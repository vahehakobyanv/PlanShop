const express = require('express');
const app = express();
app.post('/post/plan/shopp/items',function (req,res)){
	console.log('Post method');
	res.send('some items posted');
}
app.get('/get/plan/shopp/items', function (req, res) {
    res.send('Some Items');
})

app.get('/user 555/l', function (req, res) {
    res.send('Some Items');
})
app.listen(3000);