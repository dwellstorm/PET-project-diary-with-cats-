import { Router } from "express"
import quoteController from "../controllers/quoteController.js"
const quoteRouter = new Router()
quoteRouter.get('/quotes/cat/:catId', quoteController.getQuotesByCatId)
quoteRouter.get('/quotes/cat/:catId/random', quoteController.getRandomQuoteByCatId)
quoteRouter.post('/quotes', quoteController.createQuote)
quoteRouter.put('/quotes/:id', quoteController.updateQuote)
quoteRouter.delete('/quotes/:id', quoteController.deleteQuote)

export {quoteRouter}