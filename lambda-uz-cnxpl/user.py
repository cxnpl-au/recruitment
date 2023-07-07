from authentication import Authentication
from common import Roles, hash_password
import json


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

            response = update(alias, user_name, password, operation, value)
        case "DELETE":
            password = body["password"]
            user_name = body["user_name"]

            response = delete(alias, user_name, password)

    return response
