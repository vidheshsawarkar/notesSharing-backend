const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const upload = require("../middleware/uploadFile");
const rateLimitMiddleware = require("../middleware/rateLimiting");
const { userSignup, userSignin, getAllNotes, getNotesById, createNotes, updateNotes, deleteNotes, shareNotes, searchNotes } = require("../controllers/userController");

router.use(rateLimitMiddleware);

// create a new user
router.post('/api/auth/singup', userSignup);

// user signin with access token
router.post('/api/auth/signin', userSignin);

// list of all notes
router.get('/api/notes',userMiddleware, getAllNotes);

// get particular notes by id
router.get('/api/notes/:id', userMiddleware, getNotesById);

// create a new notes
router.post('/api/notes', userMiddleware, upload.single('file'), createNotes);

// update an existing note
router.put('/api/notes/:id', userMiddleware, updateNotes);

// deleting a notes
router.delete("/api/notes/:id", userMiddleware, deleteNotes);

// sharing a notes
router.post("/api/notes/:id/share", userMiddleware, shareNotes);

// search for particular notes
router.get("/api/search", userMiddleware, searchNotes);

module.exports = router;
