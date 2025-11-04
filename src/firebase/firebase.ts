import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { api } from "../api/api";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  };  

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_VAPID_KEY,
    });

    if (!token) return console.warn("No FCM token received");

    console.log("Current FCM Token:", token);

    const savedToken = localStorage.getItem("fcmToken");
    if (token !== savedToken) {
      localStorage.setItem("fcmToken", token);

      const userToken = localStorage.getItem("token");
      if (userToken) {
        await api.post(
          "/user/update-fcm",
          { fcmToken: token },
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        console.log("FCM token updated on server");
      }
    }
    return token;
  } catch (err) {
    console.error("Error getting FCM token:", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      resolve(payload);
    });
  });