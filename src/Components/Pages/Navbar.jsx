import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars } from 'react-icons/fa';
import { IoMdPerson } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { motion } from 'framer-motion';
import "./navbar.css";
import { fs, auth } from "../../Config/Config";

const GetcurrUser = () => {
  const [userDetails, setUserDetails] = useState({ userType: null, displayName: '' });

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        fs.collection('volunteer').doc(user.uid).get().then(snapshot => {
          if (snapshot.exists) {
            setUserDetails({ userType: "Volunteer", displayName: snapshot.data().displayName });
          } else {
            fs.collection('donors').doc(user.uid).get().then(snapshot => {
              if (snapshot.exists) {
                setUserDetails({ userType: "Donor", displayName: snapshot.data().displayName });
              } else {
                setUserDetails({ userType: null, displayName: '' });
              }
            })
          }
        }).catch(error => {
          console.error("Error getting user document:", error);
          setUserDetails({ userType: null, displayName: '' });
        });
      } else {
        setUserDetails({ userType: null, displayName: '' });
      }
    });
  }, []);

  return userDetails;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const { userType, displayName } = GetcurrUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const getFirstName = (displayName) => {
    return displayName.split(' ')[0];
  };

  const renderLinks = (userType, displayName) => {
    const firstName = getFirstName(displayName);

    if (userType === "Volunteer") {
      return (
        <div className="auth-container" >
          <NavLink to="/volunteer" className="profile-container-volunteer">
            <IoMdPerson />
          </NavLink>
          <div className="profile">{firstName}</div>
        </div>
      );
    } else if (userType === "Donor") {
      return (
        <div className="auth-container" >
          <NavLink to="/donor" className="profile-container-donor">
            <IoMdPerson />
          </NavLink>
          <div className="profile">{firstName}</div>
        </div>
      );
    }
  };

  const renderAuthLinks = () => {
    if (!userType) {
      return (
        <NavLink to="/login" className="sign-links">Get Started</NavLink>
      );
    } else {
      return (
        <>
          {renderLinks(userType, displayName)}
          <div>
            <button onClick={handleLogout} className="logout-button">
              <IoLogOutOutline />
              <div className="logout-mobile">Logout</div>
            </button>
          </div>
        </>
      );
    }
  };

  const renderFeedback = (userType) => {
    if (userType === "Volunteer") {
      return (
        <NavLink to="/complains" className="nav-links"  >Complains</NavLink>
      );
    } else if (userType === "Donor") {
      return (
        <NavLink to="/testimonial" className="nav-links"  >Testimonials</NavLink>
      );
    }
  };

  return (
    <div className={`navbar ${isOpen ? 'open' : ''}`}>
      <div className="logo-container">
        <div className="logo">إيثار</div>
        {isOpen ? (
          <RxCross1 className="menu-icon" onClick={toggleNavbar} />
        ) : (
          <FaBars className="menu-icon" onClick={toggleNavbar} />
        )}
      </div>

      <div className="links">
        <NavLink to="/" className="nav-links"  >Home</NavLink>
        <NavLink to="/gallery" className="nav-links"  >Gallery</NavLink>
        <NavLink to="/listedprojects" className="nav-links"  >Projects</NavLink>
        <NavLink to="/listcampaigns" className="nav-links"  >Campaigns</NavLink> 
      </div>
      <div className="auth-links">
        {renderAuthLinks()}
      </div>

      {/* Vertical menu animation */}
      <motion.div
        className="vertical-menu"
        ref={menuRef}
        initial={{ x: '-100vw' }}
        animate={{ x: isOpen ? '0' : '-100vw' }}
        transition={{ duration: 0.5 }}
      >
        <div className="vertical-logo">
          <div className="logo" onClick={toggleNavbar}>إيثار</div>
        </div>
        <div className="vertical-line"></div>
        <div className="menu-vertical">
          <NavLink to="/" className="nav-links" onClick={toggleNavbar}>Home</NavLink>
          <NavLink to="/gallery" className="nav-links" onClick={toggleNavbar}>Gallery</NavLink>
          <NavLink to="/listedprojects" className="nav-links" onClick={toggleNavbar}>Projects</NavLink>
          <NavLink to="/listcampaigns" className="nav-links" onClick={toggleNavbar}>Campaigns</NavLink>
          {renderFeedback(userType)}
        </div>
        <div className="vertical-line2"></div>
        {renderAuthLinks()}
      </motion.div>
    </div>
  );
};

export default Navbar;
