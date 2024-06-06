import Container from "./Container";

type Props = {
  imgUrl: string;
  title: string;
  text?: string;
  className?: string;
};
const PageBanner = ({ imgUrl, title, className, text }: Props) => {
  return (
    <div
      className={`w-full aspect-video sm:aspect-[16/5] h-fit transition-all bg-cover bg-no-repeat bg-center -z-[1] sticky top-[50px] sm:top-[70px] 
      ${className}`}
      style={{ backgroundImage: `url(${imgUrl})` }}
    >
      <div className="w-full h-full backdrop-blur-[1px] bg-gray-600/55">
        <Container className="flex flex-col gap-2 justify-center w-full h-full px-5 md:px-10">
          <h1 className="text-5xl font-bold">{title}</h1>
          <p className="text-xl">{text}</p>
        </Container>
      </div>
    </div>
  );
};
export default PageBanner;
