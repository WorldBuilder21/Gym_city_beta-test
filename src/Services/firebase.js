import { auth, db, storage } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  getAuth,
  deleteUser,
  sendEmailVerification,
  signInWithRedirect,
} from "firebase/auth";
import {
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  writeBatch,
  FieldValue,
  arrayUnion,
  serverTimestamp,
  addDoc,
  limit,
  orderBy,
  startAfter,
  getCountFromServer,
  deleteDoc,
  deleteField,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useId } from "react";

export const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const createUser = async ({
  email,
  password,
  usertype,
  fullname,
  username,
  bio,
  dateofbirth,
  height,
  weight,
  photoUrl,
}) => {
  return createUserWithEmailAndPassword(auth, email, password).then(
    async (result) => {
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const weightRef = doc(db, "users", user.uid, "weights", user.uid);
      await setDoc(docRef, {
        docId: user.uid,
        username,
        email,
        usertype,
        fullname,
        bio,
        dateofbirth,
        height,
        weight,
        photoUrl,
        photoUrls: [],
        memberships: [],
        // Public, Friends only, Private
        postPrivacyStatus: "Private",
        routinePrivacyStatus: "Private",
      }).then(async (_) => {
        await setDoc(weightRef, {
          lastEntryDate: serverTimestamp(),
          currentWeight: weight,
          targetWeight: "",
          goalStatus: "",
        });
      });
    }
  );
};

// for google authentication purposes
export const createUserDoc = async ({
  email,
  usertype,
  fullname,
  username,
  bio,
  dateofbirth,
  height,
  weight,
  photoUrl,
  uid,
}) => {
  const docRef = doc(db, "users", uid);
  // this collection will be where lastentrydate, current weight, starting weight, goal status will be stored
  const weightRef = doc(db, "users", uid, "weights", uid);
  // const recordRef = doc(db, "users", uid, "weights", uid, "records");
  await setDoc(docRef, {
    docId: uid,
    username,
    email,
    usertype,
    fullname,
    bio,
    dateofbirth,
    height,
    weight,
    photoUrl,
    photoUrls: [],
    memberships: [],
    // Public, Friends only, Private
    postPrivacyStatus: "Private",
    routinePrivacyStatus: "Private",
  }).then(async (_) => {
    await setDoc(weightRef, {
      lastEntryDate: serverTimestamp(),
      currentWeight: weight,
      targetWeight: "",
      goalStatus: "",
    });

    // await addDoc(recordRef, {
    //   docId: "",
    //   weight: weight,
    // });
  });
};

export const creatGymDoc = async ({
  email,
  usertype,
  gymname,
  ownername,
  username,
  bio,
  photoUrl,
  uid,
}) => {
  const docRef = doc(db, "users", uid);
  const memberRef = doc(db, "users", uid, "members", uid);
  await setDoc(docRef, {
    //
    docId: uid,
    username: username,
    email: email,
    usertype,
    ownername,
    bio,
    gymname,
    photoUrl,
    // Public, Members only,
    postPrivacyStatus: "Members only",
    routinePrivacyStatus: "Members only",
    hiringStatus: 'hiring',
  });
  await setDoc(memberRef, {
    docId: uid,
    type: "admin",
  });
};

export const createGym = async ({
  email,
  password,
  usertype,
  gymname,
  ownername,
  username,
  bio,
  photoUrl,
}) => {
  return createUserWithEmailAndPassword(auth, email, password).then(
    async (result) => {
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const memberRef = doc(db, "users", user.uid, "members", user.uid);
      await setDoc(docRef, {
        docId: user.uid,
        username: username,
        email: user.email,
        usertype,
        ownername,
        bio,
        gymname,
        photoUrl,
        // Public, Members only,
        postPrivacyStatus: "Members only",
        routinePrivacyStatus: "Members only",
        hiringStatus: 'hiring',
      });
      await setDoc(memberRef, {
        docId: user.uid,
        type: "admin",
      });
    }
  );
};

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const forgotPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const emailVerification = () => {
  const auth = getAuth();
  return sendEmailVerification(auth.currentUser);
};

