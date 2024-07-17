import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, fs, st } from "../../Config/Config"; // Import st
import Footer from "../Pages/Footer";
import "../Styles/tables.css";

const Volunteer = () => {
  const navigate = useNavigate();
  const [volunteerData, setVolunteerData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [projects, setProjects] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [image, setImage] = useState(null); // State to store image

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    address: "",
    phoneNumber: "",
    dob: "",
    cnic: "",
    idtype: "Volunteer",
    photoURL: "" // Add photoURL to formData
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Fetch volunteer data
          const volunteerRef = fs.collection("volunteer").doc(currentUser.uid);
          const volunteerDoc = await volunteerRef.get();
          if (volunteerDoc.exists) {
            const volunteerData = volunteerDoc.data();
            setVolunteerData(volunteerData);
            setFormData({ ...volunteerData, idtype: "Volunteer" });
          } else {
            console.log("No volunteer data found");
          }

          // Fetch projects data
          const projectsRef = fs
            .collection("projects")
            .where("volunteerID", "==", currentUser.uid);
          const projectsSnapshot = await projectsRef.get();
          const projectsData = projectsSnapshot.docs.map((doc) => doc.data());
          setProjects(projectsData);

          // Fetch applied projects data
          const appliedProjectsRef = fs
            .collection("proposedProjects")
            .where("volunteerID", "==", currentUser.uid);
          const appliedProjectsSnapshot = await appliedProjectsRef.get();
          const appliedProjectsData = appliedProjectsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAppliedProjects(appliedProjectsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    // Call fetchData when the component mounts or when the authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchData();
      }
    });

    return unsubscribe; // Cleanup function to unsubscribe from the auth state listener
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        let photoURL = formData.photoURL;
        if (image) {
          const storageRef = st.ref();
          const imageRef = storageRef.child(`volunteerImages/${currentUser.uid}`);
          await imageRef.put(image);
          photoURL = await imageRef.getDownloadURL();
        }
        const updatedData = { ...formData, photoURL };

        await fs.collection("volunteer").doc(currentUser.uid).update(updatedData);
        setVolunteerData(updatedData);
        setFormData(updatedData);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error updating volunteer data:", error.message);
    }
  };

  const handle_proposal = () => {
    navigate('/AppliedProject');
  };

  const handle_complains = () => {
    navigate('/complains');
  };

  return (
    <main className='w-screen h-[95vh] overflow-x-hidden'>
      <div className='grid grid-cols-1 lg:grid-cols-2 mt-[20px]'>

        <div className='flex flex-col p-[30px]'>
          {volunteerData.photoURL ? (
            <img src={volunteerData.photoURL} alt="Profile" className='w-[300px] rounded-full h-[300px] mx-auto lg:ml-[15px]' />
          ) : (
            <div className='w-[300px] rounded-full h-[300px] ml-[15px] bg-green-900'></div>
          )}
          <div className='text-[40px] text-green-900 mx-auto lg:ml-[15px] font-extrabold'>Welcome, <span className='font-bold text-[60px] text-green-700'>{volunteerData.displayName}</span></div>
          <div className='mx-auto lg:ml-[15px] text-md xl:text-lg'>Your contributions are making a difference. Explore your projects and proposals.</div>

          
          <div className='flex lg:flex-row mt-[10px] flex-col mx-auto lg:ml-[15px]'>
              <button
                onClick={handle_proposal}
                className="  bg-green-900 font-medium w-[235px] text-white py-2  rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Apply for a Project
              </button>
              <button
                onClick={handle_complains}
                className="lg:ml-[15px] mt-[10px] lg:mt-[0px] w-[234px] text-green-900 font-medium border-2 border-green-900 bg-white py-2 rounded-xl hover:text-white hover:bg-green-700 transition-colors duration-200"
              >
                Register Complain
              </button>
            </div>
        </div>

        <div className="m-[20px] p-[20px] w-[95%] flex flex-col">
          {editMode ? (
            <div>
              <form onSubmit={handleSubmit}>
                <div className="text-green-900 font-extrabold text-2xl mb-4">Edit your Profile</div>
                <div className="text-lg font-semibold mb-2">Name:</div>
                <input
                  className="text-green-700 w-[100%] font-medium border-2 border-green-950 rounded-[5px] text-2xl p-[5px] mb-4"
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                /> 
                <div className="text-lg font-semibold mb-2">Phone Number:</div>
                <input
                  className="text-green-700 w-[100%] font-medium border-2 border-green-950 rounded-[5px] text-2xl p-[5px] mb-4"
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                <div className="text-lg font-semibold mb-2">Address:</div>
                <input
                  className="text-green-700 w-[100%] font-medium border-2 border-green-950 rounded-[5px] text-2xl p-[5px] mb-4"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                <div className="text-lg font-semibold mb-2">Date of Birth:</div>
                <input
                  className="text-green-700 font-medium border-2 border-green-950 w-[100%] rounded-[5px] text-2xl p-[5px] mb-4"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
                <div className="text-lg font-semibold mb-2">CNIC:</div>
                <input
                  className="text-green-700 w-[100%] font-medium border-2 border-green-950 rounded-[5px] text-2xl p-[5px] mb-4"
                  type="text"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                />
                <div className="text-lg font-semibold mb-2">Upload Picture:</div>
                <input
                  className="text-green-700 font-medium rounded-[5px] text-md p-[5px] mb-4"
                  type="file"
                  onChange={handleImageChange}
                />
                <button
                  type="submit"
                  className="w-[105px] bg-green-900 text-xl font-medium text-white py-[4px] px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Save
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div className="text-green-900 font-extrabold text-2xl mb-4">Volunteer's Profile</div>
              <div className="text-lg font-semibold">Email:</div>
              <div className="text-green-700 rounded-lg p-[5px] border-2 border-green-950 w-[100%]  font-medium mb-4 text-2xl">{volunteerData.email}</div>
              <div className="text-lg font-semibold">Phone Number:</div>
              <div className="text-green-700 rounded-lg p-[5px] border-2 border-green-950 w-[100%]  font-medium mb-4 text-2xl">{volunteerData.phoneNumber}</div>
              <div className="text-lg font-semibold">Address:</div>
              <div className="text-green-700 rounded-lg p-[5px]  border-2 border-green-950 w-[100%] font-medium mb-4 text-2xl">{volunteerData.address}</div>
              <div className="text-lg font-semibold">Date of Birth:</div>
              <div className="text-green-700 rounded-lg p-[5px] border-2 border-green-950 w-[100%]  font-medium mb-4 text-2xl">{volunteerData.dob}</div>
              <div className="text-lg font-semibold">CNIC:</div>
              <div className="text-green-700 rounded-lg p-[5px]  border-2 border-green-950 w-[100%] font-medium mb-4 text-2xl">{volunteerData.cnic}</div>
              <button
                onClick={handleEdit}
                className="bg-green-900 text-xl font-medium w-[120px] text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="h-[4px] rounded-xl mx-auto w-[95vw] bg-custom-gradient"></div>

      <div className="m-[30px]">
        <h2 className="text-[35px] font-bold mb-4 text-green-900">Ongoing Projects</h2>
        <div className="overflow-x-auto max-w-full bg-green-100 rounded-lg shadow-md">
          <table className="w-full border-none table-auto">
            <thead className="bg-custom-gradient text-white">
              <tr>
                <th className="px-4 py-2">Project Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">End Date</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index} className="bg-green-50 even:bg-green-200">
                  <td className="text-center whitespace-nowrap font-bold px-4 py-2">{project.title}</td>
                  <td className="text-center md:text-md font-medium text-sm  px-4 py-2">{project.description}</td>
                  <td className="text-center px-4 py-2">{project.startDate}</td>
                  <td className="text-center px-4 py-2">{project.endDate}</td>
                  <td className="flex"><span  className="mx-auto font-bold px-[15px] justify-center p-[5px] my-[5px] rounded-xl bg-green-600 text-white ">{project.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="m-[30px]">
        <h2 className="text-[35px] font-bold mb-4 text-green-900">Applied Projects</h2>
        <div className="overflow-x-auto max-w-full bg-green-100 rounded-lg shadow-md">
          <table className="w-full table-auto">
            <thead className="bg-custom-gradient text-white">
              <tr>
                <th className="px-4 py-2">Project Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {appliedProjects.map((project) => (
                <tr key={project.id} className="bg-green-50 even:bg-green-200">
                  <td className="text-center font-bold px-4 py-2">{project.title}</td>
                  <td className="text-center  px-4 py-2">{project.description}</td>
                  <td className="flex "><span className="mx-auto font-bold px-[15px] justify-center p-[5px] my-[5px] rounded-xl bg-yellow-600 text-white ">Pending</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <Footer />
    </main>
  );
};

export default Volunteer;
