import express, { NextFunction, Request, Response } from 'express'
import auth, { UserRole } from '../../middlewares/auth';


const router = express.Router();


router.post('/', auth(UserRole.CUSTOMER), (req: Request, res: Response) => {
    res.send("Create a new post")
})

export const postRouter = router
