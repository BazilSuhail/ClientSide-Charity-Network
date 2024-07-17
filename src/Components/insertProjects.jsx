import React, { useState } from "react";
import { fs } from "../Config/Config"; // Assuming firebaseConfig is imported properly

const AddDummyDataToFirestore = () => {
    const [loading, setLoading] = useState(false);

    const dummyData = [
        {
            "title": "Fundraiser 1",
            "description": "Helping local shelters",
            "startDate": "2024-05-04",
            "endDate": "2024-06-04",
            "targetAmount": "5000",
            "status": "Active",
            "volunteerID": "1ZfTADFfAxeWeW4DFBMLZRjA4wj2",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "2500"
        },
        {
            "title": "Fundraiser 2",
            "description": "Environmental conservation",
            "startDate": "2024-05-10",
            "endDate": "2024-06-10",
            "targetAmount": "10000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "7500"
        },
        {
            "title": "Fundraiser 3",
            "description": "Children's education",
            "startDate": "2024-06-01",
            "endDate": "2024-07-01",
            "targetAmount": "8000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "3000"
        },
        {
            "title": "Fundraiser 4",
            "description": "Supporting elderly care",
            "startDate": "2024-06-15",
            "endDate": "2024-07-15",
            "targetAmount": "6000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "4000"
        },
        {
            "title": "Fundraiser 5",
            "description": "Disaster relief efforts",
            "startDate": "2024-07-01",
            "endDate": "2024-08-01",
            "targetAmount": "12000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "10"
        },
        {
            "title": "Fundraiser 6",
            "description": "Animal welfare",
            "startDate": "2024-07-10",
            "endDate": "2024-08-10",
            "targetAmount": "7000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "5500"
        },
        {
            "title": "Fundraiser 7",
            "description": "Promoting arts and culture",
            "startDate": "2024-08-01",
            "endDate": "2024-09-01",
            "targetAmount": "9000",
            "status": "Active",
            "volunteerID": "UzrnsNQGhiR0DHijVfXzP9qYEf43",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "6000"
        },
        {
            "title": "Fundraiser 8",
            "description": "Community health initiatives",
            "startDate": "2024-08-15",
            "endDate": "2024-09-15",
            "targetAmount": "10000",
            "status": "Active",
            "volunteerID": "WrTEhNisDbfvlpfaLLryvZWjfq62",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "8500"
        },
        {
            "title": "Fundraiser 9",
            "description": "Empowering women",
            "startDate": "2024-09-01",
            "endDate": "2024-10-01",
            "targetAmount": "8000",
            "status": "Active",
            "volunteerID": "WrTEhNisDbfvlpfaLLryvZWjfq62",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "5000"
        },
        {
            "title": "Fundraiser 10",
            "description": "Youth development programs",
            "startDate": "2024-09-10",
            "endDate": "2024-10-10",
            "targetAmount": "11000",
            "status": "Active",
            "volunteerID": "WrTEhNisDbfvlpfaLLryvZWjfq62",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "7000"
        },
        {
            "title": "Fundraiser 11",
            "description": "Promoting literacy",
            "startDate": "2024-10-01",
            "endDate": "2024-11-01",
            "targetAmount": "7000",
            "status": "Active",
            "volunteerID": "WrTEhNisDbfvlpfaLLryvZWjfq62",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "4500"
        },
        {
            "title": "Fundraiser 12",
            "description": "Combatting hunger",
            "startDate": "2024-10-15",
            "endDate": "2024-11-15",
            "targetAmount": "8000",
            "status": "Active",
            "volunteerID": "WrTEhNisDbfvlpfaLLryvZWjfq62",
            "franchiseID": "2plXpjvmljROLGZ6Q21LFpcIoP73",
            "collectedAmount": "6000"
        } 
    ];
 
    const addDataToFirestore = async () => {
        setLoading(true);
        const batch = fs.batch();

        dummyData.forEach((data) => {
            const docRef = fs.collection("campaigns").doc();
            batch.set(docRef, data);
        });

        try {
            await batch.commit();
            console.log("Dummy data added to Firestore");
        } catch (error) {
            console.error("Error adding dummy data to Firestore:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={addDataToFirestore} disabled={loading}>
                {loading ? "Adding Data..." : "Add Dummy Data"}
            </button>
        </div>
    );
};

export default AddDummyDataToFirestore;