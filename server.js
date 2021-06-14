const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const image = require('./controller/image.js');
const recipes = require('./controller/recipes.js');
const signin = require('./controller/signin.js');
const register = require('./controller/register.js');
const profile = require('./controller/profile.js');
const saved_recipes = require('./controller/saved_recipes.js')
const auth = require('./controller/authorization.js')


const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {     
       connectionString: process.env.DATABASE_URL,
       ssl: {
           rejectUnauthorized: false
       }
    }
});
  

const app = express()

app.use(express.json())
app.use(cors());

app.get('/', (req, res) => res.send('it is working'))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt, saltRounds) })
app.post('/signin', (req, res) => { signin.signinAuthorization(req, res, db, bcrypt, saltRounds) })
app.post('/image', auth.requireAuth, (req, res) =>  { image.handleApiCall(req, res) });
app.post('/recipes', auth.requireAuth, (req, res) => { recipes.handleApiCall(req, res) });
app.get('/saved_recipes/:id', auth.requireAuth, (req, res) => { saved_recipes.getSavedRecipes(req, res, db) });
app.post('/saved_recipes/:id', auth.requireAuth, (req, res) => { saved_recipes.addSavedRecipes(req, res, db) });
app.delete('/saved_recipes/:id',  auth.requireAuth, (req, res) => { saved_recipes.deleteRecipes(req, res, db)})
app.put('/saved_recipes/:id', auth.requireAuth,  (req, res) => { saved_recipes.addNote(req, res, db)})

app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.getProfile(req, res, db) })
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) })


app.listen(process.env.PORT, ()=> {
    console.log('port is working on env')
})