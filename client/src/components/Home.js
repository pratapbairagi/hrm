import React from 'react';
import heroImage from "../asset/kms.jpg"
import { NavLink } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-700 text-white py-24 text-center" 
      // style={{backgroundImage:`url(${heroImage})`, backgroundRepeat:"no-repeat", backgroundPosition:"center", backgroundSize:"100%"}}
      >
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {/* Manage Your Workforce Efficiently */}
            Chittaranjan Park Kali Mandir Society
          </h1>
          <p className="text-xl md:text-2xl mb-6">
            {/* The ultimate HRM system to streamline your employee management and grow your business. */}
            Manage your employee's Attendance, Salary and Other database with our Human Resource Management System
          </p>
          <NavLink
            to="/auth"
            className="bg-indigo-500 text-white px-8 py-3 rounded-md text-lg hover:bg-indigo-400 transition"
          >
            Get Started
          </NavLink>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-gray-100 p-8 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">Employee Database</h3>
              <p className="text-gray-600">
                Store, manage, and organize your employees’ data in a secure, easy-to-access database.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">Payroll Management</h3>
              <p className="text-gray-600">
                Automatically calculate and distribute payroll with precision, saving time and avoiding errors.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">Performance Tracking</h3>
              <p className="text-gray-600">
                Track employee performance, set goals, and manage feedback all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-indigo-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">What Our Clients Say</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="w-full sm:w-1/2 lg:w-1/3 bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="text-gray-600 mb-4">
                "This HRM system has been a game changer for our organization. We can now easily manage payroll, track performance, and handle all HR needs in one place!"
              </p>
              <div className="font-semibold text-indigo-600">John Doe</div>
              <p className="text-gray-500">CEO, TechCorp</p>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="text-gray-600 mb-4">
                "I love how easy it is to use. The interface is clean, and the features are exactly what we need to scale our team without stress."
              </p>
              <div className="font-semibold text-indigo-600">Jane Smith</div>
              <p className="text-gray-500">HR Manager, FinServe</p>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="text-gray-600 mb-4">
                "An excellent HRM solution. It has helped us automate so many manual processes and freed up time for strategic decision-making."
              </p>
              <div className="font-semibold text-indigo-600">Michael Brown</div>
              <p className="text-gray-500">COO, GreenTech</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-indigo-700 text-white py-16 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl text-gray-100 font-semibold mb-6">
            Ready to Take Control of Your Workforce?
          </h2>
          <p className="text-lg mb-6">
            Sign up today and start using the most powerful HRM system to streamline your operations and grow your team.
          </p>
          <a
            href="#features"
            className="bg-indigo-500 text-white px-8 py-3 rounded-md text-lg hover:bg-indigo-400 transition"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 HRM System. All rights reserved.</p>
          <div className="mt-2">
            <a href="#" className="text-indigo-400 hover:text-indigo-300 mx-2">Privacy Policy</a>
            <a href="#" className="text-indigo-400 hover:text-indigo-300 mx-2">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
