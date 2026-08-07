'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ActiveBids, Purchases } from '../model';
import axios from 'axios';
import BuyerHeader from "../components/buyer_header";

const instance = axios.create({
    baseURL: 'https://81j98spa49.execute-api.us-east-1.amazonaws.com/initial',
});

const BuyerPage: React.FC = () => {
    const router = useRouter();
    const [redraw, forceRedraw] = useState(0)  

    const [buyerID, setBuyerID] = useState<string | null>(null);
    const [buyerName, setBuyerName] = useState<string | null>(null);
    //fundAmount stores the input from add fund input-box:
    const [fundAmount, setFundAmount] = useState<string>('');
    //fund stores the buyer's total fund, retrieved from database:
    const [fund, setFund] = useState<string>('');
    const [activeBids, setActiveBids] = useState<ActiveBids[]>([]);
    const [allPurchases, setPurchases] = useState<Purchases[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedButton, setSelectedButton] = useState('');


    const andRefreshDisplay = () => {
        forceRedraw(redraw+1)
    }

    useEffect(() => {
        const storedBuyerID = localStorage.getItem('buyerID');
        const storedFirstName = localStorage.getItem('firstName');

        if (storedBuyerID) {
            setBuyerID(storedBuyerID);
        }
        if (storedFirstName) {
            setBuyerName(storedFirstName);
        }

    }, []);


    function obtainBuyerFund() {
        const buyerID = parseInt(localStorage.getItem('buyerID') || '0');
        instance.post('/obtain_buyerFund', { "buyerID": buyerID })
            .then(function (response) {
                const status = response.data.statusCode
                if (status == 200) {
                    setFund(response.data.fund)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    useEffect(() => {
        obtainBuyerFund();
    }, []);


    const handleAccountClosure = () => {
        const buyerID = parseInt(localStorage.getItem('buyerID') || '0');
        interface ApiResponse {
            data: {
              statusCode: number;
              message?: string;
              error?: string;
            };
            status: number;
          }
        
        console.log('Sending close account request for buyerID:', buyerID);
        
        instance.post('/close_buyer_account', JSON.stringify({
            "buyerID": buyerID,
            "isActive": 0
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res: ApiResponse) => {
            console.log('Server response:', res);
            
            // Check the HTTP status code instead of response data
            if (res.status === 200) {
                alert("Your account has been successfully closed.");
                localStorage.clear();
                router.push('/');
            } else {
                console.log('Closure failed with HTTP status:', res.status);
                alert("Failed to close account. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Error details:", error.response || error);
            alert("An error occurred while closing your account.");
        });
    };

    const handleFundSubmit = () => {
        const amount = parseInt(fundAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        instance.post('/add_fund_buyer', { "amount": amount, "buyerID": buyerID })
            .then(function (response) {
                const status = response.data.statusCode
                if (status == 200) {
                    obtainBuyerFund()
                    alert('Your available fund has been updated!');
                    setFundAmount('')
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    };

    function RetrieveActiveBids() {
        instance.post('/buyer_review_active_bids', { "buyerID": buyerID })
            .then(function (response) {
                const status = response.data.statusCode
                if (status == 200) {
                    const allActiveBids: Array<ActiveBids> = []
                    for (const item of response.data.items) { //might be causing build error change let to const
                        allActiveBids.push(new ActiveBids(item.itemID, item.itemName, item.itemDescription, item.currentPrice, item.bidPrice, item.endDate))
                    }
                    setActiveBids(allActiveBids)
                    setIsLoading(false);
                } 
                if (status == 400 ) {
                    setIsLoading(false);
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    function RetrievePurchases() {
        instance.post('/buyer_review_purchases', { "buyerID": buyerID })
            .then(function (response) {
                const status = response.data.statusCode
                if (status == 200) {
                    const allPurchases: Array<Purchases> = []
                    for (const item of response.data.items) {
                        allPurchases.push(new Purchases(item.itemID, item.itemName, item.itemDescription, item.currentPrice, item.bidPrice, item.endDate))
                    }
                    setPurchases(allPurchases)
                    setIsLoading(false);
                } 
                if (status == 400) {
                    setIsLoading(false);
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    

    function activeBidsTable() {
        // if "not yet set" then simply show "Loading..."
        //if (bids.length == 0) return <div>Loading bid history...</div>;
        if (isLoading) {
            return <div >Loading items...</div>;
        }
        if (!isLoading && activeBids.length === 0) {
            return <div >No active bids were found.</div>;
        }
        // Generatet archived item table
        return (
            <table className="text-center">
                <thead>
                    <tr>
                        <th className="px-2 py-2 border border-gray-200  text-gray-950 text-left text-sm  font-normal">
                            Item ID
                        </th>
                        <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
                            Name
                        </th>
                        <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
                            Description
                        </th>
                        <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
                            Highest Bid
                        </th>
                        <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
                            My Bid
                        </th>
                        <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
                            End Date
                        </th>
                        <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {activeBids.map(item => (
                        <tr key={item.itemID}>
                            <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                                {item.itemID}
                            </td>
                            <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                                {item.itemName}
                            </td>
                            <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                                {item.itemDescription}
                            </td>
                            <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                                {item.currentPrice}
                            </td>
                            <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                                {item.bidPrice}
                            </td>
                            <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                                {item.endDate}
                            </td>
                            <td>
                                <button type="button" onClick={() => router.push(`/buyerhome/buyer_viewitem?itemID=${item.itemID}`)}
                                    className='text-white px-1 py-2 rounded ml-2 mr-1 mt-1 mb-1 bg-blue-700  hover:bg-blue-950'>
                                    View Item
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        )
    }

    function purchasesTable() {
        if (isLoading) {
            return <div>Loading items...</div>;
        }
        if (!isLoading && allPurchases.length === 0) {
            return <div>No purchases were found.</div>;
        }
        return (
            <table className="text-center">
                <thead>
                    <tr>
                        <th className="px-2 py-2 border border-gray-200 text-gray-950 text-left text-sm font-normal">
                            Item ID
                        </th>
                        <th className="px-2 py-2 border border-gray-200 text-gray-950 text-left text-sm font-normal">
                            Name
                        </th>
                        <th className="px-2 py-2 border border-gray-200 text-gray-950 text-left text-sm font-normal">
                            Description
                        </th>
                        <th className="px-2 py-2 border border-gray-200 text-gray-950 text-left text-sm font-normal">
                            Purchase Price
                        </th>
                        <th className="px-2 py-2 border border-gray-200 text-gray-950 text-left text-sm font-normal">
                            Purchase Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {allPurchases.map(item => (
                        <tr key={item.itemID}>
                            <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                                {item.itemID}
                            </td>
                            <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                                {item.itemName}
                            </td>
                            <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                                {item.itemDescription}
                            </td>
                            <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                                {item.currentPrice}
                            </td>
                            <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                                {item.endDate}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }
    

    function handleActiveBidsButton() {
        setSelectedButton("activebids")
        RetrieveActiveBids()
        andRefreshDisplay()
    }
    function handleShowFund() {
        setSelectedButton("showfund")
        andRefreshDisplay()
    }
    function handleCloseAccount() {
        setSelectedButton("closeaccount")
        andRefreshDisplay()
    }
    function handleViewPurchases() {
        setSelectedButton("viewpurchases")
        RetrievePurchases()
        andRefreshDisplay()
    }


    return (
        <div> <div>
            <BuyerHeader />
        </div >
            <div className="p-9">

                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <div>
                        <h1 className="text-xl font-bold">Buyer Dashboard</h1>
                        <p className="text-gray-700">Welcome, {buyerName}</p>
                        <p className="text-gray-700">Buyer ID: {buyerID}</p>
                    </div>

                    <div className="text-center">
                        <label className="text-xl font-semibold">Available Funds:</label>
                        <span className="text-xl font-bold ml-2">${fund}</span>
                    </div>
                </div>

                <div className="flex justify-center space-x-20 mb-6">
                    <button
                        onClick={() => handleShowFund()}
                        className={`px-6 py-3 rounded ${(selectedButton == "showfund") ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
                    >
                        Add Fund
                    </button>
                    <button
                        onClick={() => handleActiveBidsButton()}
                        className={`px-6 py-3 rounded ${(selectedButton == "activebids") ? 'bg-blue-500' : 'bg-gray-500'} text-white hover:bg-gray-600`}
                    >
                        Review Active Bids
                    </button>
                    <button
                        onClick={() => handleViewPurchases()}
                        className={`px-6 py-3 rounded ${(selectedButton == "viewpurchases") ? 'bg-blue-500' : 'bg-gray-500'} text-white hover:bg-gray-600`}
                    >
                        Review Purchases</button>
                    <button
                        onClick={() => handleCloseAccount()}
                        className={`px-6 py-3 rounded ${(selectedButton == "closeaccount") ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
                    >
                        Close Account
                    </button>
                </div>

                <div className="flex flex-col items-center">
                    <p className="text-center text-gray-500 mb-4">Welcome to your Buyer dashboard! Use the buttons above to manage your items or account.</p>

                    {(selectedButton == "showfund") && (
                        <div className="flex items-center space-x-2 mt-4">
                            <input
                                type="number"
                                value={fundAmount}
                                onChange={(e) => setFundAmount(e.target.value)}
                                className="border rounded px-2 py-1"
                                placeholder="Enter amount"
                            />
                            <button
                                onClick={handleFundSubmit}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Submit
                            </button>
                        </div>
                    )}

                    {(selectedButton == "activebids") && (
                        <div className="table-container overflow-x-auto w-full">
                            {activeBidsTable()}
                        </div>
                    )}

                    {(selectedButton == "viewpurchases") && (
                        <div className="table-container overflow-x-auto w-full">
                            {purchasesTable()}
                        </div>
                    )}


                    {(selectedButton == "closeaccount") && (
                        <div className="mt-4 text-center">
                            <p className="text-red-600 font-semibold">
                                Are you sure you want to close your account? If you do you will no longer be able to sign into this account.
                            </p>
                            <button
                                onClick={handleAccountClosure}
                                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Confirm Account Closure
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuyerPage;