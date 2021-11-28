//Indhenter moduler 
const express = require ("express")
const app = express()

//Vi laver en konstant som tager fat i input
const brugere = []

//Gør at vi kan bruge ejs syntax
app.set("view-engine", "ejs")

//Gør at vi kan tilknytte vores forms fra ejs til vores kode i js
app.use(express.urlencoded({extended:false}))

//Lyder til localhost 5000
app.listen(5000)

//Laver en get-request for / 
app.get("/", (req,res) => {
    res.render("index.ejs",)
})
app.post("/", (req,res) => {
    
})


//Laver en get-request for login 
app.get("/login", (req,res) => {
    res.render("login.ejs",)
})

app.post("/login", (req,res) => {
    
})


//Laver en get-request for opret bruger
app.get("/opretbruger", (req,res) => {
    res.render("opretbruger.ejs",)
})
app.post("/opretbruger", (req,res) => {
    
})