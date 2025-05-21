import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';
import CardInput, { Card } from './CardInput';
import { RootState } from '@/app/store';
import { fetchCartItems, selectCartItems } from '@/features/Cart/cartSlice';
import { Checkout as CheckoutType } from '@/interfaces/checkout';

import {
  selectCheckout,
  placeOrder,
  makePayment,
  updateStatus,
  resetState,
  makeMomoPayment,
} from '@/features/Checkout/checkoutSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from '@/utils/ToastConfig';

function Direction({ rotate }: { rotate: number }) {
  return (
    <svg
      style={{ transform: `rotate(${rotate}deg)` }}
      width="24"
      height="22"
      viewBox="0 0 16 16"
      fill="black"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.66699 12.9273L5.73972 14L11.7397 8L5.73972 2L4.66699 3.07273L9.59423 8L4.66699 12.9273Z"
        fill="#001d3d"
      />
    </svg>
  );
}

function Checkout() {
  const [chosen, setChosen] = useState('card');
  const [cards, setCards] = useState<Card[]>([] as Card[]);
  const [adding, setAdding] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [coupon, setCoupon] = useState('');
  const [momoNumber, setMomoNumber] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.signIn.user);
  const cartItems = useAppSelector((state: RootState) =>
    selectCartItems(state)
  );
  const total = cartItems.reduce((acc, curr) => {
    return acc + curr.product.salesPrice * curr.quantity;
  }, 0);
  function handleAdding() {
    setAdding(!adding);
  }
  const checkoutState = useAppSelector((state: RootState) =>
    selectCheckout(state)
  );
  const order = checkoutState.checkout;
  const { loading, error, paying } = checkoutState;

  function handleSave(newCard: Card) {
    setCards((prev) => [...prev, newCard]);
  }

  function applyCoupon(e: React.ChangeEvent<HTMLInputElement>) {
    setCoupon(e.target.value);
    const checkout: CheckoutType = {
      deliveryInfo: {
        address,
        city,
        zip: '12345',
      },
      couponCode: e.target.value,
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    };
    dispatch(placeOrder(checkout));
  }

  function handlePayment() {
    if (order.id === -1) {
      const checkout: CheckoutType = {
        deliveryInfo: {
          address,
          city,
          zip: '12345',
        },
        couponCode: '',
        email: user?.email || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
      };
      dispatch(placeOrder(checkout)).then((res) => {
        const orderId = res.payload.id;
        if (chosen === 'momo') {
          dispatch(makeMomoPayment({ momoNumber, orderId }));
        } else if (chosen === 'card') {
          dispatch(makePayment(orderId));
        }
      });
    } else if (chosen === 'momo') {
      dispatch(makeMomoPayment({ momoNumber, orderId: order.id }));
    } else if (chosen === 'card') {
      dispatch(makePayment(order.id));
    }
  }

  useEffect(() => {
    if (loading && paying) {
      showInfoToast('Paying...');
    } else if (!loading && paying && !error) {
      showSuccessToast('Succesfully Paid');
      dispatch(updateStatus(false));
      dispatch(fetchCartItems());
      dispatch(resetState());
      navigate('/');
    } else if (paying && error) {
      showErrorToast('failed');
    }
  }, [error, loading, paying, navigate, dispatch]);

  return (
    <div className="flex justify-between px-20 py-10 gap-16 items-end">
      <div className="w-7/12 pr-4">
        <h2 className="text-2xl font-bold py-4">Delivery Address</h2>
        <div className="flex flex-col gap-6 py-4 w-full">
          <div className="rounded-md p-4 border border-gray300">
            <label
              htmlFor="card"
              className="flex items-center w-full bg-gray100 rounded"
            >
              <img
                src="icons/address.svg"
                alt="Mastercard"
                className="w-12 mr-4 text-primary"
              />
              <input
                className="text-gray900 text-lg ml-1 placeholder:text-gray500 h-full w-full outline-none bg-gray100"
                placeholder="Address"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
              />
            </label>
          </div>
          <div className="rounded-md p-4 border border-gray300">
            <label
              htmlFor="card"
              className="flex items-center w-full bg-gray100 rounded"
            >
              <img
                src="icons/location.svg"
                alt="Mastercard"
                className="w-12 mr-4 text-primary"
              />
              <input
                className="text-gray900 text-lg ml-1 placeholder:text-gray500 h-full w-full outline-none bg-gray100"
                placeholder="City"
                onChange={(e) => setCity(e.target.value)}
                value={city}
              />
            </label>
          </div>
        </div>
        <h2 className="text-2xl font-bold py-4">Payment Methods</h2>

        <div className="mb-6">
          <button
            className="w-full flex justify-between items-center py-6 text-xl text-gray500 px-4 border border-gray300 rounded-md text-left"
            type="button"
            onClick={() =>
              setChosen((prev) => (prev === 'momo' ? 'nothing' : 'momo'))
            }
          >
            <span>Momo Payment</span>
            <Direction rotate={Number(chosen === 'momo') * 90} />
          </button>
        </div>
        {chosen === 'momo' && (
          <div className="py-6 px-4 border border-gray300 rounded-md mb-6">
            <div className="mb">
              <h3 className="w-full text-xl text-gray500 rounded-md text-left">
                My Momo Number
              </h3>
              <div className="rounded-md py-4 flex flex-col gap-6">
                <div className="rounded-md p-4 border border-gray300">
                  <label
                    htmlFor="momoNumber"
                    className="flex items-center w-full bg-gray100 rounded"
                  >
                    <img src="momo.svg" alt="Momo" className="w-12 mr-4" />
                    <input
                      className="text-gray500 h-full w-full outline-none bg-gray100"
                      placeholder="078* *** *34"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <button
            className="w-full flex justify-between items-center py-6 text-xl text-gray500 px-4 border border-gray300 rounded-md text-left"
            type="button"
            onClick={() =>
              setChosen((prev) => (prev === 'card' ? 'nothing' : 'card'))
            }
          >
            <span>Debit Card Payment</span>
            <Direction rotate={Number(chosen === 'card') * 90} />
          </button>
        </div>

        {chosen === 'card' && (
          <div className="py-6 px-4 border border-gray300 rounded-md">
            <div className="mb-6">
              <h3 className="w-full text-xl text-gray500 rounded-md text-left">
                My Cards
              </h3>
              <div className="rounded-md py-4 flex flex-col gap-6">
                {cards.map((card) => (
                  <div
                    className="rounded-md p-4 border border-gray300"
                    key={card.cardNumber}
                  >
                    <label
                      htmlFor="card"
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center">
                        <img
                          src={`${card.cardType}.svg`}
                          alt="Mastercard"
                          className="w-12 mr-4"
                        />
                        <span className="text-gray500">
                          {card.cardHolder} **** **** ****{' '}
                          {card.cardNumber.slice(-4)}
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="card"
                        className="h-6 w-6 radio-blue-600 hidden"
                      />
                      <span className="h-6 w-6 rounded-full border-2 border-primary bg-gray900"></span>
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex gap-6 items-center text-gray600"
                  onClick={handleAdding}
                >
                  {' '}
                  <svg
                    width="39"
                    height="39"
                    viewBox="0 0 39 39"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="19.2562"
                      cy="19.3724"
                      r="19.1493"
                      fill="#374151"
                    />
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
                  <span className="text-xl text-gray500 font-medium">
                    Add New Card
                  </span>
                </button>
                {adding && (
                  <CardInput saveCard={(newCard) => handleSave(newCard)} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-5/12 flex flex-col gap-10">
        <div className="border-gray300 border flex justify-between p-4 rounded-md mb-4">
          <div className="grid grid-cols-2">
            {order.orderDetails.map((item) => (
              <img
                key={item.id}
                src="iphone.svg"
                alt="Cart item 1"
                className="w-32 h-16 rounded object-cover"
              />
            ))}
          </div>
          <div className="flex flex-col h-full py-6 pr-6">
            <h1 className="text-2xl font-semibold">Cart Collection</h1>
            <h2 className="text-lg text-gray600">My saved collection</h2>
            <h2 className="text-lg text-gray600">For summer sales</h2>
          </div>
        </div>

        <div className="border px-4 py-6 flex flex-col rounded-md mb-4 border-gray300">
          <h2 className="text-xl text-gray600 pb-4">Promo Code</h2>
          <div className="flex mb-4 h-16">
            <input
              type="text"
              className="border border-gray300 p-2 rounded-lg flex-grow mr-2 outline-none"
              onChange={applyCoupon}
              value={coupon}
            />
            <button
              className="bg-primary flex gap-2 text-white px-4 rounded-lg items-center"
              type="button"
            >
              <svg
                width="39"
                height="39"
                viewBox="0 0 39 39"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="19.2562" cy="19.3724" r="19.1493" fill="#374151" />
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
              <span className="text-xl">Apply</span>
            </button>
          </div>

          <div className="mb-2">
            <div className="flex justify-between py-2 text-xl">
              <span className="text-gray600">Total</span>
              <span>${order.totalAmount || total}</span>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-xl border-b-2 border-gray700 pb-4">
              <span className="text-gray600">Shipping</span>
              <span>$0</span>
            </div>
          </div>

          <div className="font-bold">
            <div className="flex justify-between py-2 text-xl">
              <span className="text-gray600">Total Cost</span>
              <span>${order.totalAmount || total}</span>
            </div>
          </div>
        </div>

        <button
          className={`w-full bg-primary text-white py-4 text-2xl font-medium rounded-md ${chosen ? '' : 'opacity-50 cursor-not-allowed'} ${paying ? 'opacity-75 cursor-not-allowed' : ''}`}
          type="button"
          onClick={handlePayment}
          disabled={!chosen || paying}
        >
          {paying ? (
            <BeatLoader data-testid="Loading" color="#ffffff" size={8} />
          ) : (
            'Pay Here'
          )}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
