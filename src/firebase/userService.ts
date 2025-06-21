import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
import type { Unsubscribe } from "firebase/database";

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt?: number;
}

// Listen to all users from Firebase Realtime DB
export const listenToUsers = (callback: (users: User[]) => void): Unsubscribe => {
  const usersRef = ref(db, "users");
  console.log("Setting up Firebase listener at path:", usersRef.toString());
  
  return onValue(usersRef, (snapshot) => {
    console.log("Firebase snapshot received:", snapshot.exists());
    const data = snapshot.val();
    console.log("Raw data from Firebase:", data);

    if (!data) {
      console.log("No data in Firebase");
      callback([]);
      return;
    }

    try {
      // Convert the data object to an array of users
      const users = Object.entries(data).map(([uid, userData]: [string, any]) => {
        console.log("Processing user:", uid, userData);
        return {
          uid,
          email: userData.email || '',
          displayName: userData.displayName || '',
          createdAt: userData.createdAt || Date.now()
        };
      });

      // Sort users by creation time (newest first)
      users.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      console.log("Processed users array:", users);
      callback(users);
    } catch (error) {
      console.error("Error processing user data:", error);
      callback([]);
    }
  }, (error) => {
    console.error("Firebase listener error:", error);
  });
}; 