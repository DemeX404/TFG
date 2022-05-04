const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';

/*Esta parte habra que probarla cuando tenga el servicio restful
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(request, file, cb){
        cb(null, './www/images');
    },
    filename: function(request, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});

const upload = mult({
    storage: storage,
    limite:{
        fieldSize: 1024*1024*3
    }
});*/

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
                // create new callback for closing connection
                _cb = function (err, res) {
                    client.close();
                    cb(err, res);
                }
                let db = client.db('e-order');
                let col = db.collection('customer');

                col.find().count((err, length) => {
                    if (err) _cb(err);
                    else if (length == 0) {
                        user['type'] = 'owner';
                        console.log(user);
                        col.insertOne(user, (err, result) => {
                            if (err) _cb(err);
                            else {
                                _cb(null, {
                                    id: result.insertedId.toHexString(),
                                    name: user.name, surname: user.name, email: user.email, password: user.password,
                                    avatar: user.avatar, phone: user.phone, type: type
                                });
                            }
                        });
                    } else {
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
                                                avatar: user.avatar, phone: user.phone, type: user.type
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

//Aqui tengo que plantear como hacer para distinguir entre usuarios normales y trabajadores
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
                        _id: _user._id.toHexString(), name: _user.name, surname: _user.surname,
                        email: _user.email, phone: _user.phone, type: _user.type, avatar: _user.avatar
                    });
                }
            });

        }

    });
}

//Ok
function updateUser(token, user, cb) {
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
                        col.updateOne(query, {
                            $set: {
                                "name": user.name,
                                "surname": user.surname,
                                "dni": user.dni,
                                "password": user.password,
                                "phone": user.phone
                            }
                        }, (err, _user) => {
                            if (err) _cb(err);
                            else {
                                console.log(new Error('Update Finished'));
                            }
                        });
                    } else {
                        col.updateOne(query, {
                            $set: {
                                "name": user.name,
                                "surname": user.surname,
                                "email": user.email,
                                "password": user.password,
                                "phone": user.phone
                            }
                        }, (err, _user) => {
                            if (err) _cb(err);
                            else {
                                console.log(new Error('Update Finished'));
                            }
                        });
                    }
                }
            })
        }

    });
}

//Ok
//Hay que plantar como voy a visualizar los datos 
function listMenu(opts, cb) {

    MongoClient.connect(url, function (err, client) {
        if (err) cb(err)
        else {
            console.log('connected.');
            function _cb(err, result) {
                client.close();
                cb(err, result);
            }
            var db = client.db('e-order');
            var col = db.collection('product');

            var productsArray = [];

            col.find({ type: { $exists: true } }).toArray((err, types) => {
                if (err) _cb(err);
                else {
                    types.forEach((infoType) => {
                        productsArray.push({
                            _id: infoType._id.toHexString(), type: infoType.type, lstPr: infoType.lstPr
                        });
                    });

                    col.find({ name: { $exists: true } }).toArray((err, products) => {
                        if (err) _cb(err);
                        else {
                            products.forEach((infoPr) => {
                                productsArray.push({
                                    _id: infoPr._id.toHexString(), name: infoPr.name, price: infoPr.price,
                                    typePr: infoPr.typePr, sale: infoPr.sales, description: infoPr.description
                                });
                            });
                            _cb(null, productsArray);
                        }
                    });
                }
            });
        }
    });
}

