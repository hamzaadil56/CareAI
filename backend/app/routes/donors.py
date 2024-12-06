from fastapi import APIRouter, HTTPException
from models import Donation
from database import patients_db, donations_db

router = APIRouter()


@router.get("/")
async def get_all_patients():
    """
    Fetch all patients for donor's view.
    """
    return [
        {
            "s_no": i + 1,
            "id": patient["id"],
            "disease": patient["disease"],
            "amount_required": patient["amount_required"],
            "amount_paid": patient["amount_paid"],
            "priority_score": patient["priority_score"],
            "donation_allotted": patient["donation_allotted"],
            "total_donations": sum(
                donation["amount"]
                for donation in donations_db
                if donation["patient_id"] == patient["id"]
            ),
        }
        for i, patient in enumerate(patients_db)
    ]


@router.post("/donate")
async def donate_to_patient(donation: Donation):
    """
    Allow donors to donate to a patient.
    """
    # Find patient
    patient = next(
        (p for p in patients_db if p["id"] == donation.patient_id), None)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Update donation data
    donations_db.append(donation.dict())
    patient["amount_paid"] += donation.amount
    return {"message": "Donation successful", "updated_patient": patient}
