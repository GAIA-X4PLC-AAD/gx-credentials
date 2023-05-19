import { db } from "../config/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore/lite";

export const getIssuerCredentials = async (address: string) => {
  const q = query(
    collection(db, "TrustedIssuerCredentials"),
    where("address", "==", address)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};
