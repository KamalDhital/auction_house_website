'use client'


import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Suspense } from 'react'
import axios from 'axios'
import { Item, Bid } from "../../model"
import BuyerHeader from "../../components/buyer_header";

const instance = axios.create({
    baseURL: 'https://81j98spa49.execute-api.us-east-1.amazonaws.com/initial',
})


const RecentSoldItemPageContent = () => {
    const [item, setItem] = useState<Item | undefined>(undefined);
    const [itemID, setItemID] = useState<string | null>(null);
    const [bids, setBids] = useState<Bid[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    //const [redraw, forceRedraw] = useState(0);

    const searchParams = useSearchParams();
    useEffect(() => {
        const id = searchParams.get('itemID');
        setItemID(id);
    }, [searchParams]);
    //const itemID = searchParams.get('itemID');
    // const [redraw, forceRedraw] = useState(0)


    function obtainItemBids(setBids: React.Dispatch<React.SetStateAction<Bid[]>>) {

        instance.post('/bid_list', { "itemID": itemID })
            .then(function (response) {
                const status = response.data.statusCode
                if (status == 200) {

                    const bidlist: Array<Bid> = []
                    for (const bid of response.data.bids) {
                        bidlist.push(new Bid(bid.bidID, bid.buyerID, bid.bidPrice, bid.bidDate))
                    }
                    setBids(bidlist)
                    setIsLoading(false);
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }
    useEffect(() => {
        if (itemID) {
            obtainItemBids(setBids);
        }
    }, [itemID]);

    function BidsList() {
        // if "not yet set" then simply show "Loading..."
        //if (bids.length == 0) return <div>Loading bid history...</div>;
        if (isLoading) {
            return <div className="text-center">Loading bids...</div>;
        }
        if (!isLoading && bids.length === 0) {
            return <div className="text-center">No bids available.</div>;
        }
        // Generatet archived item table
        return (
            <table className="text-center">
                <thead>
                    <tr>
                        <th className="px-2 py-2 border border-gray-200  text-gray-950 text-left text-sm  font-normal">
                            Bid ID
                        </th>
                        <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
                            BuyerID
                        </th>
                        <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
                            Bid Price
                        </th>
                        <th className="px-2 py-2 border border-gray-200   text-gray-950 text-left text-sm  font-normal">
                            Bid Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {bids.map(bid => (
                        <tr key={bid.bidID}>
                            <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                                {bid.bidID}
                            </td>
                            <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                                {bid.buyerID}
                            </td>
                            <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                                {"$" + bid.bidPrice}
                            </td>
                            <td className="px-2 py-2 border border-gray-200 bg-white text-sm">
                                {bid.bidDate}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        )
    }

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

        <div className='mb-10'>
            <div>
                <BuyerHeader />
            </div>
            <h1 className="font-bold font-sans text-black mt-4 ml-4"><Link href="/recentsolditems"> &lt; back to recent sold items page</Link></h1>
            <h1 className="text-xl text-center font-bold font-sans text-black mt-4">ItemID: {itemID} </h1>
            <Suspense fallback={<Loading />}>
                {item ? (
                    <div>
                        <div className='imageContainer mt-4' style={{
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
                        <div className='itemDetails mt-2 ml-20'>
                            <h1 className='text-xl font-bold capitalize'>{item.itemName}</h1>
                            <p>
                                <strong>Description:</strong> {item.itemDescription}</p>
                            <p>
                                <strong>Sold Price:</strong> ${item.currentPrice}</p>
                            <p>
                                <strong>Start Date:</strong> {item.startDate}
                            </p>
                            <p>
                                <strong>End Date:</strong> {item.endDate}
                            </p>
                            
                            
                        </div>
                        <div className='BidContainer mt-4 ml-20'>
                            <p>
                                <strong>Biding History:</strong> </p>
                            {BidsList()}
                        </div>
                       
                    </div>
                ) : (
                    <div className='absolute inset-0 flex justify-center items-center'><Loading /></div>
                )}
            </Suspense>
        </div>



    )
}

const ItemPage = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <RecentSoldItemPageContent />
        </Suspense>
    );
};

export default ItemPage;