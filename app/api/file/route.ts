import { apiProtect } from "@/lib/admin/adminActions";
import { storage } from "@/lib/database/firebase";
import {
  StorageError,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const directory = formData.get("directory") as string;

  const { response } = await apiProtect({ directory });
  if (response) return response;

  return uploadBytes(ref(storage, directory), file)
    .then((snapshot) =>
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        return NextResponse.json(
          { message: "Successfully Uploaded", downloadUrl },
          { status: 200 }
        );
      })
    )
    .catch((error: StorageError) => {
      return NextResponse.json(error, { status: 500 });
    });
};

export const DELETE = async (req: NextRequest) => {
  const directory = req.nextUrl.searchParams.get("directory");

  if (!directory)
    return NextResponse.json({ message: "Invalid directory" }, { status: 500 });

  const { response } = await apiProtect({ directory });
  if (response) return response;

  return deleteObject(ref(storage, directory))
    .then((res) => {
      return NextResponse.json(
        { message: "Successfully deleted" },
        { status: 200 }
      );
    })
    .catch((error: StorageError) => {
      return NextResponse.json(error, { status: 500 });
    });
};
