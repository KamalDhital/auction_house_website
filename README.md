# Auction House Website

A full-stack auction web application for buyers, sellers, and administrators. The platform supports browsing listings, placing bids, managing seller inventory, tracking purchases, and generating auction reports.

## Overview

This project combines a frontend built with Next.js and a set of backend logic modules for auction operations. It is designed to simulate a marketplace where users can:

- browse active items and recent sales
- register as a buyer or seller
- add funds and place bids
- review account activity and purchases
- manage item lifecycle as a seller
- review dashboards and reports as an admin

The application integrates with AWS services such as Cognito for authentication and backend functions for account and auction workflow logic.

## Features

### Buyer features
- Browse active items and recent sold items
- Search and sort listings
- View item details and bidding history
- Place bids with validation checks
- Add funds to account balance
- Review active bids and purchase history
- Close account

### Seller features
- Create and manage seller account
- Add, edit, publish, unpublish, and remove items
- Review inactive, active, completed, failed, and archived items
- Fulfill completed items and update balances
- Request unfreeze for frozen items

### Admin features
- Admin login and dashboard access
- Freeze and unfreeze items
- View auction and forensics reports
- Review platform-wide item and trade data

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend logic: Node.js and AWS-based serverless functions
- Authentication: AWS Cognito
- Database: MySQL-backed auction data storage
- Deployment: static frontend hosting and cloud backend integration

## Repository Structure

```text
.
├── README.md
├── backendlogics/
│   ├── add_fund_buyer.mjs
│   ├── buyer_place_bid.mjs
│   ├── publish_item(seller).mjs
│   ├── seller_add_item.mjs
│   ├── ...
│   └── add_items/
│       ├── index.mjs
│       └── package.json
├── frontend-gui/
│   ├── package.json
│   ├── next.config.mjs
│   ├── public/
│   └── src/
│       └── app/
└── ...
```

## Getting Started

### Prerequisites

- Node.js 18+ or newer
- npm
- Access to the project backend dependencies and AWS configuration used by the app

### Install frontend dependencies

```bash
cd frontend-gui
npm install
```

### Run the app locally

```bash
cd frontend-gui
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Production build

```bash
cd frontend-gui
npm run build
npm run start
```

## Demo Accounts

Use locally configured demo accounts for testing. Do not store account credentials in this repository.

## Notes

- The backend logic under the `backendlogics` folder contains AWS-integrated functions for different auction workflows.
- The frontend is the main user-facing interface and is served from the `frontend-gui` directory.
- This project is intended for academic or demo use and may require environment configuration for AWS and database access.

## License

This project is provided as-is for coursework and demonstration purposes.
