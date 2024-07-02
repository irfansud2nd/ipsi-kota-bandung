import { v4 } from "uuid";
import { sendFile, toastError } from "../form/formFunctions";
import { News, NewsSql } from "./newsConstants";
import axios from "axios";
import { toast } from "sonner";
import { getFileUrl } from "../functions";
import { deleteFile } from "../actions";
import {
  addNewsSql,
  deleteNewsSql,
  getNewsArrSql,
  getNewsSql,
  updateNewsSql,
} from "./newsActions";
import { cache } from "react";

// NEWS
// CREATE
export const addNews = async (news: News) => {
  const toastId = toast.loading("Mengunggah berita");
  try {
    const id = v4();
    let data: News = { ...news, id: id, created_at: Date.now() };
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
    const { error } = await addNewsSql(newsToNewsSql(data));
    if (error) throw error;

    toast.success("Berita berhasil diunggah", { id: toastId });
    return { result: data };
  } catch (error: any) {
    toastError(error, toastId);
    throw error;
  }
};

// READ
export const getNews = cache(async (id: string) => {
  try {
    const { result, error } = await getNewsSql(id);

    if (error) throw error;

    if (!result) throw new Error("Berita tidak dapat ditemukan");

    const news = newsSqlToNews(result);

    return news;
  } catch (error) {
    throw error;
  }
});

// UPDATE
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
    const { error } = await updateNewsSql(newsToNewsSql(data));
    if (error) throw error;

    toast.success("Berita berhasil diperbaharui", { id: toastId });
  } catch (error: any) {
    toastError(error, toastId);
    throw error;
  }
};

// DELETE
export const deleteNews = async (news: News) => {
  const toastId = toast.loading("Menghapus berita");
  const { imageUrl } = getFileUrl("news", news.id);

  try {
    // DELETE GAMBAR
    toast.loading("Menghapus gambar", { id: toastId });
    const { error: deleteFileError } = await deleteFile(imageUrl);
    if (deleteFileError) throw deleteFileError;

    // DELETE BERITA
    toast.loading("Menghapus berita", { id: toastId });
    const { error: deleteNewsError } = await deleteNewsSql(newsToNewsSql(news));
    if (deleteNewsError) throw deleteNewsError;

    toast.success("Berita berhasil dihapus", { id: toastId });
  } catch (error: any) {
    toastError(error, toastId);
    throw error;
  }
};

// NEWS ARR
// READ
export const getNewsArr = cache(
  async (page?: number, limit?: number, exception?: News) => {
    try {
      const { result, error } = await getNewsArrSql(page, limit, exception);

      if (error) throw error;

      const news = result.map((item) => newsSqlToNews(item));

      return news;
    } catch (error) {
      throw error;
    }
  }
);

// OTHERS
export const reduceText = (
  text: string,
  wordLimit: number = 30,
  splitJoinBy: string = " "
) => {
  return (
    text.split(splitJoinBy).splice(0, wordLimit).join(splitJoinBy) + " ..."
  );
};

export const newsSqlToNews = (newsSql: NewsSql) => {
  const result: News = {
    ...newsSql,
    image: {
      downloadUrl: newsSql.image,
    },
  };
  return result;
};

export const newsToNewsSql = (news: News) => {
  const result: NewsSql = {
    ...news,
    image: news.image?.downloadUrl || "",
  };
  return result;
};
