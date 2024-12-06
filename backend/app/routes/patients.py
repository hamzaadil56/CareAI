from fastapi import APIRouter
from app.database import patients_db

router = APIRouter()

@router.get("/")
async def get_patient_dashboard():
    """
    Fetch data for the patient's dashboard.
    """
    return [
        {
            "s_no": i + 1,
            "id": patient["id"],
            "treatment": patient["treatment"],
            "amount_required": patient["amount_required"],
            "amount_paid": patient["amount_paid"],
            "donation_accepted": patient["donation_allotted"],
        }
        for i, patient in enumerate(patients_db)
    ]
