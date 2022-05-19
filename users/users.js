var model = require('./model_users');
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


const fileStorageEngineUser = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./app/images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '--' + file.originalname);
    }
});

const uploadUser = multer({ storage: fileStorageEngineUser });

let port = 8090;
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

/***        Llamadas del ms product      ***/
app.get('/e-order/sessions', function (req, res) {
    console.log('checkToken ' + req.query.token);

    model.getCollection(req.query.token, req.query.token, (err, users) => {
        if (err) {
            console.log(err.stack);
            res.status(400).send(err);
        } else if (!users.length) {
            res.status(401).send();
        } else {
            res.send(users[0]);
        }
    });
});

//AGREGAR A LA DOCUMENTACION
app.get('/e-order/info/:id', (req, res) => {
    console.log('Get collection: ' + req.params.id);

    model.getCollection(req.query.token, req.params.id, (err, user) => {
        if (err) res.status(400).end(err.stack);
        else res.send(user);
    });
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
        let path = req.file.path;
        path = path.substring(11, path.length);
        newUser['image'] = 'images/users/' + path;
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
            let path = req.file.path;
            path = path.substring(11, path.length);
            newUser['image'] = 'images/users/' + path;
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

app.listen(port);
console.log('Microservice users listening on port ' + port);