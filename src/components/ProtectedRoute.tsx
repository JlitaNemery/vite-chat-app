import { ReactNode, useEffect, lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { fetchChatRooms, subscribeToUsers } from '../firebase/firestore';
import { useToast, Spinner, Center } from '@chakra-ui/react';
import { ROUTE_LOGIN } from '../common/consts';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { userProfile, user, loading } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchAndSubscribe = async () => {
      const unsubscribe = await subscribeToUsers((users) => {
        queryClient.setQueryData(['users'], users);
        queryClient.invalidateQueries({ queryKey: ['users'] });
      });

      return unsubscribe;
    };

    let unsubscribe: () => void;
    fetchAndSubscribe().then((unsub) => (unsubscribe = unsub));

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, queryClient]);

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
    }
  }, [userProfile, queryClient]);

  if (loading)
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );

  if (!user) return <Navigate to={ROUTE_LOGIN} replace />;

  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Spinner size="xl" />
        </Center>
      }
    >
      {children}
    </Suspense>
  );
};

export default ProtectedRoute;
