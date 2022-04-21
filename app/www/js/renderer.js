/*Se almacena la GUI de nuestra aplicacion web, desde aqui señalamos que paginas se van a cargar
 y cuales se ocultan */

let pages = {};
pages.login = {
    show: function (data) { console.log('login.show()'); },
    hide: function () { console.log('login.hide()'); }
};
pages.register = {
    show: function (data) { console.log('register.show()'); },
    hide: function () { console.log('register.hide()'); }
};
pages.home = {
    show: function (data) { console.log('home.show()'); },
    hide: function () { console.log('home.hide()'); }
};
pages.home = {
    show: function (data) { console.log('home.show()'); },
    hide: function () { console.log('home.hide()'); }
};
pages.profile = {
    show: function (data) { console.log('profile.show()'); },
    hide: function () { console.log('profile.hide()'); }
};
pages.order = {
    show: function (data) { console.log('order.show()'); },
    hide: function () { console.log('order.hide()'); }
};
pages.ticket = {
    show: function (data) { console.log('ticket.show()'); },
    hide: function () { console.log('ticket.hide()'); }
};
pages.owner = {
    show: function (data) { console.log('owner.show()'); },
    hide: function () { console.log('owner.hide()'); }
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

const fs = require('fs');
const pathViews = 'app/www';
let currentPage = null;

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