import { useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Footer from "../Components/Footer";
import { logout } from "../Redux/Slices/AuthSlice";

function HomeLayout({ children }) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const role = useSelector((state) => state?.auth?.role);

  function changeWidth() {
    const drawerSide = document.getElementsByClassName("drawer-side");
    if (drawerSide[0]) drawerSide[0].style.width = 'auto';
  }

  function hideDrawer() {
    const element = document.getElementsByClassName("drawer-toggle");
    if (element[0]) element[0].checked = false;

    const drawerSide = document.getElementsByClassName("drawer-side");
    if (drawerSide[0]) drawerSide[0].style.width = '0px';
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        hideDrawer();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function handleLogout(event) {
    event.preventDefault();

    await dispatch(logout());
    navigate('/');
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className='min-h-[90vh]'>
      <div className="drawer absolute left-0 z-50 w-fit">

        <input className='drawer-toggle' id="my-drawer" type="checkbox" />

        <div className="drawer-content">
          <label htmlFor="my-drawer" className="cursor-pointer relative" aria-label="Open Drawer">
            <FiMenu
              onClick={changeWidth}
              size={"32px"}
              className='font-bold text-white m-4 hover:text-yellow-500 transition-colors'
            />
          </label>
        </div>

        <div className="drawer-side w-0">
          <label htmlFor="my-drawer" className="drawer-overlay" onClick={hideDrawer}></label>
          <div className="menu bg-base-200 text-base-content min-h-full w-56 sm:w-80 p-4 flex flex-col justify-between relative shadow-2xl">
            <div>
              <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-700">
                <span className="font-bold text-lg px-2 text-yellow-500">Navigation</span>
                <button onClick={hideDrawer} aria-label="Close menu" className="p-1 hover:bg-base-300 rounded-full transition-colors text-gray-300 hover:text-white">
                  <AiFillCloseCircle size={24} />
                </button>
              </div>
              <ul className="space-y-1">
                <li>
                  <Link to="/" onClick={hideDrawer} className={isActive("/") ? "text-yellow-500 font-bold bg-base-300" : ""}> Home </Link>
                </li>
                {isLoggedIn && role === "ADMIN" && (
                  <li>
                    <Link to="/admin/dashboard" onClick={hideDrawer} className={isActive("/admin/dashboard") ? "text-yellow-500 font-bold bg-base-300" : ""}>
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                {isLoggedIn && role === "ADMIN" && (
                  <li>
                    <Link to="/course/create" onClick={hideDrawer} className={isActive("/course/create") ? "text-yellow-500 font-bold bg-base-300" : ""}>
                      Create Course
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/courses" onClick={hideDrawer} className={isActive("/courses") ? "text-yellow-500 font-bold bg-base-300" : ""}> All courses </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={hideDrawer} className={isActive("/contact") ? "text-yellow-500 font-bold bg-base-300" : ""}> Contact Us </Link>
                </li>
                <li>
                  <Link to="/about" onClick={hideDrawer} className={isActive("/about") ? "text-yellow-500 font-bold bg-base-300" : ""}> About Us </Link>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              {!isLoggedIn && (
                <div className="w-full flex items-center justify-between gap-2">
                  <Link to="/login" onClick={hideDrawer} className="w-1/2">
                    <button className="bg-amber-50 text-black py-2 font-semibold rounded-md w-full hover:bg-amber-100 transition-all text-center">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup" onClick={hideDrawer} className="w-1/2">
                    <button className="bg-amber-500 text-black py-2 font-semibold rounded-md w-full hover:bg-amber-600 transition-all text-center">
                      SignUp
                    </button>
                  </Link>
                </div>
              )}
              {isLoggedIn && (
                <div className="w-full flex items-center justify-between gap-2">
                  <Link to="/user/profile" onClick={hideDrawer} className="w-1/2">
                    <button className="bg-amber-50 text-black py-2 font-semibold rounded-md w-full hover:bg-amber-100 transition-all text-center">
                      Profile
                    </button>
                  </Link>
                  <button onClick={(e) => { hideDrawer(); handleLogout(e); }} className="w-1/2 bg-amber-500 text-black py-2 font-semibold rounded-md hover:bg-amber-600 transition-all text-center">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
      {children}
      <Footer />
    </div>
  )
}

export default HomeLayout
