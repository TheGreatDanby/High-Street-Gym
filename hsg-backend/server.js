import express from "express"
import cors from "cors"
import path from 'path';

import fileUpload from "express-fileupload"
import 'dotenv/config'



// Create express application 
const port = 8082
const app = express()



app.use(cors({
    origin: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json())

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}))


import classesController from "./controllers/classes.js"
app.use(classesController)
import userController from "./controllers/users.js"
app.use(userController)
import messageController from "./controllers/blog.js"
app.use(messageController)
import docsRouter from "./middleware/swagger-doc.js"
app.use(docsRouter)

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './hsg-frontend', 'index.html'));
});



app.listen(port, () => {
    console.log(`Express stared on  http://localhost:${port}`)
})