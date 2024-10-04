import React from "react";
import logo from "../assets/logo.svg";
import { useState, useEffect } from "react";
import { Dropdown, Button, Avatar } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { HiCog, HiCurrencyDollar, HiLogout, HiViewGrid } from "react-icons/hi";
import { isUserLoggedIn, fetchUserData } from "../utils/userUtils";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const loggedIn = await isUserLoggedIn();
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        try {
          const userDataFromFirestore = await fetchUserData();
          setUserData({
            photoURL: userDataFromFirestore.photoURL || auth.currentUser?.photoURL,
            name: `${userDataFromFirestore.fName || ''} ${userDataFromFirestore.lName || ''}`.trim(),
            email: auth.currentUser?.email || '',
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
    };

    checkAuthAndFetchData();
  }, []);

  const signOutAccount = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUserData(null);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <nav className="flex justify-around items-center sticky top-0 h-[7vh] bg-slate-100 z-20">
      <Link to="/">
        <div className="logo">
          <img src={logo} alt="logo" width={100} height={50} />
        </div>
      </Link>
      <div className="flex flex-row items-center gap-8">
        {!isLoggedIn && (
          <>
            <ul className="flex gap-4 flex-row items-center text-slate-700 font-semibold">
              <li> <Link to="/">Home</Link> </li>
              <li>
                <Dropdown label="Browse Auctions" inline>
                  <Dropdown.Item>Something</Dropdown.Item>
                  <Dropdown.Item>Settings</Dropdown.Item>
                  <Dropdown.Item>Earnings</Dropdown.Item>
                  <Dropdown.Item>Sign out</Dropdown.Item>
                </Dropdown>
              </li>
            </ul>
            <Link to="/login">
              <Button color="dark">Get Started</Button>
            </Link>
          </>
        )}
        {isLoggedIn && userData && (
          <Dropdown color="dark" label={userData.name || userData.email || 'User'}>
            <Dropdown.Header>
              <div className="flex flex-row items-center gap-2">
                <Avatar 
                  img={userData.photoURL} 
                  alt="User avatar" 
                  rounded 
                  placeholderInitials={(userData.name && userData.name.charAt(0)) || (userData.email && userData.email.charAt(0)) || 'U'}
                />
                <div className="my-2">
                  {userData.name && <span className="block text-sm">{userData.name}</span>}
                  {userData.email && <span className="block truncate text-sm font-medium">{userData.email}</span>}
                </div>
              </div>
            </Dropdown.Header>
            <Dropdown.Item icon={HiViewGrid} onClick={() => { navigate("/profile") }}>Profile</Dropdown.Item>
            <Dropdown.Item icon={HiCog}>Settings</Dropdown.Item>
            <Dropdown.Item icon={HiCurrencyDollar}>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={HiLogout} onClick={signOutAccount}>Sign out</Dropdown.Item>
          </Dropdown>
        )}
      </div>
    </nav>
  );
};

export default Navbar;