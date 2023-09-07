import db from '../models/index'
import CRUDService from "../services/CRUDService"



let getHomePage = async (req, res) => {

    try {

        let data = await db.User.findAll();

        return res.render('homePage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
    }

}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}
let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body)
    console.log(message);
    return res.send("post  Crud from server")
}
let getAboutPage = (req, res) => {
    return res.render('about.ejs')
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
   
    return res.render('displayCRUD.ejs', {
        datatable: data
    })
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;

    if (userId) {

        let userData = await CRUDService.getUserInfoById(userId);




        return res.render("editCRUD.ejs", {
            user: userData
        })
    } else {

        return res.send("user not found!!")
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    return res.render("displayCRUD.ejs", {
        datatable: allUsers
    })
}

let deleteCRUD = async (req, res) => {
    let uid = req.query.id;
    if (uid){
    await CRUDService.deleteUserById(uid);
    return res.send('delete succeed')
}else{
    return res.send('user not found')
    
}
}
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
}