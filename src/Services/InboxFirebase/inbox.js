import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

export const viewMessages = async (uid, nextPageParam = undefined) => {
  const collectionRef = collection(db, "inbox");
  let q = query(
    collectionRef,
    where("users", "array-contains", uid),
    orderBy("ts", "desc"),
    limit(15)
  );

  if (nextPageParam !== undefined) {
    q = query(
      collectionRef,
      orderBy("ts", "desc"),
      startAfter(nextPageParam),
      limit(15)
    );
  }

  const snapshot = await getDocs(q);

  const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const hasNextPage = messages.length === 15;

  const lastMessage = snapshot.docs[snapshot.docs.length - 1];

  const nextPage = hasNextPage ? lastMessage : undefined;

  return { messages, nextPage: nextPage };
};

export const getInboxCount = async ({ uid }) => {
  const collectionRef = collection(db, "inbox");
  const q = query(collectionRef, where("users", "array-contains", uid));
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

export const sendMessage = async ({
  title,
  body,
  // attachments,
  senderId,
  recieverId,
}) => {
  const collectionRef = collection(db, "inbox");

  const docRef = await addDoc(collectionRef, {
    title,
    body,
    // attachments,
    senderId,
    recieverId,
    ts: serverTimestamp(),
    users: [senderId, recieverId],
  });

  await updateDoc(docRef, {
    docId: docRef.id,
  });
  return docRef;
};

export const deleteMessage = async ({ docId }) => {
  const docRef = doc(db, "inbox", docId);
  await deleteDoc(docRef);
};

// replies
export const getRepliesCount = async ({ docId }) => {
  const collectionRef = collection(db, "inbox", docId, "replies");
  const snapshot = await getCountFromServer(collectionRef);
  return snapshot.data().count;
};

export const sendReply = async ({
  inboxId,
  message,
  senderId,
  attachments,
}) => {
  const collectionRef = collection(db, "inbox", inboxId, "replies");
  const docRef = await addDoc(collectionRef, {
    message,
    senderId,
    attachments,
    ts: serverTimestamp(),
  });
  await updateDoc(docRef, {
    docId: docRef.id,
  });

  return docRef;
};

export const deleteReply = async ({ inboxId, docId }) => {
  const docRef = doc(db, "inbox", inboxId, "replies", docId);
  await deleteDoc(docRef);
};

export const viewReplies = async (docId, nextPageParam = undefined) => {
  const collectionRef = collection(db, "inbox", docId, "replies");
  let q = query(collectionRef, orderBy("ts", "desc"), limit(15));

  if (nextPageParam !== undefined) {
    q = query(
      collectionRef,
      orderBy("ts", "desc"),
      startAfter(nextPageParam),
      limit(15)
    );
  }

  const snapshot = await getDocs(q);

  const replies = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const hasNextPage = replies.length === 15;

  const lastReply = snapshot.docs[snapshot.docs.length - 1];

  const nextPage = hasNextPage ? lastReply : undefined;

  return { replies, nextPage };
};
