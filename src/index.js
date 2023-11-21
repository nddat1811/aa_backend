const express = require('express')
const app = express()
const port = 3000

app.get('/', function (req, res) {
  res.send('Hedsads22213213212ádasda3121')
})

app.get('/22', function (req, res) {
  res.send('Hello Worldaaa')
})

app.listen(port, ()=> console.log(`Example app listening at http://localhost:${port}`))
