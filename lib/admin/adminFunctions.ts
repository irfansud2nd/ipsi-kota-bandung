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
  getSpecialUsersSql,
  updateSpecialUserSql,
} from "./adminActions";
import { cache } from "react";

// SPECIAL USER
// CREATE
export const addSpecialUser = async (specialUser: SpecialUser) => {
  let data: SpecialUser = specialUser;
  const toastId = toast.loading(`Menambahkan Akun`);
  try {
    const { result, error } = await getSpecialUserSqlByEmail(data.email);

    if (error) throw error;

    if (result) {
      const registeredRoles: SpecialUserRole[] = result.roles;
      if (registeredRoles.includes(data.roles[0]))
        throw { message: "Akun sudah didaftarkan" };
      data.roles.push(...registeredRoles);
      data.name = result.name;
    }

    await addSpecialUserSql(specialUserToSpecialUserSql(data));

    toast.success(`Akun berihasil ditambahkan`, { id: toastId });
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

// READ
export const getSpecialUsers = cache(
  async (
    role: SpecialUserRole,
    page: number,
    limit: number,
    forClient: boolean = false
  ) => {
    try {
      if (!forClient) {
        const response = await apiProtect({ directory: `admin/${role}` });
        if (response) throw response;
      }

      const { result, error } = await getSpecialUsersSql(
        role,
        page,
        limit,
        forClient
      );

      if (error) throw error;

      const specialUsers = result.map((item) =>
        specialUserSqlToSpecialUser(item)
      );

      return specialUsers;
    } catch (error) {
      throw error;
    }
  }
);

// UPDATE
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

    const { error } = await updateSpecialUserSql(
      specialUserToSpecialUserSql(data)
    );
    if (error) throw error;

    toast.success("Akun berhasil diperbaharui", { id: toastId });
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

// DELETE
export const deleteSpecialUser = async (
  specialUser: SpecialUser,
  role: SpecialUserRole
) => {
  const toastId = toast.loading("Menghapus akun");
  try {
    if (specialUser.roles.length > 1) {
      let permittedRoles: SpecialUserRole[] = ["master"];
      if (role.includes("athlete")) permittedRoles.push("coach");

      const response = await apiProtect({ roles: permittedRoles });
      if (response) throw response;

      let data: SpecialUser = { ...specialUser };
      data.roles = data.roles.filter((assignedRole) => assignedRole != role);

      const { error } = await updateSpecialUserSql(
        specialUserToSpecialUserSql(data)
      );
      if (error) throw error;
    } else {
      const { error } = await deleteSpecialUserSql(
        specialUserToSpecialUserSql(specialUser)
      );
      if (error) throw error;
    }
    toast.success("Akun berhasil dihapus", { id: toastId });
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

// OTHERS
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
    roles = ["master", "admin", "eventAdmin", "coach"];
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

export const isSpecialRole = (role: SpecialUserRole) => {
  const roles: SpecialUserRole[] = [
    "master",
    "admin",
    "coach",
    "eventAdmin",
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
