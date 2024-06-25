import express from "express";
import signup from "../controllers/signup.js";
import signin from "../controllers/signin.js";
import { auth } from "../middleware/auth.js";

const router=express.Router();

router.post("/signup",signup)
router.post("/signin",signin)


export default router;
