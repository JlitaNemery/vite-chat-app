import { useState } from 'react';
import { Box, Button, Image, useToast } from '@chakra-ui/react';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../firebase/auth';
import { db } from '../firebase/firebaseConfig';

const storage = getStorage();

const ProfilePictureUpload = ({ onFinish }: { onFinish: () => void }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(auth.currentUser?.photoURL || '');
  const toast = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please upload an image under 500KB.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      return;
    }

    if (!auth.currentUser) {
      toast({
        title: 'Not Authenticated',
        description: 'Please log in to upload a profile picture.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error('User not authenticated');
      return;
    }

    setUploading(true);
    const uid = auth.currentUser.uid;
    const userRef = doc(db, 'users', uid);

    try {
      const userSnap = await getDoc(userRef);
      let oldImageUrl = '';

      if (userSnap.exists()) {
        oldImageUrl = userSnap.data().imageUrl || '';
      }

      if (oldImageUrl && oldImageUrl.includes('firebasestorage.googleapis.com')) {
        try {
          console.log('Deleting old image before uploading new one...');
          const oldImageRef = ref(storage, `uploads/${uid}.jpg`);
          await deleteObject(oldImageRef);
          console.log('Old image deleted successfully.');
        } catch (error) {
          console.warn('Failed to delete old image:', error);
        }
      }

      const storageRef = ref(storage, `uploads/${uid}.jpg`);
      await uploadBytes(storageRef, selectedImage);

      const newImageUrl = await getDownloadURL(storageRef);

      await updateDoc(userRef, { imageUrl: newImageUrl });

      setImageUrl(newImageUrl);
      setSelectedImage(null);
      setPreviewUrl(null);

      toast({
        title: 'Success',
        description: 'Profile image updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: (error as Error).message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
      onFinish();
    }
  };

  return (
    <Box textAlign="center">
      {previewUrl || imageUrl ? (
        <Image src={previewUrl || imageUrl} alt="Profile" boxSize="100px" borderRadius="full" mb={4} />
      ) : (
        <Box boxSize="100px" borderRadius="full" bg="gray.300" mb={4} />
      )}
      <Box>
        <label htmlFor="file-upload">
          <Button as="span" colorScheme="teal" size="md" cursor={uploading ? 'not-allowed' : 'pointer'}>
            Select Image
          </Button>
        </label>
        <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} style={{ display: 'none' }} />
      </Box>
      <Button onClick={handleUpload} colorScheme="blue" isLoading={uploading} mt={2} disabled={!selectedImage}>
        Upload Image
      </Button>
    </Box>
  );
};

export default ProfilePictureUpload;
