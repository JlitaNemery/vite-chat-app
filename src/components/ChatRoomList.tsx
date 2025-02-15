import { Select } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ChatRoom } from '../common/types';
import { useQuery } from '@tanstack/react-query';
import { fetchChatRooms } from '../firebase/firestore';
import { ROUTE_CHAT } from '../common/consts';

const ChatRoomList = () => {
  const navigate = useNavigate();
  const { data: chatRooms } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: fetchChatRooms,
    enabled: false,
  });

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const roomName = event.target.value;
    if (roomName) {
      navigate(`${ROUTE_CHAT}/${roomName}`);
    }
  };

  return (
    <Select placeholder="Select a chat room..." onChange={handleSelectChange} width="200px" margin="auto" paddingTop="10px">
      {chatRooms?.map((room: ChatRoom) => (
        <option key={room.id} value={room.name}>
          {room.name}
        </option>
      ))}
    </Select>
  );
};

export default ChatRoomList;
