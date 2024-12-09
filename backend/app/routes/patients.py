from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from database import patients_db
from typing import List, Dict
from ai_assistant import DiseaseSeverityScorer
import json
import os

# Pydantic model for patient registration


class PatientRegistration(BaseModel):
    disease: str = Field(..., min_length=2, description="Name of the disease")
    symptoms: str = Field(..., min_length=3,
                          description="Description of symptoms")
    duration: str = Field(..., description="Duration of symptoms")
    amount_required: float = Field(..., gt=0,
                                   description="Total treatment cost")
    amount_paid: float = Field(..., ge=0, description="Amount already paid")
    treatment: str = Field(..., min_length=2,
                           description="Description of required treatment")


router = APIRouter()


PATIENT_RECORDS_FILE = "patient_record.json"

# Ensure the JSON file exists
if not os.path.exists(PATIENT_RECORDS_FILE):
    with open(PATIENT_RECORDS_FILE, 'w') as f:
        json.dump([], f)


@router.post("/register-patient")
async def register_patient(patient: PatientRegistration):
    """
    Register a new patient with detailed information.

    - Validates patient registration data
    - Adds patient to the database
    - Stores processed patient data in a JSON file
    - Returns the registered patient information
    """
    try:
        # Convert patient data to a dictionary
        patient_data = patient.dict()

        # Generate a unique patient ID
        patient_id = len(patients_db) + 1
        patient_data['id'] = patient_id
        patient_data['donation_allotted'] = 0
        patients_db.append(patient_data)

        # Process patient data
        scorer = DiseaseSeverityScorer()
        processed_data = scorer.process_patient_data('patient_data.csv')
        processed_json = processed_data.to_json(orient='records')
        processed_json_parsed = json.loads(processed_json)
        print(processed_json_parsed)
        # Update patients_db with processed data
        patients_db[patient_id-1] = processed_json_parsed[patient_id-1]

        # Load existing records from the JSON file
        with open(PATIENT_RECORDS_FILE, 'r') as f:
            records = json.load(f)

        # Append new patient data to the records
        records.append(patients_db[patient_id-1])

        # Write updated records back to the JSON file
        with open(PATIENT_RECORDS_FILE, 'w') as f:
            json.dump(records, f, indent=4)
        priority_score_json = scorer.calculate_priority_score()
        print(priority_score_json)
        priority_scores = priority_score_json
        for item in priority_scores:
            if item['id'] == patient_id:
                patients_db[patient_id -
                            1]['priority_score'] = item['priority_score']

        records[patient_id-1] = patients_db[patient_id-1]

        # Write updated records back to the JSON file
        with open(PATIENT_RECORDS_FILE, 'w') as f:
            json.dump(records, f, indent=4)

        return {
            "message": "Patient registered successfully",
            "patient": processed_json_parsed[patient_id-1],
        }
    except Exception as e:
        # Handle any unexpected errors
        raise HTTPException(status_code=500, detail=str(e))


@router.get("")
async def get_patient_dashboard():
    """
    Fetch data for the patient's dashboard.
    """
    try:
        # Load and return all patient records from the JSON file
        with open(PATIENT_RECORDS_FILE, 'r') as f:
            records = json.load(f)
        return records
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
