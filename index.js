const express = require("express")
const app = express()
const router = require("./web/router")
require('dotenv').config()
const cors = require('cors');

const corsOptions ={
    origin:'*', 
    credentials:true,            
    optionSuccessStatus:200,
 }
 
app.use(cors(corsOptions))
app.use(express.json()) 

app.use(router)

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port "+ process.env.PORT );
})