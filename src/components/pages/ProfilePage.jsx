import React from "react";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Card, Avatar, Label, TextInput, Button, FileInput } from "flowbite-react";

import { LuUser, LuGavel } from "react-icons/lu";
import { BsBoxSeam } from "react-icons/bs";
import { FaCog, FaUserCircle } from "react-icons/fa";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Account"); // State to track active tab
  const [data, setData] = useState(null); // State to store user data

  // Fetch user data from Firebase
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log("User:", user);
      try {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setData({
            ...userData,
            photo: auth.currentUser?.photoURL || null, // Check if photoURL exists
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    });
  };

  const onSaveChanges = async () => {
    // Save changes to Firebase

  };
  
  useEffect(() => {
    fetchUserData();
  }, [ ]);

  // Function to render content for the second card based on the active tab
  const renderCardContent = () => {
    switch (activeTab) {
      case "Account":
        return (
            <div className="flex flex-col gap-4 px-6">
                <div className="py-2">
                    <h2 className="text-2xl font-semibold">Account Information</h2>
                </div>
                <div className="flex flex-col gap-2">
                    <Label className=" ">First Name</Label>
                    <TextInput value={data ? data.fName : " "} className="w-full" name="fName" />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                    <Label className=" ">Last Name</Label>
                    <TextInput value={data ? data.lName : " "} className="w-full" name="lName" />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                    <Label className="">Upload Profile Picture</Label>
                    <FileInput className="w-full" helperText="PNG, JPG or GIF." name="photo" />
                </div>
                <div>
                    <Button color="dark">Save Changes</Button>
                </div>
            </div>
        );
      case "Active Bids":
        return <p>Your active bids will be displayed here.</p>;
      case "Won Auctions":
        return <p>List of auctions you have won will appear here.</p>;
      case "Settings":
        return <p>Here you can update your settings.</p>;
      default:
        return <p>Welcome to your profile!</p>;
    }
  };

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main className="grid grid-cols-4 p-8 gap-4">
        {/* Sidebar with user info */}
        <aside className="col-span-1">
          <Card className="py-2 h-full">
            <div className="flex flex-row py-4 pl-2 pb-8 gap-4 mt-6 items-center">
            <div>
              {data?.photo ? (
                <Avatar img={data.photo} alt="User Avatar" size="lg" rounded />
              ) : (
                <FaUserCircle className="h-16 w-16 text-gray-500" />
              )}
            </div>
              <div>
                <h2 className="text-xl font-semibold">{data ? (data.fName +" "+ data.lName) : " "}</h2>
                <p className="text-gray-500">{""}</p>
                <p className="text-gray-500">Member since 2021</p>
              </div>
            </div>
            <div>
              <ul className="flex flex-col gap-2">
                <li
                  className={`p-2 pl-6 ml-1 font-semibold cursor-pointer rounded-md flex items-center ${
                    activeTab === "Account" ? "bg-slate-300" : ""
                  }`}
                  onClick={() => setActiveTab("Account")}
                >
                <LuUser className="h-5 w-5 mr-2" />
                  Account
                </li>
                <li
                  className={`p-2 pl-6 ml-1 font-semibold cursor-pointer rounded-md flex items-center  ${
                    activeTab === "Active Bids" ? "bg-slate-300" : ""
                  }`}
                  onClick={() => setActiveTab("Active Bids")}
                >
                <LuGavel className="h-5 w-5 mr-2" />
                  Active Bids
                </li>
                <li
                  className={`p-2 pl-6 ml-1 font-semibold cursor-pointer rounded-md flex items-center  ${
                    activeTab === "Won Auctions" ? "bg-slate-300" : ""
                  }`}
                  onClick={() => setActiveTab("Won Auctions")}
                >
                <BsBoxSeam className="h-5 w-5 mr-2" />
                  Won Auctions
                </li>
                <li
                  className={`p-2 pl-6 ml-1 font-semibold cursor-pointer rounded-md flex items-center  ${
                    activeTab === "Settings" ? "bg-slate-300" : ""
                  }`}
                  onClick={() => setActiveTab("Settings")}
                >
                <FaCog className="h-5 w-5 mr-2" />
                  Settings
                </li>
              </ul>
            </div>
          </Card>
        </aside>

        {/* Main content area */}
        <div className="col-span-3">
          <Card className="w-full h-full">
            {renderCardContent()} {/* Render the content based on activeTab */}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
