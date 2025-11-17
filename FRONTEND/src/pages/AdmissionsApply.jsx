import React, { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle";
import axios from "../utils/axios";
import HeroWaveSection from "../components/HeroWaveSection";

const AdmissionsApply = () => {
  const emptyForm = {
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    age: "",
    religion: "",
    caste: "",
    category: "",
    aadhaarNumber: "",
    className: "",
    mobileNumber: "",
    alternateMobileNumber: "",
    email: "",
    permanentAddress: "",
    correspondenceAddress: "",
    city: "",
    state: "",
    pinCode: "",
    fatherName: "",
    fatherOccupation: "",
    fatherMobileNumber: "",
    motherName: "",
    motherOccupation: "",
    motherMobileNumber: "",
    guardianName: "",
    annualFamilyIncome: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sameAsPermanent, setSameAsPermanent] = useState(false);

  const update = (e) => {
    const { name, value } = e.target;

    // Update the changed field. If permanentAddress changes and checkbox is checked,
    // also update correspondenceAddress to keep them in sync.
    setForm((f) => {
      const updated = { ...f, [name]: value };
      if (name === "permanentAddress" && sameAsPermanent) {
        updated.correspondenceAddress = value;
      }
      return updated;
    });

    // Auto-calculate age from date of birth (kept as separate update to keep logic clear)
    if (name === "dateOfBirth" && value) {
      const dob = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }
      setForm((f) => ({ ...f, age: age.toString() }));
    }
  };

  const toggleSameAsPermanent = (e) => {
    const checked = e.target.checked;
    setSameAsPermanent(checked);
    if (checked) {
      // copy current permanent address into correspondence immediately
      setForm((f) => ({ ...f, correspondenceAddress: f.permanentAddress }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { data } = await axios.post("/admissions", form);
      if (!data.success) throw new Error(data.message || "Failed to submit");
      setSuccess("Application submitted successfully!");
      setForm(emptyForm);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to submit"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!success) return;
    const id = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(id);
  }, [success]);

  return (
    <>
      <title>Apply For Admission | Holy Redeemer School</title>
      <div className="bg-white">
        <HeroWaveSection
          eyebrow="Apply Online"
          title="Admission Application"
          subtitle="Complete the secure form below to reserve your child’s seat for the upcoming academic year."
        />
        <div className="max-w-4xl mx-auto p-6">
      <SectionTitle title="Admission Application" />
      <form onSubmit={submit} className="mt-8 space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-red-600">{error}</div>
        )}
        {success && (
          <div className="rounded-md bg-emerald-50 p-3 text-emerald-600">
            {success}
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Personal Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={update}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Middle Name
              </label>
              <input
                name="middleName"
                value={form.middleName}
                onChange={update}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={update}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 mt-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={update}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={update}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={update}
                required
                min="1"
                max="100"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 mt-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Religion
              </label>
              <select
                name="religion"
                value={form.religion}
                onChange={update}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select Religion</option>
                <option value="Hinduism">Hinduism</option>
                <option value="Islam">Islam</option>
                <option value="Christianity">Christianity</option>
                <option value="Sikhism">Sikhism</option>
                <option value="Buddhism">Buddhism</option>
                <option value="Jainism">Jainism</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Caste
              </label>
              <input
                name="caste"
                value={form.caste}
                onChange={update}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={update}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Aadhaar Number
              </label>
              <input
                name="aadhaarNumber"
                value={form.aadhaarNumber}
                onChange={update}
                maxLength="12"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                name="className"
                value={form.className}
                onChange={update}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select Class</option>
                <option value="Pre-Primary">Pre-Primary</option>
                <option value="Nursery">Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
                <option value="5th">5th</option>
                <option value="6th">6th</option>
                <option value="7th">7th</option>
                <option value="8th">8th</option>
                <option value="9th">9th</option>
                <option value="10th">10th</option>
                <option value="11th">11th</option>
                <option value="12th">12th</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Contact Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Mobile Number (Student) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={update}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Alternate Mobile Number
              </label>
              <input
                type="tel"
                name="alternateMobileNumber"
                value={form.alternateMobileNumber}
                onChange={update}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Address Information
          </h3>
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700">
              Permanent Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="permanentAddress"
              rows="3"
              value={form.permanentAddress}
              onChange={update}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="mb-2 flex items-center gap-3">
            <input
              id="sameAsPermanent"
              type="checkbox"
              checked={sameAsPermanent}
              onChange={toggleSameAsPermanent}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="sameAsPermanent" className="text-sm text-slate-700">
              Correspondence same as Permanent Address
            </label>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700">
              Correspondence Address
            </label>
            <textarea
              name="correspondenceAddress"
              rows="3"
              value={form.correspondenceAddress}
              onChange={update}
              className={`mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none ${
                sameAsPermanent
                  ? "bg-slate-50 cursor-not-allowed opacity-80"
                  : ""
              }`}
              disabled={sameAsPermanent}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                name="city"
                value={form.city}
                onChange={update}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                State <span className="text-red-500">*</span>
              </label>
              <input
                name="state"
                value={form.state}
                onChange={update}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Pin Code <span className="text-red-500">*</span>
              </label>
              <input
                name="pinCode"
                value={form.pinCode}
                onChange={update}
                required
                maxLength="6"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Father's Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Father's Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Father's Name <span className="text-red-500">*</span>
              </label>
              <input
                name="fatherName"
                value={form.fatherName}
                onChange={update}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Father's Occupation
              </label>
              <input
                name="fatherOccupation"
                value={form.fatherOccupation}
                onChange={update}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Father's Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="fatherMobileNumber"
                value={form.fatherMobileNumber}
                onChange={update}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Mother's Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Mother's Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Mother's Name <span className="text-red-500">*</span>
              </label>
              <input
                name="motherName"
                value={form.motherName}
                onChange={update}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Mother's Occupation
              </label>
              <input
                name="motherOccupation"
                value={form.motherOccupation}
                onChange={update}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Mother's Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="motherMobileNumber"
                value={form.motherMobileNumber}
                onChange={update}
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Guardian & Additional Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Additional Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Guardian Name (if different)
              </label>
              <input
                name="guardianName"
                value={form.guardianName}
                onChange={update}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Annual Family Income
              </label>
              <input
                name="annualFamilyIncome"
                value={form.annualFamilyIncome}
                onChange={update}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
      </div>
    </>
  );
};

export default AdmissionsApply;
