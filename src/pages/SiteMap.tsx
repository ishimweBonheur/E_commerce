
import { Link } from 'react-router-dom';

const siteMap = [
  {
    title: 'Home',
    links: [
      { name: 'Home', path: '/' },
      { name: 'Shop', path: '/shop' },
      { name: 'About Us', path: '/about' },
    ],
  },
  {
    title: 'Account',
    links: [
      { name: 'Sign In', path: '/signin' },
      { name: 'Sign Up', path: '/signup' },
      { name: 'My Account', path: '/account' },
    ],
  },
  {
    title: 'Dashboard',
    links: [
      { name: 'Orders', path: '/orders' },
      { name: 'Wishlist', path: '/wishlist' },
      { name: 'Settings', path: '/settings' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Contact Us', path: '/contact' },
      { name: 'FAQs', path: '/faqs' },
      { name: 'Help Center', path: '/help' },
    ],
  },
];

function SiteMap() {
  return (
    <main className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary text-center">Site Map</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {siteMap.map((section) => (
          <div key={section.title} className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-black">{section.title}</h2>
            <ul className="mt-4 space-y-2">
              {section.links.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-primary hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}

export default SiteMap; 