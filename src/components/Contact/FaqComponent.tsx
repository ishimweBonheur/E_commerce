import FAQList from './FaqList';

function Faqs() {
  const faqData = [
    {
      question: 'How do I pay using MTN Mobile Money?',
      answer:
        "To designate your donation to a specific area or project, send us a note with your donation by mail. We'll allocate it accordingly and send you an acknowledgment. If donating by phone, inform the representative about your preference. Online donations do not renew memberships and can only be allocated to states or countries, not individual projects.",
    },
    {
      question: 'How can I track my order?',
      answer:
        'You can track your order using the tracking number provided in your order confirmation email. Visit our order tracking page and enter the tracking number to see the status of your shipment.',
    },
    {
      question: 'What is your return policy?',
      answer:
        'Our return policy allows you to return items within 30 days of purchase. Items must be in their original condition and packaging. Please visit our returns page for more details and to initiate a return.',
    },
    // Add more FAQ items as needed
  ];
  return (
    <div className="w-full md:w-4/5 mx-auto my-14 md:my-20 md:mt-24 px-6 md:px-8 lg:px-32">
      <div className="flex flex-col justify-between gap-20 items-start mb-6 ">
        <div className="w-full">
          <h2 className="text-2xl md:text-4xl text-black text-center">
            Frequently Asked questions
          </h2>
          <p className="text-md font-light text-black text-center mt-3">
            Exercitation dolore reprehenderit fug
          </p>
          <FAQList faqs={faqData} />
        </div>
      </div>
    </div>
  );
}
export default Faqs;
