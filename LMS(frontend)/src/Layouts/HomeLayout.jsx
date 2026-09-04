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
    <div className='min-h-[90vh] flex flex-col justify-between'>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-4 sm:px-8 py-3 flex items-center justify-between shadow-lg">
        {/* Left: Menu Trigger & Logo */}
        <div className="flex items-center gap-3">
          <label htmlFor="my-drawer" className="cursor-pointer p-1 text-white hover:text-yellow-500 transition-colors rounded-md" aria-label="Open Navigation Menu">
            <FiMenu
              onClick={changeWidth}
              size={26}
            />
          </label>
          <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-1">
            <span className="text-yellow-500">LMS</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-300 hidden xs:inline uppercase tracking-wider">Portal</span>
          </Link>
        </div>

        {/* Center: Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className={isActive("/") ? "text-yellow-500 font-bold border-b-2 border-yellow-500 pb-0.5" : "text-gray-200 hover:text-yellow-500 transition-colors"}>Home</Link>
          <Link to="/courses" className={isActive("/courses") ? "text-yellow-500 font-bold border-b-2 border-yellow-500 pb-0.5" : "text-gray-200 hover:text-yellow-500 transition-colors"}>All Courses</Link>
          {isLoggedIn && role === "ADMIN" && (
            <Link to="/admin/dashboard" className={isActive("/admin/dashboard") ? "text-yellow-500 font-bold border-b-2 border-yellow-500 pb-0.5" : "text-gray-200 hover:text-yellow-500 transition-colors"}>Admin Dashboard</Link>
          )}
          {isLoggedIn && role === "ADMIN" && (
            <Link to="/course/create" className={isActive("/course/create") ? "text-yellow-500 font-bold border-b-2 border-yellow-500 pb-0.5" : "text-gray-200 hover:text-yellow-500 transition-colors"}>Create Course</Link>
          )}
          <Link to="/contact" className={isActive("/contact") ? "text-yellow-500 font-bold border-b-2 border-yellow-500 pb-0.5" : "text-gray-200 hover:text-yellow-500 transition-colors"}>Contact Us</Link>
          <Link to="/about" className={isActive("/about") ? "text-yellow-500 font-bold border-b-2 border-yellow-500 pb-0.5" : "text-gray-200 hover:text-yellow-500 transition-colors"}>About Us</Link>
        </nav>

        {/* Right: Prominent Login & SignUp buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isLoggedIn ? (
            <>
              <Link to="/login">
                <button className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-yellow-500 border border-yellow-500/80 rounded-md hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-sm cursor-pointer">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition-all duration-300 shadow-md cursor-pointer">
                  SignUp
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/user/profile">
                <button className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-white bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-all duration-300 shadow-sm cursor-pointer">
                  Profile
                </button>
              </Link>
              <button onClick={handleLogout} className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition-all duration-300 shadow-md cursor-pointer">
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      {/* Drawer Container */}
      <div className="drawer relative z-50 w-full">
        <input className='drawer-toggle' id="my-drawer" type="checkbox" />

        <div className="drawer-side w-0">
          <label htmlFor="my-drawer" className="drawer-overlay" onClick={hideDrawer}></label>
          <div className="menu bg-gray-900 text-base-content min-h-full w-64 sm:w-80 p-5 flex flex-col justify-between relative shadow-2xl border-r border-gray-800">
            <div>
              <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-800">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xl text-yellow-500">LMS Navigation</span>
                </div>
                <button onClick={hideDrawer} aria-label="Close menu" className="p-1 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white">
                  <AiFillCloseCircle size={24} />
                </button>
              </div>
              <ul className="space-y-1.5 text-sm font-medium">
                <li>
                  <Link to="/" onClick={hideDrawer} className={`py-2 px-3 rounded-md transition-colors ${isActive("/") ? "text-yellow-500 font-bold bg-gray-800" : "hover:bg-gray-800/60 text-gray-200"}`}> Home </Link>
                </li>
                {isLoggedIn && role === "ADMIN" && (
                  <li>
                    <Link to="/admin/dashboard" onClick={hideDrawer} className={`py-2 px-3 rounded-md transition-colors ${isActive("/admin/dashboard") ? "text-yellow-500 font-bold bg-gray-800" : "hover:bg-gray-800/60 text-gray-200"}`}>
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                {isLoggedIn && role === "ADMIN" && (
                  <li>
                    <Link to="/course/create" onClick={hideDrawer} className={`py-2 px-3 rounded-md transition-colors ${isActive("/course/create") ? "text-yellow-500 font-bold bg-gray-800" : "hover:bg-gray-800/60 text-gray-200"}`}>
                      Create Course
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/courses" onClick={hideDrawer} className={`py-2 px-3 rounded-md transition-colors ${isActive("/courses") ? "text-yellow-500 font-bold bg-gray-800" : "hover:bg-gray-800/60 text-gray-200"}`}> All courses </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={hideDrawer} className={`py-2 px-3 rounded-md transition-colors ${isActive("/contact") ? "text-yellow-500 font-bold bg-gray-800" : "hover:bg-gray-800/60 text-gray-200"}`}> Contact Us </Link>
                </li>
                <li>
                  <Link to="/about" onClick={hideDrawer} className={`py-2 px-3 rounded-md transition-colors ${isActive("/about") ? "text-yellow-500 font-bold bg-gray-800" : "hover:bg-gray-800/60 text-gray-200"}`}> About Us </Link>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-800">
              {!isLoggedIn && (
                <div className="w-full flex items-center justify-between gap-3">
                  <Link to="/login" onClick={hideDrawer} className="w-1/2">
                    <button className="border border-yellow-500/80 text-yellow-500 py-2 font-semibold rounded-md w-full hover:bg-yellow-500 hover:text-black transition-all text-center text-xs sm:text-sm">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup" onClick={hideDrawer} className="w-1/2">
                    <button className="bg-yellow-500 text-black py-2 font-semibold rounded-md w-full hover:bg-yellow-600 transition-all text-center text-xs sm:text-sm">
                      SignUp
                    </button>
                  </Link>
                </div>
              )}
              {isLoggedIn && (
                <div className="w-full flex items-center justify-between gap-3">
                  <Link to="/user/profile" onClick={hideDrawer} className="w-1/2">
                    <button className="bg-gray-800 text-white py-2 font-semibold rounded-md w-full hover:bg-gray-700 border border-gray-700 transition-all text-center text-xs sm:text-sm">
                      Profile
                    </button>
                  </Link>
                  <button onClick={(e) => { hideDrawer(); handleLogout(e); }} className="w-1/2 bg-yellow-500 text-black py-2 font-semibold rounded-md hover:bg-yellow-600 transition-all text-center text-xs sm:text-sm">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default HomeLayout
