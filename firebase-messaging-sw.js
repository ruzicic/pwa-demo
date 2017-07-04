importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

// Initialize Firebase
const config = {
    apiKey: "AIzaSyACnQYxIeWT9qb__sXI_DTPGQzbWja-zyA",
    authDomain: "execom-pwa-demo.firebaseapp.com",
    databaseURL: "https://execom-pwa-demo.firebaseio.com",
    projectId: "execom-pwa-demo",
    storageBucket: "",
    messagingSenderId: "94170349850"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {
    console.log('[worker] Received push notification: ', payload);
    return self.registration.showNotification(payload.title, payload);
});