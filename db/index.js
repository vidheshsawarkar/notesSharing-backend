const mongoose = require('mongoose');

mongoose.connect('mongodb://mongodb/notesSharingApp');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    sharedNotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notes"
    }]
});

const NotesSchema = new mongoose.Schema({
    title: String,
    description: String,
    file: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

NotesSchema.index({ title: 'text', description: 'text', file: 'text' });

const User = mongoose.model('User', UserSchema);
const Notes = mongoose.model('Notes', NotesSchema);

module.exports = {
    User,
    Notes
}