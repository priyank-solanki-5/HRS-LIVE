import React, { useState, useEffect } from "react";
import axios from "../utils/axios";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import HeroWaveSection from "../components/HeroWaveSection";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!formData.name || !formData.email || !formData.mobileNumber || !formData.message) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post('/contacts', formData);
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit contact form');
      }
      setSuccess('Thank you for contacting us! We will get back to you soon.');
      setFormData({
        name: "",
        email: "",
        mobileNumber: "",
        message: ""
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit contact form');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(""), 5000);
    return () => clearTimeout(timer);
  }, [success]);

  return (
    <>
      <title>Contact Us | Holy Redeemer School</title>
      <div className="bg-white">
        <HeroWaveSection
          eyebrow="We’d Love To Hear From You"
          title="Contact Us"
          subtitle="Reach out for admissions, partnerships, or any question—we respond within 2 business days."
        />

        {/* Contact Info */}
        <section className="container mx-auto px-6 py-12 grid gap-8 md:grid-cols-3 text-center">
          <div>
            <FaPhoneAlt className="text-3xl text-blue-900 mx-auto mb-4" />
            <h3 className="font-semibold text-lg">Call us on</h3>
            <p className="text-gray-700 mt-2">+91 9081544225</p>
          </div>
          <div>
            <FaMapMarkerAlt className="text-3xl text-blue-900 mx-auto mb-4" />
            <h3 className="font-semibold text-lg">Come find us at</h3>
            <p className="text-gray-700 mt-2">Yagraj nagar-1, At post madhapar.</p>
          </div>
          <div>
            <FaEnvelope className="text-3xl text-blue-900 mx-auto mb-4" />
            <h3 className="font-semibold text-lg">Email us at</h3>
            <p className="text-gray-700 mt-2">holyredeemereng@gmail.com</p>
          </div>
        </section>

        {/* Google Map */}
        <section className="container mx-auto px-6 pb-12">
        <iframe
        title="School Location"
        className="rounded-lg shadow-md" 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.7884092859863!2d70.7571549742112!3d22.32384064204383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959c90b9fd552a5%3A0x4cabc598afc8e54c!2sHoly%20Redeemer%20School!5e0!3m2!1sen!2sus!4v1761980287984!5m2!1sen!2sus" 
        width="100%" 
        height="450"  
        allowFullScreen="" 
        loading="lazy">
        </iframe>
        </section>

        {/* Contact Form */}
        <section className="container mx-auto px-6 pb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Get In Touch
          </h2>
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-red-600 text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-green-600 text-center">
                {success}
              </div>
            )}
            <div className="grid gap-6 md:grid-cols-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="border border-gray-300 rounded-md px-4 py-3 w-full focus:ring-2 focus:ring-blue-900 outline-none"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email ID"
                required
                className="border border-gray-300 rounded-md px-4 py-3 w-full focus:ring-2 focus:ring-blue-900 outline-none"
              />
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="Mobile Number"
                required
                className="border border-gray-300 rounded-md px-4 py-3 w-full focus:ring-2 focus:ring-blue-900 outline-none"
              />
            </div>
            <textarea
              rows="5"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              required
              className="border border-gray-300 rounded-md px-4 py-3 w-full focus:ring-2 focus:ring-blue-900 outline-none"
            ></textarea>
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-900 text-white font-semibold rounded-md hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default ContactUs;
