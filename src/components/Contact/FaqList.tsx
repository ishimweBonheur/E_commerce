import React, { useState } from 'react';
import FAQItem from './FaqItem';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQListProps {
  faqs: FAQ[];
}

function FAQList({ faqs }: FAQListProps): React.ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div>
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={index === openIndex}
          onClick={() => handleToggle(index)}
        />
      ))}
    </div>
  );
}

export default FAQList;
