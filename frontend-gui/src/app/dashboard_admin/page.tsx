
'use client'
import axios from "axios";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Item } from '../model';
import AdminHeader from "../components/admin_header";

const instance = axios.create({
    baseURL: 'https://81j98spa49.execute-api.us-east-1.amazonaws.com/initial',
});

function obtainItems(setItems: React.Dispatch<React.SetStateAction<Item[]>>) {
    instance.get('/admin_list_item') // Fetch all items (both frozen and active)
        .then((response) => {
            console.log('Full API Response:', response); // Log full response for debugging

            if (response.data && response.data.statusCode === 200 && Array.isArray(response.data.items)) {
                const allItems: Item[] = response.data.items.map((item: Item) => ({
                    ...item,
                    isFrozen: item.isFrozen || false, // Ensure isFrozen defaults to false
                    isArchived: item.isArchived || false, // Ensure isArchived defaults to false
                }));
                setItems(allItems);
            } else {
                console.error('Invalid API response:', response.data || 'No response body');
                setItems([]); // Reset items to empty if response is invalid
            }
        })
        .catch((error) => {
            console.error('Error fetching items:', error);
            setItems([]); // Reset items to empty if there's an error
        });
}

// Function to toggle freeze status
function toggleFreezeStatus(itemID: number, isFrozen: boolean, setItems: React.Dispatch<React.SetStateAction<Item[]>>) {
    const updatedStatus = !isFrozen;

    instance.post('/item_freeze_unfreeze', {
        itemID: itemID,
        action: updatedStatus ? 'freeze' : 'unfreeze'
    })
        .then(function (response) {
            const status = response.data.statusCode;
            if (status === 200) {
                // Update the local state by modifying the freeze status of the item
                setItems(prevItems => prevItems.map(item =>
                    item.itemID === itemID ? { ...item, isFrozen: updatedStatus } : item
                ));
                window.location.reload();   // Refresh the page
            } else {
                console.log('Failed to update freeze status');
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

export default function Home() {
    const [redraw] = useState<number>(0); // Used to trigger re-fetching of data
    const [items, setItems] = useState<Item[]>([]);
    const [filter, setFilter] = useState<string>('All'); // State for filter selection
    const [adminFund, setAdminFund] = useState<number>(0);
    const router = useRouter();

    useEffect(() => {
        obtainItems(setItems); // Fetch items when redraw is updated
    }, [redraw]);

    useEffect(() => {
        obtainAdminFund();
    }, []);

    const logout = () => {
        localStorage.removeItem('isLoggedIn'); // Clear session
        router.push('/admin_login'); // Redirect to admin login page
    };

    function obtainAdminFund() {
        instance.post('/admin_fund')
            .then((response) => {
                console.log("Admin fund response:", response.data);
                if (response.data.statusCode === 200) {
                    const fundValue = JSON.parse(response.data.body).fund;
                    setAdminFund(fundValue);
                }
            })
            .catch((error) => {
                console.log('Error fetching admin fund:', error);
            });
    }

    // Filter items based on the selected filter option
    const filteredItems = items.filter((item) => {
        if (filter === 'All') return true; // Show all items
        if (filter === 'Frozen') return item.isFrozen; // Show only frozen items
        if (filter === 'Active') return !item.isFrozen && !item.isArchived; // Show only unfrozen (active) items
        if (filter === 'Archived') return item.isArchived; // Show only archived items
    });

    return (
        <div className="ml-4 mr-6 mt-1">
            <AdminHeader />
            <div className="flex items-center justify-between mb-4 mt-1">
                <h1 className="text-xl font-bold ml-11 mt-1">Admin Dashboard</h1>
                <div className="text-xl font-semibold mr-4">
                    Auction House Fund: ${adminFund}
                </div>
                <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1 rounded"
                >
                    Logout
                </button>
            </div>
            

            <Link href={'/reports'}>
                <button className='text-white font-sans px-1 py-2 rounded ml-2 mr-1 mt-1 mb-1 bg-blue-700 hover:bg-blue-950'>
                    Click to Report Page
                </button>
            </Link>
            <h1 className="text-xl font-bold mb-4 ml-11 mt-1">Manage Freeze and Unfreeze Item Table</h1>
            {/* Filter Dropdown */}
            <div className="mb-4 ml-11">
                <label htmlFor="filter" className="mr-2">Filter Items:</label>
                <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded"
                >
                    <option value="All">All</option>
                    <option value="Frozen">Frozen</option>
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                </select>
            </div>

            <table className="min-w-full border-collapse bg-white border border-gray-300">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-1 border border-gray-300">Item ID</th>
                        <th className="px-4 py-1 border border-gray-300">Item Name</th>
                        <th className="px-1 py-1 border border-gray-300">Description</th>
                        <th className="px-1 py-1 border border-gray-300">Price</th>
                        <th className="px-0 py-1 border border-gray-300">Auction Length</th>
                        <th className="px-1 py-1 border border-gray-300">Status</th>
                        <th className="px-4 py-1 border border-gray-300">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredItems.map((item) => (
                        <tr key={item.itemID} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                            <td className="px-4 py-1 border border-gray-300">{item.itemID}</td>
                            <td className="px-4 py-1 border border-gray-300">{item.itemName}</td>
                            <td className="px-1 py-1 border border-gray-300">{item.itemDescription}</td>
                            <td className="px-1 py-1 border border-gray-300">{item.currentPrice}</td>
                            <td className="px-1 py-1 border border-gray-300">{item.auctionLength}</td>
                            <td className="px-1 py-1 border border-gray-300">
                                {item.isArchived ? "Archived" : item.isFrozen ? "Frozen" : "Active"}
                            </td>
                            <td className="px-4 py-1 border border-gray-300">
                                {item.isArchived ? (
                                    <span className="text-gray-500">Archived</span>
                                ) : item.isFrozen ? (
                                    <button
                                        onClick={() => toggleFreezeStatus(item.itemID, item.isFrozen, setItems)}
                                        className="px-1 py-0 rounded font-semibold text-white bg-red-500 hover:bg-red-600"
                                    >
                                        Unfreeze
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => toggleFreezeStatus(item.itemID, item.isFrozen, setItems)}
                                        className="px-1 py-0 rounded font-semibold text-white bg-blue-500 hover:bg-blue-600"
                                    >
                                        Freeze
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
