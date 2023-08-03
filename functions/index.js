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

// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const algoliasearch = require("algoliasearch");

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex("users");

exports.addToIndex = functions.firestore
  .document("users/{userId}")
  .onCreate((snapshot) => {
    const data = snapshot.data();
    const objectId = snapshot.id;

    // every new user document will be duplicated in alogolia
    return index.addObject({ ...data, objectId });
  });

exports.updateIndex = functions.firestore
  .document("users/{userId}")
  .onUpdate((change) => {
    const newData = change.after.data();
    const objectId = change.after.id;
    return index.saveObject({ ...newData, objectId });
  });

exports.deleteFromIndex = functions.firestore
  .document("users/{userId}")
  .onDelete((snashot) => index.deleteObject(snashot.id));
