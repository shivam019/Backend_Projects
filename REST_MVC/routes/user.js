const express = require("express")
const {handleGetAllUsers, handleGetUserById, handleAddUser, handleDeletedUser, handleModifyUser} = require("../controllers/user")
const router = express.Router();


router.route("/")
.get(handleGetAllUsers)
.post(handleAddUser)

router.route("/:id")
.get(handleGetUserById)
.patch(handleModifyUser)
.delete(handleDeletedUser)



module.exports = router;  