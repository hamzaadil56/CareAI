import DonorPage from "@/pages/DonorPage";
import LandingPage from "@/pages/LandingPage";
import PatientPage from "@/pages/PatientPage";
import { createBrowserRouter } from "react-router-dom";


const appRouter = createBrowserRouter([
  {
    path:'',
    element:<LandingPage/> ,
  },
  {
    path:'patient',
    element: <PatientPage/>,
    errorElement:<div>Error??????????</div>
  },
  {
    path:'donor',
    element:<DonorPage/>,
    errorElement:<div>Error</div>
  }
]);

export default appRouter;
