
const handleProfileUpdate = (req, res, db) => {
    const {  username, dob } = req.body.formUpdate
    const { id } = req.params;
   
    if (!username) {
        return res.status(400).json('incorrect form submitted')
    }
   
    db('users').where( 'user_id', '=', id ).update({
        username: username,
        dob: dob
    })
    .returning(['username', 'dob' ])
    .then(user => {
       res.json(user[0])
    })
    .catch(err => res.status(400).json(err))
};

const getProfile = (req, res, db) => {
   const { id } = req.params;

    return db('users').where({user_id : id})
            .then(data => res.json(data[0]))
            .catch(error => Promise.reject('unable to load user'))
}


module.exports = {
    handleProfileUpdate,
    getProfile
}