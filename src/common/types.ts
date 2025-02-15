export type ChatRoom = {
  id: string;
  name: string;
};

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  imageUrl: string;
  isGoogleUser: boolean;
}

export interface UserRecord {
  [userId: string]: { displayName: string; imageUrl: string };
}