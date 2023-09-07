import { response } from "express";
import db from "../models/index"
import bcrypt from "bcryptjs"

let salt = bcrypt.genSaltSync(10);


let hashUserPassWord = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt)
            resolve(hashPassword)
        } catch (e) {
            reject(e);

        }


    })
}


let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exist

                let user = await db.User.findOne({
                    attributes: ['id','email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });
                // console.log(user.email);
                if (user) {
                    let check =  bcrypt.compareSync(password, user.password);
                    // let check = password===user.password;

                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "oke";

                        delete user.password;
                        userData.user = user
                    } else {
                        userData.errCode = 3,
                            userData.errMessage = "Wrong password"

                    }

                } else {
                    userData.errCode = 2,
                        userData.errMessage = "User not found"
                }


            } else {
                userData.errCode = 1;
                userData.errMessage = ' account do not exist';



            }

            resolve(userData)

        } catch (e) {
            reject(e)
        }
    })

}


let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                attributes: ['email', 'roleId', 'password'],

                where: { email: email },

            })

            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}



let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {

        try {
            let users = '';
            if (userId === "ALL") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })

            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId }, attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        } catch (error) {
            reject(error)

        }
    })
}




let createNewUser = (data) => {

    return new Promise(async (resolve, reject) => {

        try {
            //check ís email exist
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 3,
                    errMessage: 'your email is already used!!!, try another'
                })
            } else {
                let hashPasswordFormBcrypt = await hashUserPassWord(data.password)
                console.log(data);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFormBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleid: data.roleid,
                    positionId: data.positionId,
                    image: data.avatar

                })
                resolve({
                    errCode: 0,
                    message: 'OK'

                })
            }
        } catch (error) {
            reject(error)

        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        if (!data.id || !data.roleid || !data.positionId || !data.gender) {
            return {
                errCode: 2,
                errMessage: ' Missing required parrameters'
            }
        }
        console.log(data);
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {

                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleid = data.roleid;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phonenumber = data.phonenumber;
                if (data.avatar) {
                    user.image = data.avatar
                }


                await user.save();


                resolve({
                    errCode: 0,
                    message: "update user succeeds!"
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: ' user not found'
                });
            }
            resolve(user)
        } catch (error) {
            reject(error)

        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            });
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: 'the user is not exist'
                })
            }
            await db.User.destroy({
                where: { id: userId }
            })
            resolve({
                errCode: 0,
                message: "delete user succeed"
            })
    
        } catch (error) {
            reject(error)
        }
       

    })

}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Opps! Missing require parameters'
                })

            } else {
                let res = {}
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res)
            }

        } catch (error) {
            reject(error);
        }

    })

}




module.exports = {
    handleUserLogin: handleUserLogin,
    // checkUserEmail: checkUserEmail
    getAllUser: getAllUser,
    createNewUser: createNewUser,
    editUser: editUser,
    deleteUser: deleteUser,
    getAllCodeService: getAllCodeService

}