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