'use client'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Item } from '../model';
import SellerHeader from "../components/seller_header";
import { useRouter } from 'next/navigation'; //says not used, commented for build error
//import { useSearchParams } from 'next/navigation' //says not used, commented for build error
import axios from "axios";
//import { read } from 'fs';//says not used, commented for build error
//import EditItem from '../edit_item/page';

// all WEB traffic using this API instance. You should replace this endpoint with whatever
// you developed for the tutorial and adjust resources as necessary.
const instance = axios.create({
  // baseURL: 'https://22n88dmhz1.execute-api.us-east-1.amazonaws.com/initial',
  baseURL: 'https://81j98spa49.execute-api.us-east-1.amazonaws.com/initial',

});

const SellerPge: React.FC = () => {
  const router = useRouter();
  //const [userData, setUserData] = useState<any>(null);
  const [sellerID, setSellerID] = useState<string | null>(null);
  const [sellerName, setSellerName] = useState<string | null>(null);
  
  const [redraw, forceRedraw] = React.useState(0);
  const [reviewPress, setReviewPress] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [selectedButton, setSelectedButton] = useState('');


  const [fund, setFund] = useState<number>(0);
  const [closeAccountPress] = useState(false);
  //const [closeAccountPress, setCloseAccountPress] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
//Obtain items
  function obtainInactiveItems(setItems: React.Dispatch<React.SetStateAction<Item[]>>) {

    const sellerID = parseInt(localStorage.getItem('sellerID') || '0');
    instance.post('/item_lists', { "sellerID": sellerID })
  
      .then(function (response) {
        const status = response.data.statusCode // changed from let to address build errors
        if (status == 200) {
          const inactiveitemlist: Array<Item> = [] //changed from let to address build errors
          for (const item of response.data.items) { //might be causing build error change let to const
            inactiveitemlist.push(new Item(
              item.itemID, 
              item.itemName, 
              item.itemDescription, 
              item.initialPrice, 
              item.itemImage, 
              item.auctionLength, 
              item.currentPrice, 
              item.startDate, 
              item.endDate, 
              item.soldDate, 
              item.isFrozen, 
              item.winnerBuyer))
          }
          setItems(inactiveitemlist)
          setIsLoading(false);
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }


  function obtainActiveItems(setItems: React.Dispatch<React.SetStateAction<Item[]>>) {
    const sellerID = parseInt(localStorage.getItem('sellerID') || '0');
    instance.post('/active_items', { "sellerID": sellerID })
      .then(function (response) {
        const status = response.data.statusCode
        if (status == 200) {
          const activeitemlist: Array<Item> = []
          for (const item of response.data.items) {
            activeitemlist.push(new Item(item.itemID, item.itemName, item.itemDescription, item.initialPrice, item.itemImage, item.auctionLength, item.currentPrice, item.startDate, item.endDate, item.soldDate, item.isFrozen, item.winnerBuyer))
          }
          setItems(activeitemlist)
          setIsLoading(false);
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  function obtainFailedItem(setItems: React.Dispatch<React.SetStateAction<Item[]>>) {

    const sellerID = parseInt(localStorage.getItem('sellerID') || '0');
    instance.post('/failed_items', { "sellerID": sellerID })
      .then(function (response) {
        const status = response.data.statusCode
        if (status == 200) {
          const faileditemlist: Array<Item> = []
          for (const item of response.data.items) {
            faileditemlist.push(new Item(item.itemID, item.itemName, item.itemDescription, item.initialPrice, item.itemImage, item.auctionLength, item.currentPrice, item.startDate, item.endDate, item.soldDate, item.isFrozen, item.winnerBuyer))
          }
          setItems(faileditemlist)
          setIsLoading(false);
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  function obtainCompletedItem(setItems: React.Dispatch<React.SetStateAction<Item[]>>) {

    const sellerID = parseInt(localStorage.getItem('sellerID') || '0');
    instance.post('/completed_items', { 'sellerID': sellerID })
      .then(function (response) {
        const status = response.data.statusCode
        if (status == 200) {
          const completeditemlist: Array<Item> = []
          for (const item of response.data.items) {
            completeditemlist.push(new Item(
              item.itemID,
              item.itemName,
              item.itemDescription,
              item.initialPrice,
              item.itemImage,
              item.auctionLength,
              item.currentPrice,
              item.startDate,
              item.endDate,
              item.soldDate,
              item.isFrozen,
              item.winnerBuyer,
            ))
          }
          setItems(completeditemlist)
          setIsLoading(false);
        }
      }).catch(function (error) {
        console.log(error)
      })
  }
  
  function obtainArchiveItems(setItems: React.Dispatch<React.SetStateAction<Item[]>>) {
  
    const sellerID = parseInt(localStorage.getItem('sellerID') || '0');
    instance.post('/review_archived_items', { 'sellerID': sellerID })
      .then(function (response) {
        const status = response.data.statusCode
        if (status == 200) {
          const archiveditemlist: Array<Item> = []
          for (const item of response.data.items) {
            archiveditemlist.push(new Item(item.itemID, item.itemName, item.itemDescription, item.initialPrice, item.itemImage, item.auctionLength, item.currentPrice, item.startDate, item.endDate, item.soldDate, item.isFrozen, item.winnerBuyer))
          }
          setItems(archiveditemlist)
          setIsLoading(false);
        }
      }).catch(function (error) {
        console.log(error)
      })
  }
  
  

  useEffect(() => {
    // Get data from localStorage after component mounts
    //const storedUserData = localStorage.getItem('userData');
    const storedSellerID = localStorage.getItem('sellerID');
    const storedFirstName = localStorage.getItem('firstName');
    // const storedFund = localStorage.getItem('fund');

    // if (storedUserData) {
    //     setUserData(JSON.parse(storedUserData));
    // }
    if (storedSellerID) {
      setSellerID(storedSellerID);
    }
    if (storedFirstName) {
      setSellerName(storedFirstName);
    }
    
  }, []);


  // Whenever 'selectedButton' changes (and there are no loaded items) this fetches from AP
  useEffect(() => {
    if (selectedButton === 'inactive') {
      setIsLoading(true)
      setItems([])

      obtainInactiveItems(setItems);
    } else if (selectedButton === 'active') {
      setIsLoading(true)
      setItems([])
      obtainActiveItems(setItems);
    }
    else if (selectedButton === 'failed') {
      setIsLoading(true)
      setItems([])
      obtainFailedItem(setItems);
    }
    else if (selectedButton === 'completed') {
      setIsLoading(true)
      setItems([])
      obtainCompletedItem(setItems);
    }
    else if (selectedButton === 'archived') {
      setIsLoading(true)
      setItems([])
      obtainArchiveItems(setItems);
    }
    // Add more cases if needed for other item types
  }, [selectedButton]);

  const andRefreshDisplay = () => {
    forceRedraw(redraw + 1)
  }

  const handleReviewClick = () => {
    setReviewPress('reviewitems');
    andRefreshDisplay()
  };
  const handleCloseAccount = () => {
    setReviewPress('closeaccount');
    setSelectedButton('')
    andRefreshDisplay()
  };


  function obtainSellerFund() {
    const sellerID = parseInt(localStorage.getItem('sellerID') || '0');
    instance.post('/obtain_sellerFund', { "sellerID": sellerID })
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
    obtainSellerFund();
  }, []);

  const handleAccountClosure = () => {
    console.log("Account closure initiated");
    //const sellerID = parseInt(localStorage.getItem('sellerID') || '0');

    instance.post('/seller_close_account', {
      "sellerID": sellerID
    })
      .then(function (response) {
        if (response.data.statusCode === 200) {
          alert("Your account has been successfully closed.");
          localStorage.clear();
          router.push('/');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //connect Publish button to API
  function PublishItem(itemID: number) {
    instance.post('/publish_item', { "itemID": itemID })
      .then(function (response) {
        const status = response.data.statusCode
        if (status == 200) {
          obtainInactiveItems(setItems)
          alert('Item has been moved to Active Items.');
          andRefreshDisplay()
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  //connect Remove button to API
  function RemoveItem(itemID: number) {
    instance.post('/remove_item', { "itemID": itemID })
      .then(function (response) {
        const status = response.data.statusCode
        if (status == 200) {
          obtainInactiveItems(setItems)
          andRefreshDisplay()

        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  //connect Archive button to API
  function ArchiveItem(itemID: number) {
    instance.post('/archive_item', { "itemID": itemID })
      .then(function (response) {
        const status = response.data.statusCode
        if (status == 200) {
          obtainInactiveItems(setItems)
          alert('Item has been moved to Archived Items.');
          andRefreshDisplay()

        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  //connect Unpublish button to API
  function unPublishItem(itemID: number) {
    instance.post('/unpublish_active_item', { "itemID": itemID })
      .then(function (response) {
        const status = response.data.statusCode
        if (status == 200) {
          obtainActiveItems(setItems)
          alert('Item has been moved to Inactive Items.');
          andRefreshDisplay()
        }
        if (status == 400) {
          obtainActiveItems(setItems)
          alert('Unpublish is not allowed! Item has bid.');
          andRefreshDisplay()
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
  //connect Fulfill button to API
  function FulfillItem(itemID: number) {
    instance.post('/fulfill_item', { "itemID": itemID, "sellerID": sellerID })
      .then(function (response) {
        const status = response.data.statusCode
        if (status == 200) {
          obtainCompletedItem(setItems)
          obtainSellerFund()
          andRefreshDisplay()
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  //Function to request unfreeze item
  function requestUnfreezeItem(itemID: number) {
    instance.post('/request_unfreeze', { "itemID": itemID })
      .then(function (response) {

        const status = response.data.statusCode;
        if (status === 200) {
          alert('Unfreeze request submitted successfully.');
          window.location.reload();  // Refresh the page
        } else {
          alert('Failed to submit unfreeze request. Please try again.');
        }
      })
      .catch(function (error) {
        console.error('Error while requesting unfreeze:', error);
        alert('An error occurred while submitting the unfreeze request.');
      });
  }

  // Table of inactive items
  function InactiveItems() {
    // if "not yet set" then simply show "Loading..."
    // if (items.length == 0) return <div>Loading...</div>;
    if (isLoading) {
      return <div >Loading bids...</div>;
  }
  if (!isLoading && items.length === 0) {
      return <div >No bids found.</div>;
  }
    // Return item-table with items list in each <tr></tr>
    return (
      <table >
        <thead>
          <tr>
            <th className="px-2 py-2 border border-gray-200  text-gray-950 text-left text-sm  font-normal">
              ItemID
            </th>
            <th className="px-2 py-2 border border-gray-200  text-gray-950 text-left text-sm  font-normal">
              Item Status
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Item Name
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Item Description
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Item Image
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm font-normal">
              Initial Price
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Auction Length (day)
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.itemID}>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {item.itemID}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {'inactive'}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {item.itemName}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {item.itemDescription}
              </td>
              {/* <td className="px-2 py-2 border border-gray-200 bg-white text-sm truncate max-w-[200px]">
                {item.itemImage}
              </td> */}
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm truncate max-w-[200px]">
                <img
                  src={item.itemImage}
                  alt="Item"
                  className="max-w-full h-auto"
                  style={{ maxHeight: '100px', objectFit: 'contain' }} // Optional styling to control image size
                />
              </td>

              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {"$" + item.initialPrice}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {item.auctionLength}
              </td>
              <td>
                <Link href={`/seller/edit_item?itemID=${item.itemID}`}>
                  <button className='text-white px-1 py-2 rounded ml-2 mr-1 mt-1 mb-1 bg-blue-700  hover:bg-blue-950' >Edit</button>
                </Link>
                <button className='text-white px-1 py-2 rounded ml-2 mr-1 mt-1 mb-1 bg-blue-700  hover:bg-blue-950' onClick={() => PublishItem(item.itemID)}>Publish</button>
                <button className='text-white px-1 py-2 rounded ml-2 mr-1 mt-1 mb-1 bg-blue-700  hover:bg-blue-950' onClick={() => RemoveItem(item.itemID)}>Remove</button>
                <button className='text-white px-1 py-2 rounded ml-2 mr-1 mt-1 mb-1 bg-blue-700  hover:bg-blue-950' onClick={() => ArchiveItem(item.itemID)}>Archive</button>
              </td>
            </tr>
          ))}</tbody>
      </table>
    )
  }

  //Table of active items
  function ActiveItems() {
    // if "not yet set" then simply show "Loading..."
    //if (items.length == 0) return <div>Loading...</div>;
    if (isLoading) {
      return <div >Loading bids...</div>;
  }
  if (!isLoading && items.length === 0) {
      return <div >No bids found.</div>}
    // Generatet Inactive item table
    return (
      <table>
        <thead>
          <tr>
            <th className="px-2 py-2 border border-gray-200  text-gray-950 text-left text-sm  font-normal">
              ItemID
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Item Name
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Item Description
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
            Item Image
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Iinital Price
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm font-normal">
              Current Price
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Start Date
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              End Date
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
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
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm truncate max-w-[200px]">
                <img
                  src={item.itemImage}
                  alt="Item"
                  className="max-w-full h-auto"
                  style={{ maxHeight: '100px', objectFit: 'contain' }} // Optional styling to control image size
                />
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {'$' + item.initialPrice}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {"$" + item.currentPrice}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {item.startDate}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {item.endDate}
              </td>
              <td>
               <button className={`text-white px-1 py-2 rounded ml-2 mr-1 mt-1 mb-1 ${item.isFrozen
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-700 hover:bg-blue-950'
                  }`}
                  onClick={() => !item.isFrozen && unPublishItem(item.itemID)}
                  disabled={item.isFrozen}>Unpublish</button>
                <button className={`text-white px-1 py-2 rounded ml-2 mr-1 mt-1 mb-1 ${item.isFrozen ?
                  'bg-blue-700 hover:bg-blue-950' : 'bg-gray-500 cursor-not-allowed'}`}
                  onClick={() => item.isFrozen && requestUnfreezeItem(item.itemID)}
                  disabled={!item.isFrozen} > {item.isFrozen ? 'Request Unfreeze' : 'Active'} 
                  </button>
              </td>
            </tr>
          ))}</tbody>
      </table>
    )
  }

  //Table of failed items
  function FailedItems() {
    // if "not yet set" then simply show "Loading..."
    //if (items.length == 0) return <div>Loading...</div>;
    if (isLoading) {
      return <div >Loading bids...</div>;
  }
  if (!isLoading && items.length === 0) {
      return <div >No bids found.</div>}
    // Generate Inactive item table
    return (
      <table>
        <thead>
          <tr>
            <th className="px-2 py-2 border border-gray-200  text-gray-950 text-left text-sm  font-normal">
              ItemID
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Item Name
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Item Description
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Item Image
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm font-normal">
              Set Price
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm font-normal">
              Had Bid?
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              End Date
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
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
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm truncate max-w-[200px]">
                <img
                  src={item.itemImage}
                  alt="Item"
                  className="max-w-full h-auto"
                  style={{ maxHeight: '100px', objectFit: 'contain' }} // Optional styling to control image size
                />
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {"$" + item.initialPrice}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {'No Bid'}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {item.endDate}
              </td>
            </tr>
          ))}</tbody>
      </table>
    )
  }

  //Table of completed items
  function CompletedItems() {
    // if "not yet set" then simply show "Loading..."
    //if (items.length == 0) return <div>Loading...</div>;
    if (isLoading) {
      return <div >Loading bids...</div>;
  }
  if (!isLoading && items.length === 0) {
      return <div >No bids found.</div>}
    // Generatet completed item table
    return (
      <table>
        <thead>
          <tr>
            <th className="px-2 py-2 border border-gray-200  text-gray-950 text-left text-sm  font-normal">
              ItemID
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Item Name
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Item Description
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Item Image
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm font-normal">
              Initial Price
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm font-normal">
              Highest Bid
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm font-normal">
              Buyer ID
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              End Date
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
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
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm truncate max-w-[200px]">
                <img
                  src={item.itemImage}
                  alt="Item"
                  className="max-w-full h-auto"
                  style={{ maxHeight: '100px', objectFit: 'contain' }} // Optional styling to control image size
                />
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {"$" + item.initialPrice}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {"$" + item.currentPrice}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {item.winnerBuyer}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {item.endDate}
              </td>
              <td>
                <button className='text-white px-1 py-2 rounded ml-2 mr-1 mt-1 mb-1 bg-blue-700  hover:bg-blue-950' onClick={() => FulfillItem(item.itemID)}>Fulfill</button>

              </td>
            </tr>
          ))}</tbody>
      </table>
    )
  }

  //Table of archived items
  function ArchivedItems() {
    // if "not yet set" then simply show "Loading..."
    //if (items.length == 0) return <div>Loading...</div>;
    if (isLoading) {
      return <div >Loading bids...</div>;
  }
  if (!isLoading && items.length === 0) {
      return <div >No bids found.</div>}
    // Generatet archived item table
    return (
      <table>
        <thead>
          <tr>
            <th className="px-2 py-2 border border-gray-200  text-gray-950 text-left text-sm  font-normal">
              ItemID
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Item Name
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Item Description
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
              Item Image
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm font-normal">
              Initial Price
            </th>
            
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm font-normal">
              Final Sale Price
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm font-normal">
              Buyer ID
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm font-normal">
              Auction End Date
            </th>
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm font-normal">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
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
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm truncate max-w-[200px]">
                <img
                  src={item.itemImage}
                  alt="Item"
                  className="max-w-full h-auto"
                  style={{ maxHeight: '100px', objectFit: 'contain' }} // Optional styling to control image size
                />
              </td>
              
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {"$" + item.initialPrice}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
              {item.currentPrice === item.initialPrice ? '-' : `$${item.currentPrice}`}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
              {item.winnerBuyer? item.winnerBuyer : '-'}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
              {item.endDate === '0000-00-00'? '-' : item.endDate}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
              {item.currentPrice === item.initialPrice ? 'Archived Inactive Item' : 'Fulfilled Completed Item'}
              </td>
            </tr>
          ))}</tbody>
      </table>
    )
  }


  const renderTable = () => {
    switch (selectedButton) {
      case 'inactive':
        return InactiveItems();
      case 'active':
        return ActiveItems();
      case 'failed':
        return FailedItems();
      case 'completed':
        return CompletedItems();
      case 'archived':
        return ArchivedItems()

    }
  };

  return (
    <div>
      <div>
        <SellerHeader />
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Seller Dashboard Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold">Seller Dashboard</h1>
            <p className="text-gray-700">Welcome, {sellerName}</p>
            <p className="text-gray-700">Seller ID: {sellerID}</p>
          </div>

          <div className="text-center">
            <label className="text-xl font-semibold">Funds:</label>
            <span className="text-xl font-bold ml-2">${fund}</span>
          </div>
        </div>

        {/* Centered Buttons for Add Item, Review Item, and Close Account */}
        <div className="flex justify-center space-x-20 mb-6">
          {/* Add Item */}
          <Link href={`/seller/add_items?sellerID=${sellerID}`}>
            <button className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
            >
              Add Item</button>
          </Link>
          {/* Review Items */}
          <button
            onClick={handleReviewClick}
            className={`px-6 py-3 rounded ${reviewPress === 'reviewitems' ? 'bg-blue-500' : 'bg-gray-500'} text-white hover:bg-gray-600`}
          >
            Review Item
          </button>
          {/* Close Account */}
          <button
            onClick={() => handleCloseAccount()}
            className={`px-6 py-3 rounded ${closeAccountPress ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
          >
            Close Account
          </button>
        </div>

        {/* Remaining Seller Page Content */}
        <div className="flex flex-col items-center">
          {/* Placeholder for additional content below buttons */}
          <p className="text-center text-gray-500">Welcome to your seller dashboard! Use the buttons above to manage your items or account.</p>

          {(reviewPress == 'closeaccount') && (
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


          {/* New Buttons Below When Review Mode is Active */}
          {(reviewPress == 'reviewitems') && (
            <div className="flex justify-center space-x-10 mt-4">
              <button
                onClick={() => setSelectedButton('inactive')}
                className={`px-4 py-2 rounded ${selectedButton === 'inactive' ? 'bg-blue-500' : 'bg-gray-300'} text-black hover:bg-gray-400`}
              >
                Inactive Items
              </button>
              <button
                onClick={() => setSelectedButton('active')}
                className={`px-4 py-2 rounded ${selectedButton === 'active' ? 'bg-blue-500' : 'bg-gray-300'} text-black hover:bg-gray-400`}
              >Active Items</button>
              <button
                onClick={() => setSelectedButton('failed')}
                className={`px-4 py-2 rounded ${selectedButton === 'failed' ? 'bg-blue-500' : 'bg-gray-300'} text-black hover:bg-gray-400`}
              >Failed Items</button>
              <button
                onClick={() => setSelectedButton('completed')}
                className={`px-4 py-2 rounded ${selectedButton === 'completed' ? 'bg-blue-500' : 'bg-gray-300'} text-black hover:bg-gray-400`}
              >Completed Items</button>
              <button
                onClick={() => setSelectedButton('archived')}
                className={`px-4 py-2 rounded ${selectedButton === 'archived' ? 'bg-blue-500' : 'bg-gray-300'} text-black hover:bg-gray-400`}
              >Archived Items</button>
            </div>
          )}



        </div>

        {/* Render the selected table */}
        <div className="table-container overflow-x-auto w-full">
          {renderTable()}
        </div>

      </div>
    </div>
  );
};

export default SellerPge;