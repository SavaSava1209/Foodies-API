const jwt = require('jsonwebtoken');
const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL); 



const handleSignin = (req, res, db, bcrypt, saltRounds) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return Promise.reject('incorrect form submission')
    }
    return db('login').where({
        email: email
    })    
    .then(user => {       
        const hash = user[0].password;
        const email = user[0].email;
        return bcrypt.compare(password, hash).then(result => {           
            if (result === true) {
            return db('users').where({
                email: email
                })
                .then(data => {                                 
                    return Promise.resolve(data[0])                    
                })
                .catch(error => Promise.reject('unable to load user'))
        } else {
            return Promise.reject('incorrect email/password')
        
        }
        })     
    })
    .catch(error => Promise.reject('No such user'))

   } 

   const getAuthTokenId = (req, res) => {
       const { authorization } = req.headers;
  
       return client.get(authorization, (err, reply) => {
           if (err || !reply) {
               return res.status(400).json('Unauthorized')
           } else {
               return res.json({ id: reply })
           }
       })
   }

   const setToken = (key, value) => {       
       return Promise.resolve(client.set(key, value))
   }

   const createSession = (data) => {
       const { email, user_id } = data;
       const token = jwt.sign({ email }, 'JWT_SECRET', { expiresIn: '10h' });
       return setToken(token, user_id).then(() => {
           return { success: 'true', userId: user_id, token }
       }).catch(err => console.log('createsession'))
   };

    const signinAuthorization = (req, res, db, bcrypt, saltRounds) => {
        const   {authorization}   = req.headers;        
        return authorization ? getAuthTokenId(req, res): 
            handleSignin(req, res, db, bcrypt, saltRounds)
            .then(data => {               
                return data.user_id && data.email? createSession(data): Promise.reject(data)
            })
            .then(session => res.json(session))
            .catch(err => console.log('noo'))
    }
  
    

module.exports = {
    signinAuthorization,
    client
}