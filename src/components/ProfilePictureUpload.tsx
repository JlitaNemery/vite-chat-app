import { useState } from 'react';
import { Button, Input, Avatar, VStack, Text } from '@chakra-ui/react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, updateProfile } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

const ProfilePictureUpload = () => {
  const { user } = useAuth();
  if (!user) {
    return (
      <VStack spacing={3}>
        <Text color="red.500">You must be logged in to upload a profile picture.</Text>
      </VStack>
    );
  }
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files) return;

    const file = event.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${user.uid}`);

    setLoading(true);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);

    // 🔹 Update Firebase user profile
    const auth = getAuth();
    await updateProfile(auth.currentUser!, { photoURL });

    setLoading(false);
  };

  return (
    <VStack spacing={3}>
      <Avatar size="xl" src={user?.photoURL || ''} name={user?.displayName || ''} />
      <Input type="file" accept="image/*" onChange={handleUpload} isDisabled={loading} />
      <Button isLoading={loading} colorScheme="blue">
        Upload Profile Picture
      </Button>
    </VStack>
  );
};

export default ProfilePictureUpload;
