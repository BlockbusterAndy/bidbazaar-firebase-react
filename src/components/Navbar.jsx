import React from "react";
import logo from "../assets/logo.svg";
import { useState, useEffect } from "react";
import { Dropdown, Button, Avatar } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { HiCog, HiCurrencyDollar, HiLogout, HiViewGrid } from "react-icons/hi";

const Navbar = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserData({
          photo: auth.currentUser.photoURL,
          name: auth.currentUser.displayName,
          email: auth.currentUser.email,
        });
      } else {
        setIsLoggedIn(false);
      }
    });
    return unsubscribe;
  }, [isLoggedIn]);

  const signOutAccount = async () => {
    try {
      await signOut(auth);
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
        { !isLoggedIn && (
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
        { isLoggedIn && (
          <Dropdown color="dark" label={ userData.name ? userData.name : userData.email } >
            <Dropdown.Header>
              <Avatar img={userData.photo} alt="avatar of user" rounded />
              <div className="my-2">
                <span className={ userData.name ? "block text-sm" : 'hidden' }>{userData.name}</span>
                <span className="block truncate text-sm font-medium">{userData.email}</span>
              </div>
            </Dropdown.Header>
            <Dropdown.Item icon={HiViewGrid} onClick={()=>{navigate("/profile")}} >Profile</Dropdown.Item>
            <Dropdown.Item icon={HiCog}>Settings</Dropdown.Item>
            <Dropdown.Item icon={HiCurrencyDollar}>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={HiLogout} onClick={()=>{ signOutAccount() }} >Sign out</Dropdown.Item>
          </Dropdown>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
