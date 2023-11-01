import { storage } from "../config";
import { uploadBytesResumable, ref, UploadTask } from "firebase/storage";

export function uploadFlyerToFirebase(name: string, file: any): UploadTask {
  const storageRef = ref(storage, `/files/${name}`);

  return uploadBytesResumable(storageRef, file);
}