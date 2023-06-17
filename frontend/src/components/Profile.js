import '../styles/Username.scss'
import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom' 
import avatar from '../assets/profile.png'
import toast,{Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import { useAuthStore } from '../store/store'
import useFetch from '../hook/fetch.hook'
import { passwordValidate, profileValidation } from '../helper/validate'
import { updateUser } from '../helper/helper'

import styles from '../styles/Username.module.css';
import extend from '../styles/Profile.module.css';

import { convertToBase64 } from '../helper/convert'

const Profile = () => {

  const navigate = useNavigate();
  const[file,setFile] = useState('')
  const [{isLoading,apiData,serverError}] = useFetch()

  const formik = useFormik({
    initialValues : {
      firstName : apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address : apiData?.address || ''
    },
    enableReinitialize:true,
    validate: profileValidation,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit:async values =>{
      values = await Object.assign(values, { profile : file || apiData?.profile ||''})
      // console.log(values)
      let updatePromise = updateUser(values)
      toast.promise(updatePromise,{
        loading: 'Updating...',
        success : <b>Update Successfully...!</b>,
        error : <b>Could not Update.</b>
      })
    }
  })

  //handle upload
  const onUpload = async (e)=>{
    const base64 = await convertToBase64(e.target.files[0])
    setFile(base64)
  }

  // logout
  const userLogout = async () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className='container mx-auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={`${styles.glass} ${extend.glass}`} style={{width:"45%"}}>

          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Profile</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              You can update the details.
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src={ file ||  apiData?.profile || avatar} alt="avatar" className={`${styles.profile_img} ${extend.profile_img}`} />
              </label>
              <input onChange={onUpload} type="file" name="profile" id="profile" />
            </div>

            <div className='textbox flex flex-col items-center gap-6'>
              <div className="name flex w-3/4 gap-10">
                <input {...formik.getFieldProps('firstName')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Firstname'/>
                <input {...formik.getFieldProps('lastName')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Lastname'/>
              </div>

              <div className="name flex w-3/4 gap-10">
                <input {...formik.getFieldProps('mobile')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Mobile No.'/>
                <input {...formik.getFieldProps('email')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Email*'/>
              </div>
              
              {/* <div className="name flex w-3/4 gap-10"> */}
                <input {...formik.getFieldProps('address')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Address'/>
                <button className={styles.btn} type="submit">Update</button>
              {/* </div> */}


              {/* <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder='Email*'/>
              <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username*'/>
              <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='Password*'/>
              <button className={styles.btn} type="submit">Sign In</button> */}
            </div>
          </form>

          <div className="text-center py-4">
            <span className='text-gray-500'>come back later? <button className='text-red-500' onClick={userLogout}>
              Logout
            </button>
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile

