import React, { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';
import "./campaignList.css";

const CampaignComp = ({ campaign, handleDonate, userInDonorsCollection }) => {
    const [localDonationAmount, setLocalDonationAmount] = useState(0);
    const [donationComplete, setDonationComplete] = useState(false);
    const [franchiseTitle, setFranchiseTitle] = useState("");
    const [donationDisabled, setDonationDisabled] = useState(false); // State to manage the disable state of the donate button

    useEffect(() => {
        const fetchFranchiseTitle = async () => {
            if (campaign.franchiseID) {
                const franchiseRef = fs.collection("franchise").doc(campaign.franchiseID);
                const franchiseDoc = await franchiseRef.get();
                if (franchiseDoc.exists) {
                    setFranchiseTitle(franchiseDoc.data().name);
                }
            }
        };

        fetchFranchiseTitle();
    }, [campaign.franchiseID]);

    useEffect(() => {
        if (campaign) {
            const remainingAmount = parseInt(campaign.targetAmount) - parseInt(campaign.collectedAmount);
            setDonationDisabled(localDonationAmount > remainingAmount);
        }
    }, [localDonationAmount, campaign]);

    const handleDonateClick = () => {
        handleDonate(campaign.id, localDonationAmount, campaign.name);
        setDonationComplete(true);
        setTimeout(() => {
            setLocalDonationAmount(0);
            setDonationComplete(false);
        }, 2000);
    };

    return (
        <div className='c-render'>

            <div className="camp-details">
                <div className='c-title'>{campaign.title}</div>
                <div className='c-franchise'>Regulating Franchise : <div className="franchise-name">{franchiseTitle}</div></div>

                <div className="franchise-props">
                    <div className='cont-loc'>Contact</div>
                    <div className='cont-loc'>Location</div>
                </div>

                <div className="franchise-props-values">
                    <div className='cont-loc-values'>0354656846568</div>
                    <div className='cont-loc-values'>Gulberg 34,berlin</div>
                </div>
            </div>

            <div className="camp-description">
                <div className='c-desc-cont'>
                    <div className="c-head-desc">Description</div>
                    <div className="c-actual-desc">{campaign.description}</div>
                </div>

                <div className="c-dates">
                    <div className="c-start">Start Date</div>
                    <div className="c-start-date">{campaign.endDate}</div>

                </div>
                <div className="c-dates">
                    <div className="c-end">End Date</div>
                    <div className="c-end-date">{campaign.startDate}</div>
                </div>
            </div>

            <div className="camp-donation">
                <div className='c-target-cont'>Target Amount: <div className="c-target-amt">$ {campaign.targetAmount}</div></div>
                <div className='c-collected-cont'>Collected Amount: <div className="c-collected-amt">${campaign.currentAmountRaised}</div></div>

                <div className='c-status-cont'>Status:<div className="c-status-actual">{campaign.status}</div></div>

                {userInDonorsCollection && !donationComplete && (
                    <div className='c-don-cont'>
                        <input className='c-donations' type="number" placeholder="Enter amount" onChange={(e) => setLocalDonationAmount(e.target.value)} />
                        <button className='c-handle-donations' onClick={handleDonateClick} disabled={donationDisabled}>
                            Donate
                        </button>
                    </div>
                )}

                {donationComplete && (<div className="c-loader">DONATING !!</div>)}
            </div>
        </div>


        /*<div className='c-render'>
            <div className='c-name-cont'><span className='name'>{campaign.name}</span></div>
            <div><strong>Description:</strong> {campaign.description}</div>
            <div><strong>Start Date:</strong> {campaign.startDate}</div>
            <div><strong>End Date:</strong> {campaign.endDate}</div>
            <div><strong>Target Amount:</strong> {campaign.targetAmount}</div>
            <div><strong>Franchise  ID:</strong> {campaign.franchiseID}</div>
            <div><strong>Collected Amount:</strong> {campaign.currentAmountRaised}</div>
            <div><strong>Status:</strong> {campaign.status}</div>

            {userInDonorsCollection && !donationComplete && (
                <div className='c-don-cont'>
                    <input className='c-donations' type="number" placeholder="Enter amount" onChange={(e) => setLocalDonationAmount(e.target.value)} />
                    <button className='c-handle-donations' onClick={handleDonateClick} disabled={localDonationAmount <= 0}>
                        Donate
                    </button>
                </div>
            )}

            {donationComplete && (
                <div className="c-loader">DONATING !!</div>
            )}
        </div>
        */
    );
};

export default CampaignComp;
