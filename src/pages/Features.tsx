import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Secure Payments',
    description: 'All transactions are encrypted and secure, ensuring your data is protected.',
    icon: '/icons/icon1.svg',
    link: '/pricing',
  },
  {
    title: 'Fast Shipping',
    description: 'Get your orders delivered quickly and reliably, with real-time tracking.',
    icon: '/icons/icon2.svg',
    link: '/shop',
  },
  {
    title: '24/7 Support',
    description: 'Our team is here to help you anytime, with dedicated customer service.',
    icon: '/icons/icon4.svg',
    link: '/contact',
  },
  {
    title: 'Easy Returns',
    description: 'Hassle-free returns within 7 days, with a simple return process.',
    icon: '/icons/icon3.svg',
    link: '/user-guides',
  },
];

function Features() {
  return (
    <main className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary text-center">Platform Features</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature) => (
          <div key={feature.title} className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <img src={feature.icon} alt={feature.title} className="w-16 h-16" />
            <div>
              <h2 className="text-xl font-semibold text-black">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
              <Link to={feature.link} className="text-primary hover:underline mt-2 inline-block">
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Features; 