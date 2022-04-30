const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';

/****   CUSTOMERS  ****/
//Ok hay que añadir que al llamar la funcion se etiqueta el tipo de usuario
function addUser(user, cb) {
    if (!user.name) cb(new Error('Property name missing'));
    else if (!user.surname) cb(new Error('Property surname missing'));
    else if (!user.email) cb(new Error('Property email missing'));
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
                let customers = db.collection('customer');
                customers.findOne({ email: user.email },
                    (err, _user) => {
                        if (err) _cb(err);
                        else if (_user) _cb(new Error('Customer already exists'));
                        else {
                            customers.insertOne(user, (err, result) => {
                                if (err) _cb(err);
                                else {
                                    _cb(null, {
                                        id: result.insertedId.toHexString(),
                                        name: user.name, surname: user.name, email: user.email, password: user.password,
                                        avatar: user.avatar, phone: user.phone, type: "customer"
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
//Btw confio en que esto funcinoa :D
function login(email, password, cb) {

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

            col.findOne({ email: email, password: password }, (err, _user) => {
                if (err) _cb(err)
                else if (!_user) _cb(new Error('User not found'));
                else {
                    _cb(null, _user._id.toHexString(), { _id: _user._id.toHexString(), name: _user.name, surname: _user.surname, email: _user.email, nick: _user.nick, avatar: _user.avatar });
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
                            _id: infoType.toHexString(), type: infoType.type, lstPr: infoType.lstPr
                        });
                    });

                    col.find({ name: { $exists: true } }).toArray((err, products) => {
                        if (err) _cb(err);
                        else {
                            products.forEach((infoPr) => {
                                productsArray.push({
                                    _id: infoPr.toHexString, name: infoPr.name, price: infoPr.price,
                                    typePr: infoPr.typePr, sale: infoPr.sales
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
                                    col.updateOne({ _id: _order._id }, {
                                        $push: { "productOrder": { $each: [content] } }
                                    }, (err, result) => {
                                        if (err) _cb(err);
                                        else {
                                            _cb(new Error('Add product to the current order'));
                                        }
                                    });
                                }
                                flag = flag - 1;
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
                        newEntry['refClient'] = token;
                        newEntry['paid'] = false;
                        newEntry['productOrder'] = [content];
                        console.log('Creando nueva entrada');
                        col_customer.insertOne(newEntry, (err, result) => {
                            if (err) _cb(err);
                            else {
                                col_customer.updateOne({ _id: _user._id }, {
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

//Hay que plantearse como apuntar al elemento del array que se quiere cambiar
function editOrder(orderID,content, cb) {
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

            col.findOne({_id: new mongodb.ObjectId(orderID)}, (err, _order)=>{
                if(err) _cb(err);
                else{

                }
            });
            let query = { _id: new mongodb.ObjectId(orderID), "productOrder.productId":  };
            col.updateOne(query, {
                $set: {
                    "productId": content.productId,
                    "qty": content.qty,
                    "msg": content.msg,
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

function printTicket(token, opts, cb) {

    MongoClient.connect(url, function (err, client) {
        if (err) cb(err)
        else {
            console.log('connected.');
            function _cb(err, result, result2) {
                client.close();
                cb(err, result, result2);
            }
            var db = client.db('twitter');
            var col = db.collection('users');
            col.findOne({ _id: new mongodb.ObjectID(token) }, (err, _user) => {
                if (err) _cb(err);
                else if (!_user) _cb(new Error('Wrong token'));
                else {
                    // Si el usuario nos pasa una query
                    var query = opts.query || {};
                    // adapt options
                    var options = {};
                    if (opts.ini) options.skip = opts.ini;
                    if (opts.count) options.limit = opts.count;
                    if (opts.sort) options.sort = [[opts.sort.slice(1),
                    //IF para ver si es + || - 
                    (opts.sort.charAt(0) == '+' ? 1 : -1)]];

                    //Recorremos las propiedades de la query y comprobamos si es un array, en ese caso sacamos lo datos 
                    //del array y lo adaptamos a la query de mongodb
                    for (let attr in query) {
                        if (Array.isArray(query[attr])) query[attr] = { $in: query[attr] };
                    }

                    col.find(query, options).toArray((err, results) => {
                        if (err) _cb(err);
                        else {
                            //results es un vector de los datos del usuario por eso solo le pasaremos los datos que sean necesarios
                            results = results.map((doc) => {
                                return {
                                    id: doc._id.toHexString(), name: doc.name,
                                    surname: doc.surname, email: doc.email, nick: doc.nick,
                                    avatar: doc.avatar
                                };
                            });
                            //No hay errores asi que pasamos los resultados
                            _cb(null, results);
                        }
                    });
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
            let customer = db.collection('customer');
            customer.findOne({ _id: new mongodb.ObjectId(token) },
                (err, _user) => {
                    if (err) _cb(err);
                    else if (_user.type != 'employee') _cb(new Error('This user is not a employee'));
                    else {
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

//Para el type se puede crear un selector
//Ok
function addProduct(token, newProduct, cb) {
    console.log('connected')
    if (!newProduct.name) cb(new Error('Property name missing'));
    else if (!newProduct.price) cb(new Error('Property price missing'));
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
            let customer = db.collection('customer');
            customer.findOne({ _id: new mongodb.ObjectId(token) },
                (err, _user) => {
                    if (err) _cb(err);
                    else if (_user.type != 'employee') _cb(new Error('This user is not a employee'));
                    else {
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
    });

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
