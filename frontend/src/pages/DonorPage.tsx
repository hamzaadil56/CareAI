import React, { useState } from "react";
import axios from "axios";
import PatientsTable from "@/components/patientsTable";

const DonorPage = () => {
  const [donationAmount, setDonationAmount] = useState("");
  const [message, setMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle donation amount change
  const handleDonationChange = (e) => {
    setDonationAmount(e.target.value);
  };

  // Handle donation submission
  const handleDonate = async (e) => {
    e.preventDefault();

    if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
      setMessage("Please enter a valid donation amount.");
      return;
    }

    try {
      const donationData = {
        patient_id: 0, // This can be adjusted if you want to specify a particular patient
        amount: parseFloat(donationAmount),
      };

      // Call the donate API
      const response = await axios.post(
        "http://127.0.0.1:8000/donors/donate",
        donationData
      );

      // Display success message
      setMessage(response.data.message);
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Error donating:", error);
      setMessage("Failed to process donation. Please try again.");
    }

    // Reset donation amount
    setDonationAmount("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
        Donor Page
      </h1>
      <div className="flex justify-center  gap-5  py-4">
        <PatientsTable changed={submitSuccess} />
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <form onSubmit={handleDonate} className="space-y-4">
            <div className="form-group">
              <label
                htmlFor="donationAmount"
                className="block text-sm font-medium text-gray-600"
              >
                Donation Amount:
              </label>
              <input
                type="number"
                id="donationAmount"
                name="donationAmount"
                value={donationAmount}
                onChange={handleDonationChange}
                placeholder="Enter donation amount"
                min="1"
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Donate
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorPage;
