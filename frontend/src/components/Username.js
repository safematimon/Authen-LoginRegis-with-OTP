// import '../styles/Username.scss'
import React, { useEffect,useRef } from 'react'
import { Link,useNavigate } from 'react-router-dom' 
import avatar from '../assets/profile.png'
import {Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'

import styles from '../styles/Username.module.css';

const Username = ({text}) => {
  
  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername)

  useEffect(()=>{
    // console.log(username)
  })

  const formik = useFormik({
    initialValues:{
      username:'example123'
    },
    validate: usernameValidate,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit:async values =>{
      setUsername(values.username)
      navigate('/password')
    }
  })

  return (
    <div className='container mx-auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>
          <div className='title flex flex-col items-center'>
            {/* <h4 className='text-5xl font-bold'>Hoolo again</h4> */}
            <h4 className='text-5xl font-bold'>{text}</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore more by connexting with us 
            </span>
          </div>

            <form className='py-1' onSubmit={formik.handleSubmit}>
              <div className="profile flex justify-center py-4">
                <img src={avatar} alt="avatar" className={styles.profile_img} />
              </div>

              <div className='textbox flex flex-col items-center gap-6'>
                <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username'/>
                <button className={styles.btn} type="submit">Let's Go</button>
              </div>
            </form>

              <div className="text-center py-4">
                <span className='text-gray-500'>Not a Member <Link className='text-red-500' to="/register">
                  Register
                </Link>
                </span>
              </div>


        </div>
      </div>
    </div>
  )
}

export default Username

