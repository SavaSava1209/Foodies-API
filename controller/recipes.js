const fetch = require('node-fetch')

const apiKey = '01f4dc754a6c40bb94aade9f67024130';




const handleApiCall = (req, res) => {
    const { foodName } = req.body;
    return fetch(
       `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=
       ${foodName}&addRecipeInformation=true&number=16`, {
        method: 'get',
        headers: {'content-type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {            
            return res.json(data) 
        })
              
        .catch(err => res.status(400).json('cant get API'))
}

module.exports =  {
    handleApiCall
}
















