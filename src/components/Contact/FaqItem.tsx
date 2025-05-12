import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: FAQItemProps): React.ReactElement {
  return (
    <div className="w-full flex flex-row border-t border-gray-200 py-6 mt-10 faq-item">
      <div className="w-11/12 pr-12">
        <h3 className="text-xl md:text-2xl text-black text-left">{question}</h3>
        {isOpen && (
          <p className="text-sm md:text-md font-light text-black text-left mt-3">
            {answer}
          </p>
        )}
      </div>
      <div className="w-1/12">
        <button
          type="button"
          className="bg-violet-700 text-white rounded-3xl text-right p-2 hover:bg-black"
          onClick={onClick}
        >
          {isOpen ? (
            <ArrowUpIcon className="w-5 h-5" />
          ) : (
            <ArrowDownIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}

export default FAQItem;
