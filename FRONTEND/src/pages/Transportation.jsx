import React from "react";
import SectionTitle from "../components/SectionTitle";
import HeroWaveSection from "../components/HeroWaveSection";
import schoolImg from "../assets/images/school.png";

const Transportation = () => {
  return (
    <>
      <title>Transportation | Holy Redeemer School</title>
      <div className="bg-white">
        <HeroWaveSection
          eyebrow="Student Transit"
          title="Transportation"
          subtitle="Safe, reliable, and comfortable transport services for every student."
        />

        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-gray-700 space-y-8 font-semibold">
            <SectionTitle icon="🚌" title="Transportation Services" />
            <p className="text-lg leading-relaxed">
              Holy Redeemer School provides a secure, punctual, and
              parent-friendly transportation service that prioritizes student
              safety and reliability. Our service supports daily commutes,
              school events, and special trips through carefully planned routes
              and professionally trained staff.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">What We Provide</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    Modern, well-maintained buses with seat belts and first-aid
                    kits.
                  </li>
                  <li>
                    Vetted, trained drivers and an escort on each vehicle.
                  </li>
                  <li>
                    Real-time tracking and timely SMS/email notifications for
                    parents.
                  </li>
                  <li>
                    Strict boarding, drop-off, and emergency response
                    procedures.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Routes & Scheduling</h3>
                <p className="leading-relaxed text-gray-700">
                  We operate fixed-stop routes across the city with morning and
                  afternoon runs. Routes are reviewed regularly to optimize
                  travel time and safety. Additional or modified routes can be
                  introduced based on demand — please contact the transport
                  office to request route consideration in your area.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Enrollment & Fees</h3>
                <p className="leading-relaxed text-gray-700">
                  Seats are allocated per route on a first-come basis. To
                  enroll, submit the transport request form available at the
                  school office or via the Admissions page. Fees are billed
                  termly and prorated for mid-term enrollments; invoices and
                  payment options are provided by the finance office.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Contact & Apply</h3>
                <p className="leading-relaxed text-gray-700">
                  For route availability, pickup points, or to request a seat,
                  contact our Transport Coordinator:
                </p>
                <p className="mt-3">
                  Transport Coordinator: <strong>+91 90815 44225</strong>
                </p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:transport@holyredeemerschool.edu"
                    className="text-blue-900"
                  >
                    transport@holyredeemerschool.edu
                  </a>
                </p>
                <div className="mt-4">
                  <a
                    href="/contact"
                    className="inline-block bg-blue-900 text-white px-5 py-2 rounded shadow hover:bg-blue-800"
                  >
                    Contact Transport Team
                  </a>
                  {/* <a
                    href="/admissions"
                    className="ml-3 inline-block border border-blue-900 text-blue-900 px-5 py-2 rounded hover:bg-blue-50"
                  >
                    Apply for Transport
                  </a> */}
                </div>
              </div>
            </div>

            <SectionTitle icon="🔒" title="Our Safety Promise" />
            <ul className="list-disc pl-6 text-gray-700">
              <li>Daily vehicle inspections and scheduled maintenance.</li>
              <li>
                Driver background checks, ongoing training, and performance
                reviews.
              </li>
              <li>
                An escort on every run to assist students during boarding and
                alighting.
              </li>
              <li>
                Emergency procedures, first-aid readiness and parent
                notification systems.
              </li>
            </ul>

            <div className="pt-4">
              <p className="text-sm text-gray-600">
                Need a map or specific route details? Please contact the
                transport office and we will share route maps and estimated
                pickup times for your area.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transportation;
