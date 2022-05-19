const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectId;
const axios = require('axios');

console.log(process.argv);
let urlUsers = 'http://localhost:8090/e-order';
if (process.argv.length > 3) urlUsers = process.argv[3];
let url = 'mongodb://localhost:27017';
if (process.argv.length > 4) url = process.argv[4];
console.log('Using users url ' + urlUsers);
console.log('Using MongoDB url ' + url);

/**     Comunicacion con ms users  **/
//Funcion que se comunica con users para comprobar que el token existe
function getSession(token, cb) {
    console.log(urlUsers + '/sessions' + {
        params: { token: token }
    });
    axios.get(urlUsers + '/sessions',
        {
            params: { token: token }
        })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}

function getCollection(token, id, cb) {
    console.log(urlUsers + '/info/' + id);
    axios.get(urlUsers + '/info/' + id,
        {
            params: { token: token }
        })
        .then(res => {
            cb(null, res.data)
        })
        .catch(err => {
            cb(err);
        });
}
/****   OWNER  ****/

//Ok
function addType(token, type, cb) {
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
                console.log('connected');
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
                            console.log('Insertando producto');
                            product.insertOne(newProduct, (err, result) => {
                                if (err) _cb(err);
                                else {
                                    console.log('Actualizando tipo');
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
    getSession(token, (err, result) => {
        MongoClient.connect(url, function (err, client) {
            if (err) cb(err);
            else {
                console.log('connected.');
                function _cb(err, result) {
                    client.close();
                    cb(err, result);
                }

                var db = client.db('e-order');
                var colProduct = db.collection('product');
                let bulkUpdates = [];

                getCollection(token, orderID, (err, _order) => {
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
    getSession(token, (err, result) => {
        MongoClient.connect(url, function (err, client) {
            if (err) cb(err)
            else {
                console.log('connected.');
                function _cb(err, result) {
                    client.close();
                    cb(err, result);
                }

                var db = client.db('e-order');
                var colProduct = db.collection('product');

                var orderArray = [];

                getCollection(token, userID, (err, _user) => {
                    if (err) _cb(err);
                    else {
                        _user.orders.forEach((ordersID) => {
                            getCollection(token, ordersID, (err, _order) => {
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
                                                            id: productID.id, idOrder: _order._id, idPr: _product._id.toHexString(), qty: productID.qty,
                                                            notes: productID.notes, name: _product.name, price: _product.price, description: _product.description, image: _product.image
                                                        });
                                                    } else {
                                                        orderArray.push({
                                                            id: productID.id, idOrder: _order._id, idPr: _product._id.toHexString(), qty: productID.qty,
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
    });
}

module.exports = {
    listMenu,
    printTicket,
    addType,
    updateType,
    deleteType,
    addProduct,
    updateProduct,
    deleteProduct,
    updateSales
}