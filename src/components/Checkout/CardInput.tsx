import { useState } from 'react';

interface Errors {
  expirydate: boolean;
  cardType: boolean;
}

export interface Card {
  cardNumber: string;
  cardType: 'visa' | 'mastercard' | 'unionpay' | null;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface ComponentProps {
  saveCard: (newCard: Card) => void;
}

export default function CardInput({ saveCard }: ComponentProps) {
  const [card, setCard] = useState<Card>({
    cardNumber: '',
    cardType: null,
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Errors>({
    expirydate: false,
    cardType: false,
  });
  function detectCardType(details: string) {
    const re = {
      unionpay: /^(62|88)\d+$/,
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
    };
    const keys: ('unionpay' | 'visa' | 'mastercard')[] = [
      'unionpay',
      'visa',
      'mastercard',
    ];
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (re[key].test(details)) {
        return key;
      }
    }
    return null;
  }
  function handleCardChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cardType = detectCardType(e.target.value);
    if (cardType === 'visa') {
      setCard({ ...card, cardType: 'visa', cardNumber: e.target.value });
      setErrors({ ...errors, cardType: false });
    } else if (cardType === 'mastercard') {
      setCard({ ...card, cardType: 'mastercard', cardNumber: e.target.value });
      setErrors({ ...errors, cardType: false });
    } else if (cardType === 'unionpay') {
      setCard({ ...card, cardType: 'unionpay', cardNumber: e.target.value });
      setErrors({ ...errors, cardType: false });
    } else {
      setCard({ ...card, cardType: null });
      setErrors({ ...errors, cardType: true });
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cardHolder = e.target.value;
    setCard({ ...card, cardHolder });
  }

  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const today = new Date();
    let expiryDate = e.target.value;
    if (expiryDate.length === 2 && !expiryDate.includes('/')) {
      expiryDate += '/';
    }
    if (expiryDate.length > 5 && expiryDate.includes('/')) {
      expiryDate = expiryDate.slice(0, 5);
    }
    if (Number(expiryDate.slice(0, 2)) > 12) {
      setErrors({ ...errors, expirydate: true });
    } else if (Number(expiryDate.slice(3, 5)) > 99) {
      setErrors({ ...errors, expirydate: true });
    } else if (Number(expiryDate.slice(3, 5)) < today.getFullYear() % 100) {
      setErrors({ ...errors, expirydate: true });
    } else if (Number(expiryDate.slice(0, 2)) <= today.getMonth()) {
      setErrors({ ...errors, expirydate: true });
    } else setErrors({ ...errors, expirydate: false });
    setCard({ ...card, expiryDate });
  }
  function handlesave() {
    if (
      !errors.cardType &&
      !errors.expirydate &&
      card.cardHolder &&
      card.cardNumber &&
      card.expiryDate &&
      card.cardType &&
      card.cvv
    ) {
      saveCard(card);
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-md px-4 min-h-16 flex flex-col justify-center border border-gray-300">
        {errors.cardType && (
          <div className="text-red-500 text-sm ml-16">Invalid Card</div>
        )}
        <label
          htmlFor="card"
          className="flex items-center w-full bg-gray-100 rounded"
        >
          {!card.cardType && (
            <img src="icons/card.svg" alt="Mastercard" className="w-12 mr-4" />
          )}
          {card.cardType && (
            <img
              src={`${card.cardType}.svg`}
              alt={card.cardType}
              className="w-12 mr-4"
            />
          )}
          <input
            className="text-gray-900 placeholder:text-gray-500 text-lg h-full w-full outline-none bg-gray-100"
            placeholder="Card Number"
            onChange={handleCardChange}
          />
        </label>
      </div>
      <div className="rounded-md p-4 border border-gray-300">
        <label
          htmlFor="card"
          className="flex items-center w-full bg-gray-100 rounded"
        >
          <img
            src="icons/user.svg"
            alt="Mastercard"
            className="w-12 mr-4 text-primary"
          />
          <input
            className="text-gray-900 text-lg ml-1 placeholder:text-gray-500 h-full w-full outline-none bg-gray-100"
            placeholder="Cardholder Name"
            onChange={handleNameChange}
          />
        </label>
      </div>
      <div className="flex gap-10 justify-between">
        <div className="rounded-md px-4 flex flex-col justify-center border border-gray-300">
          {errors.expirydate && (
            <div className="text-red-500 text-sm ml-16">
              Invalid Expiry Date
            </div>
          )}
          <label
            htmlFor="card"
            className="flex items-center w-full bg-gray-100 rounded"
          >
            <img src="icons/date.svg" alt="Mastercard" className="w-12 mr-4" />
            <input
              className={`${errors.expirydate && 'text-red-500'} text-gray-900 text-lg placeholder:text-gray-500 h-full w-full outline-none bg-gray-100`}
              placeholder="Expiry MM/YY"
              onChange={handleExpiryChange}
              value={card.expiryDate}
            />
          </label>
        </div>
        <div className="rounded-md p-4 border border-gray-300">
          <label
            htmlFor="card"
            className="flex items-center w-full bg-gray-100 rounded"
          >
            <img src="icons/ccv.svg" alt="Mastercard" className="w-12 mr-4" />
            <input
              className="text-gray-900 text-lg placeholder:text-gray-500 h-full w-full outline-none bg-gray-100"
              placeholder="CCV"
              onChange={(e) => setCard({ ...card, cvv: e.target.value })}
            />
          </label>
        </div>
      </div>
      <button
        type="button"
        onClick={handlesave}
        className="flex gap-6 justify-center rounded-md w-fit px-20 self-center border-gray-300  border py-2 items-center"
      >
        <svg
          width="39"
          height="39"
          viewBox="0 0 39 39"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          <circle cx="19.2562" cy="19.3724" r="19.1493" fill="#6D31ED" />
          <g clipPath="url(#clip0_492_2098)">
            <path
              d="M19.7352 28.6481C24.5935 28.6481 28.5319 24.7097 28.5319 19.8514C28.5319 14.9931 24.5935 11.0547 19.7352 11.0547C14.8769 11.0547 10.9385 14.9931 10.9385 19.8514C10.9385 24.7097 14.8769 28.6481 19.7352 28.6481Z"
              stroke="white"
              strokeWidth="1.25667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.9653 19.8516H23.5054"
              stroke="white"
              strokeWidth="1.25667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.7354 16.0815V23.6216"
              stroke="white"
              strokeWidth="1.25667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_492_2098">
              <rect
                width="20.1067"
                height="20.1067"
                fill="white"
                transform="translate(9.68164 9.79785)"
              />
            </clipPath>
          </defs>
        </svg>
        <span className="text-2xl text-gray-500 font-medium">Save Card</span>
      </button>
    </div>
  );
}
