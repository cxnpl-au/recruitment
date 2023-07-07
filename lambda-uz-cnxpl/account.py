# NOTE: Better to have amount as int due to floating point rounding errors
from common import Roles, ORGS, USERS, create_response
import json


class Account:
    name: str
    amount: float

    def __init__(self, name: str) -> None:
        self.name = name
        self.amount = 0.0

    @classmethod
    def from_existing(cls, name: str, amount: float) -> "Account":
        cls.name = name
        cls.amount = amount
        return cls


def handler(event, context) -> dict[str, any]:
    method = event["httpMethod"]
    ip = context["identity"]["sourceIp"]

    body: dict[str, any] = json.loads(event["body"])
    alias = body["alias"]

    match method:
        case "POST":
            account_name = body["account_name"]
            password = body["password"]
            user_name = body["user_name"]

            response = create(account_name, alias, user_name, password, ip)
        case "GET":
            password = body.get("password")
            token = body.get("token")
            user_name = body["user_name"]

            response = read(alias, user_name, password, token, ip)
        case "PATCH":
            account_name = body["account_name"]
            operation = body["operation"]
            password = body["password"]
            user_name = body["user_name"]
            value = body["value"]

            response = update(
                account_name, alias, user_name, password, operation, value, ip
            )
        case "DELETE":
            account_name = body["account_name"]
            password = body["password"]
            user_name = body["user_name"]

            response = delete(account_name, alias, user_name, password, ip)

    return response


def update(
    account_name: str,
    alias: str,
    user_name: str,
    password: str,
    operation: str,
    value: str,
    ip: str,
):
    ALLOWED_OPERATIONS = ["DEPOSIT", "RENAME", "WITHDRAW"]

    if (
        ORGS.exists(alias)
        and USERS.authenticate(user_name, password, None, ip)
        and (
            USERS.has_role(alias, user_name, Roles.ADMIN)
            or USERS.has_role(alias, user_name, Roles.ACCOUNT_MANAGER)
        )
        and operation in ALLOWED_OPERATIONS
    ):
        account: Account = ORGS.account(alias, account_name)
        if operation == "RENAME":
            account.name = value
            ORGS.update_account(alias, account)
            
            code = 200
        else:
            try:
                amount = float(value)

                if operation == "DEPOSIT":
                    account.amount += amount
                else:
                    account.amount -= amount
                
                ORGS.update_account(alias, account)

                code = 200
            except ValueError:
                code = 400
    else:
        code = 400

    return create_response(code, None)


def create(
    account_name: str, alias: str, user_name: str, password: str, ip: str
) -> dict[str, any]:
    if (
        ORGS.exists(alias)
        and USERS.authenticate(user_name, password, None, ip)
        and (USERS.has_role(Roles.ADMIN) or USERS.has_role(Roles.ACCOUNT_MANAGER))
    ):
        ORGS.create_account(alias, account_name)
        code = 200
    else:
        code = 400

    return create_response(code, None)


def delete(
    account_name: str, alias: str, user_name: str, password: str, ip: str
) -> dict[str, any]:
    if USERS.authenticate(alias, user_name, password, None, ip) and (
        USERS.has_role(Roles.ADMIN) or USERS.has_role(Roles.ACCOUNT_MANAGER)
    ):
        ORGS.delete_account(alias, account_name)
        code = 200
    else:
        code = 400

    return create_response(code, None)


def read(
    alias: str, user_name: str, password: str | None, token: str | None, ip: str
) -> dict[str, any]:
    if ORGS.exists(alias) and USERS.authenticate(user_name, password, token, ip):
        body = ORGS.accounts(alias)
        code = 200
    else:
        body = None
        code = 400

    return create_response(code, body)
