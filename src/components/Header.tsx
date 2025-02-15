import { useAuth } from '../context/AuthContext';
import ChatRoomList from './ChatRoomList';
import { Avatar, Tooltip, Button } from '@chakra-ui/react';
import { logout } from '../firebase/auth';

const Header = () => {
  const { userProfile } = useAuth();
  return (
    <div id="header">
      {userProfile ? (
        <>
          <Button size="sm" colorScheme="blue" onClick={logout} marginRight="10px">
            Logout ({userProfile.displayName})
          </Button>
          <Tooltip label={userProfile?.displayName}>
            <Avatar name={userProfile?.displayName} src={userProfile.imageUrl} size="sm" />
          </Tooltip>
          <ChatRoomList />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;
