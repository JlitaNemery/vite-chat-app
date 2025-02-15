import { Timestamp } from 'firebase/firestore';

export const formatTimestamp = (timestamp: Timestamp | Date | null | undefined): string => {
  if (!timestamp) return '';

  let date: Date;

  if (timestamp instanceof Timestamp) {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    return '';
  }

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};
