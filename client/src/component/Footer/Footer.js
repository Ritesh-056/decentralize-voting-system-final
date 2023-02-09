import React from "react";
import Logo from "../../images/Logo.png";
import "./Footer.css";

const Footer = () => (
  <>
    <div className="footer-block"></div>
    <div className="footer">
      <div className="footer-container">
       <img src={Logo} alt="Logo" style={{ height: 100, width: 100}} />
      </div>
    </div>
  </>
);

export default Footer;

