import express from "express"
import {registerUser, loginUser, logout, getProfile, updatePassword, updateProfile, getDetails, deleteUser, updateUser} from "../controllers/userControllers.js"
import {authenticateUser , isAuthorizedUser} from "../middlewares/authentication.js"

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logout)

router.route("/me").get(authenticateUser, getProfile)
router.route("/update-password").put(authenticateUser, updatePassword)
router.route("/update-profile").put(authenticateUser, updateProfile)

router.route("/admin/user/:id")
.get(authenticateUser, isAuthorizedUser("Admin"), getDetails)
.put(authenticateUser, isAuthorizedUser("Admin"), updateUser)
.delete(authenticateUser, isAuthorizedUser("Admin"), deleteUser)




export default router
