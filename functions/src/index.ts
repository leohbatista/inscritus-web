import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import cors from 'cors';

import * as users from './users/users.api';

const serviceAccount = require("../mc853-f59e9-firebase-adminsdk-i7n3j-4b7bbd73e7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mc853-f59e9.firebaseio.com"
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

const usersAPI = users.functions;
usersAPI.use(cors({ origin: true }));
exports.users = functions.https.onRequest(usersAPI);
