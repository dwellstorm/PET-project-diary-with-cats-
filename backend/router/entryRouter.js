import { Router } from "express"
import entryController from "../controllers/entryController.js"
const entryRouter = new Router()
entryRouter.get('/entries/cat/:catId', entryController.getEntriesByCatId)
entryRouter.get('/entries/card/:entry_id', entryController.getEntryById)
entryRouter.get('/entries/user-cards', entryController.getEntriesByUser)
entryRouter.post('/entries', entryController.createEntry)
entryRouter.put('/entries/edit/:id', entryController.updateEntry)
entryRouter.delete('/entries/:id', entryController.deleteEntry)

export {entryRouter}