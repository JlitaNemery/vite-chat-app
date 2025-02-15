import { Box, Heading } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { fetchChatRooms } from '../firebase/firestore';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const Chat = ({ roomName }: { roomName: string }) => {
  const { data: chatRooms } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: fetchChatRooms,
    enabled: false,
  });

  const chatRoomId = chatRooms?.find((room) => room.name === roomName)?.id || null;
  return (
    <Box p={4} maxW="600px" mx="auto" height="100%">
      <Heading size="md" mb={4}>
        Chat Room: {roomName}
      </Heading>
        {chatRoomId ? (
          <>
            <MessageList roomId={chatRoomId} />
            <MessageInput roomId={chatRoomId} />
          </>
        ) : (
          <></>
        )}
    </Box>
  );
};

export default Chat;
