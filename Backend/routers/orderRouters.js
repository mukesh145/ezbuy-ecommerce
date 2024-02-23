import express from "express"

import { authenticateUser, isAuthorizedUser } from "../middlewares/authentication.js"

import {
    allOrders,
    deleteOrder,
    getOrderDetails,
    myOrders,
    newOrder,
    updateOrder,
  } from "../controllers/orderControllers.js";
  
  const router = express.Router()

  router.route("/orders/new").post(authenticateUser, newOrder);
  router.route("/orders/:id").get(authenticateUser, getOrderDetails);
  router.route("/me/orders").get(authenticateUser, myOrders);
  
  router
    .route("/admin/orders")
    .get(authenticateUser, isAuthorizedUser("Admin"), allOrders);
  
  router
    .route("/admin/orders/:id")
    .put(authenticateUser, isAuthorizedUser("Admin"), updateOrder)
    .delete(authenticateUser, isAuthorizedUser("Admin"), deleteOrder);


export default router