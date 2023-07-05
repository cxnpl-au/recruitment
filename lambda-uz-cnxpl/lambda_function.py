from enum import Enum
import json

from custom_encoder import CustomEncoder
from organisations import Organisations

# Create a dummy item to track the next organisation ID to generate
# aws dynamodb put-item --table-name organisations --item '{"org_id": { "N": "4" }, "next_org_id": { "N": "5" }}'

# Schema Specification
# METADATA
# --------
# {
#   id: 0,
#   next_org_id: number
# }

# ORGANISATION
# ------------
# {
#   id: number,
#   alias: string,
#   name: string,
#   account_limit: number, (default 20)
#   user_limit: number, (default 2000)
#   auth_timeout_secs: number, (default 600)
#   next_account_id: number,
#   next_user_id: number,
#   accounts: [
#     {
#       id: number,
#       name: string,
#       amount: number,
#       admins: [number], <user_id>
#       depositors: [number], <user_id>
#       viewers: [number] <user_id>
#     },
#     ...
#   ],
#   users: [
#     {
#       alias: string, <user-name>
#       authenticated: {
#         ip_address: string, <hashed-value>
#         logged_out: boolean,
#         token: string, <base64-encoded-key>
#         time: number <seconds from UNIX epoch>
#       },
#       name: string,
#       password: string, <hashed-value>
#       role: string, <one of 'admin', 'acc_manager', 'normal'> # Root will be a special admin account
#     },
#     ...
#   ]
# }

# API Specification
# Routes and resources
# - /organisations
#   - POST
#     - Request
#       {
#         alias: string,
#         name: string, <Full name>
#         password: string
#       }
#     - Response
#       {
#         id: number,
#         name: string,
#         token: string
#       }
#   - GET
#     - Request
#       {
#         name: string, <must be 'root'>
#         password: string
#       }
#     - Response
#       {
#         token: string,
#         id: number,
#         name: string,
#         account_limit: number,
#         user_limit: number,
#         auth_timeout_secs: number
#       }
#   - PATCH
#     - Request
#       {
#         token: string,
#         id: number,
#         alias: string,
#         password: string,
#         key: string, <check if key exists>
#         value: any
#       }
#     - Response: HTTP codes only and update authenticated.time
#   - DELETE
#     - Request
#       {
#         id: number,
#         alias: string,
#         password: string,
#         token: string
#       }
#     - Response: HTTP codes only
#
# - /accounts
#   - POST
#     - Request
#       {
#         token: string,
#         org_id: number,
#         requestor_alias: number,
#         requestor_password: string,
#         user_alias: string,
#         user_password: string
#       }
#     - Response: HTTP codes only
#   - GET
#     - Request
#       {
#         org_id: number,
#         token: string,
#         requestor_alias: string,
#       }
#     - Response
#       {
#         accounts: [
#           {
#             id: number,
#             name: string,
#             amount: number
#           },
#           ...
#         ]
#       }
#   - PATCH
#     - Request
#       {
#         org_id: number,
#         token: string,
#         requestor_alias: string,
#         requestor_password: string,
#         account_id: number,
#         operation: string, <One of DEPOSIT, RENAME, or WITHDRAW>
#         value: string | number, <Depends on value of `operation`>
#       }
#     - Response: HTTP codes only
#   - DELETE
#     - Request
#       {
#         org_id: number,
#         token: string,
#         requestor_alias: string,
#         requestor_password: string,
#         account_id: number,
#       }
#     - Response: HTTP codes only
#
# - /users
#   - POST
#     - Request
#       {
#         token: string,
#         org_id: number,
#         requestor_alias: number,
#         requestor_password: string,
#         user_alias: string,
#         user_password: string
#       }
#     - Response: HTTP codes only
#   - GET
#     - Request
#       {
#         alias: string,
#         user_alias: string,
#         user_password: string
#       }
#     - Response
#       {
#         org_id: number,
#         token: string
#       }
#   - PATCH
#     - Request
#       {
#         org_id: number,
#         token: string,
#         requestor_alias: string,
#         requestor_password: string,
#         user_alias: string,
#         key: string,
#         value: string,
#       }
#     - Response: HTTP codes only
#   - DELETE
#     - Request
#       {
#         org_id: number,
#         token: string,
#         requestor_alias: string,
#         requestor_password: string,
#         user_alias: string,
#       }
#     - Response: HTTP codes only

# NOTE: Currently we require a password on every patch, could be improved to have some sort of
#       cache for multiple updates or we could let the frontend handle this issue
# NOTE: Currently we only take IDs, should have a second set of requests that can take in
#       user names as well
# NOTE: Talk about choice between making ID variables a number rather than a string due to better
# performance in DynamoDB
# NOTE: Talk about choice of single table structure for agility instead of ideal multi-table setup
# for scalability

# TODO: Look into authentication tokens
# TODO: Look up HTTP codes

