import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useStudent } from "../context/StudentContext";

const StudentProtectedWrapper = ({ children }) => {
  const { student, setStudent } = useStudent();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchStudent = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/student/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setStudent(response.data.student);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    if (!student) {
      fetchStudent();
    }
  }, [student, setStudent, navigate]);

  if (!student) {
    return <div>Loading...</div>;
  }

  return children;
};

export default StudentProtectedWrapper;
