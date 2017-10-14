const express = require('express');
const app = express();
app.post('/post/plan/shop/items', function (req,res){
	console.log('Post method');
	res.send('some items posted');
})
app.get('/get/plan/shop/items', function (req, res) {
    res.send('Some Items');
})

app.get('/user/last', function (req, res) {
    res.send('Some Items');
})
app.listen(3000);