import * as yup from "yup";
import { imageMaxSize, imageSchema } from "../form/formConstants";
import { v4 } from "uuid";

export type News = {
  id: string;
  title: string;
  image: {
    file?: File;
    downloadUrl: string;
  };
  text: string;
  creator: {
    email: string;
    name: string;
  };
  createdAt: number;
};

export const newsInitialValue: News = {
  id: "",
  title: "",
  image: {
    file: undefined,
    downloadUrl: "",
  },
  text: "",
  creator: {
    email: "",
    name: "IPSI Kota Bandung",
  },
  createdAt: 0,
};

export const newsSchema = (ignoreImage: boolean = false) => {
  let schema = yup.object({
    title: yup
      .string()
      .required("Tolong lengkapi judul berita")
      .max(225, "Judul berita terlalu panjang"),
    text: yup.string().required("Tolong lengkapi isi berita"),
    creator: yup.object({
      name: yup.string().required("Tolong lengkapi nama penulis"),
    }),
  });
  if (!ignoreImage)
    schema = schema.concat(
      yup.object({
        image: yup.object({
          file: imageSchema(imageMaxSize.news),
        }),
      })
    );
  return schema;
};

// DUMMY DATA
export const getDummyNews = (length: number, startNumber: number = 0) => {
  let result: News[] = [];
  for (let i = 1 + startNumber; i <= length + startNumber; i++) {
    result.push({
      id: v4(),
      title: `Judul ${i}`,
      image: {
        downloadUrl: `https://firebasestorage.googleapis.com/v0/b/ipsi-bandung.appspot.com/o/news%2F7117670d-91d1-4a8e-ad73-5781291a17df?alt=media&token=51267911-66a7-454c-b6f3-dc784d395b94`,
      },
      text: `<h2>Konten ${i}</h2><p><strong>Lorem ipsum dolor sit</strong> amet <em>consectetur adipisicing elit</em>. Natus iure voluptates rerum. Assumenda, omnis, vero delectus debitis molestiae in error temporibus minima corrupti totam quaerat perspiciatis. Aspernatur earum quasi laudantium quaerat iste iure, nostrum minus hic nemo sit beatae maiores explicabo eligendi delectus qui amet laboriosam maxime. Quas reiciendis vel eveniet commodi laudantium accusantium recusandae facere sed nemo in. Officiis tempore accusamus quam dolores, asperiores ea iusto ipsam doloremque, adipisci aut nobis libero exercitationem laudantium autem nulla neque explicabo cum atque repellat, distinctio rem. Iste eos magni temporibus harum, laudantium impedit quidem a doloremque illum facere omnis rem eius consequuntur</p><p></p><ul><li><p>item 1</p></li><li><p>item 2</p></li><p><strong>Lorem ipsum dolor sit</strong> amet <em>consectetur adipisicing elit</em>. Natus iure voluptates rerum. Assumenda, omnis, vero delectus debitis molestiae in error temporibus minima corrupti totam quaerat perspiciatis. Aspernatur earum quasi laudantium quaerat iste iure, nostrum minus hic nemo sit beatae maiores explicabo eligendi delectus qui amet laboriosam maxime. Quas reiciendis vel eveniet commodi laudantium accusantium recusandae facere sed nemo in. Officiis tempore accusamus quam dolores, asperiores ea iusto ipsam doloremque, adipisci aut nobis libero exercitationem laudantium autem nulla neque explicabo cum atque repellat, distinctio rem. Iste eos magni temporibus harum, laudantium impedit quidem a doloremque illum facere omnis rem eius consequuntur</p></li></ul><ol><li><p>item 1</p></li><li><p>item 2</p><p></p></li></ol><p><strong>Lorem ipsum dolor sit</strong> amet <em>consectetur adipisicing elit</em>. Natus iure voluptates rerum. Assumenda, omnis, vero delectus debitis molestiae in error temporibus minima corrupti totam quaerat perspiciatis. Aspernatur earum quasi laudantium quaerat iste iure, nostrum minus hic nemo sit beatae maiores explicabo eligendi delectus qui amet laboriosam maxime. Quas reiciendis vel eveniet commodi laudantium accusantium recusandae facere sed nemo in. Officiis tempore accusamus quam dolores, asperiores ea iusto ipsam doloremque, adipisci aut nobis libero exercitationem laudantium autem nulla neque explicabo cum atque repellat, distinctio rem. Iste eos magni temporibus harum, laudantium impedit quidem a doloremque illum facere omnis rem eius consequuntur</p>`,
      creator: {
        email: `irfansud${i}@gmail.com`,
        name: `IPSI Kota Bandung`,
      },
      createdAt: Date.now() + i * 99999999,
    });
  }
  return result;
};
