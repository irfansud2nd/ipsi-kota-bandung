import { v4 } from "uuid";
import { apiProtect } from "../admin/adminActions";
import {
  addOfficialSql,
  deleteOfficialSql,
  getOfficialsSql,
  getOfficialsSqlByContingentId,
  getOfficialsSqlByEmail,
  updateOfficialSql,
} from "./officialActions";
import { Official, OfficialSql } from "./officialContants";
import { toast } from "sonner";
import { getFileUrl } from "../functions";
import { sendFile, toastError } from "../form/formFunctions";
import { deleteFile } from "../actions";

// OFFICIAL
// CREATE
export const addOfficial = async (officialData: Official) => {
  const toastId = toast.loading("Mendaftarkan Official");
  const id = v4();

  let official: Official = { ...officialData, id };
  official.created_at = Date.now();

  const { imageUrl } = getFileUrl("official", id);

  try {
    if (!official.created_by) {
      throw { message: "Email pendaftar tidak ditemukan" };
    }
    if (!official.contingent_id)
      throw { message: "ID Kontingen tidak ditemukan" };
    if (!official.contingent_name)
      throw { message: "Nama Kontingen tidak ditemukan" };
    if (!official.image.file) throw { message: "Pas foto tidak ditemukan" };

    const response = await apiProtect({
      permittedEmail: official.created_by,
    });
    if (response) throw response;

    // SEND IMAGE
    toast.loading("Mengunggah pas foto official", { id: toastId });
    official.image.downloadUrl = await sendFile(official.image.file, imageUrl);
    delete official.image.file;

    // SEND ATHLETE
    toast.loading("Mendaftarkan official", { id: toastId });
    const { error } = await addOfficialSql(officialToOfficialSql(official));
    if (error) throw error;

    // FINISH
    toast.success("Official berhasil didaftarkan", { id: toastId });
    return official;
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

// READ
export const getOfficials = async (
  page: number,
  limit: number,
  showAll: boolean = false
) => {
  try {
    const response = await apiProtect({ directory: "official" });
    if (response) throw response;

    const { result: officialsSql, error } = await getOfficialsSql(
      page,
      limit,
      showAll
    );
    if (error) throw error;

    const officials = officialsSql.map((officialSql) =>
      officialSqlToOfficial(officialSql)
    );

    return officials;
  } catch (error) {
    throw error;
  }
};

export const getOfficialsByEmail = async (email: string) => {
  try {
    const response = await apiProtect({ permittedEmail: email });
    if (response) throw response;

    const { result: officialsSql, error } = await getOfficialsSqlByEmail(email);
    if (error) throw error;

    const officials = officialsSql.map((officialSql) =>
      officialSqlToOfficial(officialSql)
    );

    return officials;
  } catch (error) {
    throw error;
  }
};

export const getOfficialsByContingentId = async (contingentId: string) => {
  try {
    const response = await apiProtect({ directory: "championship" });
    if (response) throw response;

    const { result: officialsSql, error } = await getOfficialsSqlByContingentId(
      contingentId
    );
    if (error) throw error;

    const officials = officialsSql.map((officialSql) =>
      officialSqlToOfficial(officialSql)
    );

    return officials;
  } catch (error) {
    throw error;
  }
};

// UPDATE
export const updateOfficial = async (official: Official) => {
  const toastId = toast.loading("Memperbahrui official");
  const { imageUrl } = getFileUrl("official", official.id);

  try {
    const response = await apiProtect({
      permittedEmail: official.created_by,
    });
    if (response) throw response;

    if (official.image.file) {
      // UPDATE IMAGE
      toast.loading("Memperbaharui pas foto official", { id: toastId });
      official.image.downloadUrl = await sendFile(
        official.image.file,
        imageUrl
      );
      delete official.image.file;
    }

    // UPDATE ATHLETE
    toast.loading("Memperbaharui official", { id: toastId });
    const { error } = await updateOfficialSql(officialToOfficialSql(official));
    if (error) throw error;

    // FINISH
    toast.success("Official berhasil diperbaharui", { id: toastId });
    return official;
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};
// DELETE
export const deleteOfficial = async (official: Official) => {
  const toastId = toast.loading("Menghapus Official");

  const { imageUrl } = getFileUrl("official", official.id);

  try {
    const response = await apiProtect({
      permittedEmail: official.created_by,
    });
    if (response) throw response;

    // DELETE IMAGE
    toast.loading("Menghapus pas foto official", { id: toastId });
    const { error: deleteFileError } = await deleteFile(imageUrl);
    if (deleteFileError) throw deleteFileError;

    // DELETE ATHLETE
    toast.loading("Menghapus official", { id: toastId });
    const { error: deleteOfficialSqlError } = await deleteOfficialSql(
      officialToOfficialSql(official)
    );
    if (deleteFileError) throw deleteOfficialSqlError;

    // FINISH
    toast.success("Official berhasil dihapus", { id: toastId });
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

// OTHERS
export const officialSqlToOfficial = (officialSql: OfficialSql) => {
  const result: Official = {
    ...officialSql,
    image: {
      downloadUrl: officialSql.image,
    },
  };
  return result;
};

export const officialToOfficialSql = (official: Official) => {
  const result: OfficialSql = {
    ...official,
    image: official.image.downloadUrl,
  };
  return result;
};
