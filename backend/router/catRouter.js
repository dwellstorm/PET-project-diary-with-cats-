import { Router } from "express"
import catController from "../controllers/catController.js"
const catRouter = new Router()
catRouter.get('/cats', catController.getAllCats)
catRouter.get('/cats/:id', catController.getCatById)

export {catRouter}