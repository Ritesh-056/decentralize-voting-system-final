import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import LogoFirst from "../../images/LogoFirst.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav>
      <NavLink to="/" className="header">
        <img src={LogoFirst} alt="LogoFirst" style={{ height: 100, width: 100 }} />
      </NavLink>

      <ul
        className="navbar-links"
        style={{ width: "50%", transform: open ? "translateX(0px)" : "" }}
      >
        <li>
          <NavLink to="/Results" activeClassName="nav-active">
            Results
          </NavLink>
        </li>

        <li>
          <NavLink to="/Registration" activeClassName="nav-active">
            Registration
          </NavLink>
        </li>

        <li>
          <NavLink to="/RegisterCandidate" activeClassName="nav-active">
            Candidate Registration
          </NavLink>
        </li>

        <li>
          <NavLink to="/Voting" activeClassName="nav-active">
            Voting
          </NavLink>
        </li>
      </ul>
      <i onClick={() => setOpen(!open)} className="fas fa-bars burger-menu"></i>
    </nav>
  );
}
