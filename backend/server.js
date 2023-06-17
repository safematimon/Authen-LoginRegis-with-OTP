// const express = require('express')
// after add type = module in package.json now can import like this 

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import connect from './database/conn.js';
import router from './router/route.js';

const app = express()

// middleware
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.disable('x-powered-by') //less hacker know about your stack

const port = 4000

// http GET 
app.get('/',(req,res)=>{
  res.status(201).json("Home Get Request")
})

// api route

app.use('/api',router)





// ==================================================
// start when have valid connection
// app.listen(port,()=>{
//   console.log('Server Running ... on port >',port)
// })

connect().then(()=>{
  try{
    app.listen(port,()=>{
      console.log('Server Running ... on port >',port)
    })
  }catch(error){
    console.log('Cannot connect to the server')
  }
}).catch(error =>{
  console.log("Invalid database connection")
})