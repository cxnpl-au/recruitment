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
#         requestor_name: number,
#         requestor_password: string,
#         user_name: string,
#         user_full_name: string,
#         user_password: string,
#         user_role: string
#       }
#     - Response: HTTP codes only
#   - GET
#     - Request
#       {
#         alias: string,
#         user_name: string,
#         token: string | user_password: string
#       }
#     - Response
#       {
#         name: string,
#         role: string,
#         token: string <if password authentication succeeded>
#       }
#   - PATCH
#     - Request
#       {
#         alias: string,
#         operation: string, <one of UPDATE_NAME, UPDATE_PASSWORD, or UPDATE_ROLE>
#         requestor_name: string,
#         requestor_password: string,
#         user_name: string,
#         value: string,
#       }
#     - Response: HTTP codes only
#   - DELETE
#     - Request
#       {
#         alias: string,
#         requestor_name: string,
#         requestor_password: string,
#         user_name: string,
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


# TODO: Look up HTTP codes
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
