import { Link } from 'react-router-dom';

function Terms() {
  return (
    <main className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary text-center">Terms and Conditions</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-black">Introduction</h2>
        <p className="text-gray-600 mt-2">
          Welcome to our Terms and Conditions. This document outlines the rules and guidelines for using our platform.
        </p>
        <h2 className="text-xl font-semibold text-black mt-4">User Responsibilities</h2>
        <p className="text-gray-600 mt-2">
          Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
        </p>
        <h2 className="text-xl font-semibold text-black mt-4">Limitations of Liability</h2>
        <p className="text-gray-600 mt-2">
          We are not liable for any damages arising from the use of our platform, including but not limited to direct, indirect, incidental, or consequential damages.
        </p>
        <h2 className="text-xl font-semibold text-black mt-4">Contact Us</h2>
        <p className="text-gray-600 mt-2">
          If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:terms@example.com" className="text-primary hover:underline">terms@example.com</a>.
        </p>
        <Link to="/contact" className="mt-4 block text-center bg-primary text-white py-2 rounded hover:bg-primary-dark">
          Contact Us
        </Link>
      </div>
    </main>
  );
}

export default Terms; 