# API Requirements for Authentication and Authorisation
# Authentication
# 1. Check if a provided user name and password combination exist in the system
# Authorisation
# 1. No one can "GET" a list of all organisations. The GET method on organisations exists only for
#    the frontend to be able to check if an organisation and its password exist and are valid
#    If the organisation exists and we authenticate successfully, we will return the `org_id`
# 2. "PATCH" method will only take the alias, name, and root password of the organisation
#
# /organisations/{org_id}
# 1. DELETE: Only the root account can delete the organisation, will be enforced at backend-level
# 2. GET: Will return all values other then the root password
# 3. PATCH: Can update name or root password (maybe alias if unique)

# For agility we will employ a single table methodology, there are a few drawbacks
# 1. Replicated data
# 2. A large organisation will likely hit the 400KB document limit

# TABLE_NAME = "organisations"
# DYNAMODB = boto3.resource("dynamodb")
# TABLE = DYNAMODB.Table(TABLE_NAME)


class QueryType(Enum):
    ORGANISATIONS = 0
    SUB_ORGANISATION = 1
    ACCOUNTS = 2
    SUB_ACCOUNT = 3
    USERS = 4
    SUB_USER = 5
    UNKNOWN = 6


class Query:
    query_type: QueryType = QueryType.UNKNOWN
    org_id: int | None = None
    sub_id: int | None = None

    def __init__(self, path: str) -> None:
        split = path.split("/")[1:]
        path_length = len(split)

        if path_length > 0 and path[0] == "organisations":
            self.query_type = QueryType.ORGANISATIONS
            if path_length > 1:
                self.query_type = QueryType.SUB_ORGANISATION
                try:
                    self.org_id = int(path[1])
                except ValueError:
                    return

                if path_length > 2:
                    if path[2] == "accounts":
                        self.query_type = QueryType.ACCOUNTS
                    elif path[2] == "users":
                        self.query_type = QueryType.USERS
                    else:
                        self.query_type = QueryType.UNKNOWN
                        return

                    if path_length > 3:
                        if path[2] == "accounts":
                            self.query_type = QueryType.SUB_ACCOUNT
                        else:
                            self.query_type = QueryType.SUB_USER

                        try:
                            self.sub_id = int(path[3])
                        except ValueError:
                            return

    def is_valid(self) -> bool:
        if self.query_type == QueryType.UNKNOWN:
            return False
        elif self.query_type == QueryType.SUB_ORGANISATION and self.org_id is None:
            return False
        elif (
            self.query_type == QueryType.SUB_ACCOUNT
            or self.query_type == QueryType.SUB_USER
        ) and self.sub_id is None:
            return False
        else:
            return True


def lambda_handler(event, context) -> dict[str, any]:
    orgs = Organisations()

    response = {
        "Operation": "Unknown",
        "Status": "Rejected",
        "HTTP Method": "%s" % http_method,
        "Path": "%s" % path,
    }
    code = 500

    http_method = event["httpMethod"]
    query = Query(event["path"])

    if query.is_valid():
        match query.query_type:
            case QueryType.ORGANISATIONS:
                pass
            case QueryType.ACCOUNTS:
                pass
            case QueryType.USERS:
                pass
            case QueryType.SUB_ORGANISATION:
                pass
            case QueryType.SUB_ACCOUNT:
                pass
            case QueryType.SUB_USER:
                pass

    http_method = event["httpMethod"]
    path = event["path"].split("/")[1:]

    if len(path) == 1 and path[0] == "organisations":
        if http_method == "POST":
            body = json.loads(event["body"])

            alias = body["alias"]
            name = body["name"]
            root_password = body["root_password"]

            org = orgs.create_organisation(alias, name, root_password)
            response = {
                "Operation": "Create Organisation",
                "Status": "Success",
                "Organisation": org,
            }
            code = 200
        elif http_method == "GET":
            body = json.loads(event["body"])

            alias = body["alias"]
            root_password = body["root_password"]

            org_id = orgs.auth_organisation(alias, root_password)
            (code, response) = Organisations.auth_org_response(org_id, alias)
    elif len(path) == 2 and path[0] == "organisations":
        try:
            org_id = int(path[1])
        except ValueError:
            response = {
                "Operation": "Unknown",
                "Status": "Failed",
                "Message": "Could not convert `%s` to an integer for `org_id`"
                % path[1],
            }
            return create_response(code, response)

        match http_method:
            case "DELETE":
                response = orgs.delete_organisation(org_id)
                code = 200
            case "GET":
                org = orgs.read_organisation(org_id)

                code = 200
                response = {
                    "Operation": "Organisation READ",
                    "Status": "Success",
                    "Organisation": org,
                }
            case "PATCH":
                body = json.loads(event["body"])

                key = body["key"]
                value = body["value"]

                (code, response) = orgs.update_organisation(org_id, key, value)
    elif len(path) == 3 and path[0] == "organisations":
        try:
            org_id = int(path[1])
        except ValueError:
            response = {
                "Operation": "Unknown",
                "Status": "Failed",
                "Message": f"Could not convert `{path[1]}` to an integer for `org_id`",
            }
            return create_response(code, response)

        if path[2] == "users":
            match http_method:
                # TODO: Check if the request is authorised to create new users
                #       Only root and admins are allowed to create new users
                case "POST":
                    body = json.loads(event["body"])

                    alias = body["alias"]
                    name = body["name"]
                    password = body["password"]

                    user = orgs.create_user(org_id, alias, name, password)

                    code = 200
                    response = {
                        "Operation": "User CREATE",
                        "Status": "Success",
                        "User": user,
                    }
                case "GET":
                    body = json.loads(event["body"])

                    alias = body["alias"]
                    password = body["password"]

                    user_id = orgs.auth_user(org_id, alias, password)
                    (code, response) = Organisations.auth_user_response(user_id)

    return create_response(code, response)


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


