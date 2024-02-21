import React from "react";

const Footer = () => {
  return (
    <footer className="footer footer-center p-4 bg-base-300 text-base-content">
      <p>
        &copy; {new Date().getFullYear()} High Street Gym. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
