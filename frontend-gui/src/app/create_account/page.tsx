'use client'
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import Link from 'next/link';
import axios from 'axios';
import Header from "../components/header";

const instance = axios.create({
  baseURL: 'https://81j98spa49.execute-api.us-east-1.amazonaws.com/initial',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000
});

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'seller' | 'buyer'
}

const Register: React.FC = () => {
  const router = useRouter();
  const [FormDta, setFormDta] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'seller'
  });

  const client = new CognitoIdentityProviderClient({
    region: 'us-east-1',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormDta({ ...FormDta, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = {
      ClientId: '2o97ajra356tn3c54ho8vb4ggr',
      Username: FormDta.email,
      Password: FormDta.password,
      UserAttributes: [
        { Name: 'email', Value: FormDta.email },
        { Name: 'given_name', Value: FormDta.firstName },
        { Name: 'custom:userType', Value: FormDta.userType }
      ],
      DesiredDeliveryMediums: ["EMAIL"]
    };
  
  try {
    // Cognito signup remains the same
    const command = new SignUpCommand(params);
    await client.send(command);

    // Log request details
    console.log('Making request to:', FormDta.userType === 'buyer' ? '/create_account_buyer' : '/create_account');
    
    // Make the API call
    const endpoint = FormDta.userType === 'buyer' ? '/create_account_buyer' : '/create_account';
    const payload = {
      firstName: FormDta.firstName,
      lastName: FormDta.lastName,
      email: FormDta.email,
      password: FormDta.password,
      userType: FormDta.userType
    };

    console.log('Request payload:', payload);
    const dbResponse = await instance.post(endpoint, payload);
    console.log('Response:', dbResponse);

    if (dbResponse.status === 200) {
      localStorage.setItem('pendingUserType', FormDta.userType);
      localStorage.setItem('pendingEmail', FormDta.email);
      router.push('/verify-email');
    }
  } catch (error) {
    console.log('Failed endpoint:', FormDta.userType === 'buyer' ? '/create_account_buyer' : '/create_account');
    console.log('Failed payload:', FormDta);
    console.error('Error details:', error);
  }
};

  return (
    <div >
      <div>
      <Header/>
      </div>
      <form onSubmit={handleSubmit} className='max-w-md mx-auto auto bg-white p-6 shadow-md rounded border-gray-500'>
        <h2 className='text-lg font-bold text-blue-800 mb-7 text-center font-sans'>Create Account</h2>



        <div className='mb-3 flex'>
          <label className=" text-gray-800 mt-3 mr-2 font-sans">Type</label>
          <select name="userType" value={FormDta.userType} onChange={handleChange} className="mt-2 p-2 border rounded w-full">
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
          </select>
        </div>

        <div className='flex'>
          <label htmlFor="firstName" className='mr-3 text-gray-800 font-sans font-normal mt-2'>First Name</label>
          <input type="text" id='firstName' name='firstName' value={FormDta.firstName} onChange={handleChange} required placeholder='Enter First Name' className='mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm'/>
        </div>

        <div className='flex'>
          <label htmlFor="lastName" className='mr-3 text-gray-800 font-sans font-normal mt-2'>Last Name</label>
          <input type="text" id='lastName' name='lastName' value={FormDta.lastName} onChange={handleChange} required placeholder='Enter Last Name' className='mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm'/>
        </div>

        <div className='mb-3 flex items-center'>
          <label htmlFor="email" className='mr-3 text-gray-800 font-sans font-normal mt-2'>Email</label>
          <input type="email" id='email' name='email' value={FormDta.email} onChange={handleChange} required placeholder='Enter Email' className='mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm'/>
        </div>

        <div className='mb-6 flex place-items-center'>
          <label htmlFor="password" className='mr-3 text-gray-800 font-sans font-normal mt-2'>Password</label>
          <input id='password' type="password" required placeholder='Enter Password' name='password' value={FormDta.password} onChange={handleChange} className='mt-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm'/>
        </div>

        <button type='submit' className='mb-2 w-full bg-indigo-500 text-white py-2 px-4 rounded-3xl hover:bg-indigo-600 focus:outline-none'>
          Create Account
        </button>

        <p className='text-black text-center text-sm mb-2'>
          Already Have An Account?
          <Link className='text-blue-800 text-m justify-center px-2 hover:text-black font-bold hover:underline ' href={"/login"}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

