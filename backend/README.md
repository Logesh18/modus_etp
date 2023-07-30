## Installation Details 
Use the command `npm install` to install the dependencies
Use `npm version 18` and use the command `npm start` to run the application

This application performs the following operations:

1) Create CSV file if not exists


2) Create new user entries in csv file
Api : http://localhost:3000/createNewUser
Body : Sample Payload 
{
    "newUser": ["Kumar", "kumar@gmail.com", 22, "+91 3023456789", 356789] 
}


3) Update the user entries
Api : http://localhost:3000/updateExistingUserDetail/1
Body : Sample Payload 
{
   "updateData": ["Kumar", "kumar@gmail.com", 22, "+91 1023456789", 356989],
}


4) Delete the user entries by user index
Api : http://localhost:3000/deleteExistingUserDetail/1


5) Delete all entries including CSV file
Api : localhost:3000/deleteAllUsers


6) Fetch all user detailsn and send to frontend
Api : http://localhost:3000/getAllUsers


7) Fetch user entries by using column name and the given search value
Api : http://localhost:3000/searchUserDetail?header=email&value=ram
header - holds the column name
value - holds the data that is searchec by the user