const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
// Vi laver en funktion som tjekker om brugeren er oprettet, her bruges passport
function initialize (passport, getProfileByEmail, getProfileById) {
        // async 
const authenticateProfile = async (email, password, done) => {
    const profile = getProfileByEmail(email)
    if(profile == null){
        return done(null, false, {message: "Ingen profil med den email"})
        }
    try{
    // Vi bruger bcrypt igen da password er hashed 
    //Tjekker om passwordet findes 
        if(await bcrypt.compare(password, profile.password)){
        return done (null, profile)
        } else {   
        return done(null, false, {message: "Forkert password"})
        }
    }
        catch(e){
        return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: "email"}, 
    authenticateProfile))
    passport.serializeUser((profile,done) => done (null, profile.id))
    passport.deserializeUser((id,done) => { 
        return done(null, getProfileById(id))
    })
} 

module.exports = initialize




