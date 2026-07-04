import { Entries, Cats } from "../models.js";
import { Op } from "sequelize";

class entryController {

    async getEntriesByUser(req, res) {
        const { id, sortBy, search } = req.query

        let orderClause = [['created_at', 'DESC']]
        let whereClause = { user_id: id }
        if (search && search.trim() !== '') {
            whereClause.user_text = {[Op.like]: `%${search}%`} 
        }
        if (sortBy === 'date') {
            orderClause = [['created_at', 'DESC']]
        } else if (sortBy === 'cats') {
            orderClause = [[{ model: Cats, as: 'cat' }, 'name', 'ASC']]
        }
        const entries = await Entries.findAll(
            {
                where: whereClause,
                include: [{
                    model: Cats, as: 'cat',
                    attributes: ['id', 'name', 'mood', 'image_url', 'color']               
                 }],
                order: orderClause
                
            })
        if (!entries) {
            return res.status(404).json('Записи не найдены')
        }
        console.log('Отсортировано')
        return res.status(200).json(entries)
    }

    async getEntriesByCatId(req, res) {
        const user_id = req.query.user_id
        const cat_id = req.params.catId
        const entries = await Entries.findAll(
            {
                where: { cat_id: cat_id, user_id: user_id },
                include: [{
                    model: Cats, as: 'cat',
                    attributes: ['id', 'name', 'mood', 'image_url', 'color']
                }],
                order: [['created_at', 'DESC']]
            })
        if (!entries) {
            return res.status(404).json('Записи не найдены')
        }
        return res.status(200).json(entries)
    }
    async getEntryById(req, res) {
        const { entry_id } = req.params
        const entry = await Entries.findByPk(entry_id, {
            include: [{
                model: Cats, as: 'cat',
                attributes: ['id', 'name', 'mood', 'image_url', 'color']
            }]
        })
        if (!entry) {
            res.status(404).json({ message: 'Карточка не найдена' })
        }
        return res.status(200).json(entry)
    }
    async createEntry(req, res) {
        const { id } = req.query
        const newEntry = {
            user_id: id,
            cat_id: req.body.cat_id,
            user_text: req.body.user_text,
            quote_text: req.body.quote_text
        }

        const entry = await Entries.create(newEntry)
        return res.status(201).json(entry)
    }

    async updateEntry(req, res) {
        const { id } = req.params
        const entry = await Entries.findByPk(id)

        if (!entry) {
            return res.status(404).json({ message: 'Запись не найдена' })
        }
        await entry.update(req.body)
        return res.status(200).json(entry)
    }

    async deleteEntry(req, res) {
        const { id } = req.params
        const entry = await Entries.findByPk(id)
        await entry.destroy()
        return res.status(204).json(entry)
    }
}
export default new entryController()