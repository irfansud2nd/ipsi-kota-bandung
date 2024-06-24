import axios from "axios";
import {
  SpecialUserRole,
  SpecialUser,
  roleAccess,
  SpecialUserSql,
} from "./adminConstants";
import { toast } from "sonner";
import { sendFile, toastError } from "../form/formFunctions";
import {
  InternalAthleteRole,
  internalAthleteRoles,
} from "../athlete/internal/internalAthleteConstants";
import {
  addSpecialUserSql,
  apiProtect,
  deleteSpecialUserSql,
  getSpecialUserSqlByEmail,
  updateSpecialUserSql,
} from "./adminActions";

// IS PERMITTED
export const isPermitted = (
  roles: SpecialUserRole[],
  permittedRoles: SpecialUserRole[]
) => {
  if (!permittedRoles.length) return true;
  return roles.some((item) => permittedRoles.includes(item));
};

export const getPermittedRoles = (dir: string) => {
  let dirs: string[] = dir.split("/");
  let roles: SpecialUserRole[] = [];

  if (dir == "/admin") {
    roles = ["master", "admin", "adminEvent", "pelatih"];
    return roles;
  }

  if (dirs[1] == "admin") dirs.splice(1, 1);

  roleAccess.map((access) => {
    if (access.dir.some((item) => dirs.includes(item))) {
      roles.push(access.role);
    }
  });

  if (dir.includes("admin"))
    roles = roles.filter(
      (item) => !internalAthleteRoles.includes(item as InternalAthleteRole)
    );

  roles.length && !roles.includes("master") && roles.push("master");

  return roles;
};

export const addSepecialUser = async (specialUser: SpecialUser) => {
  let data: SpecialUser = specialUser;
  const toastId = toast.loading(`Menambahkan Akun`);
  try {
    const res = await getSpecialUserSqlByEmail(data.email);
    if (res.length) {
      const registeredRoles: SpecialUserRole[] = res[0].roles;
      if (registeredRoles.includes(data.roles[0]))
        throw { message: "Akun sudah didaftarkan" };
      data.roles.push(...registeredRoles);
      data.name = res[0].name;
    }
    await addSpecialUserSql(specialUserToSpecialUserSql(data));
    toast.success(`Akun berihasil ditambahkan`, { id: toastId });
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

export const updateSpecialUser = async (specialUser: SpecialUser) => {
  let data: SpecialUser = specialUser;
  const toastId = toast.loading(`Memperbaharui Akun`);
  try {
    if (!data.email) throw { message: "Email tidak ditemukan" };
    if (data.image?.file) {
      // UPDATE FOTO
      toast.loading("Mengunngah foto", { id: toastId });
      data.image.downloadUrl = await sendFile(
        data.image.file,
        `specialUser/${data.email}`
      );
      delete data.image.file;
    }
    // UPDATE ATHLETE
    toast.loading("Memperbaharui akun", { id: toastId });
    await updateSpecialUserSql(specialUserToSpecialUserSql(data));
    toast.success("Akun berhasil diperbaharui", { id: toastId });
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

export const deleteSpecialUser = async (
  specialUser: SpecialUser,
  role: SpecialUserRole
) => {
  const toastId = toast.loading("Menghapus akun");
  try {
    if (specialUser.roles.length > 1) {
      let permittedRoles: SpecialUserRole[] = ["master"];
      if (role.includes("athlete")) permittedRoles.push("pelatih");

      const response = await apiProtect({ roles: permittedRoles });
      if (response) throw response;

      let data: SpecialUser = { ...specialUser };
      data.roles = data.roles.filter((assignedRole) => assignedRole != role);
      await updateSpecialUserSql(specialUserToSpecialUserSql(data));
    } else {
      await deleteSpecialUserSql(specialUserToSpecialUserSql(specialUser));
    }
    toast.success("Akun berhasil dihapus", { id: toastId });
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

export const isSpecialRole = (role: SpecialUserRole) => {
  const roles: SpecialUserRole[] = [
    "master",
    "admin",
    "pelatih",
    "adminEvent",
    ...internalAthleteRoles,
  ];

  return roles.includes(role);
};

export const specialUserSqlToSpecialUser = (specialUserSql: SpecialUserSql) => {
  const result: SpecialUser = {
    ...specialUserSql,
    image: {
      downloadUrl: specialUserSql.image,
    },
  };
  return result;
};

export const specialUserToSpecialUserSql = (specialUser: SpecialUser) => {
  const result: SpecialUserSql = {
    ...specialUser,
    image: specialUser.image?.downloadUrl || "",
  };
  return result;
};
