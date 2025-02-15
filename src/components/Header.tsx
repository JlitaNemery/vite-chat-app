import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import ChatRoomList from './ChatRoomList';
import { Avatar, Tooltip, Button } from '@chakra-ui/react';
import { logout } from '../firebase/auth';
import Modal from './Modal';
import ProfilePictureUpload from './ProfilePictureUpload';
import { useQuery } from '@tanstack/react-query';
import { UserRecord } from '../common/types';

const Header = () => {
  const { userProfile } = useAuth();
  const [isImageUpload, setIsImageUpload] = useState(false);

  const { data: users } = useQuery<UserRecord>({
    queryKey: ['users'],
    enabled: true,
    staleTime: Infinity,
  });

  const closeModal = () => {
    setIsImageUpload(false);
  };

  return (
    <div id="header">
      {userProfile ? (
        <>
          <Button size="sm" colorScheme="blue" onClick={logout} marginRight="10px">
            Logout ({userProfile.displayName})
          </Button>
          <Tooltip label="change picture">
            <Avatar
              name={userProfile?.displayName}
              src={users?.[userProfile.uid].imageUrl || ''}
              cursor="pointer"
              size="sm"
              onClick={() => setIsImageUpload((prev) => !prev)}
            />
          </Tooltip>
          <ChatRoomList />
          <Modal isOpen={isImageUpload} onClose={closeModal}>
            <ProfilePictureUpload onFinish={closeModal} />
          </Modal>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;
