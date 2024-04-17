import React from 'react'

export default function ProfilePage ({params}: any) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-5 gap-y-2">
        <h1>{params.id}</h1>
    </div>
  )
}
