import React, { useEffect, useState } from 'react';
import { auth, fs, st } from '../../Config/Config'; // Import st
import { useNavigate } from "react-router-dom";
import "./donor.css";
import "../Styles/form.css";

const Donor = () => {
  const navigate = useNavigate();
  const [donorData, setDonorData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    city: "",
    donations: "",
    idtype: "Donor",
    photoURL: "" // Add photoURL to formData
  });
  const [image, setImage] = useState(null); // State to store image

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const donorRef = fs.collection("donors").doc(currentUser.uid);
          const doc = await donorRef.get();

          if (doc.exists) {
            setDonorData(doc.data());
            setFormData({ ...doc.data(), idtype: "Donor" });
          }
          else {
            console.log("No donor data found");
          }
        }
      }
      catch (error) {
        console.error("Error fetching donor data:", error.message);
      }
    };
    // Call fetchData when the component mounts or when the authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchDonorData();
      }
    });

    return unsubscribe;
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        let photoURL = formData.photoURL;
        if (image) {
          const storageRef = st.ref();
          const imageRef = storageRef.child(`donorImages/${currentUser.uid}`);
          await imageRef.put(image);
          photoURL = await imageRef.getDownloadURL();
        }
        const updatedData = { ...formData, photoURL };

        await fs.collection("donors").doc(currentUser.uid).update(updatedData);
        setDonorData(updatedData);
        setFormData(updatedData);
        setEditMode(false);
      }
    }
    catch (error) {
      console.error("Error updating donor data:", error.message);
    }
  };

  const gotoTransactionHistory = () => {
    navigate('/transactionhistory');
  };

  const gotoTestimonial = () => {
    navigate('/testimonial');
  };
  return (
    <main className='w-screen h-[95vh] overflow-x-hidden'>
      <div>

        <div className='grid grid-cols-1   lg:grid-cols-2 mt-[20px]' >

          <div className='flex flex-col p-[30px]'>
            {donorData.photoURL ? (
              <img src={donorData.photoURL} alt="Profile" className='w-[300px] rounded-full h-[300px] mx-auto lg:ml-[15px]' />
            ) : (
              <div className='w-[300px] rounded-full h-[300px] ml-[15px] bg-green-900'></div>
            )}
            <div className='text-[40px] text-green-900  mx-auto lg:ml-[15px] font-extrabold'>Welcome, <span className='font-bold text-[60px] text-green-700'>{donorData.displayName}</span></div>
            <div className=' mx-auto lg:ml-[15px] text-md xl:text-lg '>Your contributions are making a difference. Explore your donation history and testimonials.</div>

            <div className='flex lg:flex-row mt-[10px] flex-col mx-auto lg:ml-[15px]'>
              <button
                onClick={gotoTransactionHistory}
                className="  bg-green-900 font-medium w-[235px] text-white py-2  rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Check Transaction History
              </button>
              <button
                onClick={gotoTestimonial}
                className="lg:ml-[15px] mt-[10px] lg:mt-[0px] w-[234px] text-green-900 font-medium border-2 border-green-900 bg-white py-2 rounded-xl hover:text-white hover:bg-green-700 transition-colors duration-200"
              >
                View Testimonials
              </button>
            </div>
          </div>


          <div className="m-[20px] p-[20px]  w-[95%]  flex flex-col ">
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
                  <div className="text-lg font-semibold mb-2">Email:</div>
                  <input
                    className="text-green-700 w-[100%] font-medium border-2 border-green-950 rounded-[5px] text-2xl p-[5px] mb-4"
                    type="email"
                    name="email"
                    value={formData.email}
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
                  <div className="text-lg font-semibold mb-2">City:</div>
                  <input
                    className="text-green-700 w-[100%] font-medium border-2 border-green-950 rounded-[5px] text-2xl p-[5px] mb-4"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  <div className="text-lg font-semibold mb-2">Upload Picture:</div>
                  <input
                    className="text-green-700 font-medium   rounded-[5px] text-md p-[5px] mb-4"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <div>
                    
                  <button
                    type="submit"
                    className=" w-[105px] bg-green-900 text-xl font-medium text-white py-[4px] px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Save
                  </button>
                  </div>
                </form>
              </div>

            ) : (
              <div>
                <div className="text-green-900 font-extrabold text-2xl mb-4">Donor's Profile</div>
                <div className="text-lg font-semibold ">Name:</div>
                <div className="text-green-700 font-medium border-2 border-green-950 rounded-[5px] text-2xl p-[5px] mb-4">{donorData.displayName}</div>
                <div className="text-lg font-semibold mb-2">Email:</div>
                <div className="text-green-700 font-medium border-2 border-green-950 rounded-[5px] text-2xl p-[5px] mb-4">{donorData.email}</div>
                <div className="text-lg font-semibold mb-2">Phone Number:</div>
                <div >
                  {!donorData.phoneNumber ? (
                    <div className="text-red-500">Enter your Phone Number</div>
                  ) : (
                    <div className="text-green-700 font-medium border-2 border-green-950 rounded-[5px] text-2xl p-[5px] mb-4">{donorData.phoneNumber}</div>
                  )}
                </div>
                <div className="text-lg font-semibold mb-2">City:</div>
                <div className="text-gray-700 mb-4">
                  {!donorData.city ? (
                    <div className="text-red-500">Enter your City </div>
                  ) : (
                    <div className="text-green-700 font-medium border-2 border-green-950 rounded-[5px] text-2xl p-[5px] mb-4">{donorData.city}</div>
                  )}
                </div>
                <div className="text-lg font-semibold mb-2">Donations:</div>
                <div className="text-gray-700 mb-4">
                  {!donorData.donations ? (
                    <div className="text-red-500">You Haven't Donated Yet</div>
                  ) : (
                    <div className="text-center bg-green-950 font-medium text-white rounded-[5px] text-2xl p-[5px] mb-4">{donorData.donations}</div>
                  )}
                </div>
                <button
                  onClick={handleEdit}
                  className="mt-auto ml-auto w-[105px] bg-green-900 text-xl font-medium text-white py-[4px] px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>

  );
};

export default Donor; 