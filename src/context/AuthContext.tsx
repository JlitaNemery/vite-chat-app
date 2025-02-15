import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@chakra-ui/react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserProfile } from '../common/types';
import { ROUTE_BASE, ROUTE_LOGIN, ROUTE_SIGNUP } from '../common/consts';

interface AuthContextType {
  userProfile: UserProfile | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  userProfile: null,
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserProfile = async (uid: string, retryCount = 3) => {
    for (let i = 0; i < retryCount; i++) {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserProfile(userSnap.data() as UserProfile);
        return true;
      }
      console.warn(`User profile not found, retrying... (${i + 1}/${retryCount})`);
      await new Promise((res) => setTimeout(res, 500));
    }
    toast({
      title: 'Error',
      description: 'User profile not found.',
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'bottom',
    });
    setUserProfile(null);
    return false;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        const profileFound = await fetchUserProfile(currentUser.uid);
        if (profileFound && (location.pathname === ROUTE_LOGIN || location.pathname === ROUTE_SIGNUP)) {
          navigate(ROUTE_BASE); // Redirect only if profile exists
        }
      } else {
        setUserProfile(null);
        if (location.pathname !== ROUTE_SIGNUP && location.pathname !== ROUTE_LOGIN) {
          navigate(ROUTE_LOGIN);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  return <AuthContext.Provider value={{ userProfile, user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
