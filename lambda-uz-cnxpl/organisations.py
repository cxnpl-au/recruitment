from enum import Enum
import boto3

TABLE_NAME = "organisations"


class Auth(Enum):
    ORG_DOES_NOT_EXIST = -2
    PASSWORD_INCORRECT = -1


class Organisations:
    dynamo = None
    table = None

    def __init__(self) -> None:
        dynamo = boto3.resource("dynamodb")
        self.table = dynamo.Table(TABLE_NAME)
        self.dynamo = dynamo

    def auth_organisation(self, alias: str, root_password: str) -> int:
        org_id = Auth.ORG_DOES_NOT_EXIST

        scan = self.table.scan(
            FilterExpression="alias = :alias",
            ExpressionAttributeValues={":alias": alias},
        )

        if scan["Count"] != 0:
            org = scan["Items"][0]
            if root_password == org["root_password"]:
                org_id = org["org_id"]
            else:
                org_id = Auth.PASSWORD_INCORRECT

        return org_id

    # TODO: Check if the specified alias doesn't already exist!!!!!
    def create_organisation(
        self, alias: str, name: str, root_password: str
    ) -> dict[str, any]:
        scan = self.table.scan(Select="COUNT")
        count = scan["Count"]

        org = {
            "org_id": count,
            "alias": alias,
            "name": name,
            "root_password": root_password,
        }
        self.table.put_item(Item=org)

        del org["root_password"]
        return org

    # TODO: Only delete if the organisation exists
    def delete_organisation(self, org_id: int) -> dict[str, any]:
        self.table.delete_item(Key={"org_id": org_id}, ReturnValues="NONE")
        return {"Operation": "Delete", "Status": "Success"}

    def read_organisation(self, org_id: int) -> dict[str, any]:
        response = self.table.get_item(Key={"org_id": org_id})

        org = response["Item"]
        del org["root_password"]

        return org

    # TODO: Verify password and authentication token before we update anything
    # TODO: Don't return the updated root password upon update
    def update_organisation(
        self, org_id: int, key: str, value: str
    ) -> tuple[int, dict[str, any]]:
        body = {
            "Operation": "Organisation PATCH",
        }

        if key == "name" or key == "root_password":
            self.table.update_item(
                Key={"org_id": org_id},
                UpdateExpression="set #key = :value",
                ExpressionAttributeNames={"#key": f"{key}"},
                ExpressionAttributeValues={":value": value},
                ReturnValues="NONE",
            )

            body["Status"] = "Success"
            body["Update"] = {
                "Key": key,
                "Value": value,
            }

            code = 200
        else:
            body["Status"] = "Error"
            body["Message"] = f"Invalid key `{key}`"

            code = 404

        return (code, body)

    def auth_org_response(org_id: int, alias: str) -> tuple[int, dict[str, str]]:
        code = 404

        operation = "Organisation Root Authorisation"
        status = "Failure"
        message = None

        match org_id:
            case Auth.ORG_DOES_NOT_EXIST:
                message = "No organisation with alias `%s` found" % alias
            case Auth.PASSWORD_INCORRECT:
                message = "Incorrect Password"
            case _:
                code = 200
                status = "Success"

        response = {
            "Operation": operation,
            "Status": status,
        }

        if message is not None:
            response["Message"] = message

        return (code, response)
