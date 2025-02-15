import { useState } from 'react';
import { Input, Button, HStack, useToast } from '@chakra-ui/react';
import { sendMessage } from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';

const MessageInput = ({ roomId }: { roomId: string }) => {
  const [message, setMessage] = useState('');
  const { userProfile } = useAuth();
  const toast = useToast();

  const handleSendMessage = async () => {
    if (!userProfile || !message.trim()) return;

    await sendMessage(roomId, message, userProfile, toast);
    setMessage('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <HStack>
      <Input
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <Button colorScheme="blue" onClick={handleSendMessage}>
        Send
      </Button>
    </HStack>
  );
};

export default MessageInput;
