import { auth, db, storage } from "../firebase/firebase";
import { updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from 'browser-image-compression';

// Check if user is logged in
export const isUserLoggedIn = () => {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe(); // Unsubscribe immediately after getting the user state
        resolve(!!user); // Resolve with true if user exists, false otherwise
      });
    });
};

// Fetch user data from Firestore
export const fetchUserData = async () => {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
  
            if (docSnap.exists()) {
              const userData = docSnap.data();
              resolve({
                ...userData,
                photoURL: userData.photoURL || user.photoURL || null, // Use user's photoURL if userData.photoURL is not available
              });
            } else {
              reject(new Error("No such document!"));
            }
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error("No authenticated user"));
        }
      });
    });
};

//update user password
export const updateUserPassword = async (currentPassword,newPassword) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");
        await updatePassword(user, newPassword);
        setMessage("Password updated successfully");
        setShowToast(true);
        console.log("Password updated successfully");
    } catch (error) {
        throw error;
    }
};

export const checkProvider = async () => {
    const user = auth.currentUser;
    const provider = user.providerData[0].providerId;
    if (provider === "google.com") {
        return "google";
    } else {
        return "email";
    }
}

// Update user profile
export const updateUserProfile = async (firstName, lastName, fileInput) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No authenticated user");

        const userDocRef = doc(db, "users", user.uid);
        const updates = {}; // Object to store fields that will be updated

        // Fetch existing user data
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
            throw new Error("User document not found");
        }
        const existingData = docSnap.data();

        // Update firstName if provided
        if (firstName && firstName !== existingData.fName) {
            updates.fName = firstName;
        }

        // Update lastName if provided
        if (lastName && lastName !== existingData.lName) {
            updates.lName = lastName;
        }

        // Handle file upload and update photoURL if a new file is provided
        if (fileInput) {
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };

            const compressedFile = await imageCompression(fileInput, options);
            const storageRef = ref(storage, `profilePictures/${user.uid}`);
            await uploadBytes(storageRef, compressedFile);
            updates.photoURL = await getDownloadURL(storageRef);
        }

        // Only update the document if there are changes
        if (Object.keys(updates).length > 0) {
            await updateDoc(userDocRef, updates);
        }

        return { message: "Profile updated successfully" };
    } catch (error) {
        throw error;
    }
};