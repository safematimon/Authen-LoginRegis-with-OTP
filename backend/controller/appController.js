import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import ENV from '../config.js';
import otpGenerator from 'otp-generator'
import mongoose from "mongoose";


// middleware for verify user
export const verifyUser = async (req,res,next) => {
  try {
    const {username} = req.method == "GET" ? req.query : req.body;

    // check user existance 
    let exist = await UserModel.findOne({username})
    if(!exist)  return res.status(404).send({ error: "Can't find User" });
    next();

  } catch (error) {
    return res.status(404).send({ error: "Authenticate Error" });
  }
  
}

/** POST: http://localhost:4000/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/

export const register = async (req, res) => {
  try {
    const { username, password, profile, email } = req.body;

    // Check existing user
    const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).send({ error: "Please use a unique username" });
      }
      if (existingUser.email === email) {
        return res.status(400).send({ error: "Please use a unique email" });
      }
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new UserModel({
        username,
        password: hashedPassword,
        profile: profile || '',
        email,
      });

      // Save user and return response
      const savedUser = await user.save();
      return res.status(201).send({ msg: "User registration successful" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};



/** POST: http://localhost:4000/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/

// export const login_old = async (req,res) => {
//   const {username,password} = req.body;

//   try {
//     UserModel.findOne({username})
//       .then(user => {
//         bcrypt.compare(password,user.password)
//         .then(passwordCheck=>{
//           if(!password) return res.status(400).send({error:"Don't have password"})
//           // create jwt token
//           const token = jwt.sign({
//                           userId:user._id,
//                           username:user.username,
//                         },ENV.JWT_SECRET,{expiresIn:"24h"})

//           return res.status(200).send({msg:"Login successfull",username:user.username,token})
          
//         })
//         .cacth(error=>{
//           return res.status(400).send({error:"Password not match"})
//         })

//       })
//       .catch(error=>{
//         return res.status(400).send({error:"Username not found"})
//       })

    
//   } catch (error) {
//     return res.status(500).send({error})
//   }
  
// }

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(400).send({ error: "Password does not match" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username
      },
      ENV.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).send({
      msg: "Login Successful...!",
      username: user.username,
      token
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

// POSET: http://localhost:4000/api/getUser/axample123  

export const getUser = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(501).send({ error: "Invalid username" });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "Couldn't find the user" });
    }

    // Remove password from user object
    const { password, ...rest } = user.toObject();

    // console.log(user)

    return res.status(201).send(rest);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};

/** PUT: http://localhost:4000/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
// need middleware to check token(valid login) before update
export const updateUser = async (req, res) => {
  try {
    // const id = req.query.id;
    const {userId} = req.user

    if (!userId) {
      return res.status(401).send({ error: "User Not Found...!" });
    }

    const body = req.body;
    const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, body);

    if (!updatedUser) {
      return res.status(401).send({ error: "User Not Found...!" });
    }

    return res.status(201).send({ msg: "Record Updated...!" });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

export const generateOTP = async (req,res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
  res.status(201).send({ code: req.app.locals.OTP })
}

export const verifyOTP = async (req,res) => {
  const {code} = req.query
  if(parseInt(req.app.locals.OTP) === parseInt(code)){
    req.app.locals.OTP = null //reset OTP
    req.app.locals.resetSession = true // start sesstion to reset password
    return res.status(201).send({msg:"Verify Success"})
  }
  return res.status(400).send({ error: "Invalid OTP"});

}

export const createResetSession = async (req,res) => {
  if(req.app.locals.resetSession){
    // req.app.locals.resetSession = false //reset cuz will allow acces to this route only once
    // return res.status(201).send({msg:"access granted"})
    return res.status(201).send({flag:req.app.locals.resetSession})

  }
  return res.status(440).send({ error: "Seesion expired"});
}

export const resetPassword = async (req,res) => {
  try {
    if (!req.app.locals.resetSession) {
        return res.status(440).send({ error: "Session expired!" });
    }

    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.updateOne({ username: user.username }, { password: hashedPassword });

    req.app.locals.resetSession = false; // reset session

    return res.status(201).send({ msg: "Record Updated" });
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
}