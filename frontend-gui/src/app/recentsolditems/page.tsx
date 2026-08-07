'use client'                              // directive to clarify client-side

import axios from "axios";
import React, { useState, useEffect, useCallback } from 'react';
import { Item } from '../model';
import { useRouter } from 'next/navigation';
import BuyerHeader from "../components/buyer_header";

const instance = axios.create({
  //baseURL: 'https://22n88dmhz1.execute-api.us-east-1.amazonaws.com/initial',
  baseURL: 'https://81j98spa49.execute-api.us-east-1.amazonaws.com/initial',

});



export default function RecentSold() {
  //const [redraw, forceRedraw] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const router = useRouter()

  function obtainItems(setItems: React.Dispatch<React.SetStateAction<Item[]>>) {
    instance.get('/recently_sold_items')
  
      .then(function (response) {
        const status = response.data.statusCode // changed from let to address build errors
        if (status == 200) {
          const allActiveitemlist: Array<Item> = [] //changed from let to address build errors
          for (const item of response.data.items) { //might be causing build error change let to const
            allActiveitemlist.push(new Item(item.itemID, item.itemName, item.itemDescription, item.initialPrice, item.itemImage, item.auctionLength, item.currentPrice, item.startDate, item.endDate, item.soldDate, item.isFrozen, item.winnerBuyer))
          }
          setItems(allActiveitemlist)
          setIsLoading(false);
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  useEffect(() => {
    if (items.length == 0) {
      obtainItems(setItems)

    }
  }, [])

  console.log("items:", items)
  // const andRefreshDisplay = () => {
  //   forceRedraw(redraw + 1)
  // }

  //Sort-item reference: https://github.com/TomDoesTech/React-Sortable-Table/blob/main/src/components/SortableTable.tsx
  type Data = typeof items
  type Attribute = keyof Data[0]
  type SortOrder = "ascn" | "desc"

  function sortItem(key: Attribute, reverse: boolean) {
    const sortedData = items.sort((a, b) => {
      return a[key] > b[key] ? 1 : -1;
    });
    if (reverse) {
      return sortedData.reverse();
    }
    return sortedData;
  }

  //Table of active items
  function RecentSoldItems() {

    const [sortKey, setSortKey] = useState<Attribute>("itemID");
    const [sortOrder, setSortOrder] = useState<SortOrder>("ascn");

    const headers: { key: Attribute, label: string }[] = [
      { key: "itemID", label: "Item ID" },
      { key: "itemName", label: "Item Name" },
      { key: "currentPrice", label: "Sold Price" },
      { key: "startDate", label: "Start Date" },
      { key: "endDate", label: "End Date" },
    ];

    const sortedItems = useCallback(() => sortItem(sortKey, sortOrder === 'desc'), [sortKey, sortOrder])


    function handleSorting(key: Attribute) {
      setSortOrder(sortOrder === "ascn" ? "desc" : "ascn")
      setSortKey(key)
    }
    function chosen(key: Attribute): string {
      return sortKey === key && sortOrder === "desc" ? "sort-button sort-reverse" : "sort-button"
    }

    //obtainAllActiveItems(setItems)
    if (isLoading) {
      return <div >Loading items...</div>;
    }
    if (!isLoading && items.length === 0) {
      return <div >No recent sold items were found.</div>;
    }
    // Generatet all active item table
    return (
      <table className="table" id="itemtable">
        <thead>
          <tr>
            {headers.map((row) => {
              return (<th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal" key={row.key}>
                {row.label}{" "}
                <button className={chosen(row.key)} onClick={() => handleSorting(row.key)}> ▲ </button>
              </th>)
            })}
            <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedItems().map(item => (
            <tr key={item.itemID}>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {item.itemID}
              </td>
              <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                {item.itemName}
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
                <button type="button" onClick={() => router.push(`/recentsolditems/viewitem?itemID=${item.itemID}`)}
                  className='text-white px-1 py-2 rounded ml-2 mr-1 mt-1 mb-1 bg-blue-700  hover:bg-blue-950'>
                  View Item
                </button>
              </td>
            </tr>
          ))}</tbody>
      </table >
    )
  }

  //search keywords reference: https://www.w3schools.com/howto/howto_js_filter_table.asp
  function handleSearch() {
    let tdName, tdPrice, i, txtValue, priceValue;
    const input = document.getElementById("searchinput") as HTMLInputElement | null;

    if (!input) {
      console.error("Search input element not found.");
      return;
    }
    // const input = document.getElementById("searchinput");
    const filter = input.value.toUpperCase();
    console.log("search input value: " + filter)

    // Safely get the checkbox element and check if it's checked
    const priceCheckbox = document.getElementsByName("myCheckbox")[0] as HTMLInputElement | undefined;
    const isPriceChecked = priceCheckbox ? priceCheckbox.checked : false;

    // Safely get the min and max price input elements
    const minPriceInput = document.getElementsByName("minprice")[0] as HTMLInputElement | undefined;
    const maxPriceInput = document.getElementsByName("maxprice")[0] as HTMLInputElement | undefined;

    // Extract values from inputs if they exist and provide defaults
    const minPrice = minPriceInput ? parseFloat(minPriceInput.value) || null : null;
    const maxPrice = maxPriceInput ? parseFloat(maxPriceInput.value) || null : null;

    console.log("Price range: Min = " + minPrice + ", Max = " + maxPrice);

    const table = document.getElementById("itemtable");
    if (!table) {
      console.error("Table element not found.");
      return; // Stop execution if table is not found
    }

    const tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      tdName = tr[i].getElementsByTagName("td")[1]; //[1] is column of item name
      tdPrice = tr[i].getElementsByTagName("td")[2]; // [2] is Item price column

      if (tdName && tdPrice) {
        txtValue = tdName.textContent || tdName.innerText;
        priceValue = tdPrice.textContent || tdPrice.innerText;
        priceValue = parseFloat(priceValue.replace(/[$]/g, ""));// Remove the "$" symbol , then parse as a float. /g (globe) flag -> replace all occurences.

        // Check keyword match and price range
        const keywordMatch = txtValue.toUpperCase().indexOf(filter) > -1; //-1 if filter is not found in txtValue, meaning no match
        const priceMatch = !isPriceChecked || (minPrice === null || priceValue >= minPrice) && (maxPrice === null || priceValue <= maxPrice);

        if (keywordMatch && priceMatch) {
          tr[i].style.display = ""; // Show the row
        } else {
          tr[i].style.display = "none"; // Hide the row
        }
      }
    }
  }

  function handleReset() {
    const searchInput = document.getElementById("searchinput") as HTMLInputElement | null;
    const minPriceInput = document.getElementsByName("minprice")[0] as HTMLInputElement | undefined;
    const maxPriceInput = document.getElementsByName("maxprice")[0] as HTMLInputElement | undefined;
    const priceCheckbox = document.getElementsByName("myCheckbox")[0] as HTMLInputElement | undefined;

    // Check if the elements exist before accessing their values
    if (searchInput) {
      searchInput.value = "";
    }

    if (minPriceInput) {
      minPriceInput.value = "";
    }

    if (maxPriceInput) {
      maxPriceInput.value = "";
    }

    if (priceCheckbox) {
      priceCheckbox.checked = false;
    }
    handleSearch();
  }

  return (

    <div >
      <div>
        <BuyerHeader />
      </div>

      <h1 className="text-2xl text-center font-bold font-sans text-black mr-4"> Recently Sold Items</h1>

      <div className='search'>
        <label className='enterKeywords'>
          Enter keywords: <input type="text" id="searchinput"
            placeholder="Enter Keywords" className="inputbox" name="keywords" />
          {/* reference - https://react.dev/reference/react-dom/components/input#input */}
        </label>
        <label className='priceRange'>
          <input type="checkbox" name="myCheckbox" /> Show items priced from $ <input className="inputbox1" name="minprice" placeholder="Min" /> to $ <input className="inputbox1" name="maxprice" placeholder="Max" />
        </label>
        <div className='searchButton'><button className="button searchbutton mr-5" onClick={() => handleSearch()}>Search</button>
          <button className="button searchbutton" onClick={() => handleReset()}>Reset Search</button></div>

      </div>
      <hr />

      <div className="table-container">
        <RecentSoldItems />
      </div>
    </div>

  )
}

