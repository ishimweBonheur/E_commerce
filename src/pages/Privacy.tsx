import { Link } from 'react-router-dom';

function Privacy() {
  return (
    <main className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary text-center">Privacy Policy</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-black">Introduction</h2>
        <p className="text-gray-600 mt-2">
          Welcome to our Privacy Policy. This document outlines how we collect, use, and protect your personal information.
        </p>
        <h2 className="text-xl font-semibold text-black mt-4">Information We Collect</h2>
        <p className="text-gray-600 mt-2">
          We collect information that you provide directly to us, such as your name, email address, and any other information you choose to provide.
        </p>
        <h2 className="text-xl font-semibold text-black mt-4">How We Use Your Information</h2>
        <p className="text-gray-600 mt-2">
          We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations.
        </p>
        <h2 className="text-xl font-semibold text-black mt-4">Contact Us</h2>
        <p className="text-gray-600 mt-2">
          If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@example.com" className="text-primary hover:underline">privacy@example.com</a>.
        </p>
        <Link to="/contact" className="mt-4 block text-center bg-primary text-white py-2 rounded hover:bg-primary-dark">
          Contact Us
        </Link>
      </div>
    </main>
  );
}

export default Privacy; 