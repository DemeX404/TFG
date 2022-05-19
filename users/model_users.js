const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectId;

let url = 'mongodb://localhost:27017';
if (process.argv.length > 3) url = process.argv[3];
console.log('Using MongoDB url' + url);

/****   CUSTOMERS  ****/
//Ok
function addUser(user, cb) {
    if (!user.name) cb(new Error('Property name missing'));
    else if (!user.surname) cb(new Error('Property surname missing'));
    else if (!user.password) cb(new Error('Property password missing'));
    else if (!user.phone) cb(new Error('Property phone missing'));
    else if (!user.type) cb(new Error('Propery type missing'));
    else {
        MongoClient.connect(url, function (err, client) {
            if (err) cb(err);
            else {
                console.log('connected');
                // create new callback for closing connection
                _cb = function (err, res) {
                    client.close();
                    cb(err, res);
                }
                let db = client.db('e-order');
                let col = db.collection('customer');

                //El sustituto de count ser --> countDocuments
                col.find().count((err, length) => {
                    if (err) _cb(err);
                    else if (length == 0) {
                        user['type'] = 'owner';
                        col.insertOne(user, (err, result) => {
                            if (err) _cb(err);
                            else {
                                _cb(null, {
                                    id: result.insertedId.toHexString(),
                                    name: user.name, surname: user.name, email: user.email, password: user.password,
                                    avatar: user.avatar, phone: user.phone, type: user.type
                                });
                            }
                        });
                    } else {
                        console.log(user);
                        col.findOne({ email: user.email },
                            (err, _user) => {
                                if (err) _cb(err);
                                else if (_user) _cb(new Error('Customer already exists'));
                                else {
                                    col.insertOne(user, (err, result) => {
                                        if (err) _cb(err);
                                        else {
                                            _cb(null, {
                                                id: result.insertedId.toHexString(),
                                                name: user.name, surname: user.name, email: user.email, password: user.password,
                                                avatar: user.avatar, phone: user.phone, type: user.type, image: user.image
                                            });
                                        }
                                    });
                                }
                            });
                    }
                });

            }
        });
    }
}

//Ok
function login(name, password, cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) cb(err);
        else {
            console.log('connected.');
            function _cb(err, result, result2) {
                client.close();
                cb(err, result, result2);
            }

            var db = client.db('e-order');
            var col = db.collection('customer');

            col.findOne({ name: name, password: password }, (err, _user) => {
                if (err) _cb(err)
                else if (!_user) _cb(new Error('User not found'));
                else {
                    _cb(null, _user._id.toHexString(), {
                        _id: _user._id.toHexString(), name: _user.name, surname: _user.surname, password: _user.password,
                        email: _user.email, phone: _user.phone, type: _user.type, avatar: _user.avatar, image: _user.image
                    });
                }
            });

        }

    });
}

//Ok
function updateUser(token, user, cb) {
    if (!user.name) cb(new Error('Property name missing'));
    else if (!user.surname) cb(new Error('Property surname missing'));
    else if (!user.password) cb(new Error('Property password missing'));
    else if (!user.phone) cb(new Error('Property phone missing'));
    else {
        MongoClient.connect(url, function (err, client) {
            if (err) cb(err);
            else {
                console.log('connected.');
                function _cb(err, result) {
                    client.close();
                    cb(err, result);
                }

                var db = client.db('e-order');
                var col = db.collection('customer');

                let query = { _id: new mongodb.ObjectId(token) };
                col.findOne(query, (err, result) => {
                    if (err) _cb(err);
                    else {
                        if (result.type == 'employee') {
                            col.findOneAndUpdate(query, {
                                $set: {
                                    "name": user.name,
                                    "surname": user.surname,
                                    "dni": user.dni,
                                    "password": user.password,
                                    "phone": user.phone,
                                    "image": user.image
                                }
                            }, (err, _user) => {
                                if (err) _cb(err);
                                else {
                                    _cb(null, {
                                        _id: _user.value._id.toHexString(), name: user.name, surname: user.surname, password: user.password,
                                        dni: user.dni, phone: user.phone, type: _user.value.type, image: user.image
                                    });
                                }
                            });
                        } else {
                            col.findOneAndUpdate(query, {
                                $set: {
                                    "name": user.name,
                                    "surname": user.surname,
                                    "email": user.email,
                                    "password": user.password,
                                    "phone": user.phone,
                                    "image": user.image
                                }
                            }, (err, _user) => {
                                if (err) _cb(err);
                                else {
                                    console.log(_user);
                                    _cb(null, {
                                        _id: _user.value._id.toHexString(), name: user.name, surname: user.surname, password: user.password,
                                        email: user.email, phone: user.phone, type: _user.value.type, image: user.image
                                    });
                                }
                            });
                        }
                    }
                })
            }

        });
    }
}

