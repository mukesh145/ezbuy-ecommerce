import express from "express"
import {createNewProduct, getProductDetails, getProducts, updateProduct, deleteProduct} from "../controllers/productController.js"
import { authenticateUser, isAuthorizedUser } from "../middlewares/authentication.js"
const router = express.Router()

router.route("/admin/product").post(authenticateUser, isAuthorizedUser("Admin"), createNewProduct)
router.route("/product/:id").get(getProductDetails)
router.route("/products").get(getProducts)
router.route("/admin/update/:id").put(authenticateUser, isAuthorizedUser("Admin"), updateProduct)
router.route("/admin/delete/:id").delete(authenticateUser, isAuthorizedUser("Admin"), deleteProduct)

export default router