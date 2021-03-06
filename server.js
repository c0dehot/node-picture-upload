require( 'dotenv' ).config() // looks for .env ; process.env gets it's values

const PORT = process.env.PORT || 8080

// dependencies & setup
const express = require('express')
const apiRouter = require('./app/router')
const app = express()

// for parsing incoming POST data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// for serving all the normal html
app.use( express.static('public') )

// for routes
apiRouter(app)

app.listen(PORT, function() {
    console.log( `Serving app on: https://localhost:${PORT}` )
})