import { Router } from "express";
import { registerUSer } from "../controllers/user.controller.js";

const router = Router()

router.post("/register", registerUSer);     //this will run the post command on register user method once you hit the /register
//router.route = ("/register").post(registerUSer)      

export default router