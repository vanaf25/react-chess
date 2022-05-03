class UserController {
    async registration(req,res,next){
        try {
            res.json("registration")
        }
        catch (e) {

        }
    }
    async login(req,res,next){
        try {
            res.json("login")
        }
        catch (e) {

        }
    }
    async logout(req,res,next){
        try {
            res.json("logout")

        }
        catch (e) {

        }
    }
    async refresh(req,res,next){
        try {
            res.json("Refresh")
        }
        catch (e) {

        }
    }
    async activate(req,res,next){
        try {
            res.json("activate")
        }
        catch (e) {

        }
    }
    async getUsers(req,res,next){
        try {
        res.json("Get Users")
        }
        catch (e) {

        }
    }
}
export default new UserController()
