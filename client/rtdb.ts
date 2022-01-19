import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "GORfB34Caad2y6i73TcD0U6PUwq2v9CpBygMpycF",
  databaseURL: "https://apx-dwf-m6-a0ea8-default-rtdb.firebaseio.com/",
  authDomain: "apx-dwf-m6-a0ea8.firebaseapp.com",
});

const rtdb = firebase.database();

export { rtdb };
