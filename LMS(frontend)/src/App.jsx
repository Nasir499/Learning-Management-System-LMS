import './App.css'

import { lazy, Suspense, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'

import RequireAuth from './Components/Auth/RequireAuth'
import ErrorBoundary from './Components/ErrorBoundary'
import { getProfile } from './Redux/Slices/AuthSlice'

const AboutUs = lazy(() => import('./Pages/AboutUs'))
const Contact = lazy(() => import('./Pages/Contact'))
const CourseDescription = lazy(() => import('./Pages/Course/CourseDescription'))
const CourseList = lazy(() => import('./Pages/Course/CourseList'))
const CreateCourse = lazy(() => import('./Pages/Course/CreateCourse'))
const AddLecture = lazy(() => import('./Pages/Dashboard/AddLecture'))
const AdminDashboard = lazy(() => import('./Pages/Dashboard/AdminDashboard'))
const Displaylectures = lazy(() => import('./Pages/Dashboard/Displaylectures'))
const Denied = lazy(() => import('./Pages/Denied'))
const HomePage = lazy(() => import('./Pages/HomePage'))
const Login = lazy(() => import('./Pages/Login'))
const Notfound = lazy(() => import('./Pages/Notfound'))
const CheckOut = lazy(() => import('./Pages/Payment/CheckOut'))
const CheckoutFailure = lazy(() => import('./Pages/Payment/CheckoutFailure'))
const CheckoutSuccess = lazy(() => import('./Pages/Payment/CheckoutSuccess'))
const ResetPassword = lazy(() => import('./Pages/ResetPassword'))
const SignUp = lazy(() => import('./Pages/SignUp'))
const ChangePassword = lazy(() => import('./Pages/User/ChangePassword'))
const EditProfile = lazy(() => import('./Pages/User/EditProfile'))
const Profile = lazy(() => import('./Pages/User/Profile'))

function PageLoader() {
  return (
    <div className="h-[90vh] flex items-center justify-center bg-gray-900 text-yellow-500 text-xl font-semibold">
      Loading...
    </div>
  )
}

function App() {
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getProfile())
    }
  }, [dispatch, isLoggedIn])
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/courses' element={<CourseList />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/denied' element={<Denied />} />
          <Route path='/course/description' element={<CourseDescription />} />
          <Route path='/reset-password/:resetToken' element={<ResetPassword />} />

          <Route element={<RequireAuth allowedRoles={['ADMIN']} />}>
            <Route path='/course/create' element={<CreateCourse />} />
            <Route path='/course/addlecture' element={<AddLecture />} />
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={['ADMIN', 'USER']} />}>
            <Route path='/user/profile' element={<Profile />} />
            <Route path='/user/editprofile' element={<EditProfile />} />
            <Route path='/user/changepassword' element={<ChangePassword />} />
            <Route path='/checkout' element={<CheckOut />} />
            <Route path='/checkout/success' element={<CheckoutSuccess />} />
            <Route path='/checkout/fail' element={<CheckoutFailure />} />
            <Route path='/course/displaylectures' element={<Displaylectures />} />
          </Route>

          <Route path='*' element={<Notfound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
