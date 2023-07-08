import hashlib
from account import Account
from authentication import Authentication
from boto3.dynamodb.conditions import Key
from common import DYNAMODB, ORGS, USERS, Roles, hash_password
from organisation import Organisation
import time
from user import User


class OrgsTable:
    TABLE = DYNAMODB.Table("organisations")

    def accounts(self, alias: str) -> list[dict[str, any]]:
        response = self.TABLE.get_item(
            Key={"alias": alias}, ProjectionExpression={"accounts"}
        )
        return response["Item"]

    def create_account(self, alias: str, account_name: str):
        response = self.TABLE.get_item(
            Key={"alias": alias}, ProjectionExpression="account_limit, accounts"
        )
        item = response["Item"]
        count = len(item["accounts"])
        limit = item["account_limit"]

        if count < limit:
            self.TABLE.update_item(
                Key={"alias": alias},
                UpdateExpression="SET accounts = list_append(accounts, :new)",
                ExpressionAttributeValues={
                    ":new": {"account_name": account_name, "amount": 0.0}
                },
                ReturnValues="NONE",
            )

    def delete(self, alias: str):
        USERS.remove_org(alias)
        self.TABLE.delete_item(Key={"alias": alias})

    def delete_account(self, alias: str, account_name: str):
        result = self.TABLE.get_item(
            Key={"alias", alias}, ProjectionExpression="accounts"
        )
        accounts: list[dict[str, any]] = result["Item"]

        for idx, d in enumerate(accounts):
            if d["account_name"] == account_name:
                accounts.pop(idx)
                break

        self.TABLE.update_item(
            Key={"alias", alias},
            UpdateExpression="SET accounts = :accounts",
            ExpressionAttributeValues={":accounts": accounts},
            ReturnValues="NONE",
        )

    def exists(self, alias: str) -> bool:
        result = self.TABLE.get_item(Key={"alias": alias})
        return "Item" in result

    def get(self, alias: str) -> Organisation:
        result = self.TABLE.get_item(Key={"alias": alias})
        item = result["Item"]

        accounts = []
        for i in item["accounts"]:
            acc = Account.from_existing(i["name"], i["amount"])
            accounts.append(acc)

        org = Organisation.from_existing(
            item["account_limit"],
            accounts,
            item["alias"],
            item["auth_timeout_secs"],
            item["name"],
            item["user_limit"],
        )
        return org

    def insert(self, org: Organisation):
        item = {
            "account_limit": org.account_limit,
            "accounts": org.accounts,
            "alias": org.alias,
            "auth_timeout_secs": org.auth_timeout_secs,
            "name": org.name,
            "user_limit": org.user_limit,
        }

        self.TABLE.put_item(item)

    def name(self, alias: str) -> str:
        result = self.TABLE.get_item(Key={"alias": alias})
        return result["Item"]["name"]

    def update(self, alias: str, name: str, value):
        self.TABLE.update_item(
            Key={"alias": alias},
            UpdateExpression="SET #attr = :value",
            ExpressionAttributeNames={"#attr": name},
            ExpressionAttributeValues={":value": value},
            ReturnValues="NONE",
        )

    def update_account(self, alias: str, account_name: str, field: str, value):
        response = self.TABLE.get_item(
            Key={"alias", alias}, ProjectionExpression="accounts"
        )
        accounts = response["Item"]

        updated = False
        if field == "name":
            idx = -1
            for i, acc in enumerate(accounts):
                if acc["name"] == value:
                    return
                elif acc["name"] == account_name:
                    idx = i

            if idx != -1:
                accounts[idx]["name"] = value
                updated = True
        else:
            idx = -1
            for i, acc in enumerate(accounts):
                if acc["name"] == account_name:
                    idx = i

            if idx != -1:
                accounts[idx]["amount"] += value
                updated = True

        if updated:
            self.TABLE.update_item(
                Key={"alias", alias},
                UpdateExpression="SET accounts = :acc",
                ExpressionAttributeValues={":acc", accounts},
                ReturnValues="NONE",
            )


