require('dotenv').config()

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()), // creates express http server
  path = require('path'),
  router = require('./router')

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', router)

var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port %s", server.address().port)
})
