from authentication import Authentication
import common


class User:
    alias: str
    auth: Authentication
    name: str
    org: str
    password: str
    role: Roles

    def __init__(
        self,
        alias: str,
        ip: str,
        name: str,
        org: str,
        password: str,
        role: common.Roles,
    ) -> None:
        self.alias = alias
        self.auth = Authentication(ip)
        self.name = name
        self.org = org
        self.password = common.hash_password(org, alias, password)
        self.role = role

    @classmethod
    def from_existing(
        cls,
        alias: str,
        auth: Authentication,
        name: str,
        org: str,
        password: str,
        role: common.Roles,
    ) -> "User":
        cls.alias = alias
        cls.auth = auth
        cls.name = name
        cls.org = org
        cls.password = password
        cls.role = role
