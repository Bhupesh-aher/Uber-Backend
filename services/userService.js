const User = require("../models/user")


module.exports.createUser = async({firstname, lastname, email, password}) => {
    if(!firstname || !email || !password){
        throw new Error("All fields are requried!")
    }
    const user =  User.create({
        fullname: {
            firstname,
            lastname
        }, 
        email, 
        password
    })

    return user;
}