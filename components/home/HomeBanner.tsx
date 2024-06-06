import Container from "../ui/Container";

const HomeBanner = () => {
  return (
    <div
      className="w-full h-fit aspect-video sm:aspect-[16/5] transition-all bg-cover bg-no-repeat bg-center -mb-10 relative -z-[1]"
      style={{ backgroundImage: "url(/images/home-banner-people.png)" }}
    >
      <div
        className="backdrop-blur-sm bg-gray-600/55 w-full h-full"
        style={{ WebkitBackdropFilter: "blur(4px)" }}
      >
        <Container className="flex justify-center items-center overflow-hidden w-full h-full">
          {/* <div className="flex flex-col transition-all w-fit text-white h-fit my-auto max-md:overflow-x-hidden p-2 z-[1]"> */}
          <h2 className="uppercase text-2xl sm:text-3xl lg:text-5xl mt-20 sm:mt-16 md:mt-28 text-white font-extrabold tracking-wider transition-all animate__animated animate__slideInLeft">
            #AREYOUTHENEXTCHAMPION?
          </h2>
          {/* </div> */}
        </Container>
      </div>
    </div>
  );
  return (
    <div
      className="w-full h-fit max-h-screen bg-cover bg-no-repeat bg-center overflow-hidden -mb-10 relative -z-[1]"
      style={{ backgroundImage: "url(/images/home-banner-people.png)" }}
    >
      <div
        className="backdrop-blur-sm bg-gray-600/55"
        style={{ WebkitBackdropFilter: "blur(4px)" }}
      >
        <Container className="flex justify-around relative">
          <div className="flex flex-col transition-all w-fit text-white max-md:absolute top-[50%] h-fit my-auto max-md:overflow-x-hidden p-2 rounded-sm z-[1]">
            <h2 className="uppercase text-xl sm:text-2xl lg:text-4xl font-extrabold tracking-wider transition-all animate__animated animate__slideInLeft">
              #AREYOUTHENEXTCHAMPION?
            </h2>
            <h3 className="text-2xl sm:text-3xl lg:text-5xl font-bold transition-all animate__animated animate__slideInRight">
              Tagline
            </h3>
          </div>
          <img
            src="/images/home-banner-person.png"
            className="max-h-[400px] md:max-h-[500px] pt-20 md:pt-10 mt-auto bottom-0 -right-[110px] animate__animated animate__fadeInUp"
          />
        </Container>
      </div>
    </div>
  );
};
export default HomeBanner;
