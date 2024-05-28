import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Profil",
};

const page = () => {
  const sectionButton = [
    {
      label: "Sekilas",
      href: "#sekilas",
    },
    {
      label: "Visi & Misi",
      href: "#visi_misi",
    },
    {
      label: "Program",
      href: "#program",
    },
    {
      label: "Tugas",
      href: "#tugas",
    },
  ];

  return (
    <div className="w-full h-full scroll-smooth">
      <Container className="p-5 md:p-10 text-justify">
        <h1 className="text-3xl font-bold text-start">
          Profil IPSI Kota Bandung
        </h1>
        <div className="flex max-md:justify-center gap-2 my-5 flex-wrap">
          {sectionButton.map((button) => (
            <Button size={"lg"} key={button.href} className="w-[85px]" asChild>
              <Link href={button.href}>{button.label}</Link>
            </Button>
          ))}
        </div>
        <div
          className="flex max-md:flex-col items-center gap-5 md:gap-10 scroll-mt-20"
          id="sekilas"
        >
          <img
            src="/images/logo-ipsi-bandung.png"
            alt="logo ipsi kota bandung"
            className="h-[150px] w-fit object-scale-down my-auto"
          />
          <div className="flex-grow">
            <h2 className="text-xl font-semibold">Sekilas Profil</h2>
            <p className="mb-5 mt-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas
              voluptatibus commodi exercitationem modi dolor officia hic
              suscipit eos quaerat eligendi cupiditate quos in, perferendis,
              dolores impedit sunt unde iusto iure vero, explicabo saepe
              temporibus? Obcaecati ad sint repudiandae dolorum eveniet et ipsa,
              voluptas aliquid quos amet unde magni provident velit.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas
              voluptatibus commodi exercitationem modi dolor officia hic
              suscipit eos quaerat eligendi cupiditate quos in, perferendis,
            </p>
          </div>
        </div>
        <hr className="my-10" />
        <div
          className="rounded-xl bg-green-200 p-5 scroll-mt-24"
          id="visi_misi"
        >
          <h2 className="text-xl font-semibold">Visi</h2>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempora
            doloremque illum dolorem suscipit eligendi quia molestiae unde, vero
            deserunt, veniam, fugiat magnam laudantium alias. Reprehenderit!
          </p>
        </div>
        <div className="mt-10 rounded-xl bg-green-200 p-5">
          <h2 className="text-xl font-semibold">Misi</h2>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempora
            doloremque illum dolorem suscipit eligendi quia molestiae unde, vero
            deserunt, veniam, fugiat magnam laudantium alias. Reprehenderit!
          </p>
        </div>
        <hr className="my-10" />
        <div className="scroll-mt-24" id="program">
          <h2 className="text-xl font-semibold mb-2">Strategi & Program</h2>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus
            nemo soluta quas ad perferendis, rem in itaque provident consequatur
            quisquam. Nostrum quibusdam enim neque ea nisi, deserunt ullam quae
            molestias beatae unde odit ad itaque maxime, placeat architecto
            impedit rerum ipsum perferendis sunt sint autem corporis! Pariatur
            dolorum ab laboriosam!
          </p>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam
            voluptatem, debitis veniam qui dolorum nam nobis reprehenderit
            aliquid et minima animi accusantium perspiciatis iure labore
            deserunt error odit repudiandae, dolore voluptas iste! Optio
            suscipit, similique, est voluptatem eum odit unde et sunt repellat
            necessitatibus ullam expedita enim eveniet porro quae inventore
            nisi. Asperiores, numquam deleniti? Accusantium quibusdam atque,
            ullam non culpa odio nulla fugiat ratione in omnis voluptas fugit
            molestias laboriosam inventore. Veniam recusandae pariatur molestias
            saepe, optio illum provident aperiam amet, fugiat dolor dolores
            debitis, quia id quasi possimus velit ipsum quam quis minima
            molestiae libero perspiciatis exercitationem nulla!
          </p>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa
            temporibus nihil aut eos autem blanditiis aliquam asperiores
            laboriosam, necessitatibus expedita, impedit sed adipisci similique
            fugiat, modi fugit a recusandae est. Cupiditate, quisquam odit earum
            magni et, exercitationem alias vero illo obcaecati eius harum
            necessitatibus laborum, quae repellendus voluptas. Minima delectus,
            laudantium id ut blanditiis incidunt ipsum numquam beatae voluptate
            aut voluptates ab in molestiae facere nobis, odit quis libero, qui
            at doloribus explicabo. Harum, assumenda.
          </p>
        </div>
        <hr className="my-10" />
        <div className="scroll-mt-24" id="tugas">
          <h2 className="text-xl font-semibold mb-2">Tugas Pokok</h2>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus
            nemo soluta quas ad perferendis, rem in itaque provident consequatur
            quisquam. Nostrum quibusdam enim neque ea nisi, deserunt ullam quae
            molestias beatae unde odit ad itaque maxime, placeat architecto
            impedit rerum ipsum perferendis sunt sint autem corporis! Pariatur
            dolorum ab laboriosam!
          </p>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam
            voluptatem, debitis veniam qui dolorum nam nobis reprehenderit
            aliquid et minima animi accusantium perspiciatis iure labore
            deserunt error odit repudiandae, dolore voluptas iste! Optio
            suscipit, similique, est voluptatem eum odit unde et sunt repellat
            necessitatibus ullam expedita enim eveniet porro quae inventore
            nisi. Asperiores, numquam deleniti? Accusantium quibusdam atque,
            ullam non culpa odio nulla fugiat ratione in omnis voluptas fugit
            molestias laboriosam inventore. Veniam recusandae pariatur molestias
            saepe, optio illum provident aperiam amet, fugiat dolor dolores
            debitis, quia id quasi possimus velit ipsum quam quis minima
            molestiae libero perspiciatis exercitationem nulla!
          </p>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa
            temporibus nihil aut eos autem blanditiis aliquam asperiores
            laboriosam, necessitatibus expedita, impedit sed adipisci similique
            fugiat, modi fugit a recusandae est. Cupiditate, quisquam odit earum
            magni et, exercitationem alias vero illo obcaecati eius harum
            necessitatibus laborum, quae repellendus voluptas. Minima delectus,
            laudantium id ut blanditiis incidunt ipsum numquam beatae voluptate
            aut voluptates ab in molestiae facere nobis, odit quis libero, qui
            at doloribus explicabo. Harum, assumenda.
          </p>
        </div>
      </Container>
    </div>
  );
};
export default page;
