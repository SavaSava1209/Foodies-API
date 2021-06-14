
const addSavedRecipes = (req, res, db) => {
    const { id } = req.params
    const {recipe_id, url, title, image} = req.body;          
    db('saved_recipes').where({user_id: id, recipe_id: recipe_id})
    .select('recipe_id')
    .then(recipeId => {
        if (recipeId.length === 0) {
           db.transaction(trx => {
            return trx.insert({
                title: title,
                recipe_id: recipe_id,
                url: url,
                user_id: id,
                image: image
            })
            .into('saved_recipes')
            .returning('user_id')
            .then(user_id => {
                if (user_id) {  
                    return db('users').where('user_id', '=', user_id[0]).increment('recipes_number', 1)
                    .returning('*')
                    .then(data => res.json(data[0]))               
                    .catch(err => console.log('can not increase recipe numbers'))
                }
            })           
        })
        .catch(err => console.log('cant insert recipes'))
        } else {
            return res.status(400).json('exist')
        }
    })
    .catch(err => console.log('can identify recipe id'))
}

const getSavedRecipes = (req, res, db) => {
    const { id } = req.params; 
    db('saved_recipes').where({ user_id: id }).returning('*')
    .then(recipes => res.json(recipes))
    .catch(err => res.status.json('can not load saved recipes'))

}

const addNote = (req, res, db) => {
    const { id } = req.params;
    const { recipe_id, note } = req.body; 

 
    db('saved_recipes').where({recipe_id: recipe_id, user_id: id })
    .update({note: note }).returning('note')
    .then(data => res.json(data))
    .catch(err => res.status(400).json('not able to load note'))   
};

const deleteRecipes = (req, res, db) => {
    const { id } = req.params;
    const { recipe_id } = req.body;    
    
    return db('saved_recipes').where({recipe_id: recipe_id, user_id: id})
    .delete()
    .then(data => res.json('success'))
    .catch(err => console.log(err))
}

module.exports = {
    addSavedRecipes,
    getSavedRecipes,
    addNote,
    deleteRecipes
}