//Ok
function createOrder(token, content, cb) {
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
                    console.log(_user.orders.length);
                    //En caso que el usuario no tenga ordenes anteriores creamos una nueva
                    if (_user.orders.length == 0) addEntry(token, content);
                    //Recorremos todas las ordenes del usuario en busca de la que tiene abierta actualmente
                    _user.orders.forEach((orderID) => {
                        let flag = _user.orders.length;
                        col.findOne({ _id: new mongodb.ObjectId(orderID) }, (err, _order) => {
                            if (err) _cb(err);
                            else {
                                //Encontramos la orden abierta y añadimos el pedio
                                if (_order.paid == false) {
                                    content['id'] = _order.productOrder.length;
                                    col.updateOne({ _id: _order._id }, {
                                        $push: { "productOrder": { $each: [content] } }
                                    }, (err, result) => {
                                        if (err) _cb(err);
                                        else {
                                            _cb(new Error('Add product to the current order'));
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
                        let newEntry = {}
                        content['id'] = 0;
                        newEntry['refClient'] = token;
                        newEntry['paid'] = false;
                        newEntry['productOrder'] = [content];
                        console.log('Creando nueva entrada');
                        col.insertOne(newEntry, (err, result) => {
                            if (err) _cb(err);
                            else {
                                col.updateOne({ _id: _user._id }, {
                                    $push: { "orders": result.insertedId.toHexString() }
                                }, (err, _result) => {
                                    if (err) _cb(err);
                                    else {
                                        _cb(null, {
                                            id: result.insertedId.toHexString(), refClient: result.refClient,
                                            productOrder: result.productOrder, paid: result.paid
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

//Ok
function editOrder(orderID, content, cb) {
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

            col.findOne({ _id: new mongodb.ObjectId(orderID) }, (err, _order) => {
                if (err) _cb(err);
                else {
                    console.log(content);
                    col.updateOne({ _id: new mongodb.ObjectId(orderID), "productOrder.id": content.id }, {
                        $set: { "productOrder.$.productId": content.productId, "productOrder.$.qty": content.qty }
                    }, (err, result) => {
                        if (err) _cb(err);
                        else {
                            _cb(new Error('Data updated'))
                        }
                    });
                }
            });
        }

    });
}

//Ok
function printTicket(orderID, cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) cb(err)
        else {
            console.log('connected.');
            function _cb(err, result) {
                client.close();
                cb(err, result);
            }

            var db = client.db('e-order');
            var col = db.collection('customer');
            var orderArray = [];

            col.findOne({ _id: new mongodb.ObjectId(orderID) }, (err, _order) => {
                if (err) _cb(err);
                else {
                    _order.productOrder.forEach((order) => {
                        orderArray.push({
                            id: order.id, productId: order.productId, qty: order.qty
                        });
                    });
                    _cb(null, orderArray);
                }
            });
        }
    });
}

/****   OWNER  ****/

//Ok
function addType(type, cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) cb(err);
        else {
            // create new callback for closing connection
            _cb = function (err, res) {
                client.close();
                cb(err, res);
            }
            let db = client.db('e-order');
            let product = db.collection('product');

            product.findOne({ type: type.type },
                (err, _product) => {
                    if (err) _cb(err);
                    else if (_product) _cb(new Error('Type already exists'));
                    else {
                        type['type'] = type.type.toLowerCase();
                        type['lstPr'] = [];
                        product.insertOne(type, (err, result) => {
                            if (err) _cb(err);
                            else {
                                _cb(null, { id: result.insertedId.toHexString(), name: type.name, lstPr: type.lstPr });
                            }
                        });
                    }
                });


        }
    });

}
//Ok
function updateType(typeID, newType, cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) cb(err);
        else {
            console.log('connected.');
            function _cb(err, result, result2) {
                client.close();
                cb(err, result, result2);
            }

            var db = client.db('e-order');
            var col = db.collection('product');

            let query = { _id: new mongodb.ObjectId(typeID) };
            col.updateOne(query, {
                $set: {
                    "type": newType.type,
                }
            }, (err, _user) => {
                if (err) _cb(err);
                else {
                    console.log('Update Finished');
                }
            });

        }

    });
}

//Ok
function deleteType(typeId, cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) cb(err);
        else {
            console.log('connected.');
            function _cb(err, result) {
                console.log(err);
                client.close();
                cb(err, result);
            }

            var db = client.db('e-order');
            var col = db.collection('product');

            //No se puede borrar el tipo si aun tiene productos asociados
            objectPr = new mongodb.ObjectId(typeId);
            col.findOne({ _id: objectPr }, (err, result) => {
                if (err) _cb(err);
                else {
                    if (result.lstPr.length > 0) {
                        _cb(new Error('Some product still asociated with this type'))
                    } else {
                        col.deleteOne({ _id: objectPr }, (err, _result) => {
                            if (err) _cb(err);
                            else {
                                _cb('Type deleted');
                            }
                        });
                    }
                }
            })
        }

    });
}

//Ok
function addProduct(newProduct, cb) {
    console.log('connected')
    if (!newProduct.name) cb(new Error('Property name missing'));
    else if (!newProduct.price) cb(new Error('Property price missing'));
    else {
        MongoClient.connect(url, function (err, client) {
            if (err) cb(err);
            else {
                // create new callback for closing connection
                _cb = function (err, res) {
                    client.close();
                    cb(err, res);
                }
                let db = client.db('e-order');
                let product = db.collection('product');
                product.findOne({ name: newProduct.name },
                    (err, _product) => {
                        if (err) _cb(err);
                        else if (_product) _cb(new Error('Product already exists'));
                        else {
                            newProduct['sales'] = 0;
                            product.insertOne(newProduct, (err, result) => {
                                if (err) _cb(err);
                                else {
                                    product.updateOne({ type: newProduct.typePr }, { $push: { lstPr: result.insertedId.toHexString() } }, (err, update) => {
                                        if (err) _cb(err);
                                        else {
                                            _cb(null, { id: result.insertedId.toHexString(), name: newProduct.name, lstPr: newProduct.lstPr, type: newProduct.typePr });
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
function updateProduct(productID, product, cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) cb(err);
        else {
            console.log('connected.');
            function _cb(err, result, result2) {
                client.close();
                cb(err, result, result2);
            }

            var db = client.db('e-order');
            var col = db.collection('product');

            let query = { _id: new mongodb.ObjectId(productID) };
            objectPr = new mongodb.ObjectId(productID);

            col.updateOne({ lstPr: productID }, {
                $pull: { "lstPr": productID }
            }, (err, _oldPr) => {
                if (err) _cb(err);
                else {
                    col.updateOne({ type: product.typePr }, {
                        $push: { lstPr: productID }
                    }, (err, fake) => {
                        if (err) _cb(err);
                        else {
                            col.updateOne(query, {
                                $set: {
                                    "name": product.name,
                                    "price": product.price,
                                    "typePr": product.typePr
                                }
                            }, (err, _newProduct) => {
                                if (err) _cb(err);
                                else {
                                    _cb(null, { _newProduct })
                                }
                            });
                        }
                    });
                }
            });
        }

    });
}

//Ok Suelta on error:undefined pero funciona bien xD
function deleteProduct(product, cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) cb(err);
        else {
            console.log('connected.');
            function _cb(err, result) {
                client.close();
                cb(err, result);
            }

            var db = client.db('e-order');
            var col = db.collection('product');

            objectPr = new mongodb.ObjectId(productId);
            col.deleteOne({ _id: objectPr }, (err, result) => {
                if (err) _cb(err);
                else {
                    col.updateOne({ typePr: product.type }, {
                        $pull: { "lstPr": product }
                    }, (err, _result) => {
                        if (err) _cb(err);
                        else {
                            _cb('Product deleted');
                        }
                    });
                }
            });

        }

    });
}

//Ok, creo que hay que hacerlo para que reciba un array y fusionarlo con createOrder
function updateSales(product, cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) cb(err);
        else {
            console.log('connected.');
            function _cb(err, result) {
                client.close();
                cb(err, result);
            }

            var db = client.db('e-order');
            var col = db.collection('product');

            objectPr = new mongodb.ObjectId(product);
            col.updateOne({ _id: objectPr }, {
                $inc: { "sales": +1 }
            }, (err, result) => {
                if (err) _cb(err);
                else {
                    _cb('Sales update')
                }
            });
        }
    });
}

function showOrder(orderID, cb) {
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
            var colProduct = db.collection('product');
            var orderArray = [];
            var result = [];

            colCustomer.findOne({ _id: new mongodb.ObjectId(orderID) }, (err, _order) => {
                if (err) _cb(err);
                else {
                    _order.productOrder.forEach((order) => {
                        console.log(order.productId);
                        orderArray.push({id: order._id});
                    });
                    colProduct.findOne({ _id: new mongodb.ObjectId(order.productId) }, (err, _product) => {
                        if (err) _cb(err);
                        else {
                            console.log(_product);
                            orderArray.push({
                                id: _product.id, name: _product.name, price: _product.price, typePr: _productPr.drinks
                            });
                        }
                    });
                    _cb(null, orderArray);
                }
            });

        }
    });
}