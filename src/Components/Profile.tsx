import axios from "axios";
import { useEffect, useState } from "react";
import { CircleLoader } from "react-spinners"

const Profile = () => {
  const [userData, setUserData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    } else {
      try {
        setLoading(true);
        const response = await axios.post("http://localhost:5000/api/user", {
          token: token
        });
        if (response.data.status === "ok") {
          console.log("User data:", response.data.user);
          setUserData(response.data.user);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <CircleLoader
            color="#4fa94d"
          />
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <h2>Welcome, {userData?.name}</h2>
        </div>
      )}
    </>
  );
};

export default Profile;
