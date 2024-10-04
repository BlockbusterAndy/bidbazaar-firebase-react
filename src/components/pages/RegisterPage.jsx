import React, { useState } from "react";
import Navbar from "../Navbar";
import { Button, Label, TextInput, Card, Toast } from "flowbite-react";
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, } from "firebase/auth";
import logo from "../../assets/logo.svg";
import { HiExclamation } from "react-icons/hi";
import { doc, setDoc, getDoc } from "firebase/firestore";

const RegisterPage = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ fName:"", lName:"", email: "", password: "" });
  const [ShowToast, setShowToast] = useState(false)
  const [message, setMessage] = useState("")

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signUpWithEmailPassword = async () => {
    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password).then((result) => {
        const user = result.user;
        const userRef = doc(db, "users", user.uid);
        setDoc(userRef, {
          fName: form.fName,
          lName: form.lName,
          email: form.email,
          createdAt: new Date().toISOString(),
        });
        console.log(`User document created for ${user.uid}`);
        navigate("/");
      });
    } catch (error) {
      console.error("Error signing up:", error);
      setMessage(error.message);
      setShowToast(true);
    }
  };

  const signUpWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const userRef = doc(db, "users", user.uid);
        //check if user already exists
        const userDoc = await getDoc(userRef);
        //create user document if it doesn't exist
        if (!userDoc.exists()) {
          await setDoc(userRef, {
            fName: user.displayName.split(' ')[0] || "",
            lName: user.displayName.split(' ')[1] || "",
            email: user.email,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString(),
          });
          console.log(`User document created for ${user.uid}`);
        } else {
          console.log(`User document already exists for ${user.uid}`);
        }
        navigate("/");
    } catch (error) {
        console.error("Error signing in:", error);
        setMessage(error.message);
        setShowToast(true);
    }
  };

  
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main className="min-h-[93vh] flex flex-row w-full">
        {ShowToast && (
        <Toast className="z-50 absolute right-5 top-20">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
            <HiExclamation className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">{message}</div>
          <Toast.Toggle />
        </Toast>)
        }
        <div className='hidden md:flex flex-col w-1/2 bg-gray-900 text-white p-8 '>
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold mb-4">Welcome to Bid Bazaar</h1>
              <p className="text-lg mb-8">Join us and start bidding on amazing items today!</p>
                <ul className="space-y-4">
                  <li className="flex items-center">
                  <FaCheck className="w-6 h-6 mr-2" />
                  Wide variety of items
                  </li>
                  <li className="flex items-center">
                  <FaCheck className="w-6 h-6 mr-2" />
                  Secure transactions
                  </li>
                  <li className="flex items-center">
                  <FaCheck className="w-6 h-6 mr-2" />
                  24/7 customer support
                  </li>
              </ul>
            </div>
          </div>
        <div className="w-full flex justify-center items-center md:w-1/2">
          <Card className="p-8 w-full max-w-md bg-slate-100">
            <div className="flex items-center justify-center my-2">
              <img src={logo} alt="logo" width={150} height={150} />
            </div>
            <div>
              <h1 className='text-center text-xl text-slate-900 font-semibold my-2'>Sign up</h1>
            </div>
            <form className="flex max-w-md flex-col gap-4">
              <div>
                <Label htmlFor="name1" value="First name" />
                <TextInput
                  id="name1"
                  type="text"
                  placeholder="John"
                  required
                  name="fName"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="name2" value="Last name" />
                <TextInput
                  id="name2"
                  type="text"
                  placeholder="Doe"
                  required
                  name="lName"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email1" value="Your email" />
                <TextInput
                  id="email1"
                  type="email"
                  placeholder="example@email.com"
                  required
                  name="email"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="password1" value="Your password" />
                <TextInput
                  id="password1"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="********"
                  name="password"
                  onChange={handleChange}
                />
                <span
                  className="flex flex-row gap-2 items-center my-2 text-sm font-semibold cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  Show Password{" "}
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </span>
              </div>

              <div className="w-[100%]">
                <Button
                  pill
                  color="dark"
                  className="my-2 w-full"
                  onClick={signUpWithEmailPassword}
                >
                  Sign Up
                </Button>
                <span className="block text-center text-sm font-medium">OR</span>
                <Button pill color="light" className="my-2 w-full" onClick={()=>{ signUpWithGoogle() }}>
                  Sign up with Google <FaGoogle size={20} className="mx-2 text-slate-900" />
                </Button>
                <Link to="/login">
                  <span className="block text-sm font-normal text-center cursor-pointer mt-4 hover:underline">
                    Already have an account? <span className="text-blue-800">Login</span>
                  </span>
                </Link>
              </div>

            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
