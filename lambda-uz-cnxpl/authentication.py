import hashlib
import random
import time

class Authentication:
    ip: str
    logged_out: bool
    token: str
    time: float

    def __init__(self, ip: str) -> None:
        self.ip = hashlib.sha256(ip.encode("utf-8")).hexdigest()
        self.logged_out = False
        self.token = f"{random.randrange(2 ** 256):#064x}"
        self.time = time.time()

    @classmethod
    def from_existing(
        cls, ip: str, logged_out: bool, token: str, time: float
    ) -> "Authentication":
        cls.ip = ip
        cls.logged_out = logged_out
        cls.token = token
        cls.time = time

        return cls
