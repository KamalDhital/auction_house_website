'use client';
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react'
import axios from 'axios';
import { Item } from '../../model';


const instance = axios.create({
  baseURL: 'https://81j98spa49.execute-api.us-east-1.amazonaws.com/initial',
});


const EditItemContent = () => {

  const [redraw, forceRedraw] = useState(0)
  const searchParams = useSearchParams();
  const itemID = searchParams.get('itemID');

  const [itemName, setItemName] = useState('')
  const [itemDescription, setItemDescription] = useState('')
  const [initialPrice, setInitialPrice] = useState(0)
  const [auctionLength, setAuctionLength] = useState(0)
  const [imageonfile, setImageonfile] = useState('')
  const [item, setItem] = useState<Item | undefined>(undefined);
  const [itemImage, setItemImage] = useState<string | null>(null); // Store image as base64
  const [fileName, setFileName] = useState<string | null>(null); // Store name of image

  const router = useRouter()

  useEffect(() => {
    if (itemID) {
      const obtainItem = async () => {
        try {
          const response = await instance.post('/customer_view_item', { itemID });
          const fetchedItem = response.data.item[0]; // Assuming item is in array
          setItem(new Item(
            fetchedItem.itemID,
            fetchedItem.itemName,
            fetchedItem.itemDescription,
            fetchedItem.initialPrice,
            fetchedItem.itemImage,
            fetchedItem.auctionLength,
            fetchedItem.currentPrice,
            fetchedItem.startDate,
            fetchedItem.endDate,
            fetchedItem.soldDate,
            fetchedItem.isFrozen,
            fetchedItem.winnerBuyer
          ));
        } catch (error) {
          console.error('Error fetching item:', error);
        }
      };
      obtainItem();
    }
  }, [itemID]);


  const andRefreshDisplay = () => {
    forceRedraw(redraw + 1)
  }


  useEffect(() => {
    if (item) {
      setItemName(item.itemName || '');
      setItemDescription(item.itemDescription || '');
      setInitialPrice(item.initialPrice || 0);
      setAuctionLength(item.auctionLength || 0);
      const baseUrl = "https://auctionhouse.s3.us-east-1.amazonaws.com/images/";
      setImageonfile((item.itemImage).replace(baseUrl, "") || '');
    }
  }, [item]);




  const handleItemName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemName(e.target.value); // Update the state with the new value
    andRefreshDisplay()
  };
  const handleItemDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemDescription(e.target.value); // Update the state with the new value
    andRefreshDisplay()
  };
  const handleInitalPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialPrice(parseFloat(e.target.value)); // Update the state with the new value
    andRefreshDisplay()
  };
  const handleAuctionLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuctionLength(parseFloat(e.target.value)); // Update the state with the new value
    andRefreshDisplay()
  };

  async function EditItem() {
    try {
      if (isChecked) {
        // Step 1: Upload image to S3
        const uploadResponse = await instance.post('/seller_upload_image_to_s3', {
          itemImage,
          fileName,
        });

        if (uploadResponse.data.statusCode !== 200) {
          throw new Error('Image upload failed');
        }

        // Step 2: Save the filename from the response
        const newImage = uploadResponse.data.filename

        // Step 3: Add item to the database
        const addItemResponse = await instance.post('/seller_edit_item', {
          'itemName': itemName,
          'itemDescription': itemDescription,
          'fileName': newImage,
          'initialPrice': initialPrice,
          'auctionLength': auctionLength,
          'itemID': itemID
        })

        if (addItemResponse.data.statusCode === 200) {
          alert('Change saved successfully!');
          router.refresh(); // Refresh or redirect as needed
          // handleReset();
        } else {
          throw new Error('Failed to save change');
        }
      } else {


        // Step 3: Add item to the database
        const addItemResponse = await instance.post('/seller_edit_item', {
          'itemName': itemName,
          'itemDescription': itemDescription,
          'fileName': imageonfile,
          'initialPrice': initialPrice,
          'auctionLength': auctionLength,
          'itemID': itemID
        })

        if (addItemResponse.data.statusCode === 200) {
          alert('Change saved successfully!');
          router.refresh(); // Refresh or redirect as needed
          // handleReset();
        } else {
          throw new Error('Failed to save change');
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const [isChecked, setIsChecked] = useState(false)
  const handleCheckboxChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setIsChecked(event.target.checked);
  };
  const [imageUrl, setImageUrl] = useState("");
  // Handle image input change
  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file); // Generate a temporary URL for preview
      setImageUrl(url);
      setFileName(file.name)

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Extract the base64 data without the prefix (e.g., "data:image/jpeg;base64,")
        const base64String = (reader.result as string).split(',')[1];
        setItemImage(base64String);

      };
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    EditItem();
    andRefreshDisplay()
  };

  // Function to reset the form data
  // const handleReset = () => {
  //   if (item) {
  //     setItemName(item.itemName || ''); // Reset to the original item name
  //     setItemDescription(item.itemDescription || ''); // Reset other fields if needed
  //     setInitialPrice(item.initialPrice || 0);
  //     setAuctionLength(item.auctionLength || 0);
  //     const baseUrl = "https://auctionhouse.s3.us-east-1.amazonaws.com/images/";
  //     setImageonfile((item.itemImage).replace(baseUrl, "") || '');
  //     setIsChecked(false)
  //     setImageUrl("");
  //   }
  //   setItemImage(null);
  // };


  return (
    <div>
      <button
        className='text-white text-sm bg-blue-400 rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-4 ml-4'
        onClick={() => router.back()}
      >
        &lt;Go Back to Seller Dashboard
      </button>


      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Item</h1>
        <h1 className="text-2xl font-bold mb-4">Item ID: {itemID}</h1>
        <label>Name: </label>
        <input
          type="text"
          name="itemName"
          value={itemName}
          onChange={handleItemName}
          required
          className="border rounded-md p-2 w-full mb-4"
        />
        <label>Description: </label>
        <input
          name="itemDescription"
          value={itemDescription}
          onChange={handleItemDescription}
          required
          className="border rounded-md p-2 w-full mb-4"
        />
        <label>Price: </label>
        <input
          type="number"
          name="initialPrice"

          value={initialPrice}
          onChange={handleInitalPrice}
          required
          min="1"
          className="border rounded-md p-2 w-full mb-4"
        />
        <label>Auction length: </label>
        <input
          type="number"
          name="auctionLength"

          value={auctionLength}
          onChange={handleAuctionLength}
          required
          min="1"
          className="border rounded-md p-2 w-full mb-4"
        />
        {/* <img
          src={item?.itemImage}
          alt="Item"
          className="max-w-full h-auto"
          style={{ maxHeight: '100px', objectFit: 'contain' }} // Optional styling to control image size
        /> */}
        <label className='upload image'>
          <input type="checkbox"
            name="myCheckbox"
            checked={isChecked}
            onChange={handleCheckboxChange} />
          Upload a new image
          {isChecked && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              required
              className="border rounded-md p-2 w-full mb-4"
            />
          )}
          {imageUrl && (
            <div>
              <img src={imageUrl} alt="Selected file" className="border rounded-md" />
            </div>
          )}

        </label>
        <div className="flex space-x-4 mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">
            Save
          </button>
          {/* <button
            type="button"
            onClick={handleReset}
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          >
            Reset
          </button> */}
        </div>
      </form>


    </div>




  );
};

//export default EditItem;

export default function EditItem() {
  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <EditItemContent />
    </Suspense>
  );
}
