'use client'
//import Link from 'next/link';

import React from 'react';

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-blue-300 text-white p-3 items-center">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold text-blue-800">Prolog Group | Admin</div>
        </div>
    </header>
  );
};

export default AdminHeader;
