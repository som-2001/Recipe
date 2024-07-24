const express = require('express');
const webpush = require('web-push');
const cors=require('cors');
const app = express();
const port = 3001;

app.use(cors({
    origin:"*",
    methods:["POST","GET"],
    credentials:true
}))
// Your VAPID keys

const vapidKeys = {
  publicKey: 'BDvuN9XkXe0VCpvZkkhrVgnK1ur6-bjjD9FMJnVW4D7STYcP8pmKaak6_35Qmkhs5R7ZlJzKAOIJ3wbWGhWL5-8',
  privateKey: '1qXju9rksbY0jeG9okLlxZWrcBP2dQv3BBFQP1zJXh8',
};

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Array to store subscriptions
const subscriptions = [];

// Middleware to parse JSON body
app.use(express.json());

// Endpoint to receive and store subscription object
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: 'Subscription added successfully' });
});

// Endpoint to trigger push notification
app.post('/send-notification', (req, res) => {
  const notificationPayload = {
    title: 'New Update Available',
    body: 'Check out the latest updates on our website!',
    // icon: 'https://example.com/icon.png', // Update with your icon URL
    // badge: 'https://example.com/badge.png', // Update with your badge URL
  };

  // Send push notification to all subscribed clients
  sendPushNotification(notificationPayload);

  res.status(200).json({ message: 'Notification sent successfully' });
});

// Function to send push notification to all subscribed clients
const sendPushNotification = (payload) => {
  subscriptions.forEach(subscription => {
    webpush.sendNotification(subscription, JSON.stringify(payload))
      .catch(error => console.error('Error sending push notification:', error));
  });
};

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
