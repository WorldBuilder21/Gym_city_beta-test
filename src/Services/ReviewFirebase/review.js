import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

export const getTotalNumberOfReviews = async ({ uid }) => {
  const collectionRef = collection(db, "users", uid, "reviews");
  const snapshot = await getCountFromServer(collectionRef);
  return snapshot.data().count;
};

export const getRatingNumber = async ({ uid, rating }) => {
  const collectionRef = collection(db, "users", uid, "reviews");
  const q = query(collectionRef, where("rating", "==", rating));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

export const deleteReview = async ({ uid, docId }) => {
  const docRef = doc(db, "users", uid, "reviews", docId);
  await deleteDoc(docRef);
};

export const sendReview = async ({ senderId, uid, rating, message }) => {
  const docRef = doc(db, "users", uid, "reviews", senderId);
  await setDoc(docRef, {
    senderId,
    rating,
    message,
    ts: serverTimestamp(),
  });
};

export const checkIfReviewExist = async ({ senderId, uid }) => {
  const docRef = doc(db, "users", uid, "reviews", senderId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists();
};

export const ratingCount = async ({ uid, rating }) => {
  const collectionRef = collection(db, "users", uid, "reviews");
  const q = query(collectionRef, where("rating", "==", rating));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

export const viewRatings = async (uid, rating, nextPageParam = undefined) => {
  const collectionRef = collection(db, "users", uid, "reviews");
  let q = query(
    collectionRef,
    where("rating", "==", rating),
    orderBy("ts", "desc"),
    limit(15)
  );

  if (nextPageParam !== undefined) {
    q = query(
      collectionRef,
      where("rating", "==", rating),
      orderBy("ts", "desc"),
      startAfter(nextPageParam),
      limit(15)
    );
  }

  const snapshot = await getDocs(q);

  const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const hasNextPage = reviews.length === 15;

  const lastReview = snapshot.docs[snapshot.docs.length - 1];

  const nextPage = hasNextPage ? lastReview : undefined;

  return { reviews, nextPage };
};
