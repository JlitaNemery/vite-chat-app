import { collection, getDocs, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { UserProfile } from '../common/types';
import { UseToastOptions } from '@chakra-ui/react';

export type Message = {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
};

const showErrorToast = (toast: (options: UseToastOptions) => void, message: string) => {
  toast({
    title: 'Error',
    description: message,
    status: 'error',
    duration: 5000,
    isClosable: true,
    position: 'bottom',
  });
};

export const fetchChatRooms = async () => {
  const chatRoomsCollection = collection(db, 'chatRooms');
  const chatRoomsSnapshot = await getDocs(chatRoomsCollection);
  return chatRoomsSnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name as string,
  }));
};

export const sendMessage = async (roomId: string, text: string, userProfile: UserProfile, toast: (options: UseToastOptions) => void) => {
  if (!text.trim()) return;
  try {
    await addDoc(collection(db, 'chatRooms', roomId, 'messages'), {
      text,
      senderId: userProfile.uid,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error sending message:', error);
    showErrorToast(toast, 'Message could not be sent.');
  }
};

export const listenForMessages = (roomId: string, callback: (messages: Message[]) => void, toast: (options: UseToastOptions) => void) => {
  try {
    const messagesQuery = query(collection(db, 'chatRooms', roomId, 'messages'), orderBy('timestamp'));

    return onSnapshot(messagesQuery, (snapshot) => {
      const messages: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text as string,
        senderId: doc.data().senderId as string,
        timestamp: doc.data().timestamp as Timestamp,
      }));
      callback(messages);
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    showErrorToast(toast, 'Failed to load messages.');
  }
};

export const subscribeToUsers = async (callback: (users: Record<string, { displayName: string; imageUrl: string }>) => void) => {
  const usersCollection = collection(db, 'users');

  return onSnapshot(
    usersCollection,
    (snapshot) => {
      const usersData: Record<string, { displayName: string; imageUrl: string }> = {};

      snapshot.forEach((doc) => {
        const userData = doc.data();
        if (!userData) return;

        usersData[doc.id] = {
          imageUrl: userData.imageUrl || '',
          displayName: userData.displayName || 'Unknown User',
        };
      });

      if (Object.keys(usersData).length > 0) {
        console.log('Real-time Firestore Users:', usersData);
        callback(usersData);
      }
    },
    (error) => {
      console.error('🔥 Firestore users subscription error:', error);
    }
  );
};