importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyDZmd79MGBOQPtfnr16An-p1GGwGlmWnZ4",
    authDomain: "chat-task-9f8a8.firebaseapp.com",
    projectId: "chat-task-9f8a8",
    storageBucket: "chat-task-9f8a8.firebasestorage.app",
    messagingSenderId: "15900250571",
    appId: "1:15900250571:web:da8631974be46942e0264e",
    measurementId: "G-R8WYYKZDNJ"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, { body });
});