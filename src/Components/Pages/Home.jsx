import React, { useState, useEffect } from 'react';
import { fs } from '../../Config/Config';
import "./home.css";
import "../Styles/tables.css";
import Footer from "../Pages/Footer";
import mainlogo from "../Logo.png"; // Import the image
import coverImage from "../Styles/photos/coverimage.jpg"; // Import the image
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { useTypewriter, Cursor } from 'react-simple-typewriter';

import "./testimonialCarousel.css";

//import { motion, useTransform, useScroll } from 'framer-motion';

import { Link } from "react-router-dom";
import { HiCubeTransparent, HiOutlineHeart, HiOutlineBadgeCheck, HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineLightBulb } from 'react-icons/hi';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';


const ChooseUsItem = ({ index, item }) => {
  const renderIcon = (index) => {
    switch (index) {
      case 0:
        return <HiCubeTransparent className='choose-icon' />;
      case 1:
        return <HiOutlineHeart className='choose-icon' />;
      case 2:
        return <HiOutlineBadgeCheck className='choose-icon' />;
      case 3:
        return <HiOutlineCurrencyDollar className='choose-icon' />;
      case 4:
        return <HiOutlineUsers className='choose-icon' />;
      case 5:
        return <HiOutlineLightBulb className='choose-icon' />;
      default:
        return null;
    }
  };
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="choose-div"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
      transition={{ duration: 1 }}
    >
      <h3 className="choose-div-heading">
        {renderIcon(index)} {item.heading}
      </h3>
      <p className="choose-body">{item.body}</p>
    </motion.div>
  );
};

const chooseUsData = [
  {
    heading: "Transparency",
    body: "We believe in transparency. Every donation you make goes directly to the cause, and we ensure detailed reports are available to our donors."
  },
  {
    heading: "Impactful Projects",
    body: "Our focus is on impactful projects that bring positive change to communities. We carefully select and support initiatives that make a difference."
  },
  {
    heading: "Accountability",
    body: "Accountability is key. We maintain rigorous standards to ensure your contributions are used effectively and responsibly."
  },
  {
    heading: "Community Engagement",
    body: "We foster community engagement through our programs, encouraging participation and involvement in social causes."
  },
  {
    heading: "Long-Term Sustainability",
    body: "Sustainability is at the heart of our mission. We aim to create lasting impacts that extend beyond immediate solutions."
  },
  {
    heading: "Ethical Practices",
    body: "We adhere to ethical practices in all our operations, ensuring integrity and trust in everything we do."
  }
];

const Home = () => {

  const [franchises, setFranchises] = useState([]);

  useEffect(() => {

    const fetchFranchises = async () => {
      try {
        const organizationsRef = fs.collection('franchise');
        const snapshot = await organizationsRef.get();
        const orgData = snapshot.docs.map(doc => doc.data());
        setFranchises(orgData);
      } catch (error) {
        console.error('Error fetching franchises:', error.message);
      }
    };

    fetchFranchises();
  }, []);


  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const donorsSnapshot = await fs.collection("donors").get();
        const testimonialData = await Promise.all(donorsSnapshot.docs.map(async (doc) => {
          const donorData = doc.data();
          const testimonialDoc = await fs.collection("testimonials").doc(doc.id).get();
          if (testimonialDoc.exists && testimonialDoc.data().testimonialData.length > 0) {
            const data = testimonialDoc.data().testimonialData;
            const randomTestimonial = data[Math.floor(Math.random() * data.length)];
            return {
              displayName: donorData.displayName,
              email: donorData.email,
              feedback: randomTestimonial.feedback,
            };
          }
          return null;
        }));

        setTestimonials(testimonialData.filter(testimonial => testimonial !== null));
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  const [toDisplay] = useTypewriter({
    words: ['Save Lives', 'Provide Shelter', 'Give Food', 'Create Happiness'],
    loop: true,
    typeSpeed: 120,
    deleteSpeed: 50
  });

  return (
    <div className="home">

      <section className="cover">
        <div className="profileText">
          <motion.p
            className="naam"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            إيثار
          </motion.p>
          <motion.p
            className="tagline"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Together We can
          </motion.p>
          <motion.div
            className="typewriter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {toDisplay}
            <Cursor cursorStyle='|' />
          </motion.div>
        </div>
        <motion.img
          className="coverImage"
          src={coverImage}
          alt="Poor Connection!!"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
      </section>

      <p className="bg-custom-gradient text-[35px] text-white py-[6px] font-bold rounded-2xl text-center" >Welcome To إيثار</p>
      {/*about section*/}
      <section className="about">
        <div className="abouttext">
          إيثار is a non-profitable Charity Organization which helps those in need through various humanitarian initiatives.
          With a dedicated team of volunteers and supporters, we strive to make a meaningful impact in the
          lives of individuals and communities facing adversity.Our mission is to provide essential aid and empower communities
        </div>
        <img src={mainlogo} alt="Example" className="coverImage" />
      </section>

      <section className="choose-us">
        <div className="choose-head">
          <h2 className="choose-heading">Why Trust Us</h2>
        </div>
        <div className="choose-container">
          {chooseUsData.map((item, index) => (
            <ChooseUsItem key={index} index={index} item={item} />
          ))}
        </div>
      </section>

      {/*Franchises */}
      <p className="text-green-900 mt-[15px] text-[45px] py-[6px] font-bold text-center">Active Franchises</p>
      <div className='h-[5px] rounded-2xl w-[95vw] bg-green-800 mx-auto my-[15px]'></div>
      <section className="back">
        <div className="table-container">
          <table className="table-body">
            <thead className="head">
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {franchises.map((franchise, index) => (
                <tr key={index}>
                  <td>{franchise.name}</td>
                  <td>{franchise.location}</td>
                  <td>{franchise.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/*Testimonial */}

      <p className="bg-custom-gradient mt-[25px] lg:mt-[35px] text-[35px] text-white py-[6px] font-bold rounded-2xl text-center">Top Donor's Testimonials</p>
      <section className="testimonial-carousel-container">
        <div className="testimonial-carousel-wrapper">
          <div className="testimonial-carousel">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="left-comma">
                  <FaQuoteLeft />
                </div>
                <div className="testimonial-feedback">
                  <b>{testimonial.feedback}</b>
                </div>
                <div className="right-comma">
                  <FaQuoteRight />
                </div>
                <div className="testimonial-info">
                  <div className="testimonial-name">{testimonial.displayName}</div>
                  <div className="testimonial-email">{testimonial.email}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <p className="bg-custom-gradient text-[35px] text-white py-[6px] font-bold rounded-2xl text-center" >Let's Get Involved</p>
      <div className="continue">
        <p className='getinvolve'>There are many ways to support our cause. Choose how you'd like to make a difference today:</p>
        <Link to="/signup" className="navButton">Donate Now</Link>
        <Link to="/signup" className="navButton">Volunteer Project</Link>
      </div>

      <Footer />

    </div>
  );
};

export default Home;
