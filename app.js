const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

// ///////////////////////////////////
// FILE
// let readFile = fs.readFileSync('./file.txt', 'utf-8');

// let textOut = `Amazing work here ${readFile}`;
// // let writefile = fs.writeFileSync('./writeFile',textOut);

// // console.log(writefile);

// //non-blocking
// fs.readFile('./file.txt', 'utf-8', (err, data) => {
//     console.log(data);
// });

// ///////////////////////////////////
// SERVER


// It is advisable to keep the json file here since it will be executed once not repeatedly as the operations in the callback function
//we can do Synchronous version because we are in the top level code which is only executed once, right at the beginning when we load up the application. sync version cannot be used inside the callback function because that is called each time there is a http.request.

const tempOverview =fs.readFileSync (`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempcard =fs.readFileSync (`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct =fs.readFileSync (`${__dirname}/templates/template-product.html`, 'utf-8');
const data =fs.readFileSync (`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); 

// // 3rd party module 
// const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));
// console.log(slugs);

const server = http.createServer((req, res) => {
  const {query, pathname } = (url.parse(req.url, true));  
 
  //Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {'content-type': 'text/html'});

    const cardsHtml = dataObj.map(el => replaceTemplate(tempcard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // learning process
    // res.end("This is the OVERVIEW!");


    //Product page
  } else if (pathname === "/product") {
    res.writeHead(200, {'content-type': 'text/html'});
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product)
    res.end(output);


    //API
  } else if (pathname === "/api") {
      res.writeHead(200, {'content-type': 'application/json'});
      res.end(data);
      
      
      // Not found
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "Hello world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening at port 8000");
});
