# Authen-LoginRegis-with-OTP

This project is a web application for login, register, reset password with OTP.

using MERN STACK (mongo,express,react,node)

tools \
mongodb - database (memory-server)\
tailwind - css framework\
zustand - state management\
formik - form management\
nodemailer & mailgen - generate and send register,OTP


## Environment file
.env in frontend

```javascript
REACT_APP_SERVER_DOMAIN='<server_domain>' # example 'http://localhost:4000'
```

config.js in backend
```javascript
export default {
    JWT_SECRET : "<secret>",
    EMAIL: "eula.stamm@ethereal.email", // testing email & password from ethereal.emai
    PASSWORD : "jXx8KkpCNVMgK5sdQC",
    ATLAS_URI: "<MONGODB_ATLAS_URI>" //if u change from mongo memory server to mongo cloud 
}
```