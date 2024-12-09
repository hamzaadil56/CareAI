from pydantic import BaseModel
from typing import Optional


class Patient(BaseModel):
    id: int
    disease: str
    treatment: str
    amount_required: float
    amount_paid: float = 0.0
    priority_score: int
    donation_allotted: Optional[float] = 0.0


class Donation(BaseModel):

    amount: float
