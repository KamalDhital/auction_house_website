
'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import AdminHeader from '../components/admin_header';

// Axios instance for API Gateway
const instance = axios.create({
  baseURL: 'https://81j98spa49.execute-api.us-east-1.amazonaws.com/initial',
});
interface ForensicReport {
  bidAmount: number;
  suspiciousActivity: string;
  itemID: number;
  itemName: string;
  buyerFirstName: string; 
  buyerLastName: string;
  sellerFirstName: string;
  sellerLastName: string;
  bidPrice: number;
  bidDate: string;
}
interface AuctionHouseReport {
  tradeID: number;
  income: string;
  date: string; 
  itemID: number;
  itemPrice: number;
  sellerID: string;
  buyerID: string;
}

const Reportpage = () => {
  const [forensicReport, setForensicReport] = useState<ForensicReport[]>([]);
  const [auctionReport, setAuctionReport] = useState<AuctionHouseReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'forensic' | 'auction' | null>(null);
  const router = useRouter();

  // Function to Refresh the Reports Page
  const refreshReports = () => {
    setForensicReport([]); // Clear forensic data
    setAuctionReport([]); // Clear auction data
    setError(null); // Clear any previous errors
    setCurrentView(null); // Reset view
  };

  // Function to Fetch Forensics Report
  const fetchForensicsReport = () => {
    refreshReports(); // Reset state

    instance
      .get('/forensics_report')
      .then((response) => {
        console.log('Forensics Report Raw Data:', response.data);

        // Parse the response body if necessary
        const data = typeof response.data.body === 'string'
          ? JSON.parse(response.data.body)
          : response.data.body;

        console.log('Parsed Forensics Report Data:', data);

        setForensicReport(data);
        setAuctionReport([]);
        setError(null);
        setCurrentView('forensic');
      })
      .catch(() => {
        setError('Failed to fetch forensic report.');
      });
  };

  // Function to Fetch Auction House Report
  const fetchAuctionHouseReport = () => {
    refreshReports(); // Reset state

    instance
      .get('/auction_report')
      .then((response) => {
        console.log('Auction Report Raw Data:', response.data);

        // Parse the response body if necessary
        const data = typeof response.data.body === 'string'
          ? JSON.parse(response.data.body)
          : response.data.body;

        console.log('Parsed Auction Report Data:', data);

        setAuctionReport(data);
        setForensicReport([]);
        setError(null);
        setCurrentView('auction');
      })
      .catch(() => {
        setError('Failed to fetch auction house report.');
      });
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn'); // Clear session
    router.push('/admin_login'); // Redirect to admin login page
  };

  // Return portion
  return (
    <div className="ml-4 mr-6 mt-2">
      <AdminHeader />
      <div className="flex items-center justify-between mb-4 mt-1">
        <button
          className="text-white text-sm bg-blue-400 rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-4 ml-4"
          onClick={() => router.back()}
        >
          &lt;Go Back to Admin Main Page
        </button>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Reports Page</h1>

      {/* Buttons */}
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md mr-4"
          onClick={fetchForensicsReport}
        >
          Generate Forensics Report
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={fetchAuctionHouseReport}
        >
          Generate Auction House Report
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Forensics Report Table */}
      {currentView === 'forensic' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Forensics Report</h2>
          <table className="min-w-full border-collapse bg-white border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Item ID</th>
                <th className="px-4 py-2 border">Item Name</th>
                <th className="px-4 py-2 border">Seller Name</th>
                <th className="px-4 py-2 border">Buyer Name</th>
                <th className="px-4 py-2 border">Suspicious Activity</th>
                <th className="px-4 py-2 border">Bid Amount</th>
                <th className="px-4 py-2 border">Bid Date</th>
              </tr>
            </thead>
            <tbody>
              {forensicReport && forensicReport.length > 0 ? (
                forensicReport.map((entry, index) => (
                  <tr key={`${entry.itemID}-${index}`}>
                    <td className="px-4 py-2 border">{entry.itemID}</td>
                    <td className="px-4 py-2 border">{entry.itemName}</td>
                    <td className="px-4 py-2 border">{`${entry.sellerFirstName} ${entry.sellerLastName}`}</td>
                    <td className="px-4 py-2 border">{`${entry.buyerFirstName} ${entry.buyerLastName}`}</td>
                    <td className="px-4 py-2 border">{entry.suspiciousActivity ? entry.suspiciousActivity : 'None'}</td>
                    <td className="px-4 py-2 border">${entry.bidAmount}</td>
                    <td className="px-4 py-2 border">{new Date(entry.bidDate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-2 text-center border">
                    No forensic data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Auction House Report Table */}
      {/* {currentView === 'auction' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Auction House Report</h2>
          <table className="min-w-full border-collapse bg-white border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Item ID</th>
                <th className="px-4 py-2 border">Item Name</th>
                <th className="px-4 py-2 border">Seller Name</th>
                <th className="px-4 py-2 border">Buyer Name</th>
                <th className="px-4 py-2 border">Bid Amount</th>
                <th className="px-4 py-2 border">Bid Date</th>
              </tr>
            </thead>
            <tbody>
              {auctionReport && auctionReport.length > 0 ? (
                auctionReport.map((entry, index) => (
                  <tr key={`${entry.itemID}-${index}`}>
                    <td className="px-4 py-2 border">{entry.itemID}</td>
                    <td className="px-4 py-2 border">{entry.itemName}</td>
                    <td className="px-4 py-2 border">{`${entry.sellerFirstName} ${entry.sellerLastName}`}</td>
                    <td className="px-4 py-2 border">{`${entry.buyerFirstName} ${entry.buyerLastName}`}</td>
                    <td className="px-4 py-2 border"> ${entry.bidAmount}</td>
                    <td className="px-4 py-2 border">{new Date(entry.bidDate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-2 text-center border">
                    No auction data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )} */}
      {currentView === 'auction' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Auction House Report</h2>
          <table className="min-w-full border-collapse bg-white border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Trade ID</th>
                <th className="px-4 py-2 border">Auction House Earned</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Item ID</th>
                <th className="px-4 py-2 border">Item Price</th>
                <th className="px-4 py-2 border">Seller ID</th>
                <th className="px-4 py-2 border">Buyer ID</th>
              </tr>
            </thead>
            <tbody>
              {auctionReport && auctionReport.length > 0 ? (
                auctionReport.map((entry, index) => (
                  <tr key={`${entry.itemID}-${index}`}>
                    <td className="px-4 py-2 border">{entry.tradeID}</td>
                    <td className="px-4 py-2 border">${entry.income}</td>
                    <td className="px-4 py-2 border">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">{entry.itemID}</td>
                    <td className="px-4 py-2 border"> ${entry.itemPrice}</td>
                    <td className="px-4 py-2 border">{entry.sellerID}</td>
                    <td className="px-4 py-2 border">{entry.buyerID}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-2 text-center border">
                    No auction data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reportpage;