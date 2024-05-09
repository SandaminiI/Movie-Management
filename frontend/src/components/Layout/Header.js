import React from "react";
import { NavLink, Link } from "react-router-dom";
//import LEISUREHUB_LOGO from '../assets/LEISUREHUB_LOGO.jpg'
import LEISUREHUB_LOGO from "../../assets/LEISUREHUB_LOGO.jpg";

const Header = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link
              to="/"
              className="navbar-brand"
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                src={LEISUREHUB_LOGO}
                alt="logo"
                style={{ maxHeight: "50px", marginRight: "10px" }}
              />
              <span style={{ marginTop: "5px" }}>LEISUREHUB</span>
            </Link>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/movies" className="nav-link">
                  Movies
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/schedules" className="nav-link">
                  Movie Show Times
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/booking" className="nav-link">
                  Booking
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/gamesandactivities" className="nav-link">
                  Games & Activities
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/facilities" className="nav-link">
                  Facilities
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/membership" className="nav-link">
                  Memberships
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/login" className="nav-link">
                  Login
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
