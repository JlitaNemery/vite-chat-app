import { useEffect, useRef, useState } from 'react';
import { Box, Text, Avatar, VStack, Spinner, useToast } from '@chakra-ui/react';
import { listenForMessages } from '../firebase/firestore';
import { Message } from '../firebase/firestore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatTimestamp } from '../utils/helpers';
import { UserRecord } from '../common/types';

const MessageList = ({ roomId }: { roomId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const { data: users } = useQuery<UserRecord>({
    queryKey: ['users'],
    queryFn: () => queryClient.getQueryData(['users']) ?? {},
    enabled: true,
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = listenForMessages(
      roomId,
      (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
      },
      toast
    );

    return () => {
      if (unsubscribe !== undefined) {
        unsubscribe();
      }
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box bg="gray.100" p={4} borderRadius="md" height="90%" overflowY="auto">
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <VStack align="stretch" spacing={3}>
          {users ? (
            messages.map((msg) => (
              <Box key={msg.id} p={2} bg="white" borderRadius="md" shadow="sm">
                <Box display="flex" alignItems="center">
                  <Avatar size="sm" src={users[msg.senderId]?.imageUrl || ''} name={users[msg.senderId]?.displayName} mr={2} />
                  <Text fontWeight="bold">{users[msg.senderId]?.displayName}</Text>
                  <Text fontSize="xs" color="gray.500" ml={2}>
                    {msg.timestamp ? formatTimestamp(msg.timestamp) : ''}
                  </Text>
                </Box>
                <Text mt={1} textAlign="left">
                  {msg.text}
                </Text>
              </Box>
            ))
          ) : (
            <></>
          )}
          <div ref={messagesEndRef} />
        </VStack>
      )}
    </Box>
  );
};

export default MessageList;
