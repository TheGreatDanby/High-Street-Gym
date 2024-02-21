import React from "react";
import { NavLink } from "react-router-dom";

import {
  HiUser,
  HiAcademicCap,
  HiCalendar,
  HiPencilAlt,
  HiLogin,
  HiLogout,
  HiUsers,
} from "react-icons/hi";
import { useAuthentication } from "../hooks/authentication";

function Navbar() {
  const { authenticatedUser: user } = useAuthentication();

  const getRoleColorClass = (role) => {
    switch (role) {
      case "Admin":
        return "text-red-600";
      case "Trainer":
        return "text-green-600";
      case "Member":
        return "text-blue-600";
      default:
        return "text-black";
    }
  };

  return (
    <div className="relative">
      <nav className="bg-gray-100 min-h-screen hidden md:block sticky top-0 z-50">
        <ul className="space-y-4 p-4">
          <NavItem to="/timetable" text="Timetable" icon={HiCalendar} />
          {user && user.role !== "Member" && (
            <NavItem to="/classes" text="Classes" icon={HiAcademicCap} />
          )}
          <NavItem to="/blog" text="Blog" icon={HiPencilAlt} />
          <NavItem to="/users" text="Users" icon={HiUsers} />
          {!user && <NavItem to="/" text="Login" icon={HiLogin} />}
          {user && (
            <li
              className={`p-2 flex items-center ${getRoleColorClass(
                user.role
              )}`}
            >
              <HiUser />
              <p className="ml-2">{user.firstName}</p>
            </li>
          )}{" "}
          {user && <NavItem to="/logout" text="Logout" icon={HiLogout} />}
        </ul>
      </nav>
      <nav className="bg-gray-100 fixed  top-0 left-0 right-0 w-full md:hidden z-50">
        <ul className="flex justify-around p-2">
          <NavItem to="/timetable" text="Timetable" icon={HiCalendar} mobile />
          {user && user.role !== "Member" && (
            <NavItem to="/classes" text="Classes" icon={HiAcademicCap} mobile />
          )}
          <NavItem to="/blog" text="Blog" icon={HiPencilAlt} mobile />
          <NavItem to="/users" text="Users" icon={HiUser} mobile />
          {!user && <NavItem to="/" text="Login" icon={HiLogin} mobile />}
          {user && (
            <NavItem to="/logout" text="Logout" icon={HiLogout} mobile />
          )}
          {user && (
            <li className="text-gray-600 mr-4 text-right	">{user.firstName}</li>
          )}{" "}
        </ul>
      </nav>
    </div>
  );
}

const NavItem = ({ to, exact = false, text, icon: Icon, mobile }) => {
  return (
    <li>
      <NavLink
        to={to}
        className="flex items-center space-x-2 p-2 rounded text-primary hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200"
      >
        <Icon className="w-5 h-5" />
        {!mobile && <span>{text}</span>}
      </NavLink>
    </li>
  );
};

export default Navbar;
