//
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

//Indhenter moduler 
const express = require("express")
const app = express()

// Indhenter bcrypt
// Bcrypt gør det muligt for os at hashe passwords
// lader ikke til at være et krav dog
const bcrypt = require("bcrypt")
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")
//Indhenter fs så vi kan sende som JSON
const fs = require("fs")

app.use(flash())
app.use(session({
    //key skal være secret, da vi herved kan kryptere info fra brugeren
    secret: process.env.SESSION_SECRET,
    //Gør at vi ikke resaver hvis intet ændrer sig
    resave: false,
    saveUninitialized: false
}))
//Til at lave css i vores ejs 
app.use(express.static("views"));
 
const methodOverride = require("method-override")

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
function checkAuthenticated(req, res, next) {
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
app.use(express.urlencoded({ extended: false }))

//Laver en get-request for / 
app.get("/", checkAuthenticated, (req, res) => {
    res.render("index.ejs", { 
        name: req.user.name, 
        varer: varer
    })
})
//Laver en get-request for login 
app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login.ejs")
})
//POST for login, 
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "login",
    failureFlash: true
}))
//Laver en get-request for opret bruger
app.get("/opretprofil", checkNotAuthenticated, (req, res) => {
    res.render("opretprofil.ejs",)
})
//Laver en post-request som pusher oplysninger fra brugeren til vores array 
// Her implementeres der desuden bcrypt, så brugerens password bliver hashed.
app.post("/opretprofil", checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        profiles.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        //Efterfølgende redirecter vi til vores login-side.
        res.redirect("/login")
        fs.writeFileSync('data/profiles.json', JSON.stringify(profiles, null, 2)); //Sender som JSON til JSON fil
        //Vi console.logger, så vi kan se om vi har tilføjet en bruger.
        console.log(profiles)
    } catch {
        res.redirect("/opretprofil")
    }
})
//Gør det muligt at logge ud
app.delete("/logout", (req, res) => {
    req.logOut()
    res.redirect("/login")
})
//Sletter vores profil
app.delete("/", checkAuthenticated, (req, res) => {
    req.logOut(profiles.splice(0, profiles.length))
    res.redirect("/login")
    fs.writeFileSync('data/profiles.json', JSON.stringify(profiles))
})

//Opdater profil
app.get("/opdaterprofil", checkAuthenticated, (req, res) => {
    res.render("opdaterprofil.ejs")
})
app.put("/opdaterprofil", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        //Vi pusher nu på ny
        profiles.push({
            id: req.user.id,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        //Vi splicer de tidligere oplysninger
        profiles.splice(0, 1); //Sletter tidligere oplysninger 
        res.redirect("/") //Redirecter tilbage til "hjem"
        fs.writeFileSync('data/profiles.json', JSON.stringify(profiles, null, 2)); //Sender som JSON til JSON fil
        console.log(profiles) //Console.logger de nye oplysninger
    } catch {
        res.redirect("/opdaterprofil") //Hvis der sker en fejl, så bliver vi på opdater
    }
})
//Tilføjer varer konstant som tager brugerens varer som input
const varer = []

app.get("/varer", (req, res) => {
    res.render("varer.ejs", {
        name: req.user.name,
        varer: varer
    })
})
app.post("/", checkAuthenticated, (req, res) => {
    varer.push({
        pris: req.body.pris,
        kategori: req.body.kategori,
        beskrivelse: req.body.beskrivelse,
        billede: req.body.billede,
    })
    res.redirect("/")
    fs.writeFileSync('data/varer.json', JSON.stringify(varer, null, 2));
    console.log(varer)
})
//Laver så vi kan opdatere vores varer 
app.get("/opdatervarer", checkAuthenticated, (req, res) => {
    res.render("opdatervarer.ejs")
})
app.put("/opdatervarer", async (req, res) => {
    try {
        varer.push({
            id: req.user.id,
            pris: req.body.pris,
            kategori: req.body.kategori,
            beskrivelse: req.body.beskrivelse,
            billede: await req.body.billede,
        })
        varer.splice(0, 1);
        res.redirect("/opdatervarer")
        fs.writeFileSync('data/varer.json', JSON.stringify(varer, null, 2));
    } catch {
        res.redirect("/")
    }
    console.log(varer)
})

app.delete("/varer", checkAuthenticated, (req, res) => {
    varer.splice(0, varer.length)
    res.redirect("/")
    fs.writeFileSync('data/varer.json', JSON.stringify(varer,))
    console.log("Varer slettet")
})

app.get("/kategori/:kategori", checkAuthenticated, (req,res) => {
    const kategorier = varer.find(k => k.kategori === req.params.kategori) 
    if (!kategorier) return "Ikke en kategori" 
    res.render("kategori.ejs", {kategorier: kategorier})
})


module.exports = app.listen(5000), profiles

