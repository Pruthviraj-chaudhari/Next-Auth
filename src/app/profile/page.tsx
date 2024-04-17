'use client'

import axios from 'axios'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

export default function ProfilePage() {

  const router = useRouter();

  const [data, setData] = useState(null);

  const getProfile = async() => {
    try {
      const response = await axios.get("/api/users/me");
      setData(response.data.data._id);
    } catch (error:any) {
      console.log(error.message)
      toast.error(error.message)
    }
  }

  const logout = async()=>{
    try {
      await axios.get("/api/users/logout");
      console.log("logout successfully")
      toast.success("Logout success");
      router.push("/login");
    }catch (error:any) {
      console.log(error.message)
      toast.error(error.message)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-5">
      <h1>Profile page</h1>
      <hr />
      <h2>{data === null ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}</h2>
      <button
      onClick={getProfile}
      className='p-2 bg-green-600 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'>
        Get Data
      </button>
      <button
      onClick={logout}
      className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'>
        Logout
      </button>
    </div>
  )
}
