const express = require('express');
const port = 3000;
const path = require('path');
const expressEjsLayouts = require('express-ejs-layouts')

// calling the mongoose.js file 
const db = require('./config/mongoose');

const Contact = require('./models/contact');
// console.log(Contact);
// console.log(db);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// telling app to use express ejs layouts
app.use(expressEjsLayouts);
// extract style and scripts from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.urlencoded());
app.use(express.static('static'));

app.get('/', (req, res) => {
    Contact.find({}, (err, data) => {
        if (err) {
            console.log('Error on fetching the contacts from database');
            return;
        }
        res.render('home', {
            title: 'My Contact List',
            contact_list: data
        });
    })
})

app.post('/create-contact', (req, res) => {
    console.log(req.body)
    // console.log(req.body.name+" contact name");

    Contact.create(req.body, (err, data) => {
        if (err) {
            console.log("Error on creating new contact");
            return;
        }
        console.log(data + " is successfully store in a database");
        res.redirect('/');
    })

})

app.get('/delete-contact/', (req, res) => {
    console.log(req.query);
    let id = req.query.id;
    Contact.findByIdAndDelete(id, (err) => {
        if (err) {
            console.log('Erron on deleting contact');
            return;
        }
        res.redirect('back');
    })

})

app.get('/add-contact', (req, res) => {
    return res.render('add_contact.ejs');
})

app.get('/update/:id', (req, res) => {
    Contact.findById(req.params.id, (err, contact) => {
        return res.render('update_contact.ejs', {
            contact
        });
    })
})

app.post('/update-contact/:id', (req, res) => {
    Contact.findByIdAndUpdate(req.params.id, req.body, (err, contact) => {
        console.log('Contact is successfully updates');
        return res.redirect('/');
    })
})

app.post('/search-contact', (req, res) => {
    Contact.find({ name: req.body.contact }, (err, contacts) => {
        return res.render('search_contact.ejs', {
            contacts
        });
    })
})

app.listen(port, function (err, data) {
    if (err) {
        console.log('There is a problem in server, please try after some time');
        return;
    }

    console.log(`Server is up and running at ${port}`);
})