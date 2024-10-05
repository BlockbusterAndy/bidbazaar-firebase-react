import React, { useState, useEffect } from "react";

import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { fetchUserData, updateUserProfile, updateUserPassword, checkProvider } from "../../utils/userUtils";
import { sendPasswordResetEmail } from "firebase/auth";

import { Card, Avatar, Label, TextInput, Button, FileInput, Toast } from "flowbite-react";
import { LuUser, LuGavel } from "react-icons/lu";
import { BsBoxSeam } from "react-icons/bs";
import { FaCog, FaUserCircle } from "react-icons/fa";
import { HiExclamation } from "react-icons/hi";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Account"); // State to track active tab
  const [data, setData] = useState(null); // State to store user data
  const [formData , setFormData] = useState({ fName:"", lName:"", fileInput: null });
  const [passwordData , setPasswordData] = useState({ currentPassword:"", newPassword:"", confirmNewPassword:"" });

  const [ShowToast, setShowToast] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange =(e)=>{
    setFormData({...formData, [e.target.name]: e.target.value});
    console.log(formData);
    console.log(data);
  }

  const handleChangePassword =(e)=>{
    setPasswordData({...passwordData, [e.target.name]: e.target.value});
  }

  const onSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const firstName = e.target.fName.value;
      const lastName = e.target.lName.value;
      const fileInput = e.target.photo?.files[0];

      const result = await updateUserProfile(firstName, lastName, fileInput);
      
      setMessage(result.message);
      setShowToast(true);
  
      // Fetch updated user data
      const updatedUserData = await fetchUserData();
      setData(updatedUserData);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage(error.message);
      setShowToast(true);
    }
  };

  const handleUpdatePassword = async (e) => {
    sendPasswordResetEmail(auth.currentUser, auth.currentUser.email).then(() => {
      console.log("Password reset email sent!");
    }).catch((error) => {
      console.error("Error sending password reset email:", error);
    });
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUserData();
        setData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    getUserData();
  }, []);

  // Function to render content for the second card based on the active tab
  const renderCardContent = () => {
    switch (activeTab) {

      case "Account":
        return (
          <div className="flex flex-col gap-4 px-6">
            <div className="py-2">
              <h2 className="text-2xl font-semibold">Account Information</h2>
            </div>
            <form onSubmit={onSaveChanges} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>First Name</Label>
                <TextInput
                  placeholder={data?.fName} // Use data state
                  value={formData.fName}  // Use formData state
                  className="w-full" 
                  name="fName" 
                  onChange={handleChange} // Add onChange handler to update state
                />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <Label>Last Name</Label>
                <TextInput
                  placeholder={data?.lName}
                  value={formData.lName}  // Use formData state
                  className="w-full" 
                  name="lName" 
                  onChange={handleChange} // Add onChange handler to update state
                />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <Label>Upload Profile Picture</Label>
                <FileInput 
                  className="w-full" 
                  helperText="PNG, JPG or GIF." 
                  name="photo" 
                  onChange={(e) => setFormData({...formData, fileInput: e.target.files[0]})}  // Handle file input change
                />
              </div>
              <div>
                <Button color="dark" type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        );

      case "Active Bids":
        return <p>Your active bids will be displayed here.</p>;

      case "Won Auctions":
        return <p>List of auctions you have won will appear here.</p>;

      case "Settings":
        return (
        <div>
          <div className="flex flex-col gap-4 px-6">
            <div className="py-2">
              <h2 className="text-2xl font-semibold">Account Settings</h2>
            </div>
            <div>
              <div>
                <h3 className="text-lg font-semibold">Change Password</h3>
                <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-2">
                    <Label>Current Password</Label>
                    <TextInput type="password" className="w-full" name="currentPassword" onChange={handleChangePassword} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>New Password</Label>
                    <TextInput type="password" className="w-full" name="newPassword" onChange={handleChangePassword} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Confirm New Password</Label>
                    <TextInput type="password" className="w-full" name="confirmNewPassword" onChange={handleChangePassword} />
                  </div>
                  <div>
                    <Button color="dark" type="submit">Update Password</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );

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
        {ShowToast && (
          <Toast className="z-50 absolute right-5 top-20">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
              <HiExclamation className="h-5 w-5" />
            </div>
            <div className="ml-3 text-sm font-normal">{message}</div>
            <Toast.Toggle />
          </Toast>)
        }
        <aside className="col-span-1">
          <Card className="py-2 h-full">
            <div className="flex flex-row py-4 pl-2 pb-8 gap-4 mt-6 items-center">
              <div>
                <Avatar
                  img={data ? data.photoURL : ""}
                  alt="User avatar"
                  rounded
                  placeholderInitials={(data ? data.fName.charAt(0) : "U") + (data ? data.lName.charAt(0) : "U")}
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{data ? `${data.fName} ${data.lName}` : ""}</h2>
                <p className="text-gray-500">{""}</p>
                <p className="text-gray-500">Member since 2021</p>
              </div>
            </div>
            <div>
              <ul className="flex flex-col gap-2">
                <li
                  className={`p-2 pl-6 ml-1 font-semibold cursor-pointer rounded-md flex items-center ${activeTab === "Account" ? "bg-slate-300" : ""}`}
                  onClick={() => setActiveTab("Account")}
                >
                  <LuUser className="h-5 w-5 mr-2" />
                  Account
                </li>
                <li
                  className={`p-2 pl-6 ml-1 font-semibold cursor-pointer rounded-md flex items-center  ${activeTab === "Active Bids" ? "bg-slate-300" : ""}`}
                  onClick={() => setActiveTab("Active Bids")}
                >
                  <LuGavel className="h-5 w-5 mr-2" />
                  Active Bids
                </li>
                <li
                  className={`p-2 pl-6 ml-1 font-semibold cursor-pointer rounded-md flex items-center  ${activeTab === "Won Auctions" ? "bg-slate-300" : ""}`}
                  onClick={() => setActiveTab("Won Auctions")}
                >
                  <BsBoxSeam className="h-5 w-5 mr-2" />
                  Won Auctions
                </li>
                <li
                  className={`p-2 pl-6 ml-1 font-semibold cursor-pointer rounded-md flex items-center  ${activeTab === "Settings" ? "bg-slate-300" : ""}`}
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
