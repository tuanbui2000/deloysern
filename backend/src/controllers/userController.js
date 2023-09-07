import userService from "../services/userService"

let handleLogin = async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "missing inputs parameter"
        })
    }

    let userData = await userService.handleUserLogin(email, password);
    console.log(userData);
    //check email exist
    //compare password
    //return userinfore


    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    });
}

//r
let handleGetAllUser = async (req, res) => {
    let id = req.query.id;
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: "missing require parameters",
            users: []
        })
    }

    let users = await userService.getAllUser(id);
    // console.log(users);
    return res.status(200).json({
        errCode: 0,
        message: "OK",
        users
    })
}


let handleCreateNewUser = async (req, res) => {

    let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);

}



let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.editUser(data);


    // let message = await userService.createNewUser(req.body);
    return res.status(200).json(message);

}

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters!!"
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);

}




let getAllCode = async (req, res) => {

    try {
        
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);



    } catch (error) {
        console.log('Get allcode error ', error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Opps! Error from server'
        });

    }
}







module.exports = {
    handleLogin: handleLogin,
    handleGetAllUser: handleGetAllUser,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
}