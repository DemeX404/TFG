/*Se almacena la GUI de nuestra aplicacion web, desde aqui señalamos que paginas se van a cargar
 y cuales se ocultan */

let pages = {};
//Ok
pages.login = {
    show: function (data) { console.log('login.show()'); },
    hide: function () { console.log('login.hide()'); },
    register: function () {
        console.log('login.register()');
        navigateTo('register');
    },
    login: function () {
        console.log('login.login()');
        //Obtenemos las variables del HTML
        let name = document.getElementById('name').value;
        let password = document.getElementById('password').value;
        login(name, password, (err, token, user) => {
            if (err) alert('Error: ' + err.stack);
            else {
                //Guardamos el token
                window.token = token;
                window.user = user;
                if (user.type == 'owner') {
                    navigateTo('owner');
                } else if (user.type == 'employee') {
                    navigateTo('choose');
                } else {
                    navigateTo('home');
                }
            }
        });
    }
};
//Ok
pages.register = {
    show: function (data) { console.log('register.show()'); },
    hide: function () { console.log('register.hide()'); },
    login: function () {
        console.log('register.login()');
        navigateTo('login');
    },
    register: function () {
        console.log('register.register()');
        let name = document.getElementById('name').value;
        let surname = document.getElementById('surname').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let phone = document.getElementById('phone').value;
        let type = "customer";
        let orders = [];
        addUser({
            name: name, surname: surname, email: email, password: password,
            phone: phone, type: type, orders: orders
        }, (err, user) => {
            if (err) alert('Error: ' + err.stack);
            else {
                navigateTo('login')
            }
        });
    }
};
pages.home = {
    show: function (data) {
        console.log('home.show()');
        pages.home.refresh();
    },
    hide: function () { console.log('home.hide()'); },
    refresh: function () {
        console.log('home.refresh()');
        let htmlTabs = ``;
        let htmlProductsHead = ``;
        let htmlProductsBody = ``;
        let htmlModal = ``;
        listMenu({}, (err, colProduct) => {
            if (err) alert('Error: ' + err.stack);
            else {
                let type = [];
                colProduct.forEach((product) => {
                    if (product['type'] != null) {
                        type.push(product['type']);
                        htmlTabs += `
                        <li class="tab col s3"><a href="#${product.type}" style="color: #3454d1;"> ${product.type}</a></li>`
                        htmlProductsHead += `
                        <div id="${product.type}" class="col s12">
                            <div class="section">
                                <h4 style="color: #3454D1;"> ${product.type}</h4>
                            </div>
                            <div class="divider"></div>
                            <div id="products_${product.type}"></div>
                        </div>`;
                    }
                });
                document.getElementById('types').innerHTML = htmlTabs || 'No types';
                document.getElementById('producTab').innerHTML = htmlProductsHead || 'No types';

                colProduct.forEach((product) => {
                    if (product['typePr'] != null) {
                        htmlProductsBody = `
                        <a id="products_${product.typePr}Pr" class="modal-trigger" href="#modal${product._id}" style="">
                            <div class="section flex-h" style="color: #3454D1;">
                                <div>
                                    <h5>${product.name}</h5>
                                    <span>${product.description} </span>
                                </div>
                                <img class="responsive-img" style="width: 250px; align-self: flex-end;"
                                src="images/1entrante.jpg">
                            </div>
                        </a>`;
                        htmlModal += `
                        <div id="modal${product._id}" class="modal">
                        <div class="modal-content">
                            <div class="col s12 m6">
                                <div class="card">
                                    <div class="card-image">
                                        <img src="images/1entrante.jpg" style="width: 75%; margin-left: auto; margin-right: auto;">
                                    </div>
                                    <div class="divider"></div>
                                    <div class="card-content">
                                        <div style="color: #3454D1;">
                                            <div>
                                                <h5>${product.name}</h5>
                                                <span style="margin-left: 25px">${product.description} </span>
                                            </div>
                                        </div>
                                        <div class="divider" style="margin: 20px;"></div>
                                        <div style="color: #3454D1;">
                                            <div>
                                                <h5>Add Note</h5>
                                                <form class="col s12" style="margin-left: 25px">
                                                    <div class="input-field col s12">
                                                        <textarea id="textarea1" class="materialize-textarea"></textarea>
                                                        <label for="textarea1">Note</label>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-action"
                                        style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <a class="waves-teal btn-flat" style="margin: 0px; color: #070707;">
                                                <i class="material-icons">remove</i>
                                            </a>
                                            <input id="qty" type="number" style="width: 50%;border-style: groove; text-align: center;"
                                                value="0">
                                            <a class="waves-teal btn-flat" style="margin: 0px; color: #070707;">
                                                <i class="material-icons">add</i>
                                            </a>
                                        </div>
                                        <a href="#" onclick="pages.home.createOrder('${product._id}')" class="waves-effect waves-light btn"
                                            style="width:25%;background-color:#3454D1;">Ok</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    document.getElementById(`products_${product.typePr}`).insertAdjacentHTML('afterend', htmlProductsBody);
                    }                    
                });
                document.getElementById('modals').innerHTML = htmlModal || 'No modal found';

                // Init sidenav
                var nodes = document.querySelectorAll('.sidenav');
                var sidenavs = M.Sidenav.init(nodes, { edge: 'left' });
                // Init modal
                var nodes = document.querySelectorAll('.modal');
                var modals = M.Modal.init(nodes, {});
                //Init tabs
                var nodes = document.querySelectorAll('.tabs');
                var tabs = M.Tabs.init(nodes, {});
            }
        });
    },
    createOrder: function(productID){
        /*Hay que arreglar las variables qty y notes, se queda guardado el anterior
        Creo que es porque se queda guardado el primer valor, habra que resetear estos 
        campos despues de ejecutar la funcion*/
        console.log(`home.createOrder(${productID})`);
        let qty = document.getElementById('qty').value;
        let notes = document.getElementById('textarea1').value;
        createOrder(token,{productId: productID, qty: qty, notes: notes},(err, cb)=>{
            if(err) alert('Error: '+err.stack);
            else{
                alert('Product added to the order');
            }
        });
    },
    login: function () {
        console.log('home.login()');
        navigateTo('home');
    },
    home: function () {
        console.log('home.home()');
        navigateTo('home');
    },
    profile: function () {
        console.log('home.profile()');
        navigateTo('profile');
    },
    order: function () {
        console.log('home.order()');
        navigateTo('order');
    },
};
pages.profile = {
    show: function (data) { console.log('profile.show()'); },
    hide: function () { console.log('profile.hide()'); },
    home: function () {
        console.log('profile.home()');
        navigateTo('home');
    },
    login: function () {
        console.log('profile.login()');
        navigateTo('login');
    },
    profile: function () {
        console.log('profile.profile()');
        navigateTo('profile');
    },
};
pages.order = {
    show: function (data) { console.log('order.show()'); },
    hide: function () { console.log('order.hide()'); },
    ticket: function () {
        console.log('order.ticket()');
        navigateTo('ticket');
    },
    home: function () {
        console.log('order.home()');
        navigateTo('home');
    },
};
pages.ticket = {

    show: function (data) { console.log('ticket.show()'); },
    hide: function () { console.log('ticket.hide()'); },
    home: function () {
        console.log('ticket.home()');
        navigateTo('home');
    },
};
//Ok
pages.owner = {
    show: function (data) {
        console.log('owner.show()');
        pages.owner.refresh();
    },
    hide: function () { console.log('owner.hide()'); },
    refresh: function () {
        console.log('owner.refresh()');
        let html = ``;
        listMenu({}, (err, colProduct) => {
            if (err) alert('Error: ' + err.stack);
            else {
                colProduct.forEach((product) => {
                    if (product['typePr'] != null) {
                        html += `
                        <tr>
                            <td>${product.typePr}</td>
                            <td>${product.name}</td>
                            <td>${product.sale}</td>
                        </tr>
                        `;
                    }
                });
                document.getElementById('tbody').innerHTML = html || 'No types';
            }
        });
    },
    createPrTy: function () {
        console.log('owner.createPrTy()');
        navigateTo('createPrTy');
    },
    login: function () {
        console.log('owner.login()');
        navigateTo('login');
    },
    creatEmpl: function () {
        console.log('owner.creatEmpl()');
        navigateTo('creatEmpl');
    },
    createPrTy: function () {
        console.log('owner.createPrTy()');
        navigateTo('createPrTy');
    }
};
//Ok
pages.creatEmpl = {
    show: function (data) { console.log('creatEmpl.show()'); },
    hide: function () { console.log('creatEmpl.hide()'); },
    owner: function () {
        console.log('creatEmpl.owner()');
        navigateTo('owner');
    },
    creatEmpl: function () {
        console.log('createEmpl.createEmpl()');
        let name = document.getElementById('name').value;
        let surname = document.getElementById('surname').value;
        let dni = document.getElementById('dni').value;
        let password = document.getElementById('password').value;
        let phone = document.getElementById('phone').value;
        let type = "employee";

        addUser({ name: name, surname: surname, dni: dni, password: password, phone: phone, type: type }, (err, employe) => {
            if (err) alert('Error: ' + err.stack);
            else {
                alert('Employee create succefuly');
            }
        });
    }
};
//Ok
pages.choose = {
    show: function (data) { console.log('choose.show()'); },
    hide: function () { console.log('choose.hide()'); },
    dining: function () {
        console.log('choose.dining()');
        navigateTo('dining');
    },
    kitchen: function () {
        console.log('choose.kitchen()');;
        navigateTo('kitchen');
    }
};
pages.kitchen = {
    show: function (data) { console.log('kitchen.show()'); },
    hide: function () { console.log('kitchen.hide()'); },
    login: function () {
        console.log('kitchen.login()');
        navigateTo('login');
    }
};
pages.diningRoom = {
    show: function (data) { console.log('diningRoom.show()'); },
    hide: function () { console.log('diningRoom.hide()'); }
};
//Ok
pages.createPrTy = {
    show: function (data) {
        console.log('createPrTy.show()');
        pages.createPrTy.refresh();
    },
    hide: function () { console.log('createPrTy.hide()'); },
    refresh: function () {
        console.log('createPrTy');
        let html = ``;
        let optionHtml = ``;
        listMenu({}, (err, colProduct) => {
            if (err) alert(err.stack);
            else {
                colProduct.forEach((product) => {
                    if (product['type'] != null) {
                        optionHtml +=
                            `<option value="${product.type}" id="type"> ${product.type}</option>`
                    }
                });
                html = `
                    <select>
                        <option value="" disabled selected>Choose type</option>
                        ${optionHtml}
                    </select>
                    <label>Type Food</label>`;

                document.getElementById('allTypes').innerHTML = html || 'No types';
                //Init FormSelect
                var nodes = document.querySelectorAll('select');
                var FormSelect = M.FormSelect.init(nodes, {});
            }
        });
    },
    owner: function () {
        console.log('createPrTy.owner()');
        navigateTo('owner');
    },
    addType: function () {
        console.log('createPrTy.addType()');
        let type = document.getElementById('type').value;
        addType({ type: type }, (err, newType) => {
            if (err) alert('Error: ' + err.stack);
            else {
                console.log(newType);
                pages.createPrTy.refresh();
            }
        });
    },
    addProduct: function () {
        console.log('createPrTy.addProduct()');
        let name = document.getElementById('name').value;
        let price = document.getElementById('price').value;
        let elems = document.querySelector('select');
        var FormSelect = M.FormSelect.init(elems, {});
        let type = FormSelect.getSelectedValues();
        let description = document.getElementById('description').value;

        addProduct({
            name: name, price: price,
            typePr: type[0], description: description
        }, (err, newProduct) => {
            if (err) alert('Error: ' + err.stack);
            else {
                pages.createPrTy.refresh();
            }
        });
    }
};


const fs = require('fs');
const pathViews = 'app/www';
let currentPage = null;

//Funcion para naver entre las diferentes vistas
function navigateTo(page, data, cb) {
    console.log(`navigateTo(${page}, ${data})`);
    if (!pages[page]) {
        if (cb) cb(new Error('Target page not found'));
    } else {
        // - scanning page
        if (pages[page].content) {
            // - content cached
            if (currentPage) currentPage.hide();
            document.getElementById('app').innerHTML = pages[page].content;
            currentPage = pages[page];
            currentPage.show(data);
            if (cb) cb();
        } else {
            // - content not cached
            fs.readFile(pathViews + '/' + page + '.html', (err, content) => {
                if (err) {
                    if (cb) cb(err);
                } else {
                    // - cache content
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(content, "text/html");
                    let nodes = doc.getElementsByTagName('body');
                    pages[page].content = nodes[0].innerHTML;
                    if (currentPage) currentPage.hide();
                    document.getElementById('app').innerHTML = pages[page].content;
                    currentPage = pages[page];
                    currentPage.show(data);
                    if (cb) cb();
                }
            });
        }
    }
}

navigateTo('login');