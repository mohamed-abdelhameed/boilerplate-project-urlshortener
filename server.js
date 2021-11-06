require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const bodyParser = require('body-parser');

const app = express();

const urls = new Map();
let lastId=0;
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/shorturl/new', function(req, res) {
  let url = req.body.url;
  if(!url.match(/[a-z]+:\/\/[a-z\.]+/)) {
    res.json({ error: 'invalid url' });
    return;
  }
  dns.lookup((new URL(url)).hostname,(err,data)=>{
    if(err) {
      res.json({ error: 'invalid url' });
    } else {
      urls.set(++lastId,url);
      res.json({ original_url : url, short_url : lastId});
    }
  });
});

app.get('/api/shorturl/:url', function(req, res) {
  res.redirect(urls.get(Number(req.params.url)));
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
