from organisation import Organisation
from user import User


# TODO: Orgs Table
class OrgsTable:
    # TABLE = DYNAMODB.Table("organisations")

    def insert(self, org: Organisation) -> bool:
        return False


# TODO: Users Table
class UsersTable:
    # TABLE = DYNAMODB.Table("users")

    def insert(self, user: User) -> bool:
        return False
