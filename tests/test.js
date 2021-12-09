const { expect } = require ("chai")
const chai = require ("chai")
const chaiHttp = require ("chai-http")
const app = require("../server")
const chaiJson = require ("chai-json")
chai.use(chaiHttp)
chai.use(chaiJson)

describe("TEST", () => {
    describe("POST /opretprofil", () => {
        it("Should post parameters to JSON-object", (done) => {
            chai
            .request(app)
            .post("/opretprofil")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.equal(200)
                expect(res.body).to.be.a.jsonObj()
                done ();
            })
        })
})
})
describe("TEST", () => {
    describe("POST /opretprofil", () => {
        it("Should Filesync with JSON-file", (done) => {
            chai
            .request(app)
            .post("/opretprofil")
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.equal(200)
                expect(res.body).to.be.jsonFile
                done ();
            })
        })
})
})





