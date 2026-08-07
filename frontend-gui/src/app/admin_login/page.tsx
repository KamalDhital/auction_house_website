'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import Header from "../components/header";

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const [inputAdminID, setInputAdminID] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const adminID = 'admin'
  const password = 'prolog24'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting login with:', { inputAdminID, inputPassword });
    if (inputAdminID === adminID && inputPassword === password) {
      router.push('/dashboard_admin');
    } else {
      alert('Invalid admin credentials');
    }
  }

  return (
    <div >
      <div>
      <Header/>
      </div>
      <form onSubmit={handleSubmit} className='max-w-md mx-auto auto bg-white p-6 shadow-md rounded border-gray-500'>
        <h1 className='text-lg font-bold text-blue-800 mb-7 text-center font-sans'> Admin Login </h1>
        <div className='mb-6 flex place-items-center'>
          <label htmlFor="adminID" className='mr-2 mt-2 text-gray-800 font-sans font-normal items-center'> AdminID:</label>
          <input 
            id='adminID'
            value={inputAdminID}
            onChange={(e) => setInputAdminID(e.target.value)}
            type="text"
            required
            placeholder='Enter AdminID'
            className='mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
        </div>
        <div className='mb-6 flex items-center'>
          <label htmlFor="password" className='mr-2 mt-2 text-gray-800 font-sans font-normal'> Password:</label>
          <input 
            id='password'
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            type="password"
            required
            placeholder='Enter Password'
            className='mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:outline focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
        </div>
        <button type='submit' className='w-full bg-blue-500 text-white py-2 rounded-lg font-sans font-bold hover:bg-blue-900'>
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