# def organisation(method: str, event) -> dict[str, any]:
#     match method:
#         case "POST":
#             body = json.loads(event["body"])

#             org_id = body["org_id"]
#             name = body["name"]
#             root_password = body["root_password"]

#             response = create_organisation(org_id, name, root_password)
#         case "GET":
#             org_id = event["queryStringParameters"]["org_id"]
#             response = read_organisation(org_id)
#         case "PATCH":
#             body = json.loads(event["body"])
#             org_id = body["org_id"]
#             key = body["key"]
#             value = body["value"]

#             response = update_organisation(org_id, key, value)
#         case "DELETE":
#             org_id = event["queryStringParameters"]["org_id"]
#             response = delete_organisation(org_id)
#         case _:
#             response = create_response(504, "Unknown HTTP method `%s`" % method)

#     return response


# def create_organisation(org_id: str, name: str, root_password: str) -> dict[str, any]:
#     try:
#         org = {"org_id": org_id, "name": name, "root_password": root_password}
#         TABLE.put_item(Item=org)

#         body = {
#             "Operation": "CREATE ORGANISATION",
#             "Status": "SUCCESS",
#             "Organisation": org,
#         }
#         response = create_response(200, body)
#     except:
#         print("ERROR: Exception occurred in `create_organisation`")
#         response = create_response(
#             504, "Internal server error in `create_organisation`"
#         )

#     return response


# def read_organisation(org_id: str) -> dict[str, any]:
#     try:
#         org = TABLE.get_item(Key={"org_id": org_id})

#         if "Item" in org:
#             response = create_response(200, org["Item"])
#         else:
#             response = create_response(
#                 404, {"Message": "Organisation `%s` not found" % org_id}
#             )
#     except:
#         print("ERROR: Exception occurred in `read_organisation`")
#         response = create_response(504, "Internal server error in `read_organisation`")

#     return response


# def update_organisation(org_id: str, key: str, value: str) -> dict[str, any]:
#     try:
#         body = {
#             "Operation": "Update Organisation",
#         }

#         if key == "name" or key == "root_password":
#             update = TABLE.update_item(
#                 Key={"org_id": org_id},
#                 UpdateExpression="set %s = :value" % key,
#                 ExpressionAttributeValues={":value": value},
#                 ReturnValues="ALL_NEW",
#             )

#             body["Status"] = "Success"
#             body["UpdatedAttributes"] = update

#             code = 200
#         else:
#             body["Status"] = "Error"
#             body["Message"] = "Invalid key `%s`" % key

#             code = 404

#         response = create_response(code, body)
#     except:
#         print("ERROR: Exception occurred in `update_organisation`")
#         response = create_response(
#             504, "Internal server error in `update_organisation`"
#         )

#     return response


# def delete_organisation(org_id: str) -> dict[str, any]:
#     try:
#         item = TABLE.delete_item(Key={"org_id": org_id}, ReturnValues="ALL_OLD")
#         body = {"Operation": "Delete", "Status": "Success", "Item": item}
#         response = create_response(200, body)
#     except:
#         print("ERROR: Exception occurred in `delete_organisation`")
#         response = create_response(
#             504, "Internal server error in `delete_organisation`"
#         )

#     return response


# def organisations() -> dict[str, any]:
#     # try:
#     scan = TABLE.scan()
#     orgs = scan["Items"]

#     while "LastEvaluatedKey" in scan:
#         scan = TABLE.scan(ExclusiveStartKey=scan["LastEvaluatedKey"])
#         orgs.extend(scan["Items"])

#     body = {"organisations": orgs}
#     response = create_response(200, body)

#     print(body)
#     # except:
#     #     print("ERROR: Exception occurred in `organisations`")
#     #     response = create_response(504, "Internal server error in `organisations`")

#     return response
