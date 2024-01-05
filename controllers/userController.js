const { User, Notes } = require("../db");
const jwt = require('jsonwebtoken');
const { hashPassword } = require('../utils/encrypt');


// create a new user
async function userSignup(req, res) {    
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if(user){
        res.status(400);
        res.json({
            msg: "User already exists"
        })
    }
    else{
        const username = req.body.username;
        const password = hashPassword(req.body.password);
        await User.create({username, password});
        res.status(201);
        res.json({
            msg: "User created successfully"
        })
    }

}

// user signin with access token
async function userSignin(req, res) {
    const { username } = req.body;

    const user = await User.findOne({
        username: username
    });
    if(!user){
        res.status(400);
        res.json({
            msg: "User does not exists"
        })
    }
    else{
        const token = "Bearer " + jwt.sign({ username: username}, "123456");
        res.status(201);
        res.json({
            token
        });
    }
}

// list of all notes
async function getAllNotes(req, res) {
    const user = await User.findOne({
        username: req.username
    });
    const id = user._id;
    const notes = await Notes.find(
        {owner: id}
    );
    res.status(201);
    res.json({
        notes
    });
}

// get particular notes by id
async function getNotesById(req, res) {
    const id = req.params.id;
    const user = await User.findOne({
        username: req.username
    });
    const userId = user._id;
    const notes = await Notes.findOne({_id: id, owner: userId});
    if(!notes){
        res.status(400);
        res.json({
            msg: "Notes does not found"
        })
    }
    else{
        res.status(201);
        res.json({
            notes
        })  
    }
}

// Create a new notes
async function createNotes(req, res) {
    const username = req.username;
    const title = req.body.title;
    const description = req.body.description;
    const file = req.file.path;
    const owner = await User.findOne({username: username});

    const newNotes = await Notes.create({
        title,
        description,
        file,
        owner
    });
    res.json(newNotes);
}

// Update a notes
async function updateNotes(req, res) {
    const id = req.params.id;
    const user = await User.findOne({
        username: req.username
    });
    const userId = user._id;

    const notes = await Notes.findOneAndUpdate({_id: id, owner: userId},
        {$set : { 
            title: req.body.title,
            description: req.body.description,
            // file: req.file.path
        }
    });

    if(!notes){
        res.status(400);
        res.json({
            msg: "Notes does not found"
        })
    }
    else{
        res.status(201);
        res.json({
            msg: "Notes updated successfully"
        })
    }
}

// Delete a notes
async function deleteNotes(req, res) {
    const id = req.params.id;
    const user = await User.findOne({
        username: req.username
    });
    const userId = user._id;
    const notes = await Notes.findOne({_id: id, owner: userId});
    
    if(!notes){
        res.status(400);
        res.json({
            msg: "Notes does not found"
        })
    }
    else{
        await Notes.deleteOne({_id: id, owner: userId});
        res.status(201);
        res.json({
            msg: "Notes deleted successfully"
        })
    }
}

// Share a notes
async function shareNotes(req, res) {
    const id = req.params.id;
    const user = await User.findOne({
        username: req.username
    });
    const userId = user._id;

    const notes = await User.findOneAndUpdate({_id: userId},{$push:{sharedNotes: id}});

    if(!notes){
        res.status(400);
        res.json({
            msg: "Notes does not found"
        })
    }
    else{
        res.status(201);
        res.json({
            msg: "Notes shared successfully"
        })
    }
}

// Search a notes
async function searchNotes(req, res) {
    let { q } = req.query;
    const notes = await Notes.findOne({'$text': {'$search': q}});
    
    if(!notes){
        res.status(400);
        res.json({
            msg: "Notes does not found"
        })
    }
    else{
        res.status(201);
        res.json({
            notes
        })
    }
}

module.exports = {
    userSignup,
    userSignin,
    getAllNotes,
    getNotesById,
    createNotes,
    updateNotes,
    deleteNotes,
    shareNotes,
    searchNotes
};