class UsersTable:
    TABLE = DYNAMODB.Table("users")

    def authenticate(
        self,
        alias: str,
        user_name: str,
        password: str | None,
        token: str | None,
        ip: str,
    ) -> bool:
        if password is None and token is None:
            raise ValueError

        user_get = self.TABLE.get_item(Key={"org": alias, "alias": user_name})
        item = user_get["Item"]
        auth = item["authentication"]

        ip_match = auth["ip"] == hashlib.sha256(ip.encode("utf-8")).hexdigest()
        token_match = auth["token"] == token
        logged_out = auth["logged_out"]
        timed_out = time.time() - auth["time"] > ORGS.get(alias).auth_timeout_secs

        authenticated = False
        if password is not None:
            if hash_password(alias, user_name, password) == item["password"]:
                if logged_out or timed_out or not ip_match:
                    a = Authentication(ip)
                    auth = {
                        "ip": a.ip,
                        "logged_out": a.logged_out,
                        "token": a.token,
                        "time": a.time,
                    }
                    self.TABLE.update_item(
                        KEY={"org": alias, "alias": user_name},
                        UpdateExpression="SET authentication = :auth",
                        ExpressionAttributeValues={":auth", auth},
                        ReturnValues="NONE",
                    )
                else:
                    self.TABLE.update_item(
                        KEY={"org": alias, "alias": user_name},
                        UpdateExpression="SET authentication.#t = :now",
                        ExpressionAttributeNames={"#t": "time"},
                        ExpressionAttributeValues={":now": time.time()},
                        ReturnValues="NONE",
                    )
                authenticated = True
        elif not (logged_out or timed_out) and token_match and ip_match:
            self.TABLE.update_item(
                KEY={"org": alias, "alias": user_name},
                UpdateExpression="SET authentication.#t = :now",
                ExpressionAttributeNames={"#t": "time"},
                ExpressionAttributeValues={":now": time.time()},
                ReturnValues="NONE",
            )
            authenticated = True

        return authenticated

    def exists(self, alias: str, user_name: str) -> bool:
        get = self.TABLE.get_item(Key={"org": alias, "alias": user_name})
        return "Item" in get

    def get(self, alias: str, user_name: str) -> User:
        get = self.TABLE.get_item(Key={"org": alias, "alias": user_name})
        item = get["Item"]

        a = item["authentication"]
        auth = Authentication.from_existing(
            a["ip"], a["logged_out"], a["token"], a["time"]
        )

        match item["role"]:
            case "ADMIN":
                role = Roles.ADMIN
            case "ACCOUNT_MANAGER":
                role = Roles.ACCOUNT_MANAGER
            case "NORMAL":
                role = Roles.NORMAL
            case _:
                role = None

        user = User.from_existing(
            user_name, auth, item["name"], alias, item["password"], role
        )
        return user

    def has_role(self, org: str, user_name: str, role: Roles) -> bool:
        has_role = False

        get = self.TABLE.get_item(Key={"org": org, "alias": user_name})
        if "Item" in get:
            has_role = get["item"]["role"] == role.name

        return has_role

    def insert(self, user: User):
        response = ORGS.TABLE.get_item(
            Key={"alias": user.org}, ProjectionExpression="user_limit"
        )
        limit = response["Item"]

        response = self.TABLE.query(
            Select="COUNT", KeyConditionExpression=Key("org").eq(user.org)
        )
        count = response["Count"]

        if count < limit:
            item = {
                "org": user.org,
                "alias": user.alias,
                "name": user.name,
                "password": user.password,
                "role": user.role.name,
            }

            if user.auth is None:
                item["authentication"] = {
                    "ip": "",
                    "logged_out": True,
                    "token": "",
                    "time": 0.0,
                }
            else:
                item["authentication"] = {
                    "ip": user.auth.ip,
                    "logged_out": user.auth.logged_out,
                    "token": user.auth.token,
                    "time": user.auth.time,
                }

            self.TABLE.put_item(Item=item)

    def log_out(self, org: str, user_name: str):
        self.TABLE.update_item(
            Key={"org": org, "alias": user_name},
            UpdateExpression="SET authentication.logged_out = :value",
            ExpressionAttributeValues={":value": True},
            ReturnValues="NONE",
        )

    def remove(self, alias: str, user_name: str):
        self.TABLE.delete_item(Key={"org": alias, "alias": user_name})

    def remove_org(self, org: str):
        response = self.TABLE.query(
            Select="ALL_PROJECTED_ATTRIBUTES",
            KeyConditionExpression=Key("org").eq(org),
            ProjectionExpression="alias",
        )

        for alias in response["Items"]:
            self.TABLE.delete_item(Key={"org": org, "alias": alias}, ReturnValues="NONE")

    def update(self, org: str, user_name: str, field: str, value: str):
        self.TABLE.update_item(
            Key={"org": org, "alias": user_name},
            UpdateExpression="set #attr = :value",
            ExpressionAttributeNames={"#attr": field},
            ExpressionAttributeValues={":value": value},
            ReturnValues="NONE",
        )

        if field == "password":
            self.log_out(org, user_name)
