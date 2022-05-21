const { dialog } = require('electron').remote
const { remote } = require('electron')


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
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Wrong credentials');
            }
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
        var image = document.getElementById('image').files[0];

        let formData = new FormData();
        formData.append('name', name);
        formData.append('surname', surname);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('type', "customer");
        formData.append('image', image);

        addUser(formData, (err, user) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error at the moment to uploa the user');
            }
            else {
                remote.dialog.showMessageBox(
                    remote.getCurrentWindow(),
                    {
                        title: 'Register',
                        message: 'User registered'
                    }
                ).then(() => {
                    console.log('Dialog closed!');
                });
                navigateTo('login')
            }
        });
    },
    showPreview: function (event) {
        console.log('register.showPreview()');
        if (event.target.files.length > 0) {
            console.log('yee que entro');
            var src = URL.createObjectURL(event.target.files[0]);
            var preview = document.getElementById("preview");
            preview.src = src;
            preview.style.display = "block";
            var hide = document.getElementById("hide");
            hide.style.display = "none";
        }
    }
};
//Ok
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
        let htmlUserImage = ``;

        if (user.image != 'none') {
            htmlUserImage = `
            <img src="${user.image}" style="width: 50%;">
            `;
        } else {
            htmlUserImage = `
                <i class="large material-icons prefix">account_circle</i>
            `;
        }
        document.getElementById('image').innerHTML = htmlUserImage;

        listMenu(token, {}, (err, colProduct) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error showing products');
            }
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
                                <h4 class="center-align" style="color: #3454D1;"> ${product.type}</h4>
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
                                <img class="responsive-img" style="width: 15%; align-self: flex-end;"
                                src="${product.image}">
                            </div>
                        </a>`;
                        htmlModal += `
                        <div id="modal${product._id}" class="modal">
                        <div class="modal-content">
                            <div class="col s12 m6">
                                <div class="card">
                                    <div class="modal-head">
                                        <a href="#!" class="modal-close right-align">
                                            <i class="material-icons">clear</i>
                                        </a>
                                    </div>
                                    <div class="card-image">
                                        <img src="${product.image}" style="width: 25%; margin-left: auto; margin-right: auto;">
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
                                                        <textarea id="textarea_${product._id}" class="materialize-textarea"></textarea>
                                                        <label for="textarea1">Note</label>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-action"
                                        style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <a onclick="pages.home.decrement('${product._id}')" class="waves-teal btn-flat" style="margin: 0px; color: #070707;">
                                                <i class="material-icons">remove</i>
                                            </a>
                                            <input id="qty_${product._id}" disabled type="number" style="width: 50%;border-style: groove; text-align: center;"
                                                value="1">
                                            <a onclick="pages.home.increment('${product._id}')" class="waves-teal btn-flat" style="margin: 0px; color: #070707;">
                                                <i class="material-icons">add</i>
                                            </a>
                                        </div>
                                        <a href="#" onclick="pages.home.createOrder('${product._id}')" class="modal-close waves-effect waves-light btn"
                                            style="width:25%;background-color:#3454D1;">Add to basket</a>
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
    increment: function (productID) {
        console.log('home.increment()');
        document.getElementById(`qty_${productID}`).stepUp();

    },
    decrement: function (productID) {
        console.log('home.decrement()');
        document.getElementById(`qty_${productID}`).stepDown();
    },
    createOrder: function (productID) {
        console.log(`home.createOrder(${productID})`);
        let qty = +document.getElementById(`qty_${productID}`).value;
        let notes = document.getElementById(`textarea_${productID}`).value;


        createOrder(token, { productId: productID, qty: qty, notes: notes }, (err, _order) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error when adding the product to the order');
            }
            else {
                document.getElementById(`qty_${productID}`).value = '0';
                document.getElementById(`textarea_${productID}`).value = '';
                remote.dialog.showMessageBox(
                    remote.getCurrentWindow(),
                    {
                        title: 'Order',
                        message: 'Product added to the order'
                    }
                ).then(() => {
                    console.log('Dialog closed!');
                });
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
//Ok
pages.profile = {
    show: function (data) {
        console.log('profile.show()');

        // Init sidenav
        var nodes = document.querySelectorAll('.sidenav');
        var sidenavs = M.Sidenav.init(nodes, { edge: 'left' });

        //Se rellenan los campos con la informacion del usuario
        document.getElementById('name').value = user.name;
        document.getElementById('surname').value = user.surname;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone;
        document.getElementById('password').value = user.password;
        document.getElementById('profile').files[0] = user.image;

        let htmlUserImage = ``;
        let htmlUserImageSN = ``;
        if (user.image != 'none') {
            htmlUserImage = `
                <img id="preview" src="${user.image}" style="width: 50%;">
            `;
            htmlUserImageSN = `
                <img id="previewSN" src="${user.image}" style="width: 50%;">
            `;
        } else {
            htmlUserImage = `
                <i id="hide" class="large material-icons prefix">account_circle</i>
            `;
            htmlUserImageSN = `
                <i id="hideSN" class="large material-icons prefix">account_circle</i>
            `;
        }
        document.getElementById('image').innerHTML = htmlUserImage;
        document.getElementById('imageSN').innerHTML = htmlUserImageSN;
    },
    hide: function () { console.log('profile.hide()'); },
    home: function () {
        console.log('profile.home()');
        navigateTo('home');
    },
    update: function () {
        console.log('profile.update()');
        let name = document.getElementById('name').value
        let surname = document.getElementById('surname').value
        let email = document.getElementById('email').value
        let phone = document.getElementById('phone').value
        let password = document.getElementById('password').value
        var image = document.getElementById('profile').files[0];

        let formData = new FormData();
        formData.append('name', name);
        formData.append('surname', surname);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('password', password);
        formData.append('image', image);

        updateUser(token, formData,
            (err, _user) => {
                if (err) {
                    console.log('Error: ' + err.stack);
                    dialog.showErrorBox("Error:", 'Error in upload user data');
                }
                else {
                    window.user = _user
                    remote.dialog.showMessageBox(
                        remote.getCurrentWindow(),
                        {
                            title: 'Profile',
                            message: 'User data uploaded'
                        }
                    ).then(() => {
                        console.log('Dialog closed!');
                    });

                }
            });
    },
    showPreview: function (event) {
        console.log('register.showPreview()');
        if (event.target.files.length > 0) {
            var src = URL.createObjectURL(event.target.files[0]);
            var preview = document.getElementById("preview");
            preview.src = src;
            preview.style.display = "block";
            var hide = document.getElementById("hide");
            hide.style.display = "none";

        }
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
//Ok
pages.order = {
    show: function (data) {
        console.log('order.show()');

        pages.order.refresh();
    },
    refresh: function () {
        console.log('order.refresh()');

        printTicket(token, token, (err, productList) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error showing products');
            }
            else {
                let totalPrice = 0;
                let htmlProduct = ``;
                let htmlModal = ``;
                let htmlButtonCancel = ``;
                productList.forEach((product) => {
                    let finalPrice = product.qty * product.price;
                    totalPrice += finalPrice;
                    htmlProduct += `
                    <h4 style="text-decoration: underline;">${product.name} - ${product.qty}ud.</h4>
                    <div style="display: flex;justify-content: space-between;align-items: center;">
                        <div style="display: flex; align-items: center">
                            <a id="product_${product.idPr}Pr" class="modal-trigger" href="#modal_${product.idPr}" style="">
                                <i class="material-icons" style="color: #070707;">edit</i>
                            </a>
                            <div class="input-field col s12" style="margin: 20px">
                                <textarea disabled id="textarea1" class="materialize-textarea" style="border-style: ridge;"></textarea>
                                <label for="textarea1">${product.notes}</label>
                            </div>
                        </div>
                        <h5>${finalPrice} \u20AC </h5>
                        <a onclick="pages.order.removePr('${product.idOrder}',${product.id})" href="#" style="">
                            <i class="material-icons" style="color: #070707;">delete</i>
                        </a>
                    </div>`;

                    htmlModal += `
                        <div id="modal_${product.idPr}" class="modal">
                        <div class="modal-content">
                            <div class="col s12 m6">
                                <div class="card">
                                    <div class="card-image">
                                        <img src="${product.image}" style="width: 75%; margin-left: auto; margin-right: auto;">
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
                                                        <textarea id="textarea_${product.idPr}" class="materialize-textarea">${product.notes}</textarea>
                                                        <label for="textarea1" class="active">Note</label>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-action"
                                        style="display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <a onclick="pages.home.decrement('${product.idPr}')" class="waves-teal btn-flat" style="margin: 0px; color: #070707;">
                                                <i class="material-icons">remove</i>
                                            </a>
                                            <input id="qty_${product.idPr}" disabled type="number" style="width: 50%;border-style: groove; text-align: center;"
                                                value="${product.qty}">
                                            <a onclick="pages.home.increment('${product.idPr}')" class="waves-teal btn-flat" style="margin: 0px; color: #070707;">
                                                <i class="material-icons">add</i>
                                            </a>
                                        </div>
                                        <a href="#" onclick="pages.order.editOrder('${product.idOrder}', '${product.idPr}')" class="waves-effect waves-light btn"
                                            style="width:25%;background-color:#3454D1;">Ok</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;

                    htmlButtonCancel = `
                        <div style="display: flex; justify-content: center; padding-bottom: 20px;" class="col s6">
                            <a onclick="pages.order.cancel('${product.idOrder}')" class="waves-effect waves-light btn"
                                style="background-color:#3454D1; color:#EFEFEF">Cancel</a>
                        </div>
                    `;
                });
                let htmlTotalPrice = `<h5> ${totalPrice} \u20AC</h5>`;
                document.getElementById('product').innerHTML = htmlProduct;
                document.getElementById('finalPrice').innerHTML = htmlTotalPrice;
                document.getElementById('modals').innerHTML = htmlModal;
                document.getElementById('buttonCancel').innerHTML = htmlButtonCancel;

                // Init modal
                var nodes = document.querySelectorAll('.modal');
                var modals = M.Modal.init(nodes, {});
            }
        });
    },
    hide: function () { console.log('order.hide()'); },
    editOrder: function (orderID, idPr) {
        console.log('order.editOrder()');

        let qty = document.getElementById(`qty_${idPr}`).value
        let note = document.getElementById(`textarea_${idPr}`).value;

        console.log(orderID);
        editOrder(token, orderID, { productId: idPr, qty: qty, notes: note }, (err, result) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error at the moment to edit order');
            }
            else {
                remote.dialog.showMessageBox(
                    remote.getCurrentWindow(),
                    {
                        title: 'Order',
                        message: 'Order edited'
                    }
                ).then(() => {
                    console.log('Dialog closed!');
                });
                pages.order.refresh();
            }
        });

    },
    cancel: function (orderID) {
        console.log('order.cancel()');

        cancelOrder(token, orderID, (err, _result) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error at the moment to cancel the order');
            }
            else {
                remote.dialog.showMessageBox(
                    remote.getCurrentWindow(),
                    {
                        title: 'Order',
                        message: 'Order canceled'
                    }
                ).then(() => {
                    console.log('Dialog closed!');
                });
                navigateTo('home');
            }
        });
    },
    removePr: function (orderID, id) {
        console.log('order.removePr()');

        removeProductOrder(token, orderID, id, (err, _result) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error at the moment to delete the product to the order');
            }
            else {
                remote.dialog.showMessageBox(
                    remote.getCurrentWindow(),
                    {
                        title: 'Order',
                        message: 'Product deleted to the order'
                    }
                ).then(() => {
                    console.log('Dialog closed!');
                });
                pages.order.refresh();
            }
        });
    },
    ticket: function () {
        console.log('order.ticket()');
        navigateTo('ticket');
    },
    home: function () {
        console.log('order.home()');
        navigateTo('home');
    }
};
//Ok
pages.ticket = {
    show: function (data) {
        console.log('ticket.show()');

        printTicket(token, token, (err, productList) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error showing products');
            }
            else {

                let totalPrice = 0;
                let htmlTicket = ``;
                let htmlPaymentMethod = ``;
                productList.forEach((product) => {
                    let finalPrice = product.qty * product.price;
                    totalPrice += finalPrice;
                    htmlTicket += `
                        <div class="row" style="margin-bottom:5px; border-top: dotted;">
                            <div class="col s3">
                                <span>${product.name}</span>
                            </div>
                            <div class="col s3" style="padding-left:15%">
                                <span>${product.price}</span>
                            </div>
                            <div class="col s3" style="padding-left:15%">
                                <span>${product.qty}</span>
                            </div>
                            <div class="col s3" style="padding-left:15%">
                                <span>${finalPrice}</span>
                            </div>
                        </div>
                    `;
                    htmlPaymentMethod = `
                    <a onclick="pages.ticket.paymentMethod('${product.idOrder}','cash')" class="waves-effect waves-light btn" style="background: #EFEFEF; color: #070707">Cash</a>
                    <a onclick="pages.ticket.paymentMethod('${product.idOrder}','card')" class="waves-effect waves-light btn" style="background: #EFEFEF; color: #070707">Card</a>
                    `;
                });
                let htmlTotalPrice = `<h5> ${totalPrice} \u20AC</h5>`;
                document.getElementById('ticket').innerHTML = htmlTicket;
                document.getElementById('finalPrice').innerHTML = htmlTotalPrice;
                document.getElementById('paymentMethods').innerHTML = htmlPaymentMethod;
            }
        });
    },
    hide: function () { console.log('ticket.hide()'); },
    paymentMethod: function (orderID, method) {
        console.log('ticket.paymentMethod()');

        let content = { methodPay: method };
        editOrder(token, orderID, content, (err, result) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error at the moment to send the order');
            }
            else {
                remote.dialog.showMessageBox(
                    remote.getCurrentWindow(),
                    {
                        title: 'Ticket',
                        message: 'The waiter is on his way '
                    }
                ).then(() => {
                    console.log('Dialog closed!');
                });
                navigateTo('home');
            }
        });

    },
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
        listMenu(token, {}, (err, colProduct) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error showing the products');
            }
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
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error creating employee');
            }else{
                remote.dialog.showMessageBox(
                    remote.getCurrentWindow(),
                    {
                        title: 'Create Employee',
                        message: 'Employee create'
                    }
                ).then(() => {
                    console.log('Dialog closed!');
                });
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
        navigateTo('diningRoom');
    },
    kitchen: function () {
        console.log('choose.kitchen()');
        navigateTo('kitchen');
    }
};
//ok
pages.kitchen = {
    show: function (data) {
        console.log('kitchen.show()');

        pages.kitchen.refresh();
    },
    hide: function () { console.log('kitchen.hide()'); },
    refresh: function () {
        console.log('kitchen.refresh()');

        let htmlBody = ``;
        let htmlModal = ``;
        let count = 0;
        openOrders(token, (err, _openOrders) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error showing orders');
            }
            else {
                _openOrders.forEach((_user) => {
                    printTicket(token, _user.refClient, (err, order) => {
                        if (err) {
                            console.log('Error: ' + err.stack);
                            dialog.showErrorBox("Error:", 'Error showing products');
                        }
                        else {
                            htmlBody += `
                            <div style="display: flex;justify-content: space-between;margin-left: 5%;margin-right: 5%;">
                                <label>
                                    <input onclick="pages.kitchen.checkbox('${order[0].idOrder}')" id="done_${order[0].idOrder}" type="checkbox" />
                                    <span style="text-decoration: underline;color: #070707;font-size: 24px;">Order ${count}</span>
                                </label>
                                <span>N&#176 Table ${_user.num_table} </span>
                                
                            </div>
                            `;
                            order.forEach((product) => {
                                let htmlAlert = ``;
                                if (product.notes != "") {
                                    htmlAlert = `
                                    <a id="${product.idOrder}-${product.idPr}" class="modal-trigger" href="#modal_${product.idOrder}-${product.idPr}" style="">
                                        <i class="material-icons" style="vertical-align: middle;font-size: 20px; color:red">warning</i>
                                    </a>
                                    `;
                                    htmlModal += `
                                    <div id="modal_${product.idOrder}-${product.idPr}" class="modal">
                                        <div class="modal-content">
                                            <h4>Note</h4>
                                            <p>${product.notes}</p>
                                        </div>
                                        <div class="modal-footer">
                                            <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
                                        </div>
                                    </div>
                                    `;
                                }
                                htmlBody += `
                                <div style="display: flex; flex-direction: column; margin-left: 10%;">
                                    <label>
                                        <input type="checkbox" />
                                        <span style="color: #070707;">${product.qty} x ${product.name}</span>
                                        ${htmlAlert}
                                    </label>
                                </div>
                                `;
                            });
                            count++;

                            document.getElementById('body').innerHTML = htmlBody;
                            document.getElementById('modals').innerHTML = htmlModal;

                            // Init modal
                            var nodes = document.querySelectorAll('.modal');
                            var modals = M.Modal.init(nodes, {});
                        }
                    });
                });
            }
        });
    },
    login: function () {
        console.log('kitchen.login()');
        navigateTo('login');
    },
    checkbox: function (id) {
        console.log('kitchen.checkbox()');
        let checkbox = document.getElementById(`done_${id}`)

        if (checkbox.checked) {
            //Esto por ahora no funciona wip
            // pages.diningRoom.kitchen(true);
        };
    }
};
pages.diningRoom = {
    show: function (data) {
        console.log('diningRoom.show()');

        pages.diningRoom.refresh();
    },
    hide: function () { console.log('diningRoom.hide()'); },
    refresh: function () {
        console.log('diningRoom.refresh()');

        let htmlBody = ``;

        openOrders(token, (err, _openOrders) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error showing orders');
            }
            else if (_openOrders.length == 0) document.getElementById('body').innerHTML = htmlBody;
            else {
                _openOrders.forEach((_order) => {
                    printTicket(token, _order.refClient, (err, order) => {
                        if (err) {
                            console.log('Error: ' + err.stack);
                            dialog.showErrorBox("Error:", 'Error showing products');
                        }
                        else {
                            let finalPrice = 0;
                            let orderId = '';

                            order.forEach((product) => {
                                finalPrice += product.qty * product.price
                                orderId = product.idOrder
                            });
                            if (_order.methodPay != 'none') {
                                htmlBody += `
                                <div class="row" style="margin-bottom:5px; border-top: dotted;">
                                    <div class="col s3">
                                        <a onclick="pages.diningRoom.closeOrder('${orderId}')" class="waves-teal btn-flat">
                                            <i class="material-icons">delete</i>
                                        </a>
                                        <span>${_order.num_table}</span>
                                    </div>
                                    <div class="col s3" style="padding-left:15%">
                                        <span>${_order.methodPay}</span>
                                    </div>
                                    <div class="col s3" style="padding-left:15%">
                                        <span>${finalPrice}</span>
                                    </div>
                                </div>
                                `;
                            }

                            document.getElementById('body').innerHTML = htmlBody;
                        }
                    });
                });
            }
        });
    },
    closeOrder: function (orderID) {
        console.log('diningRoom.closeOrder()');

        closeOrder(token, orderID, (err, result) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error showing orders');
            }
            else {
                console.log(orderID);
                updateSales(token, orderID, (err, _result) => {
                    if (err) {
                        console.log('Error: ' + err.stack);
                        dialog.showErrorBox("Error:", 'Error uploading sales');
                    }
                    else {
                        pages.diningRoom.refresh();
                    }
                });
            }
        });
    },
    login: function () {
        console.log('diningRoom.login()');
        navigateTo('login');
    },
    kitchen: function (bool) {
        //Esto por el momento no funciona a lo mejor la generar la conexion puede funcionar
        let htmlKitchen = ``;

        if (bool) {
            htmlKitchen = `
            <a onclick="pages.diningRoom.kitchen(false)" class="btn-flay">
                <div style="display: flex;justify-content: center;align-items: center;">
                    <h4 style="color:red">Kitchen</h4>
                    <i class="material-icons" style="padding-top: 3%; padding-left: 10px; color:red">warning</i>
                </div>
            </a>
        `;
        } else {
            htmlKitchen = ``;
        }

        document.getElementById('kitchen').innerHTML = htmlKitchen;

        pages.diningRoom.refresh()

    }
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
        listMenu(token, {}, (err, colProduct) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error showing products');
            }
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
        addType(token, { type: type }, (err, newType) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error add the new tye');
            }
            else {
                remote.dialog.showMessageBox(
                    remote.getCurrentWindow(),
                    {
                        title: 'Add Type',
                        message: 'New type created'
                    }
                ).then(() => {
                    console.log('Dialog closed!');
                });
                pages.createPrTy.refresh();
            }
        });
    },
    addProduct: function () {
        console.log('createPrTy.addProduct()');
        let name = document.getElementById('name').value;
        let price = +document.getElementById('price').value;
        let elems = document.querySelector('select');
        var FormSelect = M.FormSelect.init(elems, {});
        let type = FormSelect.getSelectedValues();
        let description = document.getElementById('description').value;
        var image = document.getElementById('image').files[0];

        let formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('typePr', type);
        formData.append('description', description);
        formData.append('image', image);

        addProduct(token, formData, (err, newOrder) => {
            if (err) {
                console.log('Error: ' + err.stack);
                dialog.showErrorBox("Error:", 'Error add the new product');
            }
            else {
                remote.dialog.showMessageBox(
                    remote.getCurrentWindow(),
                    {
                        title: 'New Product',
                        message: 'New product created'
                    }
                ).then(() => {
                    console.log('Dialog closed!');
                });
                pages.createPrTy.refresh();
            }
        });
    }
};


const fs = require('fs');
const { BulkOperationBase } = require('mongodb');
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