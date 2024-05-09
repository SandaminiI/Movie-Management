import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footer">
      <h1 className="text-center"> All Right Reserved &copy;Leisurehub</h1>
      <p className="text-center mt-3">
        <Link to="/about">About Us</Link>|<Link to="/contact">Contact Us</Link>|
        <Link to="/policy">Privacy & Policy</Link>|
        <Link to="/reviews">Reviews & Ratings</Link>|
        <Link to="/feedback">Provide Feedback To LEISUREHUB</Link>
      </p>
      <p className="text-center">
        0786453567 | A810,Kaduwela | info@leisurehub.gov.lk
      </p>
    </div>
  );
};

export default Footer;
