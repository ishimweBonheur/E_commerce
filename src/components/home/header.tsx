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
    <header
      className="mx-0 md:mx-16 flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-6 md:px-8 md:py-8 bg-surface rounded-xl shadow-sm min-h-[200px]"
      style={{
        fontFamily:
          'Poppins, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, Liberation Sans, sans-serif',
      }}
    >
      <div className="flex flex-col mb-6 md:mb-0">
        <h1 className="text-2xl md:text-3xl font-bold pb-2 text-gray900">
          Complete Your <span className="text-primary">Order</span>
        </h1>
        <div className="flex items-center space-x-2">
          <div className="h-1 w-8 rounded-full bg-primary"></div>
          <span className="text-gray600 text-sm md:text-base">
            You&apos;re just a few steps away from finishing your order...
          </span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {headerItems.map((item) => (
          <div
            key={item.key}
            className="bg-gray50 hover:bg-surface p-5 rounded-lg transition-all duration-300 ease-in-out shadow-sm hover:shadow-md border border-gray200 hover:border-gray300 group h-full"
          >
            <div className="flex flex-col items-start h-full">
              <div className="p-3 rounded-lg mb-3 transition-all duration-300 bg-gray100 group-hover:bg-gray200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-6 h-6 object-contain [filter:invert(18%)_sepia(8%)_saturate(0%)_hue-rotate(314deg)_brightness(96%)_contrast(90%)]"
                />
              </div>
              <h3 className="font-semibold text-gray900 group-hover:text-gray800 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-sm text-gray500 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </header>
  );
}
