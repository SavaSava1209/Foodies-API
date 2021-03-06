const client = require('./signin').client


const requireAuth = (req, res, next) => {
   const { authorization } = req.headers;   
   if (!authorization) {
      return res.status(401).json('Unauthorized')
   }
   return client.get(authorization, (err, reply) => {
       if (err || !reply) {
           return res.status(401).json('Unauthorized not right')
       }
       return next()
   })
  
}

module.exports = {
    requireAuth
}