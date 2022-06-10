# RXDB failing pouch storage example

This repository demonstrates a bug or misconfiguration of pouchDb used as a storage for rxdb.

We illustrate the issue in the file [src/index.js](./src/index.js)

We configure the database, and then add and remove the same document multiple times.  This will work 2-5 times before throwing a revision error. I assume that this is undesired behaviour, as we wait for each action to complete before starting the next.

Any advice is appreciated.

This is what the browser console looks like:


``` javascript
addDoc() success 
printDocs() Array [ {…} ]
removeDoc() success index.js:17
printDocs() Array []
addDoc() success 
printDocs() Array [ {…} ]
removeDoc() failed RxError (COL19): RxError (COL19):
RxDB Error-Code COL19.
        Error messages are not included in RxDB core to reduce build size.
        - To find out what this error means, either use the dev-mode-plugin https://rxdb.info/dev-mode.html
        - or search for the error code here: https://github.com/pubkey/rxdb/search?q=COL19
        
Given parameters: {
collection:"docs"
id:"id-hello"
pouchDbError:{
  "isError": true,
  "status": 409,
  "documentId": "id-hello",
```
