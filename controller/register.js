
const jwt = require('jsonwebtoken');


const handleRegister = (req, res, db, bcrypt, saltRounds) => {
    const { username, email, password } = req.body
   
    if (!username || !email || !password) {
        return res.status(400).json('incorrect form submission')
    } 

    bcrypt.hash(password, saltRounds, function(err, hash) {
         db.transaction( trx => {
            trx.insert({ 
              email: email, 
              password: hash 
            })
            .into('login')
            .returning('email')
            .then( loginEmail => {
                return trx('users').insert({
                    email: loginEmail[0],
                    username: username,
                    create_on: new Date()
                })
                .returning('*')
                .then(user => {    
                    const token = jwt.sign( user[0].email , 'JWT_SECRET', { expiresIn: '10h' });
                    return res.json(user[0])
                })
                .then(console.log)
            })

            .then(trx.commit)
            .catch(trx.rollback)            
         })
        .catch(err => res.status(400).json('Unable to register'))
    });
}



module.exports = {
    handleRegister,
}