import Header from './header';

function Aboutus() {
  return (
    <div className="">
      <div className="w-full overflow-hidden px-10 bg-violeteBg py-5 md:h-96 relative ">
        <h1 className="font-bold md:text-3xl text-2xl text-primary md:flex justify-center py-10">
          Dynamite E-commerce
        </h1>
        <img
          src="/doublequotesl.png"
          alt=""
          className="lg:sticky top-24 md:left-72 pb-4"
        />
        <div className="flex-wrap text-textBlack lg:px-80">
          E-commerce is your go-to platform for seamless online shopping. We
          offer a wide range of products, competitive prices, and a
          user-friendly experience, ensuring you find exactly what you need with
          ease. At Dynamite, customer satisfaction is our top priority, and we
          are dedicated to providing a secure and enjoyable shopping experience
          for everyone.
        </div>
        <img
          src="/doublequotes2.png"
          alt=""
          className="pb-10 lg:sticky top-10 right-72"
          style={{ marginLeft: 'auto' }}
        />
      </div>

      <div className="font-bold flex justify-center py-5 text-2xl md:px-64">
        why choose us
      </div>
      <div className="lg:px-64">
        <Header />
      </div>
      <div className="md:flex items-center md:gap-10 py-20 justify-center md:pl-16 p-5">
        <img
          src="/whoweare.svg"
          alt=""
          className=" object-cover md:pl-8 w-96"
        />
        <div className="md:flex md:flex-col md:w-1/2 gap-10 ">
          <div>
            <h1 className="font-semibold text-lg">Mission</h1>
            <p className="mt-2">
              We prosper our customers to give them valuable product at
              affordable price in fast process.
            </p>
          </div>
          <div className="py-3">
            <h1 className="font-semibold text-lg">Vision</h1>
            <p className="mt-2">
              E-commerce is your go-to platform designed for security reasons.
              Data privacy is our endless goal for potential customers to feel
              at ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Aboutus;
