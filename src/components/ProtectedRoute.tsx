import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { fetchChatRooms, fetchUsers } from '../firebase/firestore';
import { useToast } from '@chakra-ui/react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { userProfile, user, loading } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    if (userProfile) {
      queryClient
        .fetchQuery({
          queryKey: ['chatRooms'],
          queryFn: fetchChatRooms,
          staleTime: Infinity,
        })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
        })
        .catch(() => {
          toast({
            title: 'Error',
            description: 'Failed to fetch chat rooms. Please try again later.',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'bottom',
          });
        });

      queryClient
        .fetchQuery({
          queryKey: ['users'],
          queryFn: fetchUsers,
          staleTime: Infinity,
        })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['users'] });
        })
        .catch(() => {
          toast({
            title: 'Error',
            description: 'Failed to fetch users. Please try again later.',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'bottom',
          });
        });
    }
  }, [userProfile, queryClient]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
