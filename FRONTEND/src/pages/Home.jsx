import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import Silk from './Silk';
import Card from '../components/Card';
// import hero from "../assets/images/home-hero.png";
// import enrollBg from "../assets/images/enroll-bg.jpg";
// import enrollSide from "../assets/images/enroll-side.png";
import {
  Lightbulb,
  BarChart3,
  School,
  Music,
  ClipboardList,
  Flag,
  CalendarCheck,
  Mic,
  Quote,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  BookOpen,
  DollarSign,
  Bus,
  Activity,
  MessageSquare,
  Shield
} from "lucide-react";
import Slider from "react-slick";
import { Link } from 'react-router-dom';

const Home = () => {
  const [stats, setStats] = useState([
    { value: "24", label: "Years" },
    { value: "29", label: "Teachers" },
    { value: "1500", label: "Students" },
  ]);

  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/home-stats');
        if (data.success && data.data) {
          setStats([
            { value: data.data.years, label: "Years" },
            { value: data.data.teachers, label: "Teachers" },
            { value: data.data.students, label: "Students" },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);
  const features = [
    {
      icon: <Lightbulb size={40} className="text-white" />,
      title: "Quality teaching",
      desc: "Experienced and trained teachers who provide quality instruction are a top reason parents choose a school."
    },
    {
      icon: <BarChart3 size={40} className="text-white" />,
      title: "Educational Growth",
      desc: "Nurturing young minds with knowledge and critical thinking."
    },
    {
      icon: <School size={40} className="text-white" />,
      title: "Lifelong Learning",
      desc: "Equipping students with essential skills for a successful future."
    },
  ];

  const services = [
    {
      icon: <BookOpen size={40} className="text-blue-900" />,
      title: "Academic Services",
      desc: "Comprehensive academic support and resources to help students excel in their studies throughout the year.",
      image: "https://academic-services.providence.edu/wp-content/uploads/sites/36/2020/08/oas-banner-image-1024x467.jpg"
    },
    {
      icon: <DollarSign size={40} className="text-blue-900" />,
      title: "Fees & Finance Services",
      desc: "Transparent fee structure and flexible payment options to make quality education accessible to all families.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop"
    },
    {
      icon: <Bus size={40} className="text-blue-900" />,
      title: "Transport Services",
      desc: "Safe and reliable transportation services ensuring students reach school and return home securely every day.",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop"
    },
    {
      icon: <Activity size={40} className="text-blue-900" />,
      title: "Event & Activity Services",
      desc: "Engaging events and activities that promote teamwork, creativity, and holistic development of students.",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop"
    },
    {
      icon: <MessageSquare size={40} className="text-blue-900" />,
      title: "Communication Services",
      desc: "Seamless communication channels between school, parents, and students for better coordination and updates.",
      image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&h=600&fit=crop"
    },
    {
      icon: <Shield size={40} className="text-blue-900" />,
      title: "Security Services",
      desc: "24/7 security measures and protocols to ensure a safe and secure learning environment for all students.",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop"
    },
  ];

  const [testimonials, setTestimonials] = useState([]);
  const [imageErrors, setImageErrors] = useState({});

  const [contactSuccess, setContactSuccess] = useState("");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await axios.get('/parents');
        if (data.success && data.data) {
          setTestimonials(Array.isArray(data.data) ? data.data : []);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
      }
    };
    fetchTestimonials();
  }, []);



  const handleImageError = (parentId) => {
    setImageErrors(prev => ({ ...prev, [parentId]: true }));
  };



  useEffect(() => {
    if (!contactSuccess) return;
    const timer = setTimeout(() => setContactSuccess(""), 5000);
    return () => clearTimeout(timer);
  }, [contactSuccess]);

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-900 p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      aria-label="Previous"
    >
      <ChevronLeft className="text-white w-5 h-5 md:w-6 md:h-6" />
    </button>
  );

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-900 p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      aria-label="Next"
    >
      <ChevronRight className="text-white w-5 h-5 md:w-6 md:h-6" />
    </button>
  );

  const settings = {
    dots: false,
    infinite: testimonials.length > 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    centerMode: false,
    variableWidth: false,
    fade: false,
    pauseOnHover: true,
  };

  return (
    <>
    <title>Home | Holy Redeemer School</title>
      {/* Hero Section with Silk Background */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Silk Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Silk
            speed={5}
            scale={1.2}
            color="#1e40af"
            noiseIntensity={1.5}
            rotation={0}
          />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
          {/* Badge/Tag */}
          <div className="mb-6 inline-flex items-center gap-2 px-20 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            {/* <div className="w-4 h-4 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div> */}
            <span className="text-white text-sm font-medium">Welcome to Holy Redeemer School</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 max-w-4xl leading-tight">
            Excellence in Education,
            <br />
            <span className="text-blue-200">Nurturing Future Leaders</span>
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              to="/admissions/apply"
              className="px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-blue-900/80 backdrop-blur-md text-white rounded-lg font-semibold text-lg border border-white/20 hover:bg-blue-800/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose Us</h2>
          <div className="w-24 h-1 bg-blue-900 mx-auto mb-10 rounded"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, idx) => (
              <div
                key={idx}
                className={`group relative bg-white border rounded-lg shadow-sm p-8 cursor-pointer transition-all duration-500 ease-out transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 ${
                  hoveredCard === idx ? 'scale-105 shadow-2xl -translate-y-2' : ''
                }`}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Animated background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg transition-opacity duration-500 ${
                  hoveredCard === idx ? 'opacity-100' : 'opacity-0'
                }`}></div>

                {/* Icon with hover animation */}
                <div className={`relative z-10 w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-blue-900 clip-hexagon transition-all duration-700 ease-out transform group-hover:rotate-12 group-hover:scale-110 ${
                  hoveredCard === idx ? 'rotate-12 scale-110' : ''
                }`}>
                  <div className={`transition-all duration-500 ${
                    hoveredCard === idx ? 'rotate-12 scale-110' : ''
                  }`}>
                    {item.icon}
                  </div>
                </div>

                {/* Title with slide-in animation */}
                <h3 className={`relative z-10 text-xl font-bold text-gray-900 mb-2 transition-all duration-500 transform ${
                  hoveredCard === idx ? 'translate-x-2 text-blue-900' : ''
                }`}>
                  {item.title}
                </h3>

                {/* Description with fade-in animation */}
                <p className={`relative z-10 text-gray-600 font-semibold transition-all duration-500 ${
                  hoveredCard === idx ? 'text-gray-800 opacity-90' : ''
                }`}>
                  {item.desc}
                </p>

                {/* Subtle glow effect */}
                <div className={`absolute inset-0 rounded-lg transition-all duration-500 ${
                  hoveredCard === idx ? 'shadow-lg shadow-blue-200/50' : ''
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Our Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          {/* <p className="text-gray-600 mb-2">Providing quality education and holistic development.</p> */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Services</h2>
          <div className="w-24 h-1 bg-blue-900 mx-auto mb-10 rounded"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <Card
                key={idx}
                image={service.image}
                title={service.title}
                description={service.desc}
                showGradient={true}
              />
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Happy Parents</h2>
          <div className="w-24 h-1 bg-blue-900 mx-auto mb-10 rounded"></div>

          <div className="relative max-w-3xl mx-auto px-4 md:px-8">
            {testimonials.length > 0 ? (
              <div className="overflow-hidden">
                <Slider {...settings}>
                  {testimonials.map((t, idx) => (
                    <div key={t._id || idx}>
                      <div className="bg-blue-900 text-white rounded-xl p-6 md:p-8 shadow-lg h-[500px] flex flex-col items-center justify-center mx-auto max-w-full">
                      <Quote className="mx-auto mb-4 w-8 h-8 flex-shrink-0" />
                      {t.photo && !imageErrors[t._id] ? (
                        <img
                          src={t.photo}
                          alt={t.name}
                          className="parent-testimonial-image mx-auto w-64 h-56 md:w-80 md:h-64 rounded-lg object-cover mb-4 border-4 border-white shadow-xl flex-shrink-0"
                          onError={() => handleImageError(t._id)}
                          loading="lazy"
                          style={{ imageRendering: 'high-quality' }}
                        />
                      ) : (
                        <div className="mx-auto w-64 h-56 md:w-80 md:h-64 rounded-lg bg-white/20 flex items-center justify-center mb-4 border-4 border-white shadow-xl flex-shrink-0">
                          <User className="w-20 h-20 md:w-24 md:h-24 text-white" />
                        </div>
                      )}
                      <h3 className="font-semibold mb-3 text-base md:text-lg lg:text-xl px-2 text-center flex-shrink-0">{t.name}</h3>
                      <p className="text-sm md:text-base lg:text-lg leading-relaxed text-center px-2 flex-grow overflow-y-auto hide-scrollbar">{t.testimonial || t.text}</p>
                      <Quote className="mx-auto mt-4 w-8 h-8 rotate-180 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </Slider>
              </div>
            ) : (
              <div className="bg-blue-900 text-white rounded-xl p-8 md:p-12 shadow-lg h-[500px] flex flex-col items-center justify-center max-w-md mx-auto">
                <Quote className="mx-auto mb-4 w-8 h-8 flex-shrink-0" />
                <div className="mx-auto w-64 h-56 md:w-80 md:h-64 rounded-lg bg-white/20 flex items-center justify-center mb-4 border-4 border-white shadow-xl flex-shrink-0">
                  <User className="w-20 h-20 md:w-24 md:h-24 text-white" />
                </div>
                <h3 className="font-semibold mb-4 text-xl flex-shrink-0">No testimonials yet</h3>
                <p className="text-lg leading-relaxed text-center flex-grow">Check back soon for parent testimonials.</p>
                <Quote className="mx-auto mt-4 w-8 h-8 rotate-180 flex-shrink-0" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((s, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center">
                <div className="w-40 h-40 rounded-full border-4 border-blue-900 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-blue-900">{s.value}</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800">{s.label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get In Touch Section */}
      {/* <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10">Get In Touch</h2>

          <form onSubmit={handleContactSubmit} className="max-w-4xl mx-auto">
            {contactError && (
              <div className="rounded-md bg-red-50 p-3 text-red-600 text-center mb-4">
                {contactError}
              </div>
            )}
            {contactSuccess && (
              <div className="rounded-md bg-green-50 p-3 text-green-600 text-center mb-4">
                {contactSuccess}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                name="name"
                value={contactFormData.name}
                onChange={handleContactChange}
                placeholder="Your Name"
                required
                className="border border-gray-300 rounded-md px-4 py-3 w-full focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
              <input
                type="email"
                name="email"
                value={contactFormData.email}
                onChange={handleContactChange}
                placeholder="Email ID"
                required
                className="border border-gray-300 rounded-md px-4 py-3 w-full focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
              <input
                type="tel"
                name="mobileNumber"
                value={contactFormData.mobileNumber}
                onChange={handleContactChange}
                placeholder="Mobile Number"
                required
                className="border border-gray-300 rounded-md px-4 py-3 w-full focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
            <textarea
              rows="5"
              name="message"
              value={contactFormData.message}
              onChange={handleContactChange}
              placeholder="Message"
              required
              className="border border-gray-300 rounded-md px-4 py-3 w-full mb-4 focus:ring-2 focus:ring-blue-900 focus:outline-none resize-y"
            ></textarea>
            <div className="text-center">
              <button
                type="submit"
                disabled={contactLoading}
                className="px-8 py-3 bg-blue-900 text-white font-semibold rounded-md shadow hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {contactLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </section> */}
    </>
  );
};

export default Home;
