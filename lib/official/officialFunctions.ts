import { v4 } from "uuid";
import { apiProtect } from "../admin/adminActions";
import {
  addOfficialSql,
  deleteOfficialSql,
  getOfficialsSql,
  getOfficialsSqlByContingentId,
  getRegisteredOfficialsSql,
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

  const { imageUrl, certificateUrl } = getFileUrl("official", id);

  try {
    if (!official.contingent_id)
      throw { message: "ID Kontingen tidak ditemukan" };

    if (!official.contingent_name)
      throw { message: "Nama Kontingen tidak ditemukan" };

    if (!official.image.file) throw { message: "Pas foto tidak ditemukan" };

    // if (!official.certificate_file.file)
    //   throw { message: "Sertifikat tidak ditemukan" };

    const response = await apiProtect();
    if (response) throw response;

    // SEND IMAGE
    toast.loading("Mengunggah pas foto official", { id: toastId });
    official.image.downloadUrl = await sendFile(official.image.file, imageUrl);
    delete official.image.file;

    // SEND CERTIFICATE
    if (official.certificate_file.file) {
      toast.loading("Mengunggah sertifikat official", { id: toastId });
      official.certificate_file.downloadUrl = await sendFile(
        official.certificate_file.file,
        certificateUrl
      );
      delete official.certificate_file.file;
    }

    // SEND OFFICIAL
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

// READ
export const getRegisteredOfficials = async (
  page: number,
  limit: number,
  championdhipId: string,
  showAll: boolean = false
) => {
  try {
    const response = await apiProtect({ directory: "official" });
    if (response) throw response;

    const { result: officialsSql, error } = await getRegisteredOfficialsSql(
      page,
      limit,
      championdhipId,
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

export const getOfficialsByContingentId = async (contingentId: string) => {
  try {
    const response = await apiProtect();
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
  const { imageUrl, certificateUrl } = getFileUrl("official", official.id);

  try {
    const response = await apiProtect();
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

    if (official.image.file) {
      // UPDATE IMAGE
      toast.loading("Memperbaharui pas foto official", { id: toastId });
      official.image.downloadUrl = await sendFile(
        official.image.file,
        imageUrl
      );
      delete official.image.file;
    }

    if (official.certificate_file.file) {
      // UPDATE CERcertificate_file
      toast.loading("Memperbaharui pas foto official", { id: toastId });
      official.certificate_file.downloadUrl = await sendFile(
        official.certificate_file.file,
        certificateUrl
      );
      delete official.certificate_file.file;
    }

    // UPDATE OFFICIAL
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

  const { imageUrl, certificateUrl } = getFileUrl("official", official.id);

  try {
    const response = await apiProtect();
    if (response) throw response;

    // DELETE IMAGE
    toast.loading("Menghapus pas foto official", { id: toastId });
    const { error: deleteImageError } = await deleteFile(imageUrl);
    if (deleteImageError) throw deleteImageError;

    // DELETE CERTIFICATE
    if (official.certificate_file.downloadUrl) {
      toast.loading("Menghapus sertifikat official", { id: toastId });
      const { error: deleteCertificateError } = await deleteFile(
        certificateUrl
      );
      if (deleteCertificateError) throw deleteCertificateError;
    }

    // DELETE ATHLETE
    toast.loading("Menghapus official", { id: toastId });
    const { error: deleteOfficialSqlError } = await deleteOfficialSql(
      officialToOfficialSql(official)
    );
    if (deleteOfficialSqlError) throw deleteOfficialSqlError;

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
    certificate_file: {
      downloadUrl: officialSql.certificate_file,
    },
  };
  return result;
};

export const officialToOfficialSql = (official: Official) => {
  const result: OfficialSql = {
    ...official,
    image: official.image.downloadUrl,
    certificate_file: official.certificate_file.downloadUrl,
  };
  return result;
};
