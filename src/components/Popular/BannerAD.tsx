import ADImage from '../../assets/Image/Rectangle 901.svg';

function BannerAD() {
  return (
    <div className=" bg-thinorenge flex flex-row justify-between rounded-xl items-center border-thickorenge border ">
      <div className=" flex flex-col ml-5 mb-3">
        <div className="">
          <p className=" text-thickorenge text-sm font-bold">
            In store or online your health & safety is our priority
          </p>
        </div>
        <div className="">
          <p className=" text-black text-xs">
            The only E-commerce that makes your life easier, makes you enjoy
            life and makes it bette
          </p>
        </div>
      </div>
      <div className=" h-full">
        <img src={ADImage} alt="AD" className=" h-full bg-cover" />
      </div>
    </div>
  );
}

export default BannerAD;
