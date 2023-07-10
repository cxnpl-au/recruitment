from account import Account
from authentication import Authentication
from common import DefaultLimits, Roles, create_response, hash_password
from tables import ORGS, USERS
from user import User
import json


class Organisation:
    account_limit: int = DefaultLimits.ACCOUNTS
    accounts: list[Account] = []
    alias: str
    auth_timeout_secs: int = DefaultLimits.AUTH_TIMEOUT_SECS
    name: str
    user_limit: int = DefaultLimits.USERS

    def __init__(self, alias: str, name: str) -> None:
        self.alias = alias
        self.name = name

    @classmethod
    def from_existing(
        cls,
        account_limit: int,
        accounts: list[Account],
        alias: str,
        auth_timeout_secs: int,
        name: str,
        user_limit: int,
    ) -> "Organisation":
        cls.account_limit = account_limit
        cls.accounts = accounts
        cls.alias = alias
        cls.auth_timeout_secs = auth_timeout_secs
        cls.name = name
        cls.user_limit = user_limit


def handler(event, context) -> dict[str, any]:
    method = event["httpMethod"]
    ip = context["identity"]["sourceIp"]

    body: dict[str, any] = json.loads(event["body"])
    alias = body["alias"]

    match method:
        case "POST":
            name = body["name"]
            password = body["password"]

            response = create(alias, name, password, ip)
        case "GET":
            user_name = body["user_name"]
            password = body.get("password")
            token = body.get("token")

            response = read(alias, user_name, password, token, ip)
        case "PATCH":
            operation = body["operation"]
            password = body["password"]
            user_name = body["user_name"]
            value = body["value"]

            response = update(alias, user_name, password, operation, value, ip)
        case "DELETE":
            password = body["password"]
            user_name = body["user_name"]

            response = delete(alias, user_name, password, ip)

    return response


def create(alias: str, name: str, password: str, ip: str) -> dict[str, any]:
    if not ORGS.exists(alias):
        org = {
            "account_limit": DefaultLimits.ACCOUNTS.value,
            "accounts": [],
            "alias": alias,
            "auth_timeout_secs": DefaultLimits.AUTH_TIMEOUT_SECS.value,
            "name": name,
            "user_limit": DefaultLimits.USERS.value,
        }
        ORGS.insert(org)
        user = User("root", ip, "root", alias, password, Roles.ADMIN)

        auth = Authentication(ip)
        user = {
            "alias": "root",
            "authentication": {
                "ip": auth.ip,
                "logged_out": auth.logged_out,
                "token": auth.token,
                "time": auth.time,
            },
            "name": "root",
            "org": alias,
            "password": hash_password(alias, "root", password),
            "role": Roles.ADMIN.name,
        }
        USERS.insert(user)

        code = 200
        body = {"token": auth.token}
    else:
        code = 400
        body = None

    return create_response(code, body)


def read(
    alias: str, user_name: str, password: str | None, token: str | None, ip: str
) -> dict[str, any]:
    code = 400
    body = None

    if ORGS.exists(alias) and USERS.authenticate(alias, user_name, password, token, ip):
        if user_name == "root":
            body = ORGS.get(alias)
        else:
            body = {"name": ORGS.name(alias)}

        code = 200

        if password is not None:
            body["token"] = USERS.get_token(alias, user_name)

    return create_response(code, body)


def update(
    alias: str,
    user_name: str,
    password: str,
    operation: str,
    value,
    ip: str,
) -> dict[str, any]:
    ALLOWED_OPERATIONS = [
        "UPDATE_NAME",
        "UPDATE_PASSWORD",
        "CHANGE_ACCOUNT_LIMIT",
        "CHANGE_AUTH_TIMEOUT",
        "CHANGE_USER_LIMIT",
    ]
    if (
        user_name == "root"
        and operation in ALLOWED_OPERATIONS
        and ORGS.exists(alias)
        and USERS.authenticate(alias, user_name, password, None, ip)
    ):
        if operation == "UPDATE_PASSWORD":
            new_password = hash_password(alias, user_name, value)
            USERS.update(alias, "password", new_password)
        else:
            code = 200

            match operation:
                case "UPDATE_NAME":
                    ORGS.update(alias, "name", value)
                case "CHANGE_ACCOUNT_LIMIT":
                    try:
                        new_account_limit = int(value)
                        ORGS.update(alias, "account_limit", new_account_limit)
                    except ValueError:
                        code = 400
                case "CHANGE_AUTH_TIMEOUT":
                    try:
                        new_auth_timeout_secs = int(value)
                        ORGS.update(alias, "auth_timeout_secs", new_auth_timeout_secs)
                    except ValueError:
                        code = 400
                case "CHANGE_USER_LIMIT":
                    try:
                        new_user_limit = int(value)
                        ORGS.update(alias, "user_limit", new_user_limit)
                    except ValueError:
                        code = 400

    else:
        code = 400

    return create_response(code, None)


def delete(alias: str, user_name: str, password: str, ip: str) -> dict[str, any]:
    if (
        ORGS.exists(alias)
        and user_name == "root"
        and USERS.authenticate(alias, user_name, password, None, ip)
    ):
        ORGS.delete(alias)
        code = 200
    else:
        code = 400

    return create_response(code, None)
