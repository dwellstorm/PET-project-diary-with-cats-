import {Router} from 'express'
import { catRouter } from './catRouter.js'
import { quoteRouter } from './quoteRouter.js'
import { entryRouter } from './entryRouter.js'
import { userRouter } from './userRouter.js'
const router = new Router()
router.use(catRouter)
router.use(quoteRouter)
router.use(entryRouter)
router.use(userRouter)
export {router}