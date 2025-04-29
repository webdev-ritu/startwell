import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const uploadPitchDeck = async (userId, file, onProgress) => {
  if (!userId || !file) {
    throw new Error('User ID and file are required');
  }

  // Sanitize filename
  const sanitizedName = file.name
    .replace(/[^a-z0-9_.-]/gi, '_')
    .toLowerCase();
  const timestamp = Date.now();
  const filename = `pitchdeck_${timestamp}_${sanitizedName}`;
  
  const storageRef = ref(storage, `pitch-decks/${userId}/${filename}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (typeof onProgress === 'function') {
          onProgress(progress);
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            downloadURL,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};