//Ok-used
function createOrder(token, content, cb) {
    if (!content.qty > 0) cb(new Error('Quantity should be more than 0'));
    else {
        MongoClient.connect(url, function (err, client) {
            if (err) cb(err);
            else {
                console.log('connected.');
                function _cb(err, result) {
                    client.close();
                    cb(err, result);
                }
                var db = client.db('e-order');
                var col = db.collection('customer');

                //Localizamos al usuario que esta creando la orden
                col.findOne({ _id: new mongodb.ObjectId(token) }, (err, _user) => {
                    if (err) _cb(err);
                    else {
                        //En caso que el usuario no tenga ordenes anteriores creamos una nueva
                        if (_user.orders.length == 0) addEntry(token, content);
                        //Recorremos todas las ordenes del usuario en busca de la que tiene abierta actualmente
                        let flag = _user.orders.length;
                        _user.orders.forEach((orderID) => {
                            col.findOne({ _id: new mongodb.ObjectId(orderID) }, (err, _order) => {
                                if (err) _cb(err);
                                else {
                                    //Encontramos la orden abierta y añadimos el pedio
                                    if (_order.paid == false) {
                                        content['id'] = _order.productOrder.length * Math.floor(Math.random() * (20 - 1 + 1) - 1);
                                        col.updateOne({ _id: _order._id }, {
                                            $push: { "productOrder": { $each: [content] } }
                                        }, (err, result) => {
                                            if (err) _cb(err);
                                            else {
                                                _cb(null, {
                                                    id: _order._id.toHexString(), refClient: _order.refClient,
                                                    productOrder: _order.productOrder, paid: _order.paid
                                                });
                                            }
                                        });
                                    } else {
                                        flag = flag - 1;
                                    }
                                    //En caso de no encontrar ninguna orden abierta creamos una nueva
                                    if (flag == 0) {
                                        addEntry(token, content);
                                    }
                                }
                            });
                        });
                        //Añadir una nueva entra a la coleccion
                        function addEntry(token, content) {
                            let newEntry = {};
                            let randomNum = Math.floor(Math.random() * (20 - 1 + 1) - 1);
                            content['id'] = 0;
                            newEntry['refClient'] = token;
                            newEntry['paid'] = false;
                            newEntry['num_table'] = randomNum;
                            newEntry['productOrder'] = [content];
                            newEntry['methodPay'] = 'none';
                            col.insertOne(newEntry, (err, result) => {
                                if (err) _cb(err);
                                else {
                                    col.updateOne({ _id: _user._id }, {
                                        $push: { "orders": result.insertedId.toHexString() }
                                    }, (err, _result) => {
                                        if (err) _cb(err);
                                        else {
                                            _cb(null, {
                                                id: result.insertedId.toHexString(), refClient: newEntry.refClient,
                                                productOrder: newEntry.productOrder, paid: newEntry.paid
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }

        });
    }
}

//Ok-used
function editOrder(token, orderID, content, cb) {

    MongoClient.connect(url, function (err, client) {
        if (err) cb(err);
        else {
            console.log('connected.');
            function _cb(err, result) {
                client.close();
                cb(err, result);
            }

            var db = client.db('e-order');
            var col = db.collection('customer');

            if (!content.methodPay) {
                col.findOne({ _id: new mongodb.ObjectId(orderID) }, (err, _order) => {
                    if (err) _cb(err);
                    else {
                        console.log(_order);
                        col.updateOne({ _id: new mongodb.ObjectId(orderID), "productOrder.productId": content.productId }, {
                            $set: {
                                "productOrder.$.productId": content.productId,
                                "productOrder.$.qty": content.qty,
                                "productOrder.$.notes": content.notes
                            }
                        }, (err, result) => {
                            if (err) _cb(err);
                            else {
                                _cb(null, ('Data updated'))
                            }
                        });
                    }
                });
            } else {
                col.findOneAndUpdate({ _id: new mongodb.ObjectId(orderID) }, {
                    $set: { methodPay: content.methodPay }
                }, (err, _order) => {
                    if (err) _cb(err);
                    else {
                        _cb(null, 'Data updated');
                    }
                });
            }
        }

    });
}

//Ok
function cancelOrder(token, orderID, cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) cb(err);
        else {
            console.log('connected.');
            function _cb(err, result) {
                client.close();
                cb(err, result);
            }

            var db = client.db('e-order');
            var colCustomer = db.collection('customer');

            colCustomer.findOne({ _id: new mongodb.ObjectId(orderID) }, (err, _order) => {
                if (err) _cb(err);
                else {
                    colCustomer.findOneAndUpdate({ _id: new mongodb.ObjectId(_order.refClient) }, {
                        $pull: { orders: orderID }
                    }, (err, result) => {
                        if (err) _cb(err);
                        else {
                            colCustomer.deleteOne({ _id: new mongodb.ObjectId(orderID) }, (err, _result) => {
                                if (err) _cb(err);
                                else {
                                    _cb(null, 'Order deleted')
                                }
                            });
                        }
                    });
                }
            });
        }

    });
}

//Ok
function removeProductOrder(token, orderID, productID, cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) _cb(err);
        else {
            console.log('connected');
            function _cb(err, result) {
                client.close();
                cb(err, result);
            }

            var db = client.db('e-order');
            var colCustomer = db.collection('customer');

            productID = parseInt(productID);

            colCustomer.updateOne({ _id: new mongodb.ObjectId(orderID) }, {
                $pull: { productOrder: { id: productID } }
            }, (err, result) => {
                if (err) _cb(err);
                else {
                    _cb(null, 'Product removed from the order')
                }
            });

        }
    });
}

//ok
function openOrders(token, cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) cb(err)

        console.log('connected.');
        function _cb(err, result) {
            client.close();
            cb(err, result);
        }

        var db = client.db('e-order');
        var colCustomer = db.collection('customer');

        var userOrder = [];

        colCustomer.find({ paid: false }).toArray((err, _orders) => {
            if (err) _cb(err);
            else {
                _orders.forEach((_order) => {
                    userOrder.push({
                        refClient: _order.refClient,
                        num_table: _order.num_table,
                        methodPay: _order.methodPay
                    });
                });
                _cb(null, userOrder)
            }
        });
    });
}

//Ok
function closeOrder(token, orderID, cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) cb(err)
        else {
            console.log('connected.');
            function _cb(err, result) {
                client.close();
                cb(err, result);
            }

            var db = client.db('e-order');
            var colCustomer = db.collection('customer');

            colCustomer.findOneAndUpdate({ _id: new mongodb.ObjectId(orderID) },
                { "$set": { "paid": true } },
                (err, order) => {
                    if (err) _cb(err);
                    else {
                        _cb(null, ('Order closed'));
                    }
                });
        }
    });
}

//Agregar esta funcion a la API
function getCollection(token, id, cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) cb(err)
        else {
            console.log('connected.');
            function _cb(err, result) {
                client.close();
                cb(err, result);
            }

            var db = client.db('e-order');
            var colCustomer = db.collection('customer');

            colCustomer.findOne({_id: new mongodb.ObjectId(id)}, (err, _result) =>{
                if(err) _cb(err);
                else{
                    _cb(null, _result);
                }
            });
        }
    });
}

module.exports = {
    addUser,
    login,
    updateUser,
    createOrder,
    editOrder,
    cancelOrder,
    removeProductOrder,
    openOrders,
    closeOrder,
    getCollection
}