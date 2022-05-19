const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectId;
const url = 'mongodb://localhost:27017';


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

                //El sustituto de count ser --> countDocuments
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


/****   OWNER  ****/

//Ok
function addType(token, type, cb) {
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
function updateType(token, typeID, newType, cb) {
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
                    _cb(null, 'Update Finished');
                }
            });

        }

    });
}

//Ok
function deleteType(token, typeId, cb) {
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
                                _cb(null, ('Type deleted'));
                            }
                        });
                    }
                }
            })
        }

    });
}

//Ok
function addProduct(token, newProduct, cb) {
    console.log('connected')
    if (!newProduct.name) cb(new Error('Property name missing'));
    else if (!newProduct.price) cb(new Error('Property price missing'));
    else if (!newProduct.typePr) cb(new Error('Property typePr missing'));
    else if (!newProduct.description) cb(new Error('Property description missing'));
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
                                            _cb(null, {
                                                id: result.insertedId.toHexString(), name: newProduct.name, lstPr: newProduct.lstPr,
                                                type: newProduct.typePr
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
function updateProduct(token, productID, product, cb) {
    MongoClient.connect(url, function (err, client) {
        if (err) cb(err);
        else {
            console.log('connected.');
            console.log('producto act');
            function _cb(err, result, result2) {
                client.close();
                cb(err, result, result2);
            }

            var db = client.db('e-order');
            var col = db.collection('product');

            let query = { _id: new mongodb.ObjectId(productID) };
            objectPr = new mongodb.ObjectId(productID);

            console.log('test');
            col.updateOne({ lstPr: productID }, {
                $pull: { "lstPr": productID }
            }, (err, _oldPr) => {
                if (err) _cb(err);
                else {
                    console.log(product)
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
                                    _cb(null, ('Product updated'))
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
function deleteProduct(token, productID, cb) {
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

            objectPr = new mongodb.ObjectId(productID);
            col.findOneAndDelete({ _id: objectPr }, (err, result) => {
                if (err) _cb(err);
                else {
                    console.log(result.value.typePr);
                    col.updateOne({ type: result.value.typePr }, {
                        $pull: { "lstPr": productID }
                    }, (err, _result) => {
                        if (err) _cb(err);
                        else {
                            _cb(null, 'Product deleted');
                        }
                    });
                }
            });

        }

    });
}

//Ok-use
function updateSales(token, orderID, cb) {
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
            var colProduct = db.collection('product');
            let bulkUpdates = [];

            colCustomer.findOne({ _id: new mongodb.ObjectId(orderID) }, (err, _order) => {
                if (err) _cb(err);
                else {
                    flag = _order.productOrder.length;
                    _order.productOrder.forEach((product) => {
                        bulkUpdates.push({
                            "updateOne": {
                                "filter": { _id: new mongodb.ObjectId(product.productId) },
                                "update": { $inc: { "sales": +product.qty } }
                            },
                        });
                    });

                    colProduct.bulkWrite(bulkUpdates, (err, _result) => {
                        if (err) _cb(err);
                        else {
                            _cb(null, 'Product sales updated')
                        }
                    });
                }
            });
        }
    });
}

//Ok-used
function listMenu(token, opts, cb) {

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
                                if (infoPr.image != 'none') {
                                    productsArray.push({
                                        _id: infoPr._id.toHexString(), name: infoPr.name, price: infoPr.price,
                                        typePr: infoPr.typePr, sale: infoPr.sales, description: infoPr.description, image: infoPr.image
                                    });
                                } else {
                                    productsArray.push({
                                        _id: infoPr._id.toHexString(), name: infoPr.name, price: infoPr.price,
                                        typePr: infoPr.typePr, sale: infoPr.sales, description: infoPr.description, image: 'images/1entrante.jpg'
                                    });
                                }
                            });
                            _cb(null, productsArray);
                        }
                    });
                }
            });
        }
    });
}

//Ok-used
function printTicket(token, userID, cb) {
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

            colCustomer.findOne({ _id: new mongodb.ObjectId(userID) }, (err, _user) => {
                if (err) _cb(err);
                else {
                    _user.orders.forEach((ordersID) => {
                        colCustomer.findOne({ _id: new mongodb.ObjectId(ordersID) }, (err, _order) => {
                            if (err) _cb(err);
                            else {
                                if (_order.paid == false) {
                                    let flag = _order.productOrder.length;
                                    _order.productOrder.forEach((productID) => {
                                        colProduct.findOne({ _id: new mongodb.ObjectId(productID.productId) }, (err, _product) => {
                                            if (err) _cb(err);
                                            else {

                                                if (_product.image != 'none') {
                                                    orderArray.push({
                                                        id: productID.id, idOrder: _order._id.toHexString(), idPr: _product._id.toHexString(), qty: productID.qty,
                                                        notes: productID.notes, name: _product.name, price: _product.price, description: _product.description, image: _product.image
                                                    });
                                                } else {
                                                    orderArray.push({
                                                        id: productID.id, idOrder: _order._id.toHexString(), idPr: _product._id.toHexString(), qty: productID.qty,
                                                        notes: productID.notes, name: _product.name, price: _product.price, description: _product.description, image: 'images/1entrante.jpg'
                                                    });
                                                }


                                                //No me gusta esta solucion pero es funcional
                                                flag--;
                                                if (flag == 0) {
                                                    close(orderArray);
                                                }
                                            }
                                        });
                                    });
                                }
                                function close(result) {
                                    _cb(null, result);
                                }
                            }
                        });
                    });
                }
            });
        }
    });
}

module.exports = {
    addUser,
    login,
    updateUser,
    listMenu,
    createOrder,
    editOrder,
    cancelOrder,
    removeProductOrder,
    openOrders,
    printTicket,
    addType,
    updateType,
    deleteType,
    addProduct,
    updateProduct,
    deleteProduct,
    updateSales,
    closeOrder
}
