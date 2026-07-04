import express from 'express'
import { seq } from './db.js'
import { Cats, Quotes, Entries } from './models.js'
import { router } from './router/index.js'
import fileUpload from 'express-fileupload'
import cors from 'cors'
const app = express()
app.use(cors())
app.use(fileUpload({}))
app.use(express.json())
app.use('/api', router)
app.use('/uploads', express.static('uploads'))
seq.authenticate()
    .then(() => console.log('Connect is succesful'))
    .catch((error)=> console.error('error: ', error))
seq.sync({alter: true}).then((result) => {
    console.log('DB connected')
})


app.listen(process.env.PORT, () => {
    console.log(`Server is working on ${process.env.PORT}`)
})