const express = require('express')
const app = express()
app.listen( process.env.port || 4000,function(){
    console.log('listening on port 4000')
})