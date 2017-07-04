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
let TOKEN = null;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js', { scope: "./" })
        .then((registration) => {
            console.info('Service worker is registered!');
            checkForPageUpdate(registration);

            // Set Firebase Messaging to use same Service Worker Registration
            messaging.useServiceWorker(registration);

            // Web push - subscribe a user with PushManager
            return registration.pushManager.subscribe({ userVisibleOnly: true });
        })
        .then(function (pushSubscription) {
            console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
            endpoint = subscription.endpoint;
        })
        .catch((err) => {
            console.error('Service worker failed ', err);
        })
}

const checkForPageUpdate = (registration) => {
    // onupdatefound will fire on first time install and when serviceWorker.js file changes      
    registration.addEventListener("updatefound", () => {
        // To check if service worker is already installed and controlling the page or not
        if (navigator.serviceWorker.controller) {
            var installingSW = registration.installing;
            installingSW.onstatechange = () => {
                console.info("Service Worker State :", installingSW.state);
                switch (installingSW.state) {
                    case 'installed':
                        // Now new contents will be added to cache and old contents will be remove so
                        // this is perfect time to show user that page content is updated.
                        toast('Site is updated. Refresh the page.', 5000);
                        break;
                    case 'redundant':
                        throw new Error('The installing service worker became redundant.');
                }
            }
        }
    });
}

// Request permission for push notifications.
messaging.requestPermission()
    .then(() => {
        log('Have permission to send push notifications');
        return messaging.getToken();
    })
    .then(token => {
        TOKEN = token;
        log(`Received FCM token: ${token}`);
    })
    .catch(err => {
        log(err);
    });

// Handle incoming messages.
messaging.onMessage(payload => {
    log(`Received push notification: ${JSON.stringify(payload.data)}`);
    toast(payload.data.body, 5000);
});

// Simple logging to page element.
const logElement = document.querySelector('#log');
const log = (message) => {
    console.log(message);
    let logItem = document.createElement('li');
    logItem.appendChild(document.createTextNode(message));
    logElement.append(logItem);
}

// Handlers for buttons.
function onOnSiteNotificationClick() {
    log('Sending on-site push notification...');
    fetch(`/push?token=${TOKEN}`);
}


/* 
 * notification button // todo
 * 
 */

// Push notification button
// const fabPushElement = document.querySelector('.fab__push');
// const fabPushImgElement = document.querySelector('.fab__image');

//To change status
// function changePushStatus(status) {
//     fabPushElement.dataset.checked = status;
//     fabPushElement.checked = status;
//     if (status) {
//         fabPushElement.classList.add('active');
//         fabPushImgElement.src = '../images/push-on.png';
//     }
//     else {
//         fabPushElement.classList.remove('active');
//         fabPushImgElement.src = '../images/push-off.png';
//     }
// }

