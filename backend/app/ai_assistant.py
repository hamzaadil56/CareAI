import os
import pandas as pd
import numpy as np
from langchain_community.document_loaders import UnstructuredExcelLoader, CSVLoader
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
import json
from database import patients_db


class DiseaseSeverityScorer:
    def __init__(self):
        """
        Initialize the Disease Severity Scorer

        :param api_key: Groq API key for LLM interactions
        """
        # Load environment variables (optional, but recommended for API keys)
        load_dotenv()

        # Initialize the language model
        self.llm = ChatGroq(
            model="llama-3.1-70b-versatile",

        )

        # Define a prompt template for severity assessment
        self.severity_prompt = PromptTemplate(
            input_variables=["disease", "symptoms", "duration"],
            template="""
            Assess the severity of the following medical condition:
            
            Disease: {disease}
            Symptoms: {symptoms}
            Duration: {duration}
            
            Provide a severity score from 1 to 10, where:
            1-3: Mild (minimal impact on daily life)
            4-6: Moderate (noticeable impact, may require treatment)
            7-10: Severe (significant impact, urgent medical attention needed)
            
            Respond ONLY with the numeric severity score (1-10).
            """
        )

        self.priority_prompt = PromptTemplate(
            input_variables=["severity_score",
                             "amount_required", "amount_paid"],
            template="""
            Given the severity score of {severity_score},{amount_paid} and {amount_required}, provide a priority score from 1 to 10, where:
            1-3: Low (minimal impact on daily life)
            4-6: Medium (noticeable impact, may require treatment)
            7-10: High (significant impact, urgent medical attention needed)

            Respond ONLY with the numeric priority score (1-10).
            """
        )

    def load_patient_data(self):
        """
        Load patient data from Excel or CSV

        :param file_path: Path to the patient data file
        :return: Pandas DataFrame with patient information
        """
        # if file_path.endswith('.csv'):
        #     loader = CSVLoader(file_path=file_path)
        # elif file_path.endswith(('.xls', '.xlsx')):
        #     loader = UnstructuredExcelLoader(file_path)
        # else:
        #     raise ValueError("Unsupported file format. Use CSV or Excel.")

        # Load and convert to DataFrame
        # documents = loader.load()
        data = pd.DataFrame(patients_db)
        return data

    def calculate_severity_score(self, disease, symptoms, duration):
        """
        Calculate severity score using LLM

        :param disease: Name of the disease
        :param symptoms: List or string of symptoms
        :param duration: Duration of the condition
        :return: Severity score (1-10)
        """
        # Create a chain for severity assessment
        severity_chain = (
            self.severity_prompt
            | self.llm
            | StrOutputParser()
        )

        # Invoke the chain to get severity score
        try:
            severity_score = int(severity_chain.invoke({
                "disease": disease,
                "symptoms": symptoms,
                "duration": duration
            }))
            return max(1, min(severity_score, 10))  # Clamp between 1-10
        except Exception as e:
            print(f"Error calculating severity: {e}")
            return 5  # Default to moderate severity

    def calculate_priority_score(self, severity_score, amount_required, amount_paid):
        """
        Calculate priority score using LLM

        :param severity_score: Severity score of the condition
        :param amount_required: Amount required for the condition
        :param amount_paid: Amount paid for the condition
        :return: Priority score (1-10)
        """
        # Create a chain for priority assessment
        priority_chain = (
            self.priority_prompt
            | self.llm
            | StrOutputParser()
        )

        # Invoke the chain to get priority score
        try:
            priority_score = int(priority_chain.invoke({
                "severity_score": severity_score,
                "amount_required": amount_required,
                "amount_paid": amount_paid
            }))
            return max(1, min(priority_score, 10))  # Clamp between 1-10
        except Exception as e:
            print(f"Error calculating priority: {e}")
            return 5  # Default to medium priority

    def process_patient_data(self, file_path):
        """
        Process entire patient dataset and add severity scores

        :param file_path: Path to patient data file
        :return: DataFrame with added severity scores
        """
        # Load patient data
        patient_data = self.load_patient_data()
        # patient_data = {
        #     "id": 1,
        #     "disease": "Cancer",
        #     "treatment": "Chemotherapy",
        #     "amount_required": 5000.0,
        #     "amount_paid": 2000.0,
        #     "priority_score": 8,
        #     "donation_allotted": 1500.0,
        # },

        # Add severity score column
        patient_data['severity_score'] = patient_data.apply(
            lambda row: self.calculate_severity_score(
                row.get('disease', 'Unknown'),
                row.get('symptoms', 'No symptoms reported'),
                row.get('duration', 'Unknown')
            ),
            axis=1
        )
        patient_data['priority_score'] = patient_data.apply(
            lambda row: self.calculate_priority_score(
                row.get('severity_score', 0),
                row.get('amount_required', 0),
                row.get('amount_paid', 0)
            ),
            axis=1
        )
        # patient_data['severity_score'] = self.calculate_severity_score(
        #     patient_data['disease'],

        # ),

        return patient_data


# Example usage
if __name__ == "__main__":
    # Replace with your actual Groq API key

    # Initialize the scorer
    scorer = DiseaseSeverityScorer()

    # Example of scoring a single condition
    # single_score = scorer.calculate_severity_score(
    #     "Diabetes",
    #     "Frequent urination, increased thirst, blurred vision",
    #     "6 months"
    # )
    # print(f"Diabetes Severity Score: {single_score}")

    # Example of processing a patient data file
    try:
        processed_data = scorer.process_patient_data('patient_data.csv')
        processed_json = processed_data.to_json(orient='records')

        # If you want to parse it back to a Python object
        processed_json_parsed = json.loads(processed_json)

# Print or use the JSON
        print(processed_json)
        print("\nParsed JSON:")
        print(json.dumps(processed_json_parsed, indent=2))
    except Exception as e:
        print(f"Error processing patient data: {e}")
