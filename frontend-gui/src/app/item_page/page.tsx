'use client'


import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Suspense } from 'react'
import axios from 'axios'
import { Item } from '../model'
import Header from "../components/header";

const instance = axios.create({
    baseURL: 'https://81j98spa49.execute-api.us-east-1.amazonaws.com/initial',
})


const ItemPageContent = () => {
    const [item, setItem] = useState<Item | undefined>(undefined);
    const [itemID, setItemID] = useState<string | null>(null);
    const [isFrozen, setIsFrozen] = useState(false)

    const searchParams = useSearchParams();
    useEffect(() => {
        const id = searchParams.get('itemID');
        setItemID(id);
    }, [searchParams]);
    //const itemID = searchParams.get('itemID');
    // const [redraw, forceRedraw] = useState(0)


    function obtainItem() {
        instance.post('/customer_view_item', { "itemID": itemID })
            .then(function (response) {
                const status = response.data.statusCode
                if (status == 200) {
                    const item = response.data.item[0]
                    const newItem = new Item(
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
                        item.winnerBuyer
                    )
                    setItem(newItem)
                    if (item.isFrozen == true) {
                        setIsFrozen(item.isFrozen)}
                    console.log(item)
                }

            })
            .catch(function (error) {
                console.log(error)
            })
    }
    useEffect(() => {
        if (itemID) {
            obtainItem();
        }
    }, [itemID]);

    const Loading = () => (
        <div className="text-center">Loading item...</div>
    );
    return (

        <div>
            <div>
                <Header />
            </div>
            <h1 className="font-bold font-sans text-black mt-4 ml-4"><Link href="/"> &lt; back to home page</Link></h1>
            <h1 className="text-2xl text-center font-bold font-sans text-black mt-4">ItemID: {itemID} </h1>
            {isFrozen && (
                <div className="frozen_message text-center ">
                    <label className="frozen_message text-red-500 text-2xl font-bold">{"This item is Frozen. No bids are allowed."}
                        </label>

                </div>
            )}
            <Suspense fallback={<Loading />}>
                {item ? (
                    <div>
                        <div className='imageContainer mt-10' style={{
                            display: "flex",
                            justifyContent: "center",
                        }}>
                            <div
                                style={{
                                    width: "50%",
                                    height: "300px",
                                    border: "1px solid #ccc",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "20px",
                                }}
                            >
                                <img
                                    src={item.itemImage}
                                    alt="Item Image"
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "100%",
                                        objectFit: "cover",  // Makes the image cover the container without distortion
                                    }}
                                />
                            </div>
                        </div>
                        <div className='itemDetails mt-4 ml-10'>
                            <h1 className='text-2xl font-bold capitalize'>{item.itemName}</h1>
                            <p>
                                <strong>Current Price:</strong> ${item.currentPrice}</p>
                            <p>
                                <strong>Start Date:</strong> {item.startDate}
                            </p>
                            <p>
                                <strong>End Date:</strong> {item.endDate}
                            </p>
                            <p>
                                <strong>Description:</strong> {item.itemDescription}</p>
                        </div>
                        <div className='bids mt-4 ml-10'>
                            Please <Link href='/login' style={{ textDecoration: "underline" }}>Login</Link> or <Link href='/create_account' style={{ textDecoration: "underline" }}>Create an account</Link> to view the bidding history of this item
                        </div>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </Suspense>
        </div>



    )
}

const ItemPage = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ItemPageContent />
        </Suspense>
    );
};

export default ItemPage;