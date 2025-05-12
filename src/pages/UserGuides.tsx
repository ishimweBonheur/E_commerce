import FAQList from '../components/Contact/FaqList';

interface FAQ {
  question: string;
  answer: string;
}

function UserGuides() {
  const faqData: FAQ[] = [
    {
      question: 'How do I pay using MTN Mobile Money?',
      answer: "To designate your donation to a specific area or project, send us a note with your donation by mail. We'll allocate it accordingly and send you an acknowledgment. If donating by phone, inform the representative about your preference. Online donations do not renew memberships and can only be allocated to states or countries, not individual projects.",
    },
    {
      question: 'How can I track my order?',
      answer: 'You can track your order using the tracking number provided in your order confirmation email. Visit our order tracking page and enter the tracking number to see the status of your shipment.',
    },
    {
      question: 'What is your return policy?',
      answer: 'Our return policy allows you to return items within 30 days of purchase. Items must be in their original condition and packaging. Please visit our returns page for more details and to initiate a return.',
    },
  ];

  return (
    <main className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary text-center">User Guides</h1>
      <div className="bg-white rounded-xl shadow p-6 ">
        <FAQList faqs={faqData} />
      </div>
    </main>
  );
}

export default UserGuides; 