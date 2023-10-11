/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import {info} from "firebase-functions/logger";

export const helloWorld = onRequest((request, response) => {
  info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// import {config, firestore} from "firebase-functions";
// // const { onRequest } = require("firebase-functions/v2/https");
// import algoliasearch from "algoliasearch";

// const APP_ID = config().algolia.app;
// const ADMIN_KEY = config().algolia.key;

// const client = algoliasearch(APP_ID, ADMIN_KEY);
// const index = client.initIndex("users");

// export const addToIndex = firestore
//     .document("users/{userId}")
//     .onCreate((snapshot) => {
//       const data = snapshot.data();
//       const objectId = snapshot.id;

//       // every new user document will be duplicated in alogolia
//       return index.addObject({...data, objectId});
//     });

// export const updateIndex = firestore
//     .document("users/{userId}")
//     .onUpdate((change) => {
//       const newData = change.after.data();
//       const objectId = change.after.id;
//       return index.saveObject({...newData, objectId});
//     });

// export const deleteFromIndex = firestore
//     .document("users/{userId}")
//     .onDelete((snashot) => index.deleteObject(snashot.id));
