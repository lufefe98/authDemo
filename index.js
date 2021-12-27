// Express Connection and middleware
const express = require('express')
const app = express();

const bcrypt = require('bcrypt')
const session = require('express-session')
const sessionOptions = {secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false}


app.listen(3000, () => {
    console.log('Serving from localhost 3k')
})





// Mongoose connection
const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://localhost:27017/authDemo', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false ---> I might not need this because I don't get any deprecation warning
    })
    console.log('DATABASE CONNECTED')
        }
        
    main().catch(err => {
        console.log('ERROR, CONNECTION FAILED'),
        console.log(err)
    });





// Other (External code)
    app.use(express.urlencoded({ extended: true }))
    app.use(session(sessionOptions))




// EJS Connection
app.set('view engine', 'ejs')
app.set('views', 'views')





// File Connections
// models
const User = require('./models/user')





// Routes
app.get('/', (req, res) => {
    res.send('This is the home page')
})

app.get('/register', (req, res) => {
    res.render('register')
})

// In this case, we use an app.post instead of app.get because users will be sending their usernames and passwords and we do not want that in the query string
app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash
    })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    // try {
        const  { username, password: password } = req.body;
    const user = await User.findOne({username});
    const validPassword = await bcrypt.compare(password, user.password)
    if (validPassword) {
        req.session.user_id = user._id
        res.redirect('/secret')
    } else{
        res.send('Try again')
    }
// } catch(err){
//     console.log(err)
// }
})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/login');
})

app.get('/secret', (req, res) => {
    if(!req.session.user_id){
    return res.redirect('/login')
    }
    res.render('secret')
})