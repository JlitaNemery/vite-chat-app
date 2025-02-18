export const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
export const FIREBASE_DOMAIN = import.meta.env.VITE_FIREBASE_DOMAIN;
export const FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;
export const FIREBASE_DATABASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;
export const FIREBASE_STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
export const FIREBASE_MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
export const FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID;

export const ROUTE_BASE = import.meta.env.VITE_ROUTE_BASE;
export const ROUTE_LOGIN = `${ROUTE_BASE}/login`;
export const ROUTE_SIGNUP = `${ROUTE_BASE}/signup`;
export const ROUTE_CHAT = `${ROUTE_BASE}/chat`;
export const ROUTE_CHAT_ROOM = `${ROUTE_BASE}/chat/:roomName`;
