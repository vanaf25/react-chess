import {Router} from 'express'
import controller from "../controlls/controller.js";
import {body} from 'express-validator'
import authMiddleware from './../middlewares/auth-middleware.js'
const router=new Router();
router.post("/registration",body("email").isEmail(),body("name").isLength({min:3,max:40}),
    body("password").isLength({min:8,max:32}),
    controller.registration)
router.post("/login",controller.login)
router.delete("/logout",controller.logout)
router.get("/activate/:link",controller.activate)
router.get("/refresh",controller.refresh)
router.get("/users",authMiddleware,controller.getUsers)
export default router
