import React from 'react'
import Navbar from '../Navbar'

import { useState, useMemo } from 'react'
import { Button, Label, TextInput, Card, Toast } from "flowbite-react";
import { FaRegEye, FaRegEyeSlash, FaGoogle } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { HiExclamation } from "react-icons/hi";
import { Link, useNavigate } from 'react-router-dom'
import logo from "../../assets/logo.svg";
import { auth, googleProvider } from "../../firebase/firebase"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({ email: '', password: '' })

    const [ShowToast, setShowToast] = useState(false)
    const [message, setMessage] = useState("")

    const navigate = useNavigate()

    const signInWithEmailPassword = async (e) => {
        try {
            const user = await signInWithEmailAndPassword(auth, form.email, form.password)
            console.log("User logged in:");
            setMessage("User logged in successfully");
            setShowToast(true);
            navigate('/')
        } catch (error) {
            console.error("Error signing up:", error);
            setMessage(error.message);
            setShowToast(true);
        }
    }

    const signInWithGoogle = async () => {
        try {
            const user = await signInWithPopup(auth, googleProvider)
            console.log("User logged in");
            setMessage("User logged in successfully")
            setShowToast(true)
            navigate('/')
        }
        catch (error) {
            console.error("Error signing up:", error);
            setMessage(error.message)
            setShowToast(true)
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        console.log(form)
        console.log(auth?.currentUser.email)
    }

  return (
    <div className=''>
        <header>
            <Navbar/>
        </header>
        <main className='min-h-[93vh] flex flex-row w-full'>
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
            <div className=' w-full flex justify-center items-center md:w-1/2'>
                <Card className="p-8 w-full max-w-md bg-slate-100">

                    <div className='flex items-center justify-center my-2'>
                        <img src={logo} alt="logo" width={150} height={150} className='' />
                    </div>

                    <div>
                        <h1 className='text-center text-xl text-slate-900 font-semibold my-2'>Sign in</h1>
                    </div>

                    <form className="flex max-w-md flex-col gap-4">

                        <div>
                            <div className="mb-2 block">
                            <Label htmlFor="email1" value="Your email" />
                            </div>
                            <TextInput id="email1" type="email" placeholder="example@email.com" required name='email' onChange={(e)=>{handleChange(e)}} />
                        </div>

                        <div>
                            <div className="mb-2 block">
                            <Label htmlFor="password1" value="Your password" />
                            </div>
                            <div>
                                <TextInput id="password1" type={showPassword ? 'text' : 'password'} required name='password' onChange={(e)=>{handleChange(e)}} />
                                <span className='flex flex-row gap-2 items-center my-2 text-sm font-semibold cursor-pointer' onClick={()=>{setShowPassword(!showPassword)}}>Show Password { showPassword ? <FaRegEye width={20} height={20} /> : <FaRegEyeSlash width={15} height={15} /> } </span>
                            </div>
                        </div>

                        <div className='w-[100%]'>
                            <Button pill color="dark" className='my-2 w-full' onClick={()=>{signInWithEmailPassword()}}>Sign In</Button>
                            <span className=' block text-center text-sm font-medium'> OR</span>
                            <Button pill  color="light" className='my-2 w-full ' onClick={()=>{ signInWithGoogle() }}>Sign in with Google <FaGoogle size={20} className='mx-2 text-slate-900' /> </Button>
                            <Link to='/register'><span className='block text-sm font-normal text-center cursor-pointer mt-4 hover:underline'>Don't have an account yet ? <span className=' text-blue-800'>Register Here !</span></span></Link>
                        </div>

                    </form>
                </Card>
            </div>
        </main>
    </div>
  )
}

export default LoginPage