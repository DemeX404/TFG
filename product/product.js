var model = require('./model_product');
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
        cb(null, "./app/images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '--' + file.originalname);
    }
});

const uploadPr = multer({ storage: fileStorageEngineProduct });

let port = 8080;
if (process.argv.length > 2) port = Number.parseInt(process.argv[2]);

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

//Funcion printTickets() Ok
app.get('/e-order/order/product/:id', (req, res) => {
    console.log('print ticket');

    model.printTicket(req.query.token, req.params.id, (err, client) => {
        if (err) res.status(400).end(err.stack);
        else res.send(client);
    });
});

//Funcion listMenu() Ok
app.get('/e-order/order', (req, res) => {
    console.log('List Menu');

    model.listMenu(req.query.token, {}, (err, client) => {
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
        let path = req.file.path;
        path = path.substring(11, path.length);
        newProduct['image'] = 'images/product/' + path;
    } else {
        newProduct['image'] = 'none';
    }
    console.log(newProduct);

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

app.listen(port);
console.log('Microservice product listening on port ' + port);
