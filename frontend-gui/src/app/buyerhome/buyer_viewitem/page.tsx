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


const BuyerItemPageContent = () => {
    const [redraw, forceRedraw] = useState(0)  

    const [item, setItem] = useState<Item | undefined>(undefined);
    const [itemID, setItemID] = useState<string | null>(null);
    const [bids, setBids] = useState<Bid[]>([]);
    const [bidAmount, setBidAmount] = useState<string>('');
    const [buyerID, setBuyerID] = useState<string | null>(null);
    const [fund, setFund] = useState<string>('');

    const [isLoading, setIsLoading] = useState(true);
    const [priceError, setPriceError] = useState(false)
    const [isFrozen, setIsFrozen] = useState(false)
    

    const andRefreshDisplay = () => {
        forceRedraw(redraw+1)
    }

    useEffect(() => {
        const storedBuyerID = localStorage.getItem('buyerID');

        if (storedBuyerID) {
            setBuyerID(storedBuyerID);
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


    const searchParams = useSearchParams();
    useEffect(() => {
        const id = searchParams.get('itemID');
        setItemID(id);
    }, [searchParams]);

    function updateLastBuyerFund(lastBuyerBid: number, lastBuyerID: string) {
        
        instance.post('/add_fund_buyer', { "amount": lastBuyerBid, "buyerID": lastBuyerID })
          .then(function (response) {
            const status = response.data.statusCode
            if (status == 200) {
                //front end do nothing.
                return
            }
          })
          .catch(function (error) {
            console.log(error)
          })
    }

    function buyerPlaceBid() {
        const bid = parseInt(bidAmount);
        instance.post('/buyer_place_bid', { "itemID": itemID, "buyerID": buyerID, "bidPrice": bid })
            .then(function (response) {
                const status = response.data.statusCode
                if (status == 200) {
                    setIsLoading(true)
                    obtainItemBids(setBids)
                    obtainBuyerFund()
                    obtainItem()
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    function handlePlaceBid() {
        setPriceError(false)
        const bid = parseInt(bidAmount);
        
        if (bids.length >= 1) {
            const lastBuyerID = (bids[bids.length - 1].buyerID).toString();
            const lastBuyerBid = (bids[bids.length - 1].bidPrice);
            const availableFund = parseInt(fund)
            if (buyerID == lastBuyerID) {
                alert('You cannot over bid yourself.');
                setBidAmount('')
            }
            else {
                if (item && bid <= item.currentPrice) {
                    alert('Bid Price too small! Please enter a valid amount.');
                    setPriceError(true)
                }
                else {
                    if (bid <= availableFund) {
                        console.log(bidAmount)
                        buyerPlaceBid()
                        setBidAmount('')
                        setPriceError(false)
                        updateLastBuyerFund(lastBuyerBid, lastBuyerID)
                        andRefreshDisplay()
                    }
                    else {
                        alert('You do not have enough fund. Please add fund to your account.');
                        setBidAmount('')
                    }
                }
            }
        } else {
            if (item && bid <= item.currentPrice) {
                alert('Bid Price too small! Please enter a valid amount.');
                setPriceError(true)
            }
            else {
                const availableFund = parseInt(fund)
                if (bid <= availableFund) {
                    console.log(bidAmount)
                    buyerPlaceBid()
                    setBidAmount('')
                    setPriceError(false)
                    andRefreshDisplay()
                }
                else {
                    alert('You do not have enough fund. Please add fund to your account.');
                    setBidAmount('')
                }
            }
        }
    }

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
            return <div >Loading bids...</div>;
        }
        if (!isLoading && bids.length === 0) {
            return <div >No bids found.</div>;
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
                    if (item.isFrozen == true) {
                        setIsFrozen(item.isFrozen)
                    }
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
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <div>
                    <h1 className="font-bold font-sans text-black mt-4 ml-4"><Link href="/buyerhome"> &lt; back to buyer home page</Link></h1>
                    </div>

                    <div className="text-right mr-10 mt-2">
                        <p className="text-gray-700">Buyer ID: {buyerID}</p>
                        <label className="text-gray-700">Available Funds:</label>
                        <span className="text-gray-700 ml-2">${fund}</span>
                    </div>
                </div>
            

            <h1 className="text-xl text-center font-bold font-sans text-black mt-4">ItemID: {itemID} </h1>
            {isFrozen && (
                <div className="frozen_message text-center ">
                    <label className="frozen_message text-red-500 text-2xl font-bold">{"This item is Frozen. No bids are allowed."}
                    </label>

                </div>
            )}
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
                                <strong>Initial Price:</strong> ${item.initialPrice}</p>
                            <p></p>
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
                        <div className='BidContainer mt-4 ml-20'>
                            <p>
                                <strong>Biding History:</strong> </p>
                            {BidsList()}
                        </div>
                        {!isFrozen && (
                            <div className='PlaceBidContainer mt-4 ml-20 mb-20'>
                                <p>
                                    <strong>Add bid:</strong> </p>
                                <label className='enterKeywords'>
                                    $ <input type="text" id="bidinput"
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                        placeholder="Enter you bid here" className="inputbox" name="bid" />
                                </label>

                                <button className='text-white px-1 py-1 rounded ml-2 mr-1 mt-1 mb-1 bg-blue-700  hover:bg-blue-950' onClick={() => handlePlaceBid()}>Place Bid</button>

                                {priceError && (
                                    <div className="priceError">
                                        <label className="priceError" style={{ color: 'red' }}>{"Bid Price need to be at least $1 higher than the current price!"}
                                            <br />{"Please enter another bid price."} </label>

                                    </div>
                                )}
                            </div>)}
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
            <BuyerItemPageContent />
        </Suspense>
    );
};

export default ItemPage;