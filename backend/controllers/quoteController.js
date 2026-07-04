import { seq } from "../db.js"
import { Quotes } from "../models.js"

class quoteController {

    async getQuotesByCatId(req, res) {
        const catId = req.params.catId
        const quotes = await Quotes.findAll({where: {cat_id: catId}})
        if (quotes.length === 0) {
            return res.status(404).json({message: 'Цитаты не найдены'})
        }
        return res.status(200).json(quotes)
    }

    async getRandomQuoteByCatId(req, res) {
        const catId = req.params.catId
        const quote = await Quotes.findOne({
            where: {cat_id: catId},
            order: seq.random()
        })
        if (!quote) {
            return res.status(404).json({message: 'Цитата не найдена'})
        }
        return res.status(201).json(quote)
    }
    async createQuote(req, res) {
        const newQuote = {
            cat_id: req.body.cat_id,
            quote_text: req.body.quote_text
        }
        const quote = await Quotes.create(newQuote)
        return res.status(201).json(quote)
    }

    async updateQuote(req, res) {
        const {id} = req.params
        const quote = await Quotes.findByPk(id)

        if (!quote) {
            return res.status(404).json('Цитата не найдена')
        }
        await quote.update(req.body)
        return res.status(200).json(quote)
    }

    async deleteQuote(req, res) {
        const {id} = req.params
        const quote = await Quotes.findByPk(id)
        await quote.destroy()
        return res.status(204).json()
    }
}
export default new quoteController()