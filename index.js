const express = require("express")
const app = express()
const webRouter = require("./web/router")
const authRouter = require("./Authentication/router")
require('dotenv').config()
const cors = require('cors');

const corsOptions ={
    origin:'*', 
    credentials:true,            
    optionSuccessStatus:200,
 }
 
app.use(cors(corsOptions))
app.use(express.json()) 

// app.use("/",require("./middleware/validator").ValidateApiKey) 

// app.use("/",require("./middleware/validator").ValidateHeaderToken) 

app.use(webRouter)
app.use(authRouter)

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port "+ process.env.PORT );
})