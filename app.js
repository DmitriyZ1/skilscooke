import express from'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import jsonfile from 'jsonfile'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 4111

const root = path.join(__dirname)
app.use(express.static(root))
app.use(cookieParser());

app.get("/", (req, res) => {
    res.
        sendFile('index.html', {
        root
   })
})

app.get("/cookies/:id", (req, res) => {
    const id = req.params.id
    const coockie = req.cookies
    if(id){
        if(!coockie.tasks){
            res.cookie("tasks", [id]) 
        } else {
            res.cookie("tasks", [...coockie.tasks, id])
        }
    }
    res.send()
})

app.get("/tasks", (req, res) => {
    const coockie = req.cookies
   
    jsonfile.readFile(__dirname + '/tasks.json')
        .then(data => {
            if(Array.isArray(data)){
                let arr = data.map((item) => {
                    return item.id
                })
                const tasksLength = arr.length
                if(Array.isArray(coockie.tasks)){
                    arr = arr.filter(item => !coockie.tasks.includes(item))
                }
                res
                .status(200)
                .json({data: {arr, tasksLength}})
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({err: "the file could not be read :" + err})    
        })
});

app.get('/task/:id', (req, res) => {
    const id = req.params.id
    jsonfile.readFile(__dirname + '/tasks.json')
        .then(arr => {
            const text = arr.find((item) => item.id === id).text
            if(!text) return
            res
                .status(200)
                .json({text})
        })
        .catch(err => {
            res
                .status(500)
                .json({err: "Something didn't go according to plan :" + err})
        })
})

app.delete('/cookies', (req, res) => {
    const coockie = req.cookies
    if(coockie.tasks){
        res.cookie("tasks", [])
    }
    res.send()

})


app.listen(PORT);

console.log('App is listening on port ' + PORT);