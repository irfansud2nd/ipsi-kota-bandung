import { v4 } from "uuid";
import { sendFile, toastError } from "../form/formFunctions";
import { News } from "./newsConstants";
import axios from "axios";
import { toast } from "sonner";
import { getFileUrl } from "../functions";
import { deleteFile } from "../actions";

// SEND BERITA
export const sendNews = async (news: News) => {
  const toastId = toast.loading("Mengunggah berita");
  try {
    const id = v4();
    let data: News = { ...news, id: id, createdAt: Date.now() };
    const { imageUrl } = getFileUrl("news", data.id);

    // SEND GAMBAR
    if (!news.image.file)
      throw { message: "Image not found", code: "no-image" };
    toast.loading("Mengunggah gambar", { id: toastId });
    const downloadUrl = await sendFile(news.image.file, imageUrl);
    data.image.downloadUrl = downloadUrl;
    delete data.image.file;

    // SEND BERITA
    toast.loading("Mengunggah berita", { id: toastId });
    await axios.post("/api/news", data);
    toast.success("Berita berhasil diunggah", { id: toastId });
    return { result: data };
  } catch (error: any) {
    toastError(error, toastId);
    throw error;
  }
};

// UPDATE BERITA
export const updateNews = async (news: News) => {
  const toastId = toast.loading("Memperbaharui berita");

  try {
    let data: News = { ...news };
    const { imageUrl } = getFileUrl("news", data.id);
    if (news.image.file) {
      // DELETE OLD IMAGE
      toast.loading("Memperbaharui gambar", { id: toastId });
      const downloadUrl = await sendFile(news.image.file, imageUrl);
      data.image.downloadUrl = downloadUrl;
      delete data.image.file;
    }
    // UPDATE BERITA
    toast.loading("Memperbaharui berita", { id: toastId });
    const res = await axios.patch("/api/news", data);
    toast.success("Berita berhasil diperbaharui", { id: toastId });
    return res.data.result;
  } catch (error: any) {
    toastError(error, toastId);
    throw error;
  }
};

// DELETE BERITAS
export const deleteNews = async (news: News) => {
  const toastId = toast.loading("Menghapus berita");
  const { imageUrl } = getFileUrl("news", news.id);

  try {
    // DELETE GAMBAR
    toast.loading("Menghapus gambar", { id: toastId });
    await deleteFile(imageUrl);

    // DELETE BERITA
    toast.loading("Menghapus berita", { id: toastId });
    const res = await axios.delete(`/api/news?id=${news.id}`);
    toast.success("Berita berhasil dihapus", { id: toastId });
    return { response: res.data };
  } catch (error: any) {
    toastError(error, toastId);
    throw error;
  }
};

// REDUCE TEXT
export const reduceText = (
  text: string,
  wordLimit: number = 30,
  splitJoinBy: string = " "
) => {
  return (
    text.split(splitJoinBy).splice(0, wordLimit).join(splitJoinBy) + " ..."
  );
};
