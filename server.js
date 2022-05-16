var model = require('./model');
var express = require('express');
var bodyParser = require('body-parser');
const { query } = require('express');

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectId;
//Parte que sube imagenes
const multer = require("multer");
const cors = require("cors");

var app = express();
app.use(bodyParser.json());
app.use(cors());

const fileStorageEngineProduct = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/product");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '--' + file.originalname);
    }
});

const fileStorageEngineUser = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/user");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '--' + file.originalname);
    }
});


const uploadPr = multer({ storage: fileStorageEngineProduct });
const uploadUser = multer({ storage: fileStorageEngineUser });


/*Autentificar las operaciones, register y login no se pueden autentificar porque
no tienen token, por lo tanto se manejan de forma diferente*/
app.use(function (req, res, next) {
    console.log('authorize ' + req.method + ' ' + req.originalUrl);


    if ((req.path == '/e-order/sessions' && req.method == 'POST') ||
        (req.path == '/e-order/users' && req.method == 'POST')) {
        next();
    } else if (!req.query.token) {
        res.status(401).send('Token not found');
    }
    else next();
});

//Funcion de Login Ok
app.post('/e-order/sessions', function (req, res) {
    console.log('login ' + JSON.stringify(req.body));
    if (!req.body.name || !req.body.password) {
        res.status(400).send('Parameters missing');
    }
    else {
        model.login(req.body.name, req.body.password, (err, token, user) => {
            if (err) {
                console.log(err.stack);;
                res.status(400).send(err);
            } else {
                res.send({ token: token, user: user });
            }
        });
    }
});

/****       URL de users            ****/
//Funcion addUser Ok
app.post('/e-order/users', uploadUser.single("image"), function (req, res) {
    console.log('addUser ' + JSON.stringify(req.body));

    let newUser = req.body;
    newUser['orders'] = [];
    if (req.file) {
        newUser['image'] = '../../' + req.file.path;
    } else {
        newUser['image'] = 'none';
    }

    model.addUser(newUser, (err, user) => {
        if (err) {
            console.log(err.stack);
            res.status(400).send(err);
        } else res.send(user);
    });
});

//Funcion updateUser() Ok
app.put('/e-order/users/:me', uploadUser.single("image"), (req, res) => {
    console.log('update user ' + req.params.me);

    if (req.params.me != req.query.token) res.status(401).send();
    else {
        let newUser = req.body;
        if (req.file) {
            newUser['image'] = '../../' + req.file.path;
        } else {
            newUser['image'] = 'none';
        }
        model.updateUser(req.query.token, newUser, (err, client) => {
            if (err) res.status(400).end(err.stack);
            else res.send(client);
        });
    }

});

/****       URL de order            ****/

//Funcion listMenu() Ok
app.get('/e-order/order', (req, res) => {
    console.log('List Menu');

    model.listMenu(req.query.token, {}, (err, client) => {
        if (err) res.status(400).end(err.stack);
        else res.send(client);
    });
});

//Funcion createOrder() Ok
app.post('/e-order/order', (req, res) => {
    console.log('create order' + JSON.stringify(req.body));

    model.createOrder(req.query.token, req.body, (err, client) => {
        if (err) res.status(400).end(err.stack);
        else res.send(client);
    });
});

//Funcion editOrder() Ok
app.put('/e-order/order/:id', (req, res) => {
    console.log('edit order ' + JSON.stringify(req.body));

    model.editOrder(req.query.token, req.params.id, req.body,
        (err, client) => {
            if (err) res.status(400).end(err.stack);
            else res.send(client);
        });
});

//Funcion cancelOrder()
app.delete('/e-order/order/:id', (req, res) => {
    console.log('delete order ' + req.params.id);

    model.cancelOrder(req.query.token, req.params.id, (err, client) => {
        if (err) res.status(400).end(err.stack);
        else res.send(client);
    });
});

//Funcion updateSales() Ok
app.put('/e-order/order/sales/:id', (req, res) => {
    console.log('update sales ');
    console.log(req.params.id);

    model.updateSales(req.query.token, req.params.id, (err, client) => {
        if (err) res.status(400).end(err.stack);
        else res.send(client);
    });
});

//Funcion closeOrder() Ok
app.put('/e-order/order/close/:id', (req, res) => {
    console.log('close order');

    model.closeOrder(req.query.token, req.params.id, (err, client) => {
        if (err) res.status(400).end(err.stack);
        else res.send(client);
    });
});

//Funcion removeProductOrder Ok
app.put('/e-order/order/:order/:product', (req, res) => {
    console.log('product from the order ' + req.params.order);

    model.removeProductOrder(req.query.token, req.params.order, req.params.product,
        (err, client) => {
            if (err) res.status(400).end(err.stack);
            else res.send(client);
        });
});

//Funcion openOrders() Ok
app.get('/e-order/order/open', (req, res) => {
    console.log('open orders');

    model.openOrders(req.query.token, (err, client) => {
        if (err) res.status(400).end(err.stack);
        else res.send(client);
    });
});

//Funcion printTickets() Ok
app.get('/e-order/order/product/:id', (req, res) => {
    console.log('print ticket');

    model.printTicket(req.query.token, req.params.id, (err, client) => {
        if (err) res.status(400).end(err.stack);
        else res.send(client);
    });
});

/****       URL de product            ****/

//Funcion addType() Ok
app.post('/e-order/product/type', (req, res) => {
    console.log('add type' + JSON.stringify(req.body));

    model.addType(req.query.token, req.body, (err, client) => {
        if (err) res.status(400).end(err.stack);
        else res.send(client);
    })
});

//Funcion addProduct() Ok
app.post('/e-order/product', uploadPr.single("image"), (req, res) => {
    console.log('add product' + JSON.stringify(req.body));

    let newProduct = req.body;

    if (req.file) {
        newProduct['image'] = '../../' + req.file.path;
    } else{
        newProduct['image'] = 'none';
    }

    model.addProduct(req.query.token, newProduct, (err, client) => {
        if (err) res.status(400).end(err.stack);
        else res.send(client);
    })
});

//Funcion updateType() Ok
app.put('/e-order/product/type/:id', (req, res) => {
    console.log('update type ' + req.params.id);

    model.updateType(req.query.token, req.params.id, req.body, (err, client) => {
        if (err) res.status(400).end(err.stack);
        else res.send(client);
    });
});

//Funcion updateProduct() Ok
app.put('/e-order/product/:id', (req, res) => {
    console.log('update product ' + req.params.id);

    model.updateProduct(req.query.token, req.params.id, req.body, (err, client) => {
        if (err) res.status(400).end(err.stack);
        else res.send(client);
    });
});

//Funcion deleteType() Ok
app.delete('/e-order/product/type/:id', (req, res) => {
    console.log('delete type ' + req.params.id);

    model.deleteType(req.query.token, req.params.id, (err, client) => {
        if (err) res.status(400).end(err.stack);
        else res.send(client);
    });
});

//Funcion deleteProduct() Ok
app.delete('/e-order/product/:id', (req, res) => {
    console.log('delete product ' + req.params.id);

    model.deleteProduct(req.query.token, req.params.id, (err, client) => {
        if (err) res.status(400).end(err.stack);
        else res.send(client);
    });
});



app.listen(8080);
console.log('Server listening...');
