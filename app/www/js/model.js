const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';

/****   CUSTOMERS  ****/
function addClient(user, cb) {
    if (!user.name) cb(new Error('Property name missing'));
    else if (!user.surname) cb(new Error('Property surname missing'));
    else if (!user.email) cb(new Error('Property email missing'));
    else if (!user.password) cb(new Error('Property password missing'));
    else if (!user.phone) cb(new Error('Property phone missing'));
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
                            user["type"] = "customer";
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

function updateClient(token, user, cb) {
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

            let query = { _id: new mongodb.ObjectId(token) };
            col.updateOne(query, {
                $set: {
                    "name": user.name,
                    "surname": user.surname,
                    "email": user.email,
                    "password": user.password,
                    "nick": user.nick
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

//No se puede hacer hasta que tenga los productos y tipos crea
function listMenu(token, opts, cb) {

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

function createOrder(token, content, cb) {

    MongoClient.connect(url, function (err, client) {
        if (err) cb(err);
        else {
            console.log('connected.');
            function _cb(err, result) {
                client.close();
                cb(err, result);
            }
            var db = client.db('twitter');
            var col = db.collection('tweets');
            var col_User = db.collection('users');
            //Sirve para buscar si el usuario ya existe
            col_User.findOne({ _id: new mongodb.ObjectID(token) }, (err, _user) => {
                if (err) _cb(err)
                else if (!_user) _cb(new Error('User not exists'));
                else {
                    let tweet = {
                        owner: token,
                        date: Date.now(), content: content, likes: [], dislikes: []
                    };
                    col.insertOne(tweet, (err, result) => {
                        if (err) _cb(err);
                        else _cb(null, {
                            id: result.insertedId.toHexString(), owner: tweet.owner,
                            date: tweet.date, content: tweet.content, likes: tweet.likes, dislikes: tweet.dislikes
                        });
                    });
                }
            });

        }

    });

}

function editOrder(token, orderID, cb) {
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

            let query = { _id: new mongodb.ObjectId(token) };
            col.updateOne(query, {
                $set: {
                    "name": user.name,
                    "surname": user.surname,
                    "email": user.email,
                    "password": user.password,
                    "nick": user.nick
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
                        product.findOne({ name: type.name },
                            (err, _user) => {
                                if (err) _cb(err);
                                else if (_user) _cb(new Error('Type already exists'));
                                else {
                                    type['name'] = type.name.toLowerCase();
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

//No se esta cambiando bien el id de los arrays
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

            col.updateOne({ lstPr: objectPr }, {
                $pull: {"lstPr": productID}
            }, (err, _oldPr) => {
                if (err) _cb(err);
                else {
                    console.log(objectPr);
                    col.updateOne({ type: product.typePr }, {
                        $pull: { lstPr: productID }
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
