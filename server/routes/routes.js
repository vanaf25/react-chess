import {Router} from 'express'
import controller from "../controlls/controller.js";
const router=new Router();
router.post("/registration",controller.registration)
router.post("/login",controller.login)
router.delete("/logout",controller.logout)
router.get("/activate/:link",controller.activate)
router.get("/refresh",controller.refresh)
router.get("/users",controller.getUsers)
export default router
