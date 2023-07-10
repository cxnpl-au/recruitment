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
