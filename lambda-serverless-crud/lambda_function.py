import boto3
from custom_encoder import CustomEncoder
import json
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

DYNAMODB_TABLE_NAME = "product-inventory"
DYNAMODB = boto3.resource("dynamodb")
TABLE = DYNAMODB.Table(DYNAMODB_TABLE_NAME)


def lambda_handler(event, context) -> dict:
    logger.info(event)

    httpMethod = event["httpMethod"]
    path = event["path"]

    if httpMethod == "GET":
        if path == "/health":
            response = buildResponse(200)
        elif path == "/product":
            response = getProduct(event["queryStringParameters"]["productId"])
        elif path == "/products":
            response = getProducts()
        else:
            response = buildResponse(404, "Not found")
    elif httpMethod == "POST" and path == "/product":
        response = saveProduct(json.loads(event["body"]))
    elif httpMethod == "PATCH" and path == "/product":
        requestBody = json.loads(event["body"])
        response = modifyProduct(
            requestBody["productId"],
            requestBody["updateKey"],
            requestBody["updateValue"],
        )
    elif httpMethod == "DELETE" and path == "/product":
        requestBody = json.loads(event["body"])
        response = deleteProduct(requestBody["productId"])
    else:
        response = buildResponse(404, "Not found")

    return response


def deleteProduct(productId):
    try:
        response = TABLE.delete_item(
            Key={
                "productId": productId,
            },
            ReturnValues="ALL_OLD",
        )

        body = {"Operation": "DELETE", "Message": "SUCCESS", "deletedItem": response}

        return buildResponse(200, body)
    except:
        logger.exception("Error occurred in deleteProduct")


def getProduct(productId):
    try:
        response = TABLE.get_item(
            Key={
                "productId": productId,
            }
        )

        if "Item" in response:
            return buildResponse(200, response["Item"])
        else:
            return buildResponse(
                404, {"Message": "ProductId: %s not found" % productId}
            )
    except:
        logger.exception("Error occurred in getProduct")


def getProducts():
    try:
        response = TABLE.scan()
        result = response["Items"]

        while "LastEvaluatedKey" in response:
            response = TABLE.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
            result.extend(response["Items"])

        body = {"products": result}

        return buildResponse(200, body)
    except:
        logger.exception("Error occurred in getProducts")


def modifyProduct(productId, updateKey, updateValue):
    try:
        response = TABLE.update_item(
            Key={
                "productId": productId,
            },
            UpdateExpression="set %s = :value" % updateKey,
            ExpressionAttributeValues={":value": updateValue},
            ReturnValues="UPDATED_NEW",
        )

        body = {
            "Operation": "UPDATE",
            "Message": "SUCCESS",
            "UpdatedAttributes": response,
        }

        return buildResponse(200, body)
    except:
        logger.exception("Error occurred in modifyProduct")


def saveProduct(requestBody):
    try:
        TABLE.put_item(Item=requestBody)

        body = {"Operation": "SAVE", "Message": "SUCCESS", "Item": requestBody}

        return buildResponse(200, body)
    except:
        logger.exception("Error occurred in saveProduct")


def buildResponse(status: int, body=None) -> dict[str, any]:
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
