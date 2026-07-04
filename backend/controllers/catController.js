import { Cats } from "../models.js"

class catController {

    async getAllCats(req, res) {
        const cats = await Cats.findAll()
        return res.status(201).json(cats)
    }

    async getCatById(req, res) {
        const {id} = req.params
        const cat = await Cats.findByPk(id)
        if (!cat) {
            return res.status(404).json({message: 'Кот не найден'})
        }
        return res.status(201).json(cat)
    }
}
export default new catController()