import React, { useEffect, useState } from "react";
import { fs, useFirebaseAuth } from "../../Config/Config";

import "./complains.css";

const Complains = () => {
  const { currentUser } = useFirebaseAuth();
  const [complainData, setComplainData] = useState({
    displayName: "",
    email: "",
    projectsCompleted: "",
    phoneNumber: "",
    title: "",
    complain: "",
  });
  const [complains, setComplains] = useState([]);
  const [showTable, setShowTable] = useState(false); // New state variable to control table visibility

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
          const volunteerDocRef = fs.collection("volunteer").doc(currentUser.uid);
          const volunteerDoc = await volunteerDocRef.get();

          if (volunteerDoc.exists) {
            const volunteerData = volunteerDoc.data();
            console.log("Fetched volunteer data:", volunteerData);
            setComplainData((prevData) => ({
              ...prevData,
              displayName: volunteerData.displayName || "",
              email: volunteerData.email || "",
              projectsCompleted: volunteerData.Projectscompleted || "",
              phoneNumber: volunteerData.phoneNumber || "",
            }));
          } else {
            console.log("No volunteer data found for user:", currentUser.uid);
          }

          const complainDocRef = fs.collection("complains").doc(currentUser.uid);
          const complainDoc = await complainDocRef.get();

          if (complainDoc.exists) {
            const data = complainDoc.data();
            setComplains(data.complainData || []);
          }
        }
      } catch (error) {
        console.error("Error fetching user or complain data:", error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplainData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const complainDocRef = fs.collection("complains").doc(currentUser.uid);
      const updatedComplains = [...complains, complainData];

      await complainDocRef.set({
        complainData: updatedComplains,
      }, { merge: true });

      setComplains(updatedComplains);

      setComplainData((prevData) => ({
        ...prevData,
        title: "",
        complain: "",
      }));
    } catch (error) {
      console.error("Error submitting complain:", error.message);
    }
  };

  return (
    <div className="complain">

      <div className="complain-head">Submit Complain</div>

      <form className="complain-form" onSubmit={handleSubmit}>

        <div className="complain-title">Title: </div>
        <input className="border-2 border-green-800 rounded-md p-[5px] placeholder:font-bold" type="text" placeholder="Enter Title of your Complain" name="title" value={complainData.title} onChange={handleChange} required />

        <div className="complain-title">Complain: </div>
        <textarea className="comp-desc" name="complain" placeholder="Enter Your Complain" value={complainData.complain} onChange={handleChange} required />

        <button className="submit-complain" type="submit">Submit Complain</button>
      </form>


      <button className="show-complain" onClick={() => setShowTable(!showTable)}>
        {showTable ? "Hide Complains" : "Show Complains"}
      </button>

      {showTable && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {complains.map((complain, index) => (
            <div key={index} className="bg-custom-gradient shadow-md rounded-lg overflow-hidden">
              <div className="p-4">
                <h3 className="text-xl text-red-200 font-semibold">{complain.title}</h3>
                <p className="text-green-100 p-[5px] border-2 border-green-200 rounded-md mt-2">{complain.complain}</p>
              </div>
            </div>
          ))}
        </div>

      )}
    </div>

  );
};

export default Complains;
