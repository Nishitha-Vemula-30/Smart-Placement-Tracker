Smart Placement Tracker
===>Backend
===>Frontend

---------------BACKEND----------------
cd Backend
1-Initialize backend
   npm init -y  (to get package.json)
2-Install Required Libraries 
   npm i express mongoose cors dotenv bcryptjs jsonwebtoken         
   install nodemon if not exists  
3-Replace scripts in package.json(optional)
   "scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
   }
4-Add this in package.json(under license)
   "type":"module"


5.Create Backend Folder Structure
  -Folders-
    Config
    Controllers
    Middleware
    Models
    Routes 

  -Files-
  server.js
  .env
  .gitignore

6.Write code in server.js and start the server
7.Connect Database
8.Add Error Handling Middleware
9.Create MODEL,SCHEMA for students
10.Create APIs,Routes,Controllers and Add them Specific Route in server.js to identify 
like app.use("/api/students", studentRoutes)
11.Create a file name as req.http to check the apis like this
POST
http://localhost:5000/api/students/register
12.Add specfic user by post req and like this

POST http://localhost:5000/api/students/register
Content-Type: application/json

{
  "name":"Nishitha",
  "email":"nishi@gmail.com",
  "password":"123456",
  "branch":"IT",
  "cgpa":8.5
}





----------FRONTEND--------------
cd Frontend
1.Create React App inside Frontend Folder
     npm create vite@latest 
2.Cleanup the files:App.jsx,App.css,index.css,main.jsx
3.rfce is shortcut for creating functional component
4.Remove strictmode in main.jsx
5.Install TailwindCSS 
   npm install tailwindcss @tailwindcss/vite    
6.Goto vite.config.js
 and add import tailwindcss from '@tailwindcss/vite' and add  tailwindcss() in plugins

7.Add @import "tailwindcss"; in index.css
8.Install Required Libraries 
   npm i axios react-toastify react-hook-form react-router 
9.   

