'use client'
import Link from 'next/link';

import React from 'react';

const SellerHeader: React.FC = () => {
  return (
    <header className="bg-blue-300 text-white p-3 items-center">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold text-blue-800">Prolog Group | Seller</div>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/"               className=" hover:text-violet-800 font-sans font-bold px-3 mr-0 border-gray-500 border-2 bg-slate-600 rounded-md">Log out</Link></li>
            
            
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default SellerHeader;
