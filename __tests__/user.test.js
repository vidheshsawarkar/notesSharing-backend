const { userSignup, userSignin, getAllNotes, getNotesById, createNotes, updateNotes, deleteNotes, shareNotes, searchNotes } = require("../controllers/userController");
const { User, Notes } = require("../db");
const { hashPassword } = require('../utils/encrypt');

jest.mock('../utils/encrypt', () => ({
    hashPassword: jest.fn(() => 'hash password'),
}));

jest.mock("../db");

const req = {
    body: {
        username: "dummy_username",
        password: "dummy_password",
        title: "dummy_title",
        description: "dummy_description",
        sharedNotes: [123]
    },
    params: {
        id: 534
    },
    file: {
        path: "/dummy_path/dummy_File.pdf"
    },
    query: {
        q: "dummy"
    }
};

const res = {
    status: jest.fn((x) => x),
    json: jest.fn((x) => x)
}

// tests for signup --------------------------------------------------------------

it('User exixts. 400 status code', async () =>{
    User.findOne.mockImplementationOnce(() => ({
        _id: 1,
        username: "username",
        password: "password"
    }));
    await userSignup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
});

it('Add user to db. 201 status code', async () =>{
    User.findOne.mockResolvedValueOnce(undefined);
    User.create.mockResolvedValueOnce({
        _id: 1,
        username: "username",
        password: "password"
    });
    await userSignup(req, res);
    expect(hashPassword).toHaveBeenCalledWith('dummy_password');
    expect(User.create).toHaveBeenCalledWith({
        username: "dummy_username",
        password: "hash password"
    });
    expect(res.json).toHaveBeenCalledTimes(1);
});


// tests for signin --------------------------------------------------------------

it('User does not exixt. 400 status code', async () =>{
    User.findOne.mockResolvedValueOnce(undefined);
    await userSignin(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
});

it('Create jwt token for user. 201 status code', async () =>{
    User.findOne.mockImplementationOnce(() => ({
        _id: 1,
        username: "username",
        password: "password"
    }));
    await userSignin(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
});


// tests for getAllNotes --------------------------------------------------------------

it('Getting all notes for particular user. 201 status code', async () =>{
    User.findOne.mockImplementationOnce(() => ({
        _id: 1,
        username: "username",
        password: "password"
    }));
    Notes.find.mockResolvedValueOnce({
        owner: 1
    })
    await getAllNotes(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
});

// tests for getNotesById --------------------------------------------------------------

it("Notes does not found. 400 status code", async () => {
    User.findOne.mockImplementationOnce(() => ({
        _id: 1,
        username: "username",
        password: "password"
    }));
    Notes.findOne.mockResolvedValueOnce(undefined);
    await getNotesById(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
})

it("Notes found. 201 status code", async () => {
    User.findOne.mockImplementationOnce(() => ({
        _id: 1,
        username: "username",
        password: "password"
    }));
    Notes.findOne.mockResolvedValueOnce({
        _id: 534,
        owner: 1
    });  
    await getNotesById(req, res);  
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
})


// tests for createNotes --------------------------------------------------------------

it("Create a new notes. 201 status code", async () => {
    User.findOne.mockImplementationOnce(() => ({
        _id: 1,
        username: "username",
        password: "password"
    }));
    Notes.create.mockResolvedValueOnce({
        title: "Notes",
        description: "This is a Notes",
        file: "notesPath/notesFile.pdf",
        owner: 1
    });
    await createNotes(req, res);
    expect(Notes.create).toHaveBeenCalledWith({
        title: "dummy_title",
        description: "dummy_description",
        file: "/dummy_path/dummy_File.pdf",
        owner: {
            "_id": 1,
            "password": "password",
            "username": "username",
        }
    });
    expect(res.json).toHaveBeenCalledTimes(1);
})


// tests for updateNotes --------------------------------------------------------------

it("Notes does not found. 400 status code", async () => {
    User.findOne.mockImplementationOnce(() => ({
        _id: 1,
        username: "username",
        password: "password"
    }));
    Notes.findOneAndUpdate.mockResolvedValueOnce(undefined);
    await updateNotes(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
})

it("Notes updated. 201 status code", async () => {
    User.findOne.mockImplementationOnce(() => ({
        _id: 1,
        username: "username",
        password: "password"
    }));
    Notes.findOneAndUpdate.mockResolvedValueOnce({
        _id: 453,
        owner: 1
    });
    await updateNotes(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
})


// tests for deleteNotes --------------------------------------------------------------

it("Notes does not found. 400 status code", async () => {
    User.findOne.mockImplementationOnce(() => ({
        _id: 1,
        username: "username",
        password: "password"
    }));
    Notes.findOne.mockResolvedValueOnce(undefined);
    await deleteNotes(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
})

it("Notes deleted. 201 status code", async () => {
    User.findOne.mockImplementationOnce(() => ({
        _id: 1,
        username: "username",
        password: "password"
    }));
    Notes.findOne.mockResolvedValueOnce({
        _id: 453,
        owner: 1
    });
    await deleteNotes(req, res);
    expect(Notes.deleteOne).toHaveBeenCalledWith({
        _id: 534,
        owner: 1
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
})


// tests for sharedNotes --------------------------------------------------------------

it("Notes does not found. 400 status code", async () => {
    User.findOne.mockImplementationOnce(() => ({
        _id: 1,
        username: "username",
        password: "password"
    }));
    Notes.findOneAndUpdate.mockResolvedValueOnce(undefined);
    await shareNotes(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
})

it("Notes shared. 201 status code", async () => {
    User.findOne.mockImplementationOnce(() => ({
        _id: 1,
        username: "username",
        password: "password"
    }));
    Notes.findOneAndUpdate.mockResolvedValueOnce({
        _id: 1,
    });
    await shareNotes(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
})


// tests for searchNotes --------------------------------------------------------------

it("Notes does not found. 400 status code", async () => {
    Notes.findOne.mockResolvedValueOnce(undefined);
    await searchNotes(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
})

it("Notes shared. 201 status code", async () => {
    Notes.findOne.mockResolvedValueOnce({});
    await searchNotes(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
})
