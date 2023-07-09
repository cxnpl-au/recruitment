from authentication import Authentication
from common import Roles, create_response, hash_password
import json
from tables import ORGS, USERS


class User:
    alias: str
    auth: Authentication
    name: str
    org: str
    password: str
    role: Roles

    def __init__(
        self,
        alias: str,
        ip: str,
        name: str,
        org: str,
        password: str,
        role: Roles,
    ) -> None:
        self.alias = alias
        self.auth = Authentication(ip)
        self.name = name
        self.org = org
        self.password = hash_password(org, alias, password)
        self.role = role

    @classmethod
    def from_existing(
        cls,
        alias: str,
        auth: Authentication,
        name: str,
        org: str,
        password: str,
        role: Roles,
    ) -> "User":
        cls.alias = alias
        cls.auth = auth
        cls.name = name
        cls.org = org
        cls.password = password
        cls.role = role


def handler(event, context) -> dict[str, any]:
    method = event["httpMethod"]
    ip = context["identity"]["sourceIp"]

    body: dict[str, any] = json.loads(event["body"])
    alias = body["alias"]

    match method:
        case "POST":
            requestor_name = body["requestor_name"]
            requestor_password = body["requestor_password"]
            user_name = body["user_name"]
            user_full_name = body["user_full_name"]
            user_password = body["user_password"]
            user_role = body["user_role"]

            response = create(
                alias,
                requestor_name,
                requestor_password,
                user_name,
                user_full_name,
                user_password,
                user_role,
                ip,
            )
        case "GET":
            user_name = body["user_name"]
            password = body.get("password")
            token = body.get("token")

            response = read(alias, user_name, password, token, ip)
        case "PATCH":
            operation = body["operation"]
            requestor_name = body["requestor_name"]
            requestor_password = body["requestor_password"]
            user_name = body["user_name"]
            value = body["value"]

            response = update(
                alias,
                requestor_name,
                requestor_password,
                user_name,
                operation,
                value,
                ip,
            )
        case "DELETE":
            requestor_name = body["requestor_name"]
            requestor_password = body["requestor_password"]
            user_name = body["user_name"]

            response = delete(alias, requestor_name, requestor_password, user_name, ip)

    return response


def delete(alias: str, req_name: str, req_password: str, user_name: str, ip: str):
    if (
        ORGS.exists(alias)
        and user_name != "root"
        and USERS.authenticate(alias, req_name, req_password, None, ip)
        and USERS.has_role(alias, req_name, Roles.ADMIN)
    ):
        USERS.remove(alias, user_name)
        code = 200
    else:
        code = 400

    return create_response(code, None)


def create(
    alias: str,
    requestor_name: str,
    requestor_password: str,
    user_name: str,
    user_full_name: str,
    user_password: str,
    user_role: str,
    ip: str,
) -> dict[str, any]:
    if (
        ORGS.exists(alias)
        and USERS.authenticate(alias, requestor_name, requestor_password, None, ip)
        and Roles.valid(user_role)
    ):
        auth = Authentication(ip)
        user = {
            "alias": "root",
            "auth": {
                "ip": auth.ip,
                "logged_out": auth.logged_out,
                "token": auth.token,
                "time": auth.time,
            },
            "name": "root",
            "org": alias,
            "password": hash_password(alias, "root", user_password),
            "role": Roles.ADMIN.name,
        }
        USERS.insert(alias, user)
        code = 200
    else:
        code = 400

    return create_response(code, None)


def read(
    alias: str, user_name: str, password: str | None, token: str | None, ip: str
) -> dict[str, any]:
    if ORGS.exists(alias) and USERS.authenticate(alias, user_name, password, token, ip):
        user: User = USERS.get(alias, user_name)
        code = 200
        body = {
            "name": user.name,
            "role": str(user.role.name),
        }
        if token is None:
            body["token"] = user.auth.token
    else:
        code = 400
        body = None

    return create_response(code, body)


def update(
    alias: str,
    requestor_name: str,
    requestor_password: str,
    user_name: str,
    operation: str,
    value: str,
    ip: str,
) -> dict[str, any]:
    ALLOWED_OPERATIONS = ["LOG_OUT", "UPDATE_NAME", "UPDATE_PASSWORD"]
    code = 400

    if (
        ORGS.exists(alias)
        and USERS.authenticate(alias, requestor_name, requestor_password, None, ip)
        and USERS.exists(alias, user_name)
    ):
        is_admin = USERS.has_role(alias, requestor_name, Roles.ADMIN)

        if is_admin:
            ALLOWED_OPERATIONS.append("UPDATE_ROLE")

        if (
            is_admin or requestor_name == user_name
        ) and operation in ALLOWED_OPERATIONS:
            match operation:
                case "LOG_OUT":
                    USERS.log_out(alias, user_name)
                    code = 200
                case "UPDATE_NAME":
                    USERS.update(alias, user_name, "name", value)
                    code = 200
                case "UPDATE_PASSWORD":
                    password = hash_password(alias, user_name, value)
                    USERS.update(alias, user_name, "password", password)
                    code = 200
                case "UPDATE_ROLE":
                    if Roles.valid(value):
                        USERS.update(alias, user_name, "role", value)
                        code = 200

    return create_response(code, None)
