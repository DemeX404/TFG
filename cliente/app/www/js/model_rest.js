const axios = require('axios');
const urlBaseUser = 'http://localhost:8090/e-order';
const urlBaseProduct = 'http://localhost:8080/e-order';


function login(name, password, cb) {
    axios.post(urlBaseUser + '/sessions',
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
    axios.post(urlBaseUser + '/users', user)
        .then(res => {
            cb(null, res.data);
        })
        .cath(err => {
            cb(err);
        });
}

function updateUser(token, content, cb) {

    axios.put(urlBaseUser + '/users/' + token, content, {
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

function createOrder(token, content, cb) {

    axios.post(urlBaseUser + '/order', content, {
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

    axios.put(urlBaseUser + '/order/' + orderID, content, {
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

    axios.delete(urlBaseUser + '/order/' + orderID, {
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

    axios.put(urlBaseUser + '/order/close/' + orderID, null, {
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

    axios.put(urlBaseUser + '/order/' + orderID + '/' + prodcutID, null, {
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

    axios.get(urlBaseUser + '/order/open', {
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

    axios.get(urlBaseProduct + '/order/product/' + userID, {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

function listMenu(token, { }, cb) {
    axios.get(urlBaseProduct + '/order', {
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

    axios.put(urlBaseProduct + '/order/sales/' + orderID, null, {
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

    axios.post(urlBaseProduct + '/product/type', content, {
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

    axios.post(urlBaseProduct + '/product', content, {
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

    axios.put(urlBaseProduct + '/product/type/' + typeID, content, {
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

    axios.put(urlBaseProduct + '/product/type/' + productID, content, {
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

    axios.delete(urlBaseProduct + '/product/type/' + typeID, {
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

    axios.delete(urlBaseProduct + '/product/' + productID, {
        params: { token: token }
    })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}