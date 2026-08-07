# Prolog
Auction House Url: http://auctionhouse.s3-website-us-east-1.amazonaws.com
## iteration 3 (final iteration)
Remaining Use cases:
1. Buyer - View Item (Lingji: done - 12/06)
2. Buyer - Search recently sold (Lingji: done - 12/09)
3. Buyer - Sort recently sold (Lingji: done - 12/09)
4. Buyer - Place Bid (Lingji: done - 12/11)
5. Buyer - Review Active Bids (Lingji: done - 12/11)
6. Buyer - Review Purchases (Sarika)
7. Admin - generate auction report (Kamal: done)
8. Admin - generate forensics report (Kamal: done)
9. Buyer - Close Account (Sarika)
10. Seller - Close Account (Sarika)
11. Seller - Request unfreeze item (Kamal:done)
12. Seller - Buy Now (Couldn't finish within the due date)
Fixed use cases:
1. Buyer - Add fund (Lingji)
   - buyer available fund will be updated on the page once new amount is added.
3. Admin - Freeze/unfreeze (Kamal)
4. Seller - edit item (Lingji)
   - edit image is allowed now!
5. Seller - fulfill item (Lingji)
   - fulfill item will trigger money exchange. This trade info will be stored into all trade history (can be found in Auction House Report)
   - fulfilled items will be moved to archived item list. In archived item list, seller can see the buyerID and final price and other info.

After login as a buyer:
- In the header,
  - 'Home' will lead buyer to view all the current on sale items.
  - 'Recent Sold' will lead buyer to view all the last 24 h sold items. If there was no items sold in the last 24 hrs, the page will show "No recent sold items were found."
  - 'My Account' will lead buyers back to their buyerdashboard.
  - 'Logout' will log out to customer Home page.
- In Buyer Home page,
  - 'View Item' will lead buyer to the item page, where buyer can view the details of an item and place a bid.
  - To place a bid, enter an amount, and press 'Place Bid'. If Place Bid is succcessful, buyer will see an updated item page (with his bid in the bidding history). Buyer's available fund will also get deducted by the amount he placed. If there is a new bid after buyer's bid, this amount will come back to buyer's balance. 
  - There are scenarios that buyer cannot place a bid:
    1. buyer is over bidding himself. An alert will pop up.
    2. buyer's bid is not higher than the previous bid or the initial price (when there's no bid). An alert will pop up.
    3. buyer does not have enough available fund. An alert will pop up.
- In Buyer Recent sold page,
  - If there are items, buyer can search rencent sold and sort the item table by itemID, price, name, etc.
  - Buyer can click 'view item' to view the item info and bidding history as well.
- Back in Buyer dashboard,
  - Click 'Review Active Bids' to view the items that buyer has placed a bid. The Highest bid may change if another buyer placed a bid on that item. Buyer can click 'View Item' to go to the item page and place another bid if his fund is allowed.
  
On Admin Dashboard page:
-Admin Dashboard page can be logged in with credentials: 
                     AdminID: admin  Password: prolog24

-Admin dashboard has a button “Click to report Page” to link the report page for Auction report and Forensic  report generation and Logout button at right top which bring back to admin login page once logout.

-Items on the table can be filtered by Active, frozen or Archive. 

To test Freeze/Unfreeze Item use case: Click the "Freeze" and "Unfreeze" button. It will change the isFrozen(Boolean) status in our database.

   Admin Report page:
-“Click to report Page” button on admin dashboard navigate to reports page that has buttons “Generate Auction House Report” and “Generate Forensics Report”

-“Go Back to Admin Main Page link” navigate back to admin main dashboard.

To test Generate Auction Report use case: Click on Generate Auction house Report Button (shows all the trades that seller and buyer has made)

To test Generate Forensic Report use case: Click on Generate Forensic Report Button (shows all bids)

On the Seller Dashboard page: 
Request unfreeze Item: 
-Clicking  to “Review Item” button  shows  the “Active Item” buttons  and clicking Active Items buttons will display all the active items for that seller. 

-If the item is active “Unpublished” button is active and item can be Unpublish by clicking it, and “active” status is seen right after Unpublished button. 

-If the item is frozen Unpublished button is inactive  (grey-out) and  “Request Unfreeze” button become active in place of” active

To test Request Unfreeze use case:  Click “Request Unfreeze” button and  message poops:   “Unfreeze request submitted successfully” after successful request.

Testing Review Purchases (Buyer Feature):
- Login to your buyer account
- Click "Review Purchases" button on the buyer dashboard
- You will see a table displaying all your completed purchases including:
  - Item ID, Name, Description
  - Purchase Price
  - Purchase Date
  - End Date
- If no purchases exist, you'll see a "No purchases were found" message

Testing Add Fund (Buyer Feature):
- Login to your buyer account
- Your current available funds are displayed at the top right of the dashboard
- Click "Add Fund" button on the buyer dashboard
- Enter the desired amount in the input field
- Click "Submit" to add funds
- You'll receive a confirmation message "Your available fund has been updated!"
- The displayed fund amount at the top right will automatically update
- Invalid inputs (negative numbers or non-numeric values) will trigger an alert to enter a valid amount


Test Close Account last as you will be locked out of your account and unable to log back in (without resetting active flag in the database).

Testing Close Account (Buyer):
- Login to your buyer account
- Click "Close Account" button on the buyer dashboard
- A confirmation message will appear warning about account deactivation
- Click "Confirm Account Closure" to proceed
- You will be logged out and redirected to home page
- Attempting to log back in will show "This account has been deactivated"

Testing Close Account (Seller):
- Login to your seller account
- Click "Close Account" button on the seller dashboard  
- A confirmation message will appear warning about account deactivation
- Click "Confirm Account Closure" to proceed
- You will be logged out and redirected to home page
- Attempting to log back in will show "This account has been deactivated"




