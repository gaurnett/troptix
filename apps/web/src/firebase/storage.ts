import { storage } from '../config';
import { uploadBytesResumable, ref, UploadTask } from 'firebase/storage';

export function uploadFlyerToFirebase(
  eventID: string,
  name: string,
  file: any
): UploadTask {
  const storageRef = ref(storage, `/files/${eventID}/${name}`);

  return uploadBytesResumable(storageRef, file);
}
