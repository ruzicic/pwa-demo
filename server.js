const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');

const app = express();
const PORT = 3017;
const vapidKeys = webpush.generateVAPIDKeys();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

webpush.setVapidDetails(
    'mailto:mladen.ruzicic@wolkabout.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);
// console.log(vapidKeys.publicKey, vapidKeys.privateKey);

const admin = require('firebase-admin');
const serviceAccount = require('./execom-pwa-demo-firebase-adminsdk-cktkb-583093d9b6.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://execom-pwa-demo.firebaseio.com/'
});

// Admin FCM - Firebase Cloud Messaging (FCM)
const messaging = admin.messaging();

// To serve static assests in root dir
app.use(express.static(__dirname));

// To allow cross origin request
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// To serve index.html page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/push', async (req, res) => {
    const token = req.query.token;

    if (token) {
        const payload = {
            data: {
                title: 'Hey!',
                body: 'You are awesome!',
                icon: '/images/icons/apple-touch-icon.png'
            }
        }

        admin.messaging()
            .sendToDevice(token, payload)
            .then(response => {
                // See the MessagingDevicesResponse reference documentation for
                // the contents of response.
                console.log("Successfully sent message:", response);
            })
            .catch(err => {
                console.log("Error sending message:", err);
            });

        res.status = 200;
    } else {
        res.status = 500;
    }
});

app.post('/sendNotification', (req, res) => {
    webpush.sendNotification({
        endpoint: req.query.endpoint,
        TTL: req.query.ttl
    })
        .then(function () {
            res.sendStatus(201);
        })
        .catch(function (error) {
            res.sendStatus(500);
            console.log(error);
        });
})


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at port ${PORT}`);
});
