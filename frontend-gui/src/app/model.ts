

export class Item {
    itemID: number;
    itemName: string;
    itemDescription: string;
    initialPrice: number;
    itemImage: string;
    auctionLength: number;
    currentPrice: number;
    startDate: string;
    endDate: string;
    soldDate: string;
    isFrozen: boolean; // changed from any to boolean to fix a compiler error
    hasBid!: boolean; 
    isArchived!: boolean;
    winnerBuyer: string;
    
    


    constructor(id: number, name: string, description: string, initialPrice: number, image: string, auctionLength: number, currentPrice: number, startDate:string, endDate: string, soldDate:string, isFrozen: boolean, winnerBuyer: string) {
        
        this.itemID = id;
        this.itemName = name;
        this.itemDescription = description;
        this.initialPrice = initialPrice;
        this.itemImage = image;
        this.auctionLength = auctionLength;
        this.currentPrice = currentPrice;
        this.startDate = startDate.slice(0,10);
        this.endDate = endDate.slice(0,10) 
        this.soldDate = soldDate.slice(0,10)
        this.isFrozen = isFrozen; 
        this.winnerBuyer = winnerBuyer;
    }
}



export class Seller {
    sellerID: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    fund: number

    constructor(id: string, firstName: string, lastName: string, email: string, password: string) {
        this.sellerID = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.fund = 0
    }

}

export class Buyer {
    buyerID: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    fund: number

    constructor(id: string, firstName: string, lastName: string, email: string, password: string) {
        this.buyerID = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.fund = 0
    }

}

export class Bid {
    bidID: number
    buyerID: number;
    bidPrice: number;
    bidDate: string;


    constructor(bidID: number, buyerID: number, bidPrice: number, bidDate: string) {
        this.bidID = bidID;
        this.buyerID = buyerID;
        this.bidPrice = bidPrice;
        this.bidDate = bidDate.slice(0,10);
       
    }
}

export class Admin {
    adminID: string;
    password: string;
    auctionhouseFund: number;

    constructor(adminID: string, password: string, auctionhouseFund: number) {
        this.adminID = adminID;
        this.password = password;
        this.auctionhouseFund = auctionhouseFund;
    }
}

export class ActiveBids {
    itemID: number;
    itemName: string;
    itemDescription: string;
    currentPrice: number;
    bidPrice: number;
    endDate: string;

    constructor(id: number, name: string, descrip: string, curPrice: number, bidPrice: number, endDate: string) {
        this.itemID = id;
        this.itemName = name;
        this.itemDescription = descrip;
        this.currentPrice = curPrice;
        this.bidPrice = bidPrice;
        this.endDate = endDate.slice(0,10);
    }

}

export class Purchases {
    itemID: number;
    itemName: string;
    itemDescription: string;
    currentPrice: number;
    bidPrice: number;
    endDate: string;

    constructor(id: number, name: string, descrip: string, curPrice: number, bidPrice: number, endDate: string) {
        this.itemID = id;
        this.itemName = name;
        this.itemDescription = descrip;
        this.currentPrice = curPrice;
        this.bidPrice = bidPrice;
        this.endDate = endDate.slice(0,10);
    }

}

export class Model {
    items: Item[];
    sellerAccounts: Seller[];
    buyerAccounts: Buyer[];
    admin: Admin[];

    constructor() {
        this.items = [];
        this.sellerAccounts = [];
        this.buyerAccounts = [];
        this.admin = []
    }
}