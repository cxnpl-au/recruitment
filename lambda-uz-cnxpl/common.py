import boto3
from custom_encoder import CustomEncoder
from enum import Enum
import json
import tables

DYNAMODB = boto3.resource("dynamodb")

ORGS = tables.OrgsTable()
USERS = tables.UsersTable()

class DefaultLimits(Enum):
    ACCOUNTS = 20
    AUTH_TIMEOUT_SECS = 600
    USERS = 2000


class Roles(Enum):
    ADMIN = 0
    ACCOUNT_MANAGER = 1
    NORMAL = 2


def create_response(status: int, body=None) -> dict[str, any]:
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
    # TODO: Use multiple rounds of hashing with pre-generated random numbers to extend the key

    # org + alias is guaranteed to be unique for each user
    # We apply a two-layer salt to the passwords
    first = hashlib.sha256(org.encode("utf-8")).hexdigest().encode("utf-8")
    second = hashlib.sha256(first)
    second.update(alias.encode("utf-8"))

    salt = second.hexdigest().encode("utf-8")
    h = hashlib.sha256(salt)
    h.update(password.encode("utf-8"))

    return h.hexdigest()
