import { auth, db, storage, realtimeDb } from "../firebase/firebase";
import { getDoc, addDoc, updateDoc, doc, collection, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as dbRef, set } from "firebase/database";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid"; // To generate unique file names

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

// Compress and upload images
export const compressAndUploadImages = async (images, listingId) => {
  const promises = [];
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };

  for (const image of Array.from(images)) {
    promises.push(
      new Promise(async (resolve, reject) => {
        try {
          const compressedFile = await imageCompression(image, options);
          const storageRefPath = storageRef(storage, `listings/${listingId}/${uuidv4()}`);
          const uploadTask = uploadBytesResumable(storageRefPath, compressedFile);

          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        } catch (error) {
          reject(error);
        }
      })
    );
  }

  return Promise.all(promises); // Return an array of download URLs
};

// Function to set the initial bid data in Realtime Database
const setInitialBidData = async (listingId, startingPrice, sellerId) => {
  try {
    const bidRef = dbRef(realtimeDb, `bids/${listingId}`);

    const bidData = {
      listingId: listingId,
      startingPrice: startingPrice,
      currentBid: startingPrice, // Set the current bid initially as the starting price
      sellerId: sellerId,
      bidderId: null, // No bidder at the start
    };

    await set(bidRef, bidData);
    console.log(`Initial bid data set for listing: ${listingId}`);
  } catch (error) {
    console.error('Error setting initial bid data:', error);
    throw error;
  }
};

// Function to set initial bid history for a listing
const setInitialBidHistory = async (listingId) => {
  try {
    const bidHistoryRef = dbRef(realtimeDb, `bidHistory/${listingId}`);
    const bidHistoryData = {
      listingId: listingId,
      bids: [] // No bids initially
    };

    await set(bidHistoryRef, bidHistoryData);
    console.log(`Initial bid history set for listing: ${listingId}`);
  } catch (error) {
    console.error('Error setting initial bid history:', error);
    throw error;
  }
};

export const createListingWithImages = async (formData) => {
  const storage = getStorage();
  const imageUrls = []; // To store the URLs of uploaded images
  const sellerId = auth.currentUser.uid; // Get the current user's UID
  const uuid = uuidv4(); // Generate a unique ID for images

  for (const file of formData.images) {
    const uuid = uuidv4(); // Generate a unique ID for images
    const storageRef = ref(storage, `listings/${uuid}`); // Create a storage reference

    await uploadBytes(storageRef, file); // Upload the file
    const downloadURL = await getDownloadURL(storageRef); // Get the download URL
    imageUrls.push(downloadURL); // Push the URL to the array
  }

  // Create the listing object with image URLs
  const listingData = {
    itemName: formData.itemName,
    description: formData.description,
    category: formData.category,
    startingPrice: parseFloat(formData.startingPrice),
    endDate: formData.endDate,
    endTime: formData.endTime,
    hasAuthenticityDocument: formData.hasAuthenticityDocument,
    images: imageUrls, // Store the URLs instead of File objects
    sellerId: sellerId
  };

  // Save the listing data to Firestore
  const listingRef = doc(collection(db, "listings")); // Assuming 'listings' is your collection name
  await setDoc(listingRef, listingData);
  await setInitialBidData(listingRef.id, listingData.startingPrice, listingData.sellerId); // Use sellerId here
  await setInitialBidHistory(listingRef.id);

  return { message: "Listing created successfully", listingId: listingRef.id };
};


export const getListingById = async (listingId) => {
  try {
    const listingRef = doc(db, "listings", listingId);
    const listingSnap = await getDoc(listingRef);

    if (listingSnap.exists()) {
      return { id: listingSnap.id, ...listingSnap.data() };
    } else {
      throw new Error("No such listing!");
    }
  } catch (error) {
    console.error("Error fetching listing data:", error);
    throw error;
  }
};

export const getListingData = async (id) => {
  const listingRef = doc(db, 'listings', id); // Assuming your collection is named 'listings'
  const listingSnap = await getDoc(listingRef);

  if (listingSnap.exists()) {
      return listingSnap.data();
  } else {
      throw new Error('No such listing!');
  }
};