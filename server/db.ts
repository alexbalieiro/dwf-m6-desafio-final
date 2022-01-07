import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: "https://apx-dwf-m6-a0ea8-default-rtdb.firebaseio.com",
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
