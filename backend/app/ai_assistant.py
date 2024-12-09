import os
import pandas as pd
from langchain_community.document_loaders import UnstructuredExcelLoader, CSVLoader
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from dotenv import load_dotenv
import json
from database import patients_db
from langchain_community.document_loaders import JSONLoader
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.runnables import RunnablePassthrough
from pydantic import BaseModel, Field


class PriorityScore(BaseModel):
    id: int = Field(description="id of the patient")
    priority_score: int = Field(description="priority score given to the user")


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
            You are a highly skilled and experienced doctor. Analyze the following medical condition thoroughly based on the provided details. Carefully assess the severity and provide a precise numeric severity score from 1 to 10 using the following guidelines:

1-3 (Mild): Minimal impact on daily life; treatment may be optional.
4-6 (Moderate): Noticeable impact on daily life; treatment is likely necessary.
7-10 (Severe): Significant impact on daily life; urgent medical attention is required.
Details:

Disease: {disease}
Symptoms: {symptoms}
Duration: {duration}
Your Response:
Provide only the numeric severity score (1-10) based on your expert medical assessment.
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

    # def calculate_priority_score(self, severity_score, amount_required, amount_paid):
    #     """
    #     Calculate priority score using LLM

    #     :param severity_score: Severity score of the condition
    #     :param amount_required: Amount required for the condition
    #     :param amount_paid: Amount paid for the condition
    #     :return: Priority score (1-10)
    #     """
    #     # Create a chain for priority assessment
    #     priority_chain = (
    #         self.priority_prompt
    #         | self.llm
    #         | StrOutputParser()
    #     )

    #     # Invoke the chain to get priority score
    #     try:
    #         priority_score = int(priority_chain.invoke({
    #             "severity_score": severity_score,
    #             "amount_required": amount_required,
    #             "amount_paid": amount_paid
    #         }))
    #         return max(1, min(priority_score, 10))  # Clamp between 1-10
    #     except Exception as e:
    #         print(f"Error calculating priority: {e}")
    #         return 5  # Default to medium priority

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
        # patient_data['priority_score'] = patient_data.apply(
        #     lambda row: self.calculate_priority_score(
        #         row.get('severity_score', 0),
        #         row.get('amount_required', 0),
        #         row.get('amount_paid', 0)
        #     ),
        #     axis=1
        # )
        # patient_data['severity_score'] = self.calculate_severity_score(
        #     patient_data['disease'],

        # ),

        return patient_data

    def calculate_priority_score(self):
        loader = JSONLoader(
            file_path='./patient_record.json', jq_schema='.[]', text_content=False)
        documents = loader.load()
        vectorstore = FAISS.from_documents(
            documents, HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2"))
        retriever = vectorstore.as_retriever()
        template = """You are an administrator responsible for assigning a priority score to patients based on the following factors:

Severity Score: (higher severity suggests greater urgency).
Amount Required: (higher cost indicates greater financial need).
Amount Paid:  (lower contributions by the patient indicate higher dependency on external support).
Provide a priority score from 1 to 10 using these guidelines:

1-3 (Low): Minimal impact or urgency; financial and medical needs are manageable.
4-6 (Medium): Noticeable impact; treatment is needed but not urgent.
7-10 (High): Significant impact; immediate financial and medical intervention is required.
Output:
Only Respond with a json format having the id of the patient and priority_score. Do not add anything else.

Patients Data:
            {context}

            """

    # Create RAG chain
        prompt = PromptTemplate.from_template(template)
        rag_chain = (
            {"context": retriever, "question": RunnablePassthrough()}
            | prompt
            | self.llm
            | JsonOutputParser(pydantic_object=PriorityScore)
        )

        # Invoke the RAG chain and return the response
        return rag_chain.invoke("")


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
        processed_data = scorer.calculate_priority_score()
        print(processed_data)
    except Exception as e:
        print(f"Error processing patient data: {e}")
