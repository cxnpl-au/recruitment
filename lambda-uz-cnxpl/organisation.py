from account import Account
from common import ORGS, USERS, DefaultLimits, create_response
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

            response = create_organisation(alias, name, password, ip)
        case "GET":
            user_name = body["user_name"]
            password = body.get("password")
            token = body.get("token")

            response = get_organisation(alias, user_name, password, token, ip)
        case "PATCH":
            operation = body["operation"]
            password = body["password"]
            user_name = body["user_name"]
            value = body["value"]

            response = modify_organisation(alias, user_name, password, operation, value)
        case "DELETE":
            password = body["password"]
            user_name = body["user_name"]

            response = delete_organisation(alias, user_name, password)

    return response


def delete_organisation(alias: str, user_name: str, password: str) -> dict[str, any]:
    if (
        user_name == "root"
        and ORGS.exists(alias)
        and USERS.authenticate(user_name, password, None, None)
    ):
        ORGS.delete(alias)
        code = 200
    else:
        code = 400

    return create_response(code, None)


def create_organisation(
    alias: str, name: str, password: str, ip: str
) -> dict[str, any]:
    org = Organisation(alias, name)

    if ORGS.insert(org):
        user = User("root", ip, "root", alias, password, Roles.ADMIN)
        USERS.insert(user)

        code = 200
        body = {"token": user.authentication.token}
    else:
        code = 400
        body = None

    return create_response(code, body)


# TODO: Finish table functions
def get_organisation(
    alias: str, user_name: str, password: str | None, token: str | None, ip: str
) -> dict[str, any]:
    code = 400
    body = None

    if ORGS.exists(alias) and USERS.authenticate(user_name, password, token, ip):
        if alias == "root":
            org = ORGS.get(alias)
            body = {
                "account_limit": org.account_limit,
                "auth_timeout_secs": org.auth_timeout_secs,
                "name": org.name,
                "user_limit": org.user_limit,
            }
        else:
            body = {"name": ORGS.name(alias)}

        code = 200

    return create_response(code, body)


# NOTE: Parameter validation would be a good thing
def modify_organisation(
    alias: str,
    user_name: str,
    password: str,
    operation: str,
    value,
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
        and USERS.authenticate(user_name, password, None, None)
    ):
        if operation == "UPDATE_PASSWORD":
            root: User = USERS.get(user_name)
            root.password = hash_password(alias, user_name, value)
            USERS.update(root)
        else:
            org: Organisation = ORGS.get(alias)
            match operation:
                case "UPDATE_NAME":
                    org.name = value
                case "CHANGE_ACCOUNT_LIMIT":
                    org.account_limit = value
                case "CHANGE_AUTH_TIMEOUT":
                    org.auth_timeout_secs = value
                case "CHANGE_USER_LIMIT":
                    org.user_limit = value
            ORGS.update(org)

        code = 200
    else:
        code = 400

    return create_response(code, None)
