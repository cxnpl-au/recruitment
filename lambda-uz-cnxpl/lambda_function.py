# Create a dummy item to track the next organisation ID to generate
# aws dynamodb put-item --table-name organisations --item '{"org_id": { "N": "4" }, "next_org_id": { "N": "5" }}'

# Schema Specification
# ORGANISATION
# ------------
# {
#   alias: string, <HK>
#   name: string, <SK>
#   account_limit: number, (default 20)
#   user_limit: number, (default 2000)
#   auth_timeout_secs: number, (default 600)
#   accounts: [
#     {
#       name: string,
#       amount: number
#     },
#     ...
#   ]
# }
#
# USERS
# -----
# {
#   org: string, <HK>
#   alias: string, <SK>
#   name: string,
#   password: string, <hashed-value>
#   role: string, <one of 'account_manager', 'admin', 'normal'> # Root will be a special admin account
#   authentication: {
#     ip_address: string, <hashed-value>,
#     logged_out: boolean,
#     token: string, <hashed-random-base64-key>
#     time: number <seconds from UNIX epoch>
#   }
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
#         token: string
#       }
#   - GET
#     - Request
#       {
#         alias: string,
#         user_name: string,
#         password: string | token: string
#       }
#     - Response
#       {
#         name: string,
#         account_limit: number, <if root>
#         user_limit: number, <if root>
#         auth_timeout_secs: number <if root>
#       }
#   - PATCH
#     - Request
#       {
#         alias: string,
#         user_name: string,
#         password: string,
#         operation: string, <one of UPDATE_NAME, UPDATE_PASSWORD, CHANGE_ACCOUNT_LIMIT, CHANGE_AUTH_TIMEOUT, CHANGE_USER_LIMIT>
#         value: any
#       }
#     - Response: HTTP codes only and update authenticated.time
#   - DELETE
#     - Request
#       {
#         alias: string,
#         user_name: string,
#         password: string,
#       }
#     - Response: HTTP codes only
#
# - /accounts
#   - POST
#     - Request
#       {
#         account_name: string,
#         alias: number,
#         user_name: number,
#         password: string
#       }
#     - Response: HTTP codes only
#   - GET
#     - Request
#       {
#         alias: number,
#         password: string | token: string,
#         user_name: string,
#       }
#     - Response
#       {
#         accounts: [
#           {
#             name: string,
#             amount: number
#           },
#           ...
#         ]
#       }
#   - PATCH
#     - Request
#       {
#         account_name: string,
#         alias: string,
#         operation: string, <One of DEPOSIT, RENAME, or WITHDRAW>
#         password: string,
#         user_name: string,
#         value: string | number | None, <Depends on value of `operation`>
#       }
#     - Response: HTTP codes only
#   - DELETE
#     - Request
#       {
#         account_name: number,
#         alias: number,
#         user_name: string,
#         password: string,
#       }
#     - Response: HTTP codes only
#
# - /users
#   - POST
#     - Request
#       {
#         alias: string,
#         requestor_alias: number,
#         requestor_password: string,
#         user_alias: string,
#         user_password: string,
#         user_role: string
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
#         token: string
#       }
#   - PATCH
#     - Request
#       {
#         alias: string,
#         requestor_alias: string,
#         requestor_password: string,
#         user_alias: string,
#         operation: string, <one of UPDATE_NAME, UPDATE_PASSWORD, or UPDATE_ROLE>
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
# NOTE: Talk about choice between making ID variables a string rather than a number and impact on
# performance in DynamoDB
# NOTE: Talk about choice of single table structure for agility instead of ideal multi-table setup
# for scalability
# NOTE: Parameter validation would be a good thing

import account
from common import create_response
import organisation
import user


# TODO: Finish table functions
# TODO: Look up HTTP codes
# TODO: Extract IP address from `context` and pass only that to the handlers
def lambda_handler(event, context) -> dict[str, any]:
    match event["path"]:
        case "/accounts":
            response = account.handler(event, context)
        case "/organisations":
            response = organisation.handler(event, context)
        case "/users":
            response = user.handler(event, context)
        case _:
            response = create_response(400, None)

    return response


# class QueryType(Enum):
#     ORGANISATIONS = 0
#     SUB_ORGANISATION = 1
#     ACCOUNTS = 2
#     SUB_ACCOUNT = 3
#     USERS = 4
#     SUB_USER = 5
#     UNKNOWN = 6


# class Query:
#     query_type: QueryType = QueryType.UNKNOWN
#     org_id: int | None = None
#     sub_id: int | None = None

#     def __init__(self, path: str) -> None:
#         split = path.split("/")[1:]
#         path_length = len(split)

