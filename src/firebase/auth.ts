import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { app } from './firebaseConfig';

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const userData = {
    uid: user.uid,
    email: user.email,
    isGoogleUser: true,
    displayName: user.displayName || 'Anonymous',
    imageUrl: user.photoURL || '',
  };

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, userData);
  }

  return user;
};

export const registerUser = async (email: string, password: string, name: string, imageUrl: string = '') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: name, photoURL: imageUrl });

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    isGoogleUser: false,
    displayName: name,
    imageUrl: imageUrl,
  });

  return user;
};

export const signInWithEmail = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
