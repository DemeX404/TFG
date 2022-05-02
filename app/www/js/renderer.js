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
        addUser({ name: name, surname: surname, email: email, password: password, phone: phone, type: type }, (err, user) => {
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
        // Init sidenav
        var nodes = document.querySelectorAll('.sidenav');
        var sidenavs = M.Sidenav.init(nodes, { edge: 'left' });
        // Init modal
        var nodes = document.querySelectorAll('.modal');
        var modals = M.Modal.init(nodes, {});
        //Init tabs
        var nodes = document.querySelectorAll('.tabs');
        var tabs = M.Tabs.init(nodes, {});
    },
    hide: function () { console.log('home.hide()'); },
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
pages.owner = {
    show: function (data) { console.log('owner.show()'); },
    hide: function () { console.log('owner.hide()'); },
    createPrTy: function () {
        console.log('owner.createPrTy()');
        navigateTo('createPrTy');
    },
    creatEmpl: function(){
        console.log('owner.createEmpl()');
        navigateTo('createEmpl');
    }
};
pages.createEmpl = {
    show: function (data) { console.log('createEmpl.show()'); },
    hide: function () { console.log('createEmpl.hide()'); }
};
pages.choose = {
    show: function (data) { console.log('choose.show()'); },
    hide: function () { console.log('choose.hide()'); }
};
pages.kitchen = {
    show: function (data) { console.log('kitchen.show()'); },
    hide: function () { console.log('kitchen.hide()'); }
};
pages.diningRoom = {
    show: function (data) { console.log('diningRoom.show()'); },
    hide: function () { console.log('diningRoom.hide()'); }
};
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
        let count = 0;
        listMenu({}, (err, colProduct) => {

            colProduct.forEach((product) => {
                count++;
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
        });
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
        console.log(type[0]);

        addProduct({ name: name, price: price, typePr: type[0] }, (err, newProduct) => {
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