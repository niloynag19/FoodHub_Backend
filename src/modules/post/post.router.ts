import express, { NextFunction, Request, Response } from 'express'
import auth, { UserRole } from '../../middlewares/auth';
import { postController } from './post.controller';


const router = express.Router();

router.get('/',postController.getAllPost)

router.post('/', auth(UserRole.CUSTOMER), (req: Request, res: Response) => {
    res.send("Create a new post")
})

export const postRouter = router
