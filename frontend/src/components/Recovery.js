// import '../styles/Username.scss'
import React, { useState,useEffect } from 'react'
import { Link ,useNavigate} from 'react-router-dom' 
import avatar from '../assets/profile.png'
import {Toaster, toast} from 'react-hot-toast'
import { useAuthStore } from '../store/store'
import { generateOTP,verifyOTP } from '../helper/helper'


import styles from '../styles/Username.module.css';

const Recovery = () => {

  const navigate = useNavigate();

  const {username} = useAuthStore(state => state.auth)
  const [OTP,setOTP] = useState()

  useEffect(() => {
    generateOTP(username).then((OTP)=>{
      console.log("useEff",OTP)
      if(OTP) return toast.success('OTP has been send to your email')
  
      return toast.error('Problem while generating OTP')
    })
  }, [username])
 
  const OnSubmit = async (e) => {
    e.preventDefault();
    console.log("tick")
    try { 
      let { status } = await verifyOTP({ username, code : OTP })
      if(status === 201){
        toast.success('Verify Successfully!')
        return navigate('/reset')
      }  
    } catch (error) {
      return toast.error('Wront OTP! Check email again!')
    }
  }
  // handle resend
  const resendOTP = async () => {
    
    // let sentPromise = generateOTP(username);

    // toast.promise(sentPromise ,
    //   {
    //     loading: 'Sending...',
    //     success: <b>OTP has been send to your email!</b>,
    //     error: <b>Could not Send it!</b>,
    //   }
    // );

    // sentPromise.then((OTP) => {
    //   console.log(OTP)
    // });
    try {
      let OTP = await generateOTP(username);
      console.log("resend OTP",OTP);
      toast.success(<b>OTP has been sent to your email!</b>);
    } catch (error) {
      // console.error(error);
      toast.error(<b>Could not send it!</b>);
    }
  }
 
  return (
    <div className='container mx-auto'>

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>
          <div className='title flex flex-col items-center'>
            {/* <h4 className='text-5xl font-bold'>Hoolo again</h4> */}
            <h4 className='text-5xl font-bold'>Recovery</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter OTP to recovery password.
            </span>
          </div>

          <form className='pt-20'  onSubmit={OnSubmit}>

            <div className='textbox flex flex-col items-center gap-6'>

              <div className='input text-center'>
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email address
                </span>
                <input onChange={(e)=> setOTP(e.target.value)} className={styles.textbox} type="text" placeholder='OTP'/>
              </div>
              
              <button className={styles.btn} type="submit">Sign In</button>
            </div>
          </form>

            <div className="text-center py-4">
              <span className='text-gray-500'>Cant's get OTP?  <button className='text-red-500' onClick={resendOTP}>Resend</button>
              </span>
            </div>

        </div>
      </div>
    </div>
  )
}

export default Recovery