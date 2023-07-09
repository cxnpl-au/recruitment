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
#     token: string, <hashed-random-hex-key>
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
#     - Response: HTTP codes only
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
#         name: number,
#         password: string
#       }
#     - Response: HTTP codes only
#   - GET
#     - Request
#       {
#         alias: number,
#         name: string,
#         password: string | token: string,
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
#         name: string,
#         value: string | number, <Depends on value of `operation`>
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
#         name: string,
#         token: string | password: string
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

import account
from common import create_response
import organisation
import user


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

context = {
    "identity": {
        "sourceIp": "192.168.1.100",
    }
}

event = {
    "body": '{ "alias": "cxnpl", "user_name": "root", "token": "51be4192641be6c728513db49a8964a426d57861e29d2e1d2ab126b44ae4f356" }',
    "httpMethod": "GET",
    "path": "/organisations",
}
print(lambda_handler(event, context))
