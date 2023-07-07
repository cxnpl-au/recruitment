# NOTE: Better to have amount as int due to floating point rounding errors
class Account:
    name: str
    amount: float

    def __init__(self, name: str) -> None:
        self.name = name
        self.amount = 0.0

    @classmethod
    def from_existing(cls, name: str, amount: float) -> "Account":
        cls.name = name
        cls.amount = amount
        return cls
