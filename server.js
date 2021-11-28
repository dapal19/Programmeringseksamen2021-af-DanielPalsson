//Indhenter moduler 
const express = require ("express")
const app = express()

// Indhenter bycrypt
// Bcrypt gør det muligt for os at hashe passwords
// lader ikke til at være ikke krav dog
const bcrypt = require ("bcrypt")

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
//Laver en post-request som pusher oplysninger fra brugeren til vores array brugere
// Her implementeres der desuden bcrypt, så brugerens password bliver hashed.
app.post("/opretbruger", async (req ,res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        brugere.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        //Efterfølgende redirecter vi til vores login-side.
        res.redirect("/login")
        //Vi console.logger, så vi kan se om vi har tilføjet en bruger.
        console.log(brugere)
    }catch{
        res.redirect("/opretbruger")
    }})
    
  
