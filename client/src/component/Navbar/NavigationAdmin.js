import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import LogoFirst from "../../images/LogoFirst.png";

import "./Navbar.css";

export default function NavbarAdmin() {
  const [open, setOpen] = useState(false);
  return (
    <nav>
      <div className="header">
        <img src={LogoFirst} alt="Logo" style={{ height: 90, width: 90 }} />
      </div>
      <ul
        className="navbar-links"
        style={{ transform: open ? "translateX(0px)" : "" }}
      >
         <li>
          <NavLink to="/" activeClassName="nav-active">
            Admin Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/Verification" activeClassName="nav-active">
            Voter Verification
          </NavLink>
        </li>

        <li>
          <NavLink to="/CandidateVerification" activeClassName="nav-active">
            Candidate Verification
          </NavLink>
        </li>
        <li>
          <NavLink to="/Registration" activeClassName="nav-active">
            Registration
          </NavLink>
        </li>
        <li>
          <NavLink to="/Voting" activeClassName="nav-active">
            Voting
          </NavLink>
        </li>
        <li>
          <NavLink to="/Results" activeClassName="nav-active">
            Results
          </NavLink>
        </li>
      </ul>
      <i onClick={() => setOpen(!open)} className="fas fa-bars burger-menu"></i>
    </nav>
  );
}
