import Container from "./Container";

type Props = {
  type: "notLoggedIn" | "notAuthorized" | "underDevelopment" | "notFound";
  text?: string;
};

const PageInfo = ({ type, text }: Props) => {
  let displayText;
  let displayImage;
  switch (type) {
    case "notLoggedIn":
      displayText = "Maaf, login terlebih dahulu untuk melanjutkan";
      displayImage = "/images/not-logged-in.png";
      break;
    case "notAuthorized":
      displayText =
        "Maaf, anda tidak memiliki izin untuk mengakses halaman ini";
      displayImage = "/images/not-authorized.png";
      break;
    case "underDevelopment":
      displayText = "Maaf, halaman ini masih dalam tahap pengembangan";
      displayImage = "/images/under-development.png";
      break;
    default:
      displayText = "Maaf, halaman yang anda cari tidak ditemukan";
      displayImage = "/images/not-found.png";
      break;
  }

  if (text) displayText = text;
  return (
    <Container className="w-full h-full flex justify-center items-center ">
      <div className="w-[450px] max-w-[90vw] grid grid-cols-2 items-center gap-5 ">
        <h1 className="font-bold text-xl sm:text-3xl">{displayText}</h1>
        <img
          src={displayImage}
          alt="not logged in"
          className="max-w-[50vw] w-[150px] sm:w-[250px]"
        />
      </div>
    </Container>
  );
};
export default PageInfo;
