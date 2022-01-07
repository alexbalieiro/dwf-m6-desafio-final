import * as admin from "firebase-admin";
require("dotenv").config();

const service = JSON.parse(process.env.FIREBASE_CONFIG);
admin.initializeApp({
  credential: admin.credential.cert(service),
  databaseURL: "https://apx-dwf-m6-a0ea8-default-rtdb.firebaseio.com",
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
