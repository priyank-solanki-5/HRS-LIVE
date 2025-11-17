import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react"; // icons
import logo from "../assets/images/logo.png"; // replace with your logo path
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start">
          <img src={logo} alt="School Logo" className="w-28 mb-4" />
        </div>

        {/* Our Campus */}
        <div>
          <h3 className="font-semibold text-lg mb-3 border-b border-gray-400 inline-block">
            Our Campus
          </h3>
          <ul className="space-y-2">
            <li><Link to="games-sports" className="hover:underline">Games and Sports</Link></li>
            {/* <li><Link to="#" className="hover:underline">Testimonial</Link></li> */}
            <li><Link to="/career" className="hover:underline">Career</Link></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="font-semibold text-lg mb-3 border-b border-gray-400 inline-block">
            Useful Links
          </h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/academics" className="hover:underline">Academics</Link></li>
            <li><Link to="/admissions" className="hover:underline">Admissions</Link></li>
            <li><Link to="/events" className="hover:underline">Events</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="font-semibold text-lg mb-3 border-b border-gray-400 inline-block">
            Contact Us
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <MapPin size={18} /> 
              <span>Yagraj nagar-1, At post madhapar.</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} /> 
              <span>+91 9081544225</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} /> 
              <span>holyredeemereng@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={18} /> 
              <span>Mon - Fri, 08:00AM - 06:00PM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-400 mt-6 py-4 px-6 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>© 2025 Holy Redeemer School, all rights reserved</p>
        <div className="flex gap-4 mt-3 md:mt-0">
          <a href="#" className="hover:text-gray-300"><Facebook size={20} /></a>
          <a href="#" className="hover:text-gray-300"><Instagram size={20} /></a>
          <a href="#" className="hover:text-gray-300"><Linkedin size={20} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
