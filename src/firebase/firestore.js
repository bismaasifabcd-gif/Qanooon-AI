import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

export const saveUser = async (uid, name, email, language) => {
  await setDoc(doc(db, "users", uid), {
    uid,
    name,
    email,
    preferredLanguage: language,
    createdAt: serverTimestamp()
  });
};

export const getUser = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const updateLanguage = async (uid, language) => {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    preferredLanguage: language
  });
};
export const updateProfile = async (uid, data) => {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};
