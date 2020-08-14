require("dotenv").config()


const express = require("express")
const jwt  = require("jsonwebtoken")
const app = express()

app.use(express.json())

const posts = [
    {
        usename: "sunny",
        title: "Title1"
    },
    {
        usename: "sunny2",
        title: "Title2"
    }
]

app.get("/posts", autheticateToken, (req, res) => {
    res.json(posts.filter(post => post.usename === req.user.name))
})

app.post("/login", (req, res) => {
    const usename = req.body.usename
    const user = { name: usename }
    const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accesstoken: accesstoken })
})

function autheticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // BEARER token
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(4000)