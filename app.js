const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const passwordHash = require('password-hash');
const fetch = require('node-fetch');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

app.get('/', (req, res) => {
    res.redirect('/login.html');
});

app.get('/login.html', (req, res) => {
    res.render('login', { message: null });
});

app.get('/signup.html', (req, res) => {
    res.render('signup');
});

app.post('/signupSubmit', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const usersData = await db.collection('users').where('email', '==', email).get();

        if (!usersData.empty) {
            return res.render('signup', { message: 'This account already exists.' });
        }

        await db.collection('users').add({
            userName: username,
            email: email,
            password: passwordHash.generate(password)
        });

        res.render('login', { message: 'Signup successful! Please log in.' });
    } catch (error) {
        res.send('Something went wrong.');
    }
});

app.post('/loginSubmit', async (req, res) => {
    const { username, password } = req.body;

    try {
        const usersData = await db.collection('users').where('userName', '==', username).get();

        let verified = false;
        let user = null;

        usersData.forEach((doc) => {
            if (passwordHash.verify(password, doc.data().password)) {
                verified = true;
                user = doc.data();
            }
        });

        if (verified) {
            res.render('welcome', { username: user.userName });
        } else {
            res.render('login', { message: 'Login failed. Please try again.' });
        }
    } catch (error) {
        res.send('Something went wrong.');
    }
});

app.get('/recipe.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'recipe.html'));
})

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
