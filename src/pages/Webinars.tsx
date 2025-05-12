import { useState, useEffect } from 'react';

interface Webinar {
  title: string;
  date: string;
  time: string;
  description: string;
  role: 'all' | 'Buyer' | 'Seller' | 'Admin';
}

const webinars: Webinar[] = [
  {
    title: 'Introduction to Our Platform',
    date: '2023-10-15',
    time: '10:00 AM',
    description: 'Learn about the key features and benefits of our platform. Perfect for new users getting started.',
    role: 'all',
  },
  {
    title: 'Advanced Features for Sellers',
    date: '2023-10-20',
    time: '2:00 PM',
    description: 'Explore advanced features for managing your store, inventory, and sales analytics.',
    role: 'Seller',
  },
  {
    title: 'Customer Success Stories',
    date: '2023-10-25',
    time: '11:00 AM',
    description: 'Hear from our customers about their success with our platform. Learn best practices and tips.',
    role: 'Buyer',
  },
  {
    title: 'Platform Administration',
    date: '2023-10-30',
    time: '3:00 PM',
    description: 'Advanced administration features and platform management techniques.',
    role: 'Admin',
  },
];

function Webinars() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <main className="p-10 max-w-5xl mx-auto">
      <div className="bg-primary/5 rounded-lg p-4 mb-8 text-center">
        <p className="text-primary font-semibold">
          Current Date: {formatDate(currentDateTime)}
        </p>
        <p className="text-primary font-semibold mt-1">
          Current Time: {formatTime(currentDateTime)}
        </p>
      </div>
      
      <h1 className="text-3xl font-bold mb-8 text-primary text-center">Upcoming Webinars</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {webinars.map((webinar) => (
          <div key={webinar.title} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold text-black">{webinar.title}</h2>
              {webinar.role !== 'all' && (
                <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded">
                  {webinar.role}
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-2">{webinar.description}</p>
            <p className="text-gray-500 mt-2">{webinar.date} at {webinar.time}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Webinars; 