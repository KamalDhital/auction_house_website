'use client'
import React, { ChangeEvent, FormEvent, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://81j98spa49.execute-api.us-east-1.amazonaws.com/initial',
});


const AddItem: React.FC = () => {

  const [redraw, forceRedraw] = useState(0)
  const andRefreshDisplay = () => {
    forceRedraw(redraw + 1)
  }

  const [sellerID, setSellerID] = useState<string | null>(null);

  const searchParams = useSearchParams();
  useEffect(() => {
    const id = searchParams.get('sellerID');
    setSellerID(id);
  }, [searchParams]);

  const initialFormData = {
    itemName: '',
    itemDescription: '',
    //itemImage: '',
    initialPrice: '',
    auctionLength: '',

  };


  const [formData, setFormData] = useState(initialFormData);
  const [itemImage, setItemImage] = useState<string | null>(null); // Store image as base64
  const [fileName, setFileName] = useState<string | null>(null); // Store name of image
  const fileInputRef = useRef<HTMLInputElement>(null);

  //const [responseMessage, setResponseMessage] = useState('');
  const responseMessage = '';
  const router = useRouter();

  // Handle input changes for text fields
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // Handle image input change
  const [imageUrl, setImageUrl] = useState("");
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


  async function AddItem() {
    try {
      // Step 1: Upload image to S3
      const uploadResponse = await instance.post('/seller_upload_image_to_s3', {
        itemImage,
        fileName,
      });

      if (uploadResponse.data.statusCode !== 200) {
        throw new Error('Image upload failed');
      }

      // Step 2: Save the filename from the response
      const uploadedFileName = uploadResponse.data.filename;


      // Step 3: Add item to the database
      const addItemResponse = await instance.post('/seller_add_item', {
        itemName: formData.itemName,
        itemDescription: formData.itemDescription,
        fileName: uploadedFileName,
        initialPrice: formData.initialPrice,
        auctionLength: formData.auctionLength,
        sellerID,
      });

      if (addItemResponse.data.statusCode === 200) {
        alert('Item added successfully!');
        router.refresh(); // Refresh or redirect as needed
        handleReset();
      } else {
        throw new Error('Failed to add item');
      }
    } catch (error) {
      console.error(error);
    }
  }




  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    AddItem();
    andRefreshDisplay()

  };

  // Function to reset the form data
  const handleReset = () => {
    setFormData(initialFormData);
    setItemImage(null);
    setImageUrl("");
    setFileName(null); 
    // Clear file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input field
    }
    andRefreshDisplay()
  };



  return (
    <div>
      <button
        className='text-white text-sm bg-blue-400 rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-4 ml-4'
        onClick={() => router.back()}
      >
        &lt;Go Back to Seller Dashboard
      </button>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">Seller ID: {sellerID}</h1>
        <h1 className="text-2xl font-bold mb-4">Add New Item</h1>

        <label>Name: </label>
        <input
          type="text"
          name="itemName"
          placeholder="Item Name"
          value={formData.itemName}
          onChange={handleChange}
          required
          className="border rounded-md p-2 w-full mb-4"
        />
        <label>Description: </label>
        <textarea
          name="itemDescription"
          placeholder="Item Description"
          value={formData.itemDescription}
          onChange={handleChange}
          required
          className="border rounded-md p-2 w-full mb-4"
        />
        <label>Price: </label>
        <input
          type="number"
          name="initialPrice"
          placeholder="Initial Price"
          value={formData.initialPrice}
          onChange={handleChange}
          required
          min="1"
          className="border rounded-md p-2 w-full mb-4"
        />
        <label>Auction length: </label>
        <input
          type="number"
          name="auctionLength"
          placeholder="Auction Length (days)"
          value={formData.auctionLength}
          onChange={handleChange}
          required
          min="1"
          className="border rounded-md p-2 w-full mb-4"
        />
        <div>
          <label>Upload a image: </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            ref={fileInputRef}
            required
            className="border rounded-md p-2 w-full mb-4"
          />{imageUrl && (
            <div>
              <img src={imageUrl} alt="Selected file" className="border rounded-md" />
            </div>
          )}
        </div>
        <div className="flex space-x-4 mt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">
            Submit
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          >
            Clear All
          </button>
        </div>
      </form>
      {responseMessage && <p className="mt-4 text-center text-green-600">{responseMessage}</p>}
    </div>




  );
};


const addItemPage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AddItem />
    </Suspense>
  );
};

export default addItemPage;

