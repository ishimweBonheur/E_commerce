import Item from '../home/headerItem';

interface HeaderItem {
  image: string;
  title: string;
  description: string;
  key: number;
}

const headerItems: HeaderItem[] = [
  {
    image: '/icons/icon1.svg',
    title: 'Free Shipping',
    description: 'Free shipping on all orders',
    key: 1,
  },
  {
    image: '/icons/icon4.svg',
    title: 'Online Support 24/7',
    description: 'Support online 24 hours a day',
    key: 2,
  },
  {
    image: '/icons/icon3.svg',
    title: 'Money Return',
    description: 'Back guarantee under 7 days',
    key: 3,
  },
  {
    image: '/icons/icon2.svg',
    title: 'Member Discount',
    description: 'On every order over $20.00',
    key: 4,
  },
];

export default function Header() {
  return (
    <header className="mx-0 md:mx-16 flex justify-between items-center px-8">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold py-3">Complete Your Order</h1>
        <span className="text-gray-600">
          You are just a few steps away to finsih
        </span>
        <span className="text-gray-600">your order...</span>
      </div>
      <div className="grid grid-cols-2 justify-between gap-6 pt-3">
        {headerItems.map((item) => (
          <Item key={item.key} item={item} />
        ))}
      </div>
    </header>
  );
}
