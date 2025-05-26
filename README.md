Stores Rating App
Live Link: https://stores-rating-app.netlify.app/
GitHub Repository: https://github.com/ankitSharma645/work-by-ankit

Project Overview
The Stores Rating App is a web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to register, log in, and rate stores. Ratings range from 1 to 5. The platform supports three types of user roles: System Administrator, Normal User, and Store Owner, each with specific functionalities.

User Roles and Functionalities
1. System Administrator
Can add new stores, normal users, and admin users.

Dashboard displays:

Total number of users

Total number of stores

Total number of submitted ratings

Can add new users with the following details:

Name

Email

Password

Address

Can view a list of stores with:

Name, Email, Address, Rating

Can view a list of users (normal and admin) with:

Name, Email, Address, Role

Can apply filters on listings based on:

Name, Email, Address, Role

Can view full details of all users:

Name, Email, Address, Role

If user is a Store Owner, their Rating is also shown

Can log out

2. Normal User
Can sign up and log in

Signup form includes:

Name

Email

Address

Password

Can update password after logging in

Can view all registered stores

Can search for stores by:

Name

Address

Store listings display:

Store Name

Address

Overall Rating

User's Submitted Rating

Option to submit or modify rating

Can submit ratings (1 to 5)

Can log out

3. Store Owner
Can log in

Can update password

Dashboard functionalities:

View users who have rated their store

View average rating of their store

Can log out

Form Validations
Name: Minimum 20 characters, Maximum 60 characters

Address: Maximum 400 characters

Password: 8–16 characters, must include at least one special character

Tech Stack
MongoDB

Express.js

React.js

Node.js