----------------------------------------------------------------------------------------------------------------------------
## Nov 27, 2024 - iteration 2
Use cases:
1. customer - search items (Lingji: done - 11/18)
2. customer - sort items (Lingji: done - 11/15 )
3. customer - view item (Lingji: done)
4. seller - add item (Kamal/Lingji: done)
5. seller - edit item (Kamal/Lingji: 80% done)
6. Admin - Login (Sarika: done)
7. buyer - close account (Sarika: NOT DONE)
8. buyer - add fund (Sarika: 80% done) - Lambda function tests pass, however front bug preventing update to buyer page.
9. admin - freeze item (Kamal)
10. admin - unfreeze item (Kamal)

----------------------Carry over cases from previous iteration----------------------

11. login (display unique user dasboard) - seller - (Sarika: done)
12. login(display unique user dasboardion) - buyer - (Sarika: done)

Admin Login:
- You can login to the Admin Dashboard page using the Credentials:
    AdminID: admin
    Password: prolog24

Seller unique Dasboard example:
- you can create your own account or login to the following:
    email: sarikasaran@gmail.com
    Password: Password@123

Buyer unique Dasboard example:
- you can create your own account or login to the following:
    email: ssaran@wpi.edu
    Password: Password@123

On the Home page:
- To search items, enter keywords in the keywords input box. Then click "Search" button. (Optional) To include price range into search, click and select checkbox, then enter min price and max price. Then click "Search" button.
- To reset keywords and price range to default (undefined), click "Reset Search" button.
- To sort items, click ▲ next to the column name. ▲ means sorting by ascending order, ▼ means sorting by descending order.
- To view one specific item, click "View Item" button at the last column of th row. This will direct user to the item page.
- For a customer who hasn't login, the customer will be able to view the name, current price, description, start date, end date, and the image on the item page.

On the Seller Dashboard page:
- Login will now bring you to your personal seller dashboard. In Previous iteration, this was a hard-coded user ID.
- To test Add Item use case:
  - click "Add Item" button, enter item info and upload item image from your local folder. You can only upload one image for now. Once fill in all 5 fields, click 'Submit' button to add this item into your inactive item list. You can now go to your inactive item table to view this item. 
  - The "Clear All" button will reset all the fields to empty.
  - Click "<Go Back to Seller Dashboard" on the left top conner to go back to seller dashboard.
- To test Edit Item use case:
  - Click "Review Item" button, then "Inactive Item" button. Find "Edit" button in the table and click it to edit the item.
  - Edit page will show the stored info of this item, but except the image url of the item.
  - You can edit the info in the first four cells, and you have to upload a image for this item.
  - We are still working on making the image url to be editable.

On the Buyer Dashboard page:
- Login will now bring you to your personal buyer dashboard. In Previous iteration, this was a hard-coded user ID.
- If you Press Add Fund button, the option to add funds will appear on the page. However, though the lambda function is working, the front end is not updating the buyer's page yet.

On the Admin Dashboard page:
- Loginin will now bring you to the admin dashboard.
- To test Freeze/Unfreeze Item use case, Click the "Freeze" and "Unfreeze" button. It will change the isFrozen(Boolean) status in our database.
- We will also make the "Unpublish" button and the related "Bid" to be disabled in our next iteration.

## Nov 10, 2024 - iteration 1
Use cases:
1. create account - seller
2. create account - buyer
3. login (authentication) - seller
4. login(authentication) - buyer
5. seller - review items
6. seller - publish item
7. seller - remove item
8. seller - archive item
9. seller - unpublish item
10. seller - fulfill item

- Our landing page is the home page of this webapp. At the top right, click the 'create account' button to create an seller/buyer account, or click the 'login' button to use your registed email and password to enter user account page. (Our app's createt account and login use cases integrated AWS Cognito(SDK package).) 
- By creating an account, your registered info will be stored into our AWS cogito user pool and our auctonhouse database. A sequential Seller ID will be generated in the database and be used to identify the seller for the purpose of displaying Seller dashboard. [There is a known bug in the verify email.  Gmail account works as expected but wpi.edu email is triggering a invalid link message when you click the link in your email to confirm your account.  However Account is confirmed in cognito and created in database.]
- Login a example seller account, enter Email: sarika.saran@gmail.com and the password: Password@123 and select Type:'Seller' at the log in page.
- Once you login and land into seller page, our examples are based on the info of our fake user - sellerID: 2159 which is currently hard coded in for testing purposes.
- To test review items use case, click "Review Item" button, then click the five buttons ("Inactive Items", "Active Items", "Failed Items", "Completed Items", and "Archived Items") to view items.
- In "Inactive Items", Click "Publish" button to publish item. This item will be removed from this table and goes to the Active Item Table. The process may takes few seconds. Then click "Active Items", you will find this published item in the table here.
- In "Inactive Items", Click "Remove" button to remove item. This item will be removed from this table. The process may takes few seconds. The table will be automatically refreshed once it's processed.
- In "Inactive Items", Click "Archive" button to archive item. The process may takes few seconds. Item will be transfered from this table to the Archived Items Table. Click 'Archived Items" to find the item there.
- In "Active Items", Click "Unpublish" button to unpublish item. The process may takes few seconds. Item will be transfered from this table back to the Inactive Items Table. Click 'Inactive Items" to find the item there.
- In "Completed Items", Click "Fulfill" button to fulfill item. The process may takes few seconds. Item will be transfered from this table to the Archived Items Table. Click 'Archived Items" to find the item there. And the Fund, showing in the top middle of this page will be updated.
  
#   A u c t i o n _ H o u s e _ W e b _ G r o u p _ P r o j e c t  
 