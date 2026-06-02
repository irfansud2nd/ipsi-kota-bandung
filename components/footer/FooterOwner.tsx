import Link from "next/link";
import Container from "../ui/Container";

const FooterOwner = () => {
  return (
    // COLOR_CHANGE BLUE-400 -> #419EBD
    <div className="w-full bg-[#419EBD] py-3">
      <Container className="px-10">
        <p className="inline">
          <span className="font-semibold">© 2024 IPSI KOTA BANDUNG</span>
          <span className="max-sm:hidden"> | </span>
          <br className="sm:hidden" />
          Developed by{" "}
        </p>
        <Link
          href="https://sud-dev.vercel.app"
          className="font-extrabold"
          target="_blank"
        >
          {" "}
          sud.dev
        </Link>
      </Container>
    </div>
  );
};
export default FooterOwner;
