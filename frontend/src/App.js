import React from 'react'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'

/** import components**/ 
import Username from './components/Username';
import Password from './components/Password';
import Register from './components/Register';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';


// auth middleware
import { AuthorizeUser,ProtectRoute } from './middleware/auth';

/**root routes**/

const router = createBrowserRouter([
  {
      path : '/',
      element : <Username text='safeplanet'/>
  },
  {
      path : '/register',
      element : <Register></Register>
  },
  {
      path : '/password',
      element : <ProtectRoute><Password /></ProtectRoute>
      // element : <Password />

  },
  {
      path : '/profile',
      element : <AuthorizeUser><Profile /></AuthorizeUser>
      // element : <Profile />
  },
  {
      path : '/recovery',
      element : <Recovery></Recovery>
  },
  {
      path : '/reset',
      element : <Reset></Reset>
  },
  {
      path : '*',
      element : <PageNotFound></PageNotFound>
  },
])


const App = () => {
  return (
    <main>
      <RouterProvider router={router}>

      </RouterProvider>
    </main>
  )
}

export default App