export const doesUserNameExist = async (username) => {
  try {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log("query_snapshot:", querySnapshot);
      if (querySnapshot.docs.length > 0) {
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export const uploadPicture = async ({ uid, file }) => {
  console.log("userid:", uid);
  console.log("file:", file);
  const docRef = doc(db, "users", uid);
  const storageRef = ref(
    storage,
    `motivationalpictures/${uid}/${Date.now()}${file.name}`
  );
  const uploadImage = uploadBytes(storageRef, file);
  uploadImage.then((snapshot) => {
    getDownloadURL(snapshot.ref).then(async (url) => {
      await updateDoc(docRef, {
        photoUrls: arrayUnion(url),
      });
    });
  });
};

export const doesUserExist = async (userId) => {
  const docRef = doc(db, "users", userId);
  const user_data = await getDoc(docRef);
  return user_data.exists();
};

export const getUserDataUid = async (userId) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const getPostData = async (userid, postId) => {
  const docRef = doc(db, "users", userid, "posts", postId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const getPostsDocs = async (uid) => {
  const postsRef = collection(db, "users", uid, "posts");
  const snapshot = await getDocs(postsRef);
  return snapshot;
};

export const createComment = async ({ uid, docId, comment }) => {
  try {
    const collectionRef = collection(
      db,
      "users",
      uid,
      "posts",
      docId,
      "comments"
    );
    const docRef = await addDoc(collectionRef, {
      comment,
      uid,
      ts: serverTimestamp(),
    });

    const commentRef = doc(
      db,
      "users",
      uid,
      "posts",
      docId,
      "comments",
      docRef.id
    );

    await updateDoc(commentRef, {
      docId: docRef.id,
    });
  } catch (error) {
    console.log("error:", error);
  }
};

export const getAllComments = async (docId, uid) => {
  const commentRef = collection(db, "users", uid, "posts", docId, "comments");
  const q = query(commentRef, orderBy("ts", "desc"), limit(2));
  const snapshot = await getDocs(q);
  return snapshot;
};

export const getCommentCount = async (docId, uid) => {
  const commentRef = collection(db, "users", uid, "posts", docId, "comments");
  const commentCount = await getCountFromServer(commentRef);
  return commentCount.data().count;
};

export const getLikeCount = async (docId, uid) => {
  const likesRef = collection(db, "users", uid, "posts", docId, "likes");
  const likeCount = await getCountFromServer(likesRef);
  return likeCount.data().count;
};

export const isLiked = async (docId, uid) => {
  const docRef = doc(db, "users", uid, "posts", docId, "likes", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};

export const getRoutineDocs = async (uid) => {
  const routineRef = collection(db, "users", uid, "routines");
  const snapshot = await getDocs(routineRef);
  return snapshot;
};

export const deleteRoutine = async ({ uid, docId, data }) => {
  const docRef = doc(db, "users", uid, "routines", docId);
  if (data.photoUrl !== "") {
    let fileRef = ref(storage, data.photoUrl);
    deleteObject(fileRef);
  }
  return await deleteDoc(docRef);
};

export const handleToggleLiked = async ({
  docId,
  uid,
  setToggledLiked,
  setToggleCount,
  toggleLiked,
}) => {
  try {
    setToggledLiked((toggleLiked) => !toggleLiked);
    const batch = writeBatch(db);
    const docRef = doc(db, "users", uid, "posts", docId, "likes", uid);

    if (!toggleLiked) {
      batch.set(docRef, { uid });

      setToggleCount((toggleCount) => toggleCount + 1);
    } else {
      batch.delete(docRef);

      setToggleCount((toggleCount) => toggleCount - 1);
    }
    batch.commit();
  } catch (error) {
    console.log(error);
  }
};

export const deleteComment = async ({ uid, postId, commentId }) => {
  try {
    const docRef = doc(
      db,
      "users",
      uid,
      "posts",
      postId,
      "comments",
      commentId
    );
    return await deleteDoc(docRef);
  } catch (error) {
    console.log("uid:", uid);
    console.log("postId:", postId);
    console.log("commentId:", commentId);
    console.log("firebaseError:", error);
  }
};

export const handlePaginateComments = async (docId, uid, pageParam = null) => {
  const commentRef = collection(db, "users", uid, "posts", docId, "comments");
  const q = query(commentRef, orderBy("ts", "desc"), limit(15));
  let comments = await getDocs(q);

  const lastVisible = comments.docs[comments.docs.length - 1];

  if (lastVisible === 15) {
    const next = query(
      commentRef,
      orderBy("ts", "desc"),
      startAfter(lastVisible),
      limit(15)
    );
    comments = await getDocs(next);
  }

  return {
    comments,
    nextPage: lastVisible,
  };
};

export const recieveGraphData = async (uid) => {
  const docRef = doc(db, "users", uid, "weights", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const queryData = async (uid, month, year) => {
  const q = query(
    collection(db, "users", uid, "weights", uid, "records"),
    where("month", "==", month),
    where("year", "==", year)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs;
};

export const updateGoalDoc = async ({
  uid,
  targetWeight,
  currentWeight,
  goalStatus,
  deadline,
}) => {
  const docRef = doc(db, "users", uid, "weights", uid);
  const userRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    targetWeight,
    currentWeight,
    goalStatus,
    // used for tracking weight
    lastEntryDate: serverTimestamp(),

    // used for goal tracking
    startDate: serverTimestamp(),
    deadline,
    previousWeight: 0,
  });

  await updateDoc(docRef, {
    weight: currentWeight,
  });
};

export const deleteGoalDoc = async ({ uid }) => {
  const docRef = doc(db, "users", uid, "weights", uid);
  await updateDoc(docRef, {
    goalStatus: "",
    targetWeight: "",
    previousWeight: deleteField(),
    deadline: deleteField(),
    startDate: deleteField(),
  });
};

export const editGoalDoc = async ({
  uid,
  currentWeight,
  targetWeight,
  goalStatus,
  deadline,
  new_currentWeight,
  new_targetWeight,
  new_goalStatus,
  new_deadline,
}) => {
  const docRef = doc(db, "users", uid, "weights", uid);

  if (currentWeight !== new_currentWeight) {
    await updateDoc(docRef, {
      currentWeight: new_currentWeight,
    });
  }
  if (targetWeight !== new_targetWeight) {
    await updateDoc(docRef, {
      targetWeight: new_targetWeight,
    });
  }
  if (goalStatus !== new_goalStatus) {
    await updateDoc(docRef, {
      goalStatus: new_goalStatus,
    });
  }
  if (deadline !== new_deadline) {
    await updateDoc(docRef, {
      deadline: new_deadline,
    });
  }
};

export const top_gym = async () => {
  const collection_ref = collection(db, "users");
  const q = query(collection_ref, where("usertype", "==", "Gym"), limit(5));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

export const top_instructors = async () => {
  const collection_ref = collection(db, "users");
  const q = query(
    collection_ref,
    where("usertype", "==", "Instructor"),
    limit(5)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

export const getRequests = async (uid) => {
  const collection_ref = collection(db, 'users', uid, 'requests')
  const q = query(collection_ref, limit(15))
  let requests = await getDocs(q)

  const lastVisible = requests.docs[requests.docs.length - 1]

  if(lastVisible === 15){
    const next = query(
      collection_ref, 
      startAfter(lastVisible),
      limit(15)
    );
    requests = await getDocs(next)
  }

  return {
    requests, nextPage: lastVisible,
  }

  // const docsSnap = await getDocs(collection_ref)
  // return docsSnap;
}

// export const getNotifications = async (uid) => {
//   const collection_ref = collection(db, "users", uid, "Notifications");
//   const docsSnap = await getDocs(collection_ref);
//   return docsSnap;
// };

export const getTestUsers = async () => {
  const collection_ref = collection(db, "users");
  const q = query(collection_ref, where("usertype", "==", "User"), limit(5));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

export const removeFriend = async (uid, docId) => {
  const docRef = doc(db, "users", uid, "friends", docId);
  return await deleteDoc(docRef);
};

export const viewFriends = async (uid) => {
  const docRef = collection(db, "users", uid, "friends");
  const docSnap = await getDocs(docRef);
  return docSnap;
};

// VIEW INSTRUCTORS (Gyms)
export const viewInstructors = async (uid) => {
  const docRef = collection(db, "users", uid, "instructors");
  const docSnap = await getDocs(docRef);
  return docSnap;
};

export const addInstructor = async (uid, docId) => {
  const docRef = collection(db, "users", uid, "instructors", docId);
  return await setDoc(docRef, {
    instructorId: docId,
    ts: serverTimestamp(),
  });
};

export const checkIfInstructor = async (uid, docId) => {
  const docRef = doc(db, "users", uid, "instructors", docId);
  const member_data = await getDoc(docRef);
  return member_data.exists();
};

// VIEWING MEMBERS (Gyms)
export const viewMembers = async (uid) => {
  const docRef = collection(db, "users", uid, "members");
  const docSnap = await getDocs(docRef);
  return docSnap;
};

export const checkifFriendOrMember = async (uid, docId, type) => {
  if (type === "Gym") {
    const docRef = doc(db, "users", uid, "members", docId);
    const member_data = await getDoc(docRef);
    return member_data.exists();
  } else {
    const docRef = doc(db, "users", uid, "friends", docId);
    const user_data = await getDoc(docRef);
    return user_data.exists();
  }
};

export const addMember = async (uid, docId, type) => {
  const docRef = collection(db, "users", uid, "members", docId);
  return await setDoc(docRef, {
    memberId: docId,
    joined: serverTimestamp(),
    type: type,
  });
};

export const removeMember = async (uid, docId) => {
  const docRef = doc(db, "users", uid, "members", docId);
  return await deleteDoc(docRef);
};

// SENDING REQUESTS

// users have friends request, check if potential frnd has already sent a request or is the friend of the user already

// docId will be sender userId
// HelloWorld
// checks to see if the request is already sent
export const checkIfRequest = async (uid, docId) => {
  const docRef = doc(db, "users", uid, "requests", docId);
  const request_data = await getDoc(docRef);
  return request_data.exists();
};

// sending friend and member request
// sending of membership request(user) and employment request (instructors) is the same format,
export const sendUserRequest = async ( uid, docId, typeOfRequest, sendertype ) => {
  // types of request: membership request, creation of routine, friend request
    const docRef = doc(db, "users", uid, "requests", docId);
    return await setDoc(docRef, {
      ts: serverTimestamp(),
      senderId: docId,
      // friend, membership
      requestType: typeOfRequest,
      sendertype,
    });
};

export const declineRequest = async (uid, docId) => {
  const docRef = doc(db, 'users', uid, 'requests', docId)
  await deleteDoc(docRef)
}

export const acceptRequest = async (uid, docId, requestType) => {
  // for friends requests u have to add the document to in the friends collection of both the users
  if(requestType === 'friend'){
    const docRef = doc(db, 'users', uid, 'friends', docId)
    const doc_ref = doc(db, 'users', docId, 'friends', uid)
    await setDoc(docRef, {
      ts: serverTimestamp(),
      friendId: docId,
    })
    await setDoc(doc_ref, {
      ts: serverTimestamp(),
      friendId: uid,
    })
  }
  if(requestType === 'Membership'){
    const docRef = doc(db, 'users', uid, 'members', docId)
    await setDoc(docRef, {
      ts: serverTimestamp(),
      memberId: docId
    })
  }
  if(requestType === 'Employment'){
    const docRef = doc(db, 'users', uid, 'instructors', docId)
    await setDoc(docRef, {
      ts: serverTimestamp(),
      instructorId: docId
    })
  }
}

export const sendRoutineRequest = async ({ uid, docId, type, data }) => {
  const docRef = doc(db, "users", uid, "requests", docId);
  return await setDoc(docRef, {
    ts: serverTimestamp(),
    senderId: docId,
    // routine
    type: type,
    data: data,
  });
};

// Privacy status
export const updatePrivacyStatus = async ({
  uid,
  type,
  oldStatus,
  newStatus,
}) => {
  const docRef = doc(db, "users", uid);
  if (type === "Posts") {
    if (oldStatus !== newStatus) {
      await updateDoc(docRef, {
        postPrivacyStatus: newStatus,
      });
    }
  }
  if (type === "Routines") {
    if (oldStatus !== newStatus) {
      await updateDoc(docRef, {
        routinePrivacyStatus: newStatus,
      });
    }
  }
  if(type === 'Employment'){
    if(oldStatus !== newStatus){
      await updateDoc(docRef, {
        hiringStatus: newStatus,
      })
    }
  }
};

// create message for reject of routine in inbox

// BLOCK OF USERS
// Blocked user are unable to view the post and routine of user
// Blocked users are unable to send comments to a user

// check if have blocked user, blocked
export const checkIfUserisBlocked = async (uid, docId) => {
  // uid: is the account being viewed id
  // docId: is the viewers id
  
  // if the account being viewed has blocked me
  // if i have blocked others from viewing me

  // have i blocked the user??
  // has the user blocked me??

  // STATES OF BEING BLOCKED
  // the user blocks me, i didnt blocked the user
  // i block the user, the user doesnt block me
  // we both block each other

  // is the person vieing my page on my block list??
  const docRef = doc(db, "users", uid, "blocked", docId);

  const docSnap = await getDoc(docRef);
  return docSnap;
};

// check the account i have blocked, blocker
export const checkAccountsBlocked = async (uid, docId) => {
  const docRef = doc(db, 'users',docId, 'block2', uid)
  const docSnap = await getDoc(docRef)
  return docSnap;
}


export const viewBlockedUsers = async (uid) => {
  const blockRef = collection(db, "users", uid, "blocked");
  const snapshot = await getDocs(blockRef);
  return snapshot;
};

// user would be blocked from sending request to user, messaging, joining gym and will not be able to view users profile
export const blockUser = async (uid, docId) => {
  // uid: users account uid
  // docId: the user being blocked uid
  // format: blockedId_blockerId
  // const docRef = doc(db, 'users', uid, 'blocked', docId)

  // the persons account i am viewing i want to blocked it
  // account that i have blocked
  const docRef = doc(db, "users", uid, "blocked", docId);

  // account the have blocked me
  const doc_ref = doc(db, 'users', docId, 'block2', uid)
  
  await setDoc(docRef, {
    // to show time when user was blocked
    ts: serverTimestamp(),
    blockedId: docId,
  });

  await setDoc(doc_ref, {
    ts:serverTimestamp(),
    blockerId: uid
  })
};

export const unblockUser = async (uid, docId ) => {
  const docRef = doc(db, "users", uid, "blocked", docId);
  const doc_ref = doc(db, 'users',docId, 'block2', uid)
  await deleteDoc(docRef);
  await deleteDoc(doc_ref)
};

// function is to block users from post on a particular post
// export const blockedFromCommentOnPost = async ({ uid, postId, docId }) => {
//   const docRef = doc(db, "users", uid, "posts", postId, "blocked", docId);
//   return await setDoc(docRef, {
//     ts: serverTimestamp(),
//     blockedId: docId,
//   });
// };