#         if path_length > 0 and path[0] == "organisations":
#             self.query_type = QueryType.ORGANISATIONS
#             if path_length > 1:
#                 self.query_type = QueryType.SUB_ORGANISATION
#                 try:
#                     self.org_id = int(path[1])
#                 except ValueError:
#                     return

#                 if path_length > 2:
#                     if path[2] == "accounts":
#                         self.query_type = QueryType.ACCOUNTS
#                     elif path[2] == "users":
#                         self.query_type = QueryType.USERS
#                     else:
#                         self.query_type = QueryType.UNKNOWN
#                         return

#                     if path_length > 3:
#                         if path[2] == "accounts":
#                             self.query_type = QueryType.SUB_ACCOUNT
#                         else:
#                             self.query_type = QueryType.SUB_USER

#                         try:
#                             self.sub_id = int(path[3])
#                         except ValueError:
#                             return

#     def is_valid(self) -> bool:
#         if self.query_type == QueryType.UNKNOWN:
#             return False
#         elif self.query_type == QueryType.SUB_ORGANISATION and self.org_id is None:
#             return False
#         elif (
#             self.query_type == QueryType.SUB_ACCOUNT
#             or self.query_type == QueryType.SUB_USER
#         ) and self.sub_id is None:
#             return False
#         else:
#             return True


# def lambda_handler(event, context) -> dict[str, any]:
#     orgs = Organisations()

#     response = {
#         "Operation": "Unknown",
#         "Status": "Rejected",
#         "HTTP Method": "%s" % http_method,
#         "Path": "%s" % path,
#     }
#     code = 500

#     http_method = event["httpMethod"]
#     query = Query(event["path"])

#     if query.is_valid():
#         match query.query_type:
#             case QueryType.ORGANISATIONS:
#                 pass
#             case QueryType.ACCOUNTS:
#                 pass
#             case QueryType.USERS:
#                 pass
#             case QueryType.SUB_ORGANISATION:
#                 pass
#             case QueryType.SUB_ACCOUNT:
#                 pass
#             case QueryType.SUB_USER:
#                 pass

#     http_method = event["httpMethod"]
#     path = event["path"].split("/")[1:]

#     if len(path) == 1 and path[0] == "organisations":
#         if http_method == "POST":
#             body = json.loads(event["body"])

#             alias = body["alias"]
#             name = body["name"]
#             root_password = body["root_password"]

#             org = orgs.create_organisation(alias, name, root_password)
#             response = {
#                 "Operation": "Create Organisation",
#                 "Status": "Success",
#                 "Organisation": org,
#             }
#             code = 200
#         elif http_method == "GET":
#             body = json.loads(event["body"])

#             alias = body["alias"]
#             root_password = body["root_password"]

#             org_id = orgs.auth_organisation(alias, root_password)
#             (code, response) = Organisations.auth_org_response(org_id, alias)
#     elif len(path) == 2 and path[0] == "organisations":
#         try:
#             org_id = int(path[1])
#         except ValueError:
#             response = {
#                 "Operation": "Unknown",
#                 "Status": "Failed",
#                 "Message": "Could not convert `%s` to an integer for `org_id`"
#                 % path[1],
#             }
#             return create_response(code, response)

#         match http_method:
#             case "DELETE":
#                 response = orgs.delete_organisation(org_id)
#                 code = 200
#             case "GET":
#                 org = orgs.read_organisation(org_id)

#                 code = 200
#                 response = {
#                     "Operation": "Organisation READ",
#                     "Status": "Success",
#                     "Organisation": org,
#                 }
#             case "PATCH":
#                 body = json.loads(event["body"])

#                 key = body["key"]
#                 value = body["value"]

#                 (code, response) = orgs.update_organisation(org_id, key, value)
#     elif len(path) == 3 and path[0] == "organisations":
#         try:
#             org_id = int(path[1])
#         except ValueError:
#             response = {
#                 "Operation": "Unknown",
#                 "Status": "Failed",
#                 "Message": f"Could not convert `{path[1]}` to an integer for `org_id`",
#             }
#             return create_response(code, response)

#         if path[2] == "users":
#             match http_method:
#                 # TODO: Check if the request is authorised to create new users
#                 #       Only root and admins are allowed to create new users
#                 case "POST":
#                     body = json.loads(event["body"])

#                     alias = body["alias"]
#                     name = body["name"]
#                     password = body["password"]

#                     user = orgs.create_user(org_id, alias, name, password)

#                     code = 200
#                     response = {
#                         "Operation": "User CREATE",
#                         "Status": "Success",
#                         "User": user,
#                     }
#                 case "GET":
#                     body = json.loads(event["body"])

#                     alias = body["alias"]
#                     password = body["password"]

#                     user_id = orgs.auth_user(org_id, alias, password)
#                     (code, response) = Organisations.auth_user_response(user_id)

#     return create_response(code, response)


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
