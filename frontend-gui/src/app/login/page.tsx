'use client'

import React from 'react';
import { useState} from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from "../components/header";
import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand,
  GetUserCommand, 
  AuthFlowType
 } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({
  region: 'us-east-1'
});

const instance = axios.create({
  //baseURL: 'https://22n88dmhz1.execute-api.us-east-1.amazonaws.com/initial',
  baseURL: 'https://81j98spa49.execute-api.us-east-1.amazonaws.com/initial',
});

const Login: React.FC = () => {
  const router = useRouter();
  const [FormData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'seller' as 'buyer' | 'seller'
  });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...FormData, [e.target.name]: e.target.value });
    };
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { email, password, userType } = FormData;

        try {
          // Cognito auth first
          const params = {
            AuthFlow: 'USER_PASSWORD_AUTH' as AuthFlowType,
            ClientId: '2o97ajra356tn3c54ho8vb4ggr',
            AuthParameters: {
              USERNAME: email,
              PASSWORD: password,
            }
          };
        
          const command = new InitiateAuthCommand(params);
          const cognitoResponse = await client.send(command);

          // Get user attributes to verify userType
          const getUserParams = {
            AccessToken: cognitoResponse.AuthenticationResult?.AccessToken
          };
        
          const getUserCommand = new GetUserCommand(getUserParams);
          const userResponse = await client.send(getUserCommand);
          const userTypeAttribute = userResponse.UserAttributes?.find(attr => attr.Name === 'custom:userType');
        
          if (userTypeAttribute?.Value !== userType) {
            throw new Error(`Invalid login attempt. This account is registered as a ${userTypeAttribute?.Value}`);
          }

          if (userType === 'seller') {
            const loginResponse = await instance.post('/login_account', { 
              email: FormData.email,
              password: FormData.password 
            });

            if (loginResponse.data.statusCode === 200) {
              const { sellerID, firstName, fund, isActive } = loginResponse.data.result;
              if (isActive === 0) {
                alert('This account has been deactivated');
                return;
            }
              const dbResponse = await instance.post('/item_lists', { 
                sellerID: sellerID,
                email: FormData.email 
              });

              const userData = dbResponse.data;
              localStorage.setItem('userData', JSON.stringify(userData));
              localStorage.setItem('sellerID', sellerID);
              localStorage.setItem('firstName', firstName);
              localStorage.setItem('fund', fund.toString());            
              router.push('/seller');
            }
          } 
          if (userType === 'buyer') {
            const loginResponse = await instance.post('/login_account_buyer', { 
              email: FormData.email,
              password: FormData.password,
              userType: 'buyer'
            });

            console.log('Full response structure:', loginResponse.data.result);

            if (loginResponse.data.statusCode === 200) {
              console.log("Login response data:", loginResponse.data.result);
              const { buyerID, firstName, fund, isActive } = loginResponse.data.result;

              if (isActive === 0) {
                alert('This account has been deactivated');
                return;
              }
              const dbResponse = await instance.post('/item_lists', {
                buyerID: buyerID,
                email: FormData.email
              });
              const userData = dbResponse.data;
              localStorage.setItem('userData', JSON.stringify(userData));
              localStorage.setItem('buyerID', buyerID);
              localStorage.setItem('firstName', firstName);
              localStorage.setItem('fund', fund.toString());
              // const result = loginResponse.data.result;
              
              // // Set default values if properties are missing
              // localStorage.setItem('buyerID', result.buyerID || '');
              // localStorage.setItem('firstName', result.firstName || '');
              // localStorage.setItem('fund', result.fund ? result.fund.toString() : '0');
              // localStorage.setItem('userType', 'buyer');
              router.push('/buyer');
            }
          }
          // if (userType === 'admin') {
          //   // Admin authentication logic
          //   if (email === 'admin' && password === 'prolog24') {
          //     localStorage.setItem('userType', 'admin');
          //     router.push('/admin');
          //   }
          // }
        } catch (error) {
          console.error('Login error:', error);
        }
      };  return (
    <div >
      <div>
      <Header/>
      </div>
      <form onSubmit={handleSubmit} className='max-w-md mx-auto auto bg-white p-6 shadow-md rounded border-gray-500'>
        <h2 className='text-lg font-bold text-blue-800 mb-7 text-center font-sans'>Login</h2>

        <div className='mb-3'>
          <label className="text-gray-800">User Type</label>
          <select
            name="userType"
            value={FormData.userType}
            onChange={handleChange}
            className="mt-2 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <div className='mb-3'>
          <label htmlFor="email" className="text-gray-800">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={FormData.email}
            onChange={handleChange}
            required
            placeholder="Enter Email"
            className="mt-2 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div className='mb-3'>
          <label htmlFor="password" className="text-gray-800">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={FormData.password}
            onChange={handleChange}
            required
            placeholder="Enter Password"
            className="mt-2 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-3xl hover:bg-indigo-600 focus:outline-none">
          Login
        </button>

      </form>
    </div>
  );
};

export default Login;

