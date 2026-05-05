import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkToken);
    checkToken();

    return () => window.removeEventListener("storage", checkToken);
  }, []);

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    setIsLoggedIn(false);

    setMobileOpen(false);
    setProfileOpen(false);

    toast.success("Logged out successfully!");
    navigate("/auth");
  };

  const goTo = (path) => {
    setMobileOpen(false);
    setProfileOpen(false);
    navigate(path);
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <div className="logo" style={{ cursor: "pointer" }} onClick={() => goTo("/")}>
          Trans<span>L</span>
        </div>
      </div>

      <div className="nav-links desktop-only">
        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/shipper">Post a Load</NavLink>
        <NavLink to="/truck">Register Truck</NavLink>
        <NavLink to="/match">View Matches</NavLink>

        {!isLoggedIn ? (
          <NavLink to="/auth" className="nav-auth-btn">
            Log in / Sign up
          </NavLink>
        ) : (
          <div style={{ position: "relative" }}>
            <button
              className="btn btn-outline"
              style={{ padding: "10px 18px", fontSize: "14px" }}
              onClick={() => setProfileOpen(!profileOpen)}
            >
              Profile ▾
            </button>

            {profileOpen && (
              <div className="dropdown">
                <div className="dropdown-top">Logged in</div>

                <button onClick={() => goTo("/profile")} className="dropdown-btn">
                  My Profile
                </button>

                <button onClick={logout} className="dropdown-btn danger">
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        className="hamburger mobile-only"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        ☰
      </button>

      {mobileOpen && (
        <div className="mobile-menu">
          <button className="mobile-link" onClick={() => goTo("/")}>
            Home
          </button>

          <button className="mobile-link" onClick={() => goTo("/shipper")}>
            Post a Load
          </button>

          <button className="mobile-link" onClick={() => goTo("/truck")}>
            Register Truck
          </button>

          <button className="mobile-link" onClick={() => goTo("/match")}>
            View Matches
          </button>

          <div className="mobile-divider"></div>

          {!isLoggedIn ? (
            <button className="mobile-auth" onClick={() => goTo("/auth")}>
              Log in / Sign up
            </button>
          ) : (
            <>
              <button className="mobile-link" onClick={() => goTo("/profile")}>
                My Profile
              </button>

              <button className="mobile-link danger" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}