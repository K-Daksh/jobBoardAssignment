import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCompany } from "../context/CompanyContext";

const CompanyProtectedWrapper = ({ children }) => {
  const { company, setCompany } = useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchCompany = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/company/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCompany(response.data.company);
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    if (!company) {
      fetchCompany();
    }
  }, [company, setCompany, navigate]);

  if (!company) {
    return <div>Loading...</div>;
  }

  return children;
};

export default CompanyProtectedWrapper;
