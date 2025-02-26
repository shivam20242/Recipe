const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const recipeRoutes = require('./Routes/recipeRoutes')
const authRoutes = require('./Routes/authRoutes')
const userRoutes = require('./Routes/userRoutes');
//Environment variable
const PORT = process.env.PORT;
const MONGOURL = process.env.MONGOURL;


const app = express();

//Middleware
app.use(cors());
app.use(express.json())

//Routes
app.use('/api', recipeRoutes)
app.use('/api/auth', authRoutes)
// Add this line to connect the favorites routes
app.use('/api', userRoutes);
app.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`);
    connectDB()
});

async function connectDB() {
    try {
        await mongoose.connect(MONGOURL)
        console.log("mongo Connect")
    } catch (error) {
     console.log("mongo not connect")   
    }
}