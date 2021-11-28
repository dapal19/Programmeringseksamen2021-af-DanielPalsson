//
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()}

//Indhenter moduler 
const express = require ("express")
const app = express()

// Indhenter bcrypt
// Bcrypt gør det muligt for os at hashe passwords
// lader ikke til at være et krav dog
const bcrypt = require ("bcrypt")
const passport = require ("passport")
const flash = require ("express-flash")
const session = require ("express-session")
app.use(flash())
app.use(session({
    //key skal være secret, da vi herved kan kryptere info fra brugeren
    secret: process.env.SESSION_SECRET,
    //Gør at vi ikke resaver hvis intet ændrer sig
    resave: false,
    saveUninitialized: false
}))
const methodOverride = require ("method-override")

const initializePassport = require("./passport.js")
initializePassport(
    passport,
    email => profiles.find(profile => profile.email === email),
    id => profiles.find(profile => profile.id === id)
)
app.use(passport.initialize())
app.use(passport.session())
//Gør at vi kan override POST
app.use(methodOverride("_method"))

//Vi laver nu en middleware-funktion for at tjekke om brugeren er authenticated
// Dette kan vi indsætte i vores andre funktioner med routing
function checkAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next()
        }
        res.redirect('/login')
      }
//Vi laver nu en middleware-funktion for at tjekke om brugeren er authenticated  
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { 
        return res.redirect('/')
        }
        next()  
    }

//Vi laver en konstant som tager fat i input
const profiles = []

//Gør at vi kan bruge ejs syntax
app.set("view-engine", "ejs")

//Gør at vi kan tilknytte vores forms fra ejs til vores kode i js
app.use(express.urlencoded({extended:false}))

//Lytter til localhost 5000
app.listen(5000)

//Laver en get-request for / 
app.get("/", checkAuthenticated, (req,res) => {
    res.render("index.ejs", {name: req.user.name})
})
//Laver en get-request for login 
app.get("/login", checkNotAuthenticated, (req,res) => {
    res.render("login.ejs",)
})
//POST for login, 
app.post("/login", checkNotAuthenticated, passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "login",
    failureFlash: true
}))
app.post("/login", checkNotAuthenticated, (req,res) => {
})
//Laver en get-request for opret bruger
app.get("/opretprofil", checkNotAuthenticated, (req,res) => {
    res.render("opretprofil.ejs",)
})
//Laver en post-request som pusher oplysninger fra brugeren til vores array brugere
// Her implementeres der desuden bcrypt, så brugerens password bliver hashed.
app.post("/opretprofil", checkNotAuthenticated, async (req ,res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        profiles.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        //Efterfølgende redirecter vi til vores login-side.
        res.redirect("/login")
        //Vi console.logger, så vi kan se om vi har tilføjet en bruger.
        console.log(profiles)
    }catch{
        res.redirect("/opretprofil")
    }})

app.delete("/logout", (req, res) => {
        req.logOut()
        res.redirect("/login")
    })
app.delete("/" ,checkAuthenticated, (req, res) => {
    req.logOut(profiles.splice(0, profiles.length))
        res.redirect("/login")
    })

  