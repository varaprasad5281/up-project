import { Link, useNavigate } from "react-router-dom"
import { getCookie, removeCookie } from "../../helper"
import { auth } from "../../firebase"

const Navbar = () => {

    const token = getCookie('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut().then(() => {
            removeCookie('token');
            navigate(0, { replace: true })
        }).catch((error) => {
            alert(error.message)
        })
    }


    return (
        <div className="navbar bg-gray-800 flex justify-between px-8 py-2">
            <Link to='/'>
                <img className="h-8 w-8" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
            </Link>
            {token ? <button onClick={handleLogout} className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Logout</button>
                : <Link to='/admin' className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Admin Login</Link>}
        </div>
    )
}

export default Navbar