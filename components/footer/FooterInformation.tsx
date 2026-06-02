import Link from "next/link";
import Container from "../ui/Container";
import { IoMdMail } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { FaFacebookF, FaInstagram, FaPhone } from "react-icons/fa6";
import React from "react";

const FooterInformation = () => {
  const logos = [
    {
      src: "/images/logo-dispora.png",
      alt: "logo dispora",
      landscape: true,
    },
    {
      src: "/images/logo-koni.png",
      alt: "logo koni",
    },
    {
      src: "/images/logo-ipsi.png",
      alt: "logo ipsi",
    },
    {
      src: "/images/logo-bpjs.png",
      alt: "logo bpjs",
      landscape: true,
    },
    {
      src: "/sponsors/yamaha.png",
      alt: "logo yamaha",
      landscape: true,
    },
    {
      src: "/sponsors/rush.png",
      alt: "logo rush",
      landscape: true,
    },
    {
      src: "/sponsors/id-silat.png",
      alt: "logo id silat",
    },
    {
      src: "/sponsors/3boy.png",
      alt: "logo 3boy",
      landscape: true,
    },
    // {
    //   src: "/images/logo-ars.png",
    //   alt: "logo ars",
    // },
    // {
    //   src: "/images/logo-mills.png",
    //   alt: "logo mills",
    // },
  ];

  const socmeds = [
    {
      href: "https://www.instagram.com/ipsikotabandung",
      icon: <FaInstagram />,
    },
    {
      href: "https://web.facebook.com/profile.php?id=100075907940926",
      icon: <FaFacebookF />,
    },
  ];

  // COLOR_CHANGE BLUE-400 -> #419EBD

  return (
    <div className="w-full bg-muted py-5">
      <Container className="px-5 md:px-10">
        <div className="flex justify-between max-md:flex-col gap-y-5">
          <div className="flex flex-col gap-3 max-md:order-2">
            <Link
              href={"https://maps.app.goo.gl/hy5xcJnrxGn4Aurs9"}
              className="hover:text-[#419EBD] transition flex max-[380px]:flex-col gap-1 max-[380px]:items-start items-center"
            >
              <IoLocationSharp className="size-10 min-w-10 min-h-10 bg-[#419EBD] text-black rounded-full p-2 inline mr-2" />
              <div>
                <p className="font-semibold">Sekretariat IPSI Kota Bandung</p>
                <p>Jl. Jakarta No.18 (GOR KONI Kota Bandung) </p>
                <p>Kacapiring, Batununggal, Kota Bandung, Jawa Barat 40271</p>
              </div>
            </Link>
            <div className="flex max-[380px]:flex-col gap-1 max-[380px]:items-start items-center">
              <FaPhone className="size-10 bg-[#419EBD] text-black rounded-full p-2 inline mr-2" />
              <div>
                <p className="font-semibold">Telepon</p>
                <p>0857-9416-3821</p>
              </div>
            </div>
            <Link
              href={"mailto:ipsikotabandungofficial@gmail.com"}
              className="hover:text-[#419EBD] transition flex max-[380px]:flex-col gap-1 max-[380px]:items-start items-center"
              target="_blank"
            >
              <IoMdMail className="size-10 bg-[#419EBD] text-black rounded-full p-2 inline mr-2" />
              <div>
                <p className="font-semibold">Email</p>
                <p>ipsikotabandungofficial@gmail.com</p>
              </div>
            </Link>
          </div>
          <div className="flex flex-wrap h-fit gap-2 justify-center max-md:order-1">
            {logos.map((image) => (
              <img
                className="size-[50px] object-contain object-center flex-1"
                key={image.src}
                src={image.src}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          {socmeds.map((socmed) => (
            <Link href={socmed.href} target="_blank" key={socmed.href}>
              {React.cloneElement(socmed.icon, {
                className:
                  "size-10 p-1 bg-[#419EBD] hover:bg-transparent text-black hover:text-[#419EBD] transition rounded-full inline mr-2 border-2 border-[#419EBD]",
              })}
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};
export default FooterInformation;
