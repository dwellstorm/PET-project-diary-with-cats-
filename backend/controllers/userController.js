import { User } from '../models.js'
import { v4 } from 'uuid'
import path from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mailService from '../mailService.js'
const getToken = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.PRIVATE_KEY, { expiresIn: '12h' })
}
class userController {

    async getAllUsers(req, res) {
        const users = await User.findAll()
        return res.status(200).json(users)
    }
    async getOneUser(req, res) {
        const { id } = req.query
        const user = await User.findByPk(id)
        if (!user) {
            return res.status(404).json('Пользователь не найден')
        }
        return res.status(200).json(user)
    }
    async registration(req, res, next) {
        const { avatar } = req.files
        const photoName = v4() + avatar.name
        avatar.mv(path.resolve('uploads', photoName))
        console.log('body:', req.body)

        const { username, email, password } = req.body
        if (!username || !email || !password) {
            const e = new Error('Заполните все поля')
            e.status = 400
            return next(e)
        }
        const visitor = await User.findOne({ where: { email: email } })
        if (visitor) {
            return next(Error('Пользователь с этой почтой уже существует'))
        }
        const activationLink = v4()
        const hashedPassword = await bcrypt.hash(password, 3)
        const newUser = {
            username: username,
            email: email,
            avatar: '/uploads/' + photoName,
            password: hashedPassword,
            role: 'USER',
            activationLink: activationLink,
            activated: false
        }

        const user = await User.create(newUser)
        await mailService.sendActivationLink(user.email, `http://${process.env.HOST}:${process.env.PORT}/api/users/activate/${activationLink}`)
        const token = getToken(user.id, user.email, user.role)
        return res.json(token)
    }
    async activation(req, res) {
        const user = await User.findOne({ where: { activationLink: req.params.link } })
        user.activated = true
        user?.save()
        res.json(user)
    }
    async login(req, res, next) {
        const { username, password } = req.body
        if (!username || !password) {
            return next(Error('Заполните все поля'))
        }
        const visitor = await User.findOne({ where: { username: username } })
        if (!visitor) {
            return next(Error('Пользователя с таким именем не существует'))
        }
        const comprasion = bcrypt.compareSync(password, visitor.password)
        if (!comprasion) {
            return next(Error('Неверный пароль'))
        }
        const token = getToken(visitor.id, visitor.email, visitor.role)
        res.json({
            token, user: {
                id: visitor.id,
                username: visitor.username,
                avatar: visitor.avatar,
                email: visitor.email,
                bio: visitor.bio,
                role: visitor.role,
                createdAt: visitor.createdAt
            }
        })

    }
    async updatePhoto(req, res) {
        try {
            const { id } = req.query
            const user = await User.findByPk(id)

            if (req.files && req.files.avatar) {
                const avatar = req.files.avatar
                const photoName = v4() + avatar.name
                const uploadPath = path.resolve('uploads', photoName)
                avatar.mv(uploadPath)
                await user.update({ avatar: '/uploads/' + photoName })
                const updateUser = await User.findByPk(id, {
                    attributes: { exclude: ['password'] }
                })
                return res.status(200).json(updateUser)
            }

        } catch (error) {
            console.error('Ошибка: ', error)
        }
    }
    async updateUser(req, res) {
        try {
            const { id } = req.query
            const user = await User.findByPk(id)
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' })
            }
            const updateData = {
                username: req.body.username || user.username,
                bio: req.body.bio !== undefined ? req.body.bio : user.bio
            }
            // if (req.body.password && req.body.password.trim() !== "") {
            //     updateData.password = await bcrypt.hash(req.body.password, 3);
            //     console.log('Пароль успешно изменён!')
            // }

            await user.update(updateData)

            const updatedUser = await User.findByPk(id, {
                attributes: ['id', 'username', 'bio']
            })
            return res.status(200).json(updatedUser)
        } catch (error) {
            console.error('Error: ', error)
        }
    }
    async updateUserBio(req, res) {
        try {
            const { id } = req.query
            const user = await User.findByPk(id)
            const updateBio = req.body.bio

            await user.update({ bio: updateBio })

            const updateUser = await User.findByPk(id, {
                attributes: { exclude: ['password'] }
            })
            return res.status(200).json(updateUser)
        } catch (error) {
            console.error('error: ', error)
        }
    }
    async sendLinkOnEmail(req, res, next) {
        try {
            const { id } = req.query
            const { newPassword } = req.body

            if (!newPassword) {
                return res.status(400).json({ message: "Введите новый пароль" });
            }

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }

            const resetToken = v4()
            const tempPassword = await bcrypt.hash(newPassword, 3) 
             await user.update({
            resetToken: resetToken,
            tempPassword: tempPassword
        });
            await mailService.sendResetPasswordLink(user.email, `http://${process.env.DBHOST}:${process.env.PORT}/api/users/reset-password/${resetToken}`)
            return res.json({ message: "Ссылка для подтверждения изменения пароля отправлена на вашу почту" });

        } catch (error) {
            console.error('Error: ', error)
            next(error)
        }

    }

    async CheckedEmail(req, res, next) {
        try {
            const {link} = req.params
             const user = await User.findOne({ where: { resetToken: link } })
              if (!user || !user.tempPassword) {
                return res.status(400).json({ message: "Ссылка недействительна или устарела" });
            }
             await user.update({
                password: user.tempPassword,
                resetToken: null,
                tempPassword: null
            });
            return res.redirect('http://localhost:3000/my-profile')
        } catch (error) {
            console.error('Error: ', error)
            next(error)
        }
    }
}

export default new userController()