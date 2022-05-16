const axios = require('axios');
const url = 'http://localhost:8080/e-order';

function login(name, password, cb) {
    axios.post(url + '/sessions',
        { name: name, password: password })
        .then(res => {
            cb(null, res.data.token, res.data.user)
        })
        .catch(err => {
            cb(err);
        });
}

/****           Users Resources         ****/

function addUser(user, cb) {
    axios.post(url + '/users', user)
        .then(res => {
            cb(null, res.data);
        })
        .cath(err => {
            cb(err);
        });
}

function updateUser(token, content, cb) {

    axios.put(url + '/users/' + token, content, {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}



/****           Orders Resources         ****/
function listMenu(token, { }, cb) {
    axios.get(url + '/order', {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

function createOrder(token, content, cb) {

    axios.post(url + '/order', content, {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

function editOrder(token, orderID, content, cb) {

    axios.put(url + '/order/' + orderID, content, {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

function cancelOrder(token, orderID, cb) {

    axios.delete(url + '/order/' + orderID, {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

function updateSales(token, orderID, cb) {
    console.log(orderID);

    axios.put(url + '/order/sales/' + orderID, null, {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

function closeOrder(token, orderID, cb) {

    axios.put(url + '/order/close/' + orderID, null, {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

function removeProductOrder(token, orderID, prodcutID, cb) {

    axios.put(url + '/order/' + orderID + '/' + prodcutID, null, {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

function openOrders(token, cb) {

    axios.get(url + '/order/open', {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

function printTicket(token, userID, cb) {

    axios.get(url + '/order/product/' + userID, {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}
/****           Products Resources         ****/

function addType(token, content, cb) {

    axios.post(url + '/product/type', content, {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

function addProduct(token, content, cb) {

    axios.post(url + '/product', content, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

function updateType(token, typeID, content, cb) {

    axios.put(url + '/product/type/' + typeID, content, {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

function updateProduct(token, productID, content, cb) {

    axios.put(url + '/product/type/' + productID, content, {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

function deleteType(token, typeID, cb) {

    axios.delete(url + '/product/type/' + typeID, {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

function deleteProduct(token, productID, cb) {

    axios.delete(url + '/product/' + productID, {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}