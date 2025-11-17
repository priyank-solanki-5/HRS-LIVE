import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import Card from "../components/Card";
import HeroWaveSection from "../components/HeroWaveSection";

const benefits = [
  {
    title: "Supportive Environment",
    desc: "A friendly, team-oriented school culture that values every staff member.",
    icon: "✅",
  },
  {
    title: "Growth Opportunities",
    desc: "Regular workshops and training to help you grow professionally.",
    icon: "✅",
  },
  {
    title: "Modern Facilities",
    desc: "Smart classrooms, digital tools, and updated teaching resources.",
    icon: "✅",
  },
  {
    title: "Innovation Friendly",
    desc: "We encourage creative teaching methods and fresh ideas.",
    icon: "✅",
  },
];

const Career = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    currentPosition: '',
    currentCompany: '',
    yearsOfExperience: '',
    education: '',
    skills: '',
    coverLetter: '',
    expectedSalary: '',
    availability: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get("/jobs");
        if (!data.success) {
          throw new Error(data.message || "Failed to load jobs");
        }
        if (!ignore) {
          setJobs(Array.isArray(data.data) ? data.data : []);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || err.message || "Failed to load jobs");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadJobs();

    return () => {
      ignore = true;
    };
  }, []);

  const formatDate = (value) => {
    if (!value) return "";
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return value;
    }
  };

  const handleApplyNow = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
    setApplicationForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      city: '',
      state: '',
      pinCode: '',
      currentPosition: '',
      currentCompany: '',
      yearsOfExperience: '',
      education: '',
      skills: '',
      coverLetter: '',
      expectedSalary: '',
      availability: ''
    });
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const payload = {
        ...applicationForm,
        jobId: selectedJob._id,
        yearsOfExperience: applicationForm.yearsOfExperience ? parseInt(applicationForm.yearsOfExperience) : undefined
      };

      const { data } = await axios.post('/job-applications', payload);
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit application');
      }

      setSubmitSuccess('Application submitted successfully!');
      setTimeout(() => {
        setShowApplicationModal(false);
        setSubmitSuccess('');
      }, 2000);
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <title>Career | Holy Redeemer School</title>
      <div className="bg-white">
        <HeroWaveSection
          eyebrow="Join Our Team"
          title="Careers"
          subtitle="Inspire the next generation in an inclusive, growth-oriented campus."
        />

      {/* Why Work With Us */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 relative inline-block">
          Why Work With Us?
          <span className="block w-16 h-1 bg-indigo-900 mx-auto mt-2 rounded"></span>
        </h2>
        <div className="space-y-8 max-w-3xl mx-auto text-left">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-4">
              <span className="text-2xl">{benefit.icon}</span>
              <div>
                <h3 className="text-lg font-bold">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Job Openings */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 relative">
            Current Job Openings
            <span className="block w-20 h-1 bg-indigo-900 mx-auto mt-2 rounded"></span>
          </h2>

          {loading ? (
            <div className="text-center text-slate-500">Loading current openings...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : jobs.length === 0 ? (
            <div className="text-center text-slate-500">
              We&apos;re not hiring right now. Please check back soon!
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <div key={job._id} className="relative">
                  <Card
                    image="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop"
                    title={job.title}
                    description={`${job.employmentType} • ${job.location}\n\n${job.description}`}
                    date={`Deadline: ${formatDate(job.deadline)}`}
                    showGradient={true}
                    onClick={() => handleApplyNow(job)}
                    className="h-full"
                  />
                  <button 
                    onClick={() => handleApplyNow(job)}
                    className="mt-4 w-full bg-indigo-900 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 font-semibold"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowApplicationModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Apply for {selectedJob.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{selectedJob.employmentType} • {selectedJob.location}</p>
              </div>
              <button
                onClick={() => setShowApplicationModal(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitApplication} className="p-6 space-y-6">
              {submitError && <div className="rounded-md bg-red-50 p-3 text-red-600 text-sm">{submitError}</div>}
              {submitSuccess && <div className="rounded-md bg-emerald-50 p-3 text-emerald-600 text-sm">{submitSuccess}</div>}

              {/* Personal Information */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700">First Name <span className="text-red-500">*</span></label>
                    <input name="firstName" value={applicationForm.firstName} onChange={handleFormChange} required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Last Name <span className="text-red-500">*</span></label>
                    <input name="lastName" value={applicationForm.lastName} onChange={handleFormChange} required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Email <span className="text-red-500">*</span></label>
                    <input type="email" name="email" value={applicationForm.email} onChange={handleFormChange} required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Phone <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" value={applicationForm.phone} onChange={handleFormChange} required className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={applicationForm.dateOfBirth} onChange={handleFormChange} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">City</label>
                    <input name="city" value={applicationForm.city} onChange={handleFormChange} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">State</label>
                    <input name="state" value={applicationForm.state} onChange={handleFormChange} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Pin Code</label>
                    <input name="pinCode" value={applicationForm.pinCode} onChange={handleFormChange} maxLength="6" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Address</label>
                    <textarea name="address" rows="2" value={applicationForm.address} onChange={handleFormChange} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Professional Information</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700">Current Position</label>
                    <input name="currentPosition" value={applicationForm.currentPosition} onChange={handleFormChange} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Current Company</label>
                    <input name="currentCompany" value={applicationForm.currentCompany} onChange={handleFormChange} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Years of Experience</label>
                    <input type="number" name="yearsOfExperience" value={applicationForm.yearsOfExperience} onChange={handleFormChange} min="0" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Education</label>
                    <input name="education" value={applicationForm.education} onChange={handleFormChange} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Skills</label>
                    <textarea name="skills" rows="2" value={applicationForm.skills} onChange={handleFormChange} placeholder="List your key skills" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Expected Salary</label>
                    <input name="expectedSalary" value={applicationForm.expectedSalary} onChange={handleFormChange} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">Availability</label>
                    <input name="availability" value={applicationForm.availability} onChange={handleFormChange} placeholder="e.g., Immediate, 2 weeks notice" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-slate-700">Cover Letter</label>
                    <textarea name="coverLetter" rows="4" value={applicationForm.coverLetter} onChange={handleFormChange} placeholder="Tell us why you're interested in this position" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowApplicationModal(false)}
                  className="rounded-md border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`rounded-md bg-indigo-900 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 ${submitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Career;