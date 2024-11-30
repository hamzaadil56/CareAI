import streamlit as st
import pandas as pd

def main():
    # Set page configuration
    st.set_page_config(layout="wide")

    # Create a sample patient dataset
    patient_data = [
        {"Patient ID": "P001", "Name": "John Doe", "Age": 45, "Diagnosis": "Hypertension", "Treatment": "Medication"},
        {"Patient ID": "P002", "Name": "Jane Smith", "Age": 32, "Diagnosis": "Diabetes", "Treatment": "Insulin"},
        {"Patient ID": "P003", "Name": "Mike Johnson", "Age": 55, "Diagnosis": "Heart Disease", "Treatment": "Surgery"},
        {"Patient ID": "P004", "Name": "Emily Brown", "Age": 28, "Diagnosis": "Asthma", "Treatment": "Inhaler"},
        {"Patient ID": "P005", "Name": "David Wilson", "Age": 62, "Diagnosis": "Arthritis", "Treatment": "Physical Therapy"}
    ]

    # Convert to DataFrame
    df = pd.DataFrame(patient_data)

    # Create a container for the header with donation button
    header_col1, header_col2 = st.columns([3, 1])

    # Page title
    with header_col1:
        st.title("Patient Data Dashboard")

    # Donation Button
    with header_col2:
        donate_amount = st.button("💰 Donate Amount", type="primary")
        
        # Optional: Add functionality when donation button is clicked
        if donate_amount:
            st.toast("Thank you for your generosity! 🙏")

    # Display patient data table
    st.dataframe(df, 
                 use_container_width=True, 
                 hide_index=True,
                 column_config={
                     "Patient ID": st.column_config.TextColumn("Patient ID"),
                     "Name": st.column_config.TextColumn("Patient Name"),
                     "Age": st.column_config.NumberColumn("Age"),
                     "Diagnosis": st.column_config.TextColumn("Diagnosis"),
                     "Treatment": st.column_config.TextColumn("Treatment")
                 })

    # Additional information or statistics
    st.markdown("---")
    
    # Display some basic statistics
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric(label="Total Patients", value=len(df))
    
    with col2:
        st.metric(label="Average Age", value=f"{df['Age'].mean():.1f}")
    
    with col3:
        st.metric(label="Unique Diagnoses", value=df['Diagnosis'].nunique())

if __name__ == "__main__":
    main()