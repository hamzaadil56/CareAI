from fastapi import APIRouter, HTTPException
from models import Donation
from database import patients_db, donations_db
import json
router = APIRouter()

PATIENT_RECORDS_FILE = "patient_record.json"


def get_patients_from_json():
    """
    Load patients from the JSON file.
    """
    try:
        with open(PATIENT_RECORDS_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error reading patient data")


def update_patient_in_json(updated_patient):
    """
    Update a patient's record in the JSON file.
    """
    patients = get_patients_from_json()
    for i, patient in enumerate(patients):
        if patient["id"] == updated_patient["id"]:
            patients[i] = updated_patient
            break
    with open(PATIENT_RECORDS_FILE, "w") as file:
        json.dump(patients, file, indent=4)


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
async def donate_to_highest_priority(donation: Donation):
    """
    Allocate donation to the patient with the highest priority score.
    """
    # Load all patients
    patients = get_patients_from_json()

    if not patients:
        raise HTTPException(status_code=404, detail="No patients found")

    # Find the patient with the highest priority score
    highest_priority_patient = max(
        patients, key=lambda p: (p["priority_score"], -p["amount_paid"])
    )

    if highest_priority_patient["amount_paid"] >= highest_priority_patient["amount_required"]:
        raise HTTPException(
            status_code=400,
            detail="Patient with the highest priority already has sufficient funds",
        )

    # Update donation data
    highest_priority_patient["amount_paid"] += donation.amount
    highest_priority_patient["donation_allotted"] += donation.amount

    # Save updated patient back to JSON
    update_patient_in_json(highest_priority_patient)

    # Record the donation
    donations_db.append(donation.dict())

    return {
        "message": "Donation allocated to the highest priority patient successfully",
        "patient": highest_priority_patient,
    }
