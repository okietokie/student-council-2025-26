import { megaStorage } from '../megaClient.js';
import { Readable } from 'stream';

export const uploadAvatarToMega = async (file, userId) => {
  const fileName = `avatars/${userId}-${Date.now()}-${file.originalname}`;

  const uploadStream = megaStorage.upload({
    name: fileName,
    size: file.size
  });

  // Convert buffer → stream
  Readable.from(file.buffer).pipe(uploadStream);

  await new Promise((resolve, reject) => {
    uploadStream.on('complete', resolve);
    uploadStream.on('error', reject);
  });

  // Make public
  const node = megaStorage.root.children.find(c => c.name === fileName);
  await node.link();

  return node.link; // public URL
};
