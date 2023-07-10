from custom_encoder import CustomEncoder
from enum import Enum
import hashlib
import json


class DefaultLimits(Enum):
    ACCOUNTS = 20
    AUTH_TIMEOUT_SECS = 600
    USERS = 2000


class Roles(Enum):
    ACCOUNT_MANAGER = 1
    ADMIN = 0
    NORMAL = 2

    @classmethod
    def valid(cls, name: str) -> bool:
        return (
            name == cls.ACCOUNT_MANAGER.name
            or name == cls.ADMIN.name
            or name == cls.NORMAL.name
        )


def create_response(status: int, body: dict[str, any] | None = None) -> dict[str, any]:
    response = {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    }

    if body is not None:
        response["body"] = json.dumps(body, cls=CustomEncoder)

    return response


def hash_password(org: str, alias: str, password: str) -> str:
    # org + alias is guaranteed to be unique for each user
    # We apply a two-layer salt to the passwords
    first = hashlib.sha256(org.encode("utf-8")).hexdigest().encode("utf-8")
    second = hashlib.sha256(first)
    second.update(alias.encode("utf-8"))

    salt = second.hexdigest().encode("utf-8")
    h = hashlib.sha256(salt)
    h.update(password.encode("utf-8"))

    return h.hexdigest()
