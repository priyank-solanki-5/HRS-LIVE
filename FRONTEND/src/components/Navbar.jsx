import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import logo from "../assets/images/logo.png"; // Update path if needed
import { Link, useLocation } from "react-router-dom"; // Use RouterLink for navigation
import GradientText from "../pages/GradientText";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Admissions", to: "/admissions" },
    { name: "Academics", to: "/academics" },
    {
      name: "Activities",
      children: [
        { name: "Curricular Activities", to: "/activities/curricular" },
        { name: "Co-Curricular Activities", to: "/activities/co-curricular" },
        {
          name: "Extra-Curricular Activities",
          to: "/activities/extra-curricular",
        },
      ],
    },
    { name: "Events", to: "/events" },
    { name: "Transportation", to: "/transportation" },
    { name: "About Us", to: "/about" },
    { name: "Career", to: "/career" },
    { name: "Contact Us", to: "/contact" },
  ];

  const isLinkActive = (link) => {
    if (link.to) {
      return location.pathname === link.to;
    }

    if (link.children) {
      return link.children.some((child) => location.pathname === child.to);
    }

    return false;
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-md">
      {/* 🔹 Top Section */}
      <div className="flex items-center justify-between px-4 md:px-10 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-18">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-15 md:h-19" />
          </Link>

          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={3}
            showBorder={false}
            className="custom-class"
          >
            <h3 className="text-4xl">Holy Redeemer School</h3>
          </GradientText>
        </div>

        {/* Contact + Social (Desktop Only) */}
        <div className="hidden lg:flex items-center space-x-6 text-sm text-gray-700">
          <div className="flex items-center space-x-1">
            <Phone size={16} />
            <a href="+91 9081544225">+91 0123456789</a>
          </div>
          <div className="flex items-center space-x-1">
            <Mail size={16} />
            <span>example@mail.com</span>
          </div>
          <div className="flex space-x-4 text-blue-900">
            <a href="#" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Mobile Hamburger - Hidden on admin routes */}
        {!isAdminRoute && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden focus:outline-none text-gray-800"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}
      </div>
      {!isAdminRoute && (
        <nav className="hidden lg:flex justify-center border-t border-blue-900 bg-white">
          <ul className="flex space-x-8 py-3 font-medium text-gray-800">
            {navLinks.map((link) => (
              <li
                key={link.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.children ? (
                  <>
                    <button
                      type="button"
                      className={`flex items-center gap-1 hover:text-blue-900 transition-colors duration-300 ${
                        isLinkActive(link) ? "text-blue-900 font-bold" : ""
                      }`}
                    >
                      {link.name}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === link.name ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {activeDropdown === link.name && (
                      <div className="absolute left-1/2 top-full z-40 flex w-max -translate-x-1/2 pt-4">
                        <div className="w-72 rounded-xl bg-white shadow-xl border border-gray-100 py-3">
                          {link.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.to}
                              className={`block px-5 py-2 text-sm hover:bg-blue-50 hover:text-blue-900 transition ${
                                location.pathname === child.to
                                  ? "text-blue-900 font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.to}
                    className={`hover:text-blue-900 transition-colors duration-300 ${
                      isLinkActive(link) ? "text-blue-900 font-bold" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
      {/* 🔹 Mobile Nav (Animated) - Hidden on admin routes */}
      {!isAdminRoute && (
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-blue-900 shadow-md"
            >
              <ul className="flex flex-col space-y-4 p-5 font-medium text-gray-800">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    {link.children ? (
                      <div>
                        <button
                          type="button"
                          className={`w-full flex items-center justify-between text-left hover:text-blue-900 transition-colors duration-300 ${
                            isLinkActive(link) ? "text-blue-900 font-bold" : ""
                          }`}
                          onClick={() =>
                            setActiveDropdown((current) =>
                              current === link.name ? null : link.name
                            )
                          }
                        >
                          {link.name}
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              activeDropdown === link.name ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {activeDropdown === link.name && (
                          <div className="mt-3 space-y-3 pl-3 border-l border-blue-100">
                            {link.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.to}
                                className={`block text-sm hover:text-blue-900 transition-colors duration-300 ${
                                  location.pathname === child.to
                                    ? "text-blue-900 font-semibold"
                                    : "text-gray-700"
                                }`}
                                onClick={closeMobileMenu}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={link.to}
                        className={`block hover:text-blue-900 transition-colors duration-300 ${
                          isLinkActive(link) ? "text-blue-900 font-bold" : ""
                        }`}
                        onClick={closeMobileMenu}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}

                {/* Contact + Social (Mobile Only) */}
                <div className="mt-6 space-y-3 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Phone size={16} />
                    <span>+91 9081544225</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail size={16} />
                    <span>holyredeemereng@gmail.com</span>
                  </div>
                  <div className="flex space-x-4 text-blue-900 pt-2">
                    <a href="#" aria-label="Facebook">
                      <Facebook size={20} />
                    </a>
                    <a href="#" aria-label="Instagram">
                      <Instagram size={20} />
                    </a>
                    <a href="#" aria-label="LinkedIn">
                      <Linkedin size={20} />
                    </a>
                  </div>
                </div>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      )}
    </header>
  );
};

export default Navbar;
