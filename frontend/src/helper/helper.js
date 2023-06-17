import axios from 'axios'
import jwt_decode from 'jwt-decode';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN

// make API request

// to get user name from token
export const getUsername = async () => {
  const token = localStorage.getItem('token')
  if(!token) return Promise.reject("Cannot find Token");
  let decode = jwt_decode(token)
  // console.log("decode:",decode)
  return decode;
}

// authen func
export const authenticate = async (username) => {
  try {
    return await axios.post('/api/authenticate',{username})
  } catch (error) {
    return {error:"Username doesn't exist"}
  }
}

// get user detail
export const getUser = async ({username}) => {
  try {
    const {data} = await axios.get(`/api/user/${username}`)
    return {data}
  } catch (error) {
    return {error:"Password doesn't match"}
  }
}

// register user func
export const registerUser = async (credentials) => {
  try {
    const {data:{msg},status} = await axios.post(`/api/register`,credentials)
    let {username,email} = credentials

    // send email
    if(status === 201){
      await axios.post('api/registerMail',{username,userEmail:email,text:msg})
    }

    return Promise.resolve(msg)
  } catch (error) {
    return Promise.reject({error})
  }
}

// login  func
export const verifyPassword = async ({ username, password }) => {
  try {
    if(username){
      const { data } = await axios.post('/api/login', { username, password })
      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error : "Password doesn't Match...!"})
  }
}

// update user
export const updateUser = async (response) => {
  try {
    const token = await localStorage.getItem('token')
    const data = await axios.put('/api/updateuser',response,{headers:{"Authorization":`Bearer ${token}`}})
    console.log(data)
    return Promise.resolve({data})
  } catch (error) {
    return Promise.reject({ error : "Couldnt update profile"})
  }
}

//generate OTP
export const generateOTP = async (username) => {
  try {
    const {data:{code},status} = await axios.get('/api/generateOTP',{params:{username}})
    
    // send mail with OTP
    if(status === 201){
      let { data : { email }} = await getUser({ username });
      let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
      await axios.post('/api/registerMail', { username, userEmail: email, text, subject : "Password Recovery OTP"})
    }
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject({ error})
  }
} 

// verify OTP
export const verifyOTP = async ({ username, code }) => {
  try {
    const { data, status } = await axios.get('/api/verifyOTP', { params : { username, code }})
    return { data, status }
 } catch (error) {
     return Promise.reject(error);
 }
}

// reset password
export const resetPassword = async ({ username, password }) => {
  try {
    const { data, status } = await axios.put('/api/resetPassword', { username, password });
    return Promise.resolve({ data, status})
  } catch (error) {
    return Promise.reject({ error })
  }
}