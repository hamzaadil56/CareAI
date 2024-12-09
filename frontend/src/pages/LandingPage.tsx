import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-3xl font-bold mb-6 text-white">Welcome to CareAI</h1>
      <Link
        to="/patient"
        className="bg-blue-600 text-white px-4 py-2 m-2 rounded hover:bg-blue-700"
      >
        View Your Treatments
      </Link>
      <Link
        to="/donor"
        className="bg-blue-600 text-white px-7 py-2 rounded hover:bg-blue-700"
      >
        View Your Donors
      </Link>
    </div>
  );
};

export default LandingPage;
