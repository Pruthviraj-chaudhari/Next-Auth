'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function Login() {

  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: ""
  })

  const[loading, setLoading] = useState(false);
  const[buttonDisabled, setButtonDisabled] = useState(true);
  
  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onLogin = async() => {
    setLoading(true);
    try {
      const response = await axios.post("/api/users/login", user);
      console.log("Login success: ", response.data);
      router.push('/profile');
    } catch (error:any) {
      console.log("Login failed");
      toast.error(error.message);
    }
    setLoading(false);
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-5 gap-y-2">
      <h1>{loading ? "Processing" : "Login"}</h1>
      <hr />
      <label htmlFor="email">email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg md-4 focus:outline-none focus:border-gray-600 text-black"
        id="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="email"
        type="email"
      />
      <hr />
      <label htmlFor="password">password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg md-4 focus:outline-none focus:border-gray-600 text-black"
        id="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="password"
        type="password"
      />
      <button
        onClick={onLogin}
        className={
          "p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 " +
          (buttonDisabled
            ? "cursor-not-allowed"
            : "bg-white hover:bg-gray-100 text-black")
        }
        disabled={buttonDisabled}
      >
        Login
      </button>
    </div>
  )
}