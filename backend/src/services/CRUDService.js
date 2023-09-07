import bcrypt from "bcryptjs"
import db from "../models/index";
import { raw } from "body-parser";
let salt = bcrypt.genSaltSync(10);



let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFormBcrypt = await hashUserPassWord(data.password)
            await db.User.create({
                email: data.email,
                password: hashPasswordFormBcrypt,
                // password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.Address,
                phonenumber: data.Phonenumber,
                gender: data.gender === '1' ? true : false,
                roleid: data.roleId

            })
            resolve("oke created new user!!!!");
            console.log(data);
        } catch (e) {
            reject(e)
        }
    })
    console.log(' data from service');
    console.log(data);
    console.log(hashPasswordFormBcrypt);
}



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


let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll(
                { raw: true, });
            resolve(users)

        } catch (e) {
            reject(e);
        }



    })
}



let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = db.User.findOne({
                where: { id: userId },
                raw: true, 
            })
if(user){
    resolve(user)
}else(
    resolve({})
)
        } catch (e) {
            reject(e);
        }

    })
}


let updateUserData=  (data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let user =  await db.User.findOne({
                where :{id:data.id}
            })
            if(user){
                user.firstName=data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
            
           await user.save();
           let allUsers = await db.User.findAll();
            resolve(allUsers);
            }else{
                resolve();
            }
        } catch (e) {
            reject(e);
        }
    })
}
let deleteUserById = (userId)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let user = await db.User.findOne({where:
                {id:userId}
            })
            if(user){
                user.destroy();
            }
            resolve();
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData:updateUserData,
    deleteUserById:deleteUserById
}