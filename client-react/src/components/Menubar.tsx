import { Link, useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import HistoryIcon from '@mui/icons-material/History';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import axios from 'axios';
import { Logout } from '../store/userSlice';
import { apiUrl } from '../URL/url';

const Menubar = () => {
  const status = useAppSelector((state) => state.user.status)
  const user = useAppSelector((state) => state.user.user)
  const { mode } = useAppSelector(state => state.mode)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/users/logout`, {}, {
        headers: {
          "Authorization": `Bearer ${user?.access_token}`
        }
      })
      dispatch(Logout())
      navigate("/")
    } catch (error) {
      alert("Logout unsuccessfull due to internal server error")
    }
  }
  return (
    <div>
      <div className={`${mode ? 'bg-white' : 'bg-black'} h-screen p-4 `}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="flex gap-1 cursor-pointer">
            <YouTubeIcon className={`${mode ? 'text-black' : 'text-white'}`} />
            <h1 className={`${mode ? 'text-black' : 'text-white'} mb-2`}>YouTube</h1>
          </div>
        </Link>
        <hr className="m-4" />
        <ul>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li className="flex gap-1 my-1">
              <HomeIcon className={`${mode ? 'text-black' : 'text-white'}`} />
              <p className={`${mode ? 'text-black' : 'text-white'}`}>Home</p>
            </li>
          </Link>
          <Link to="/trends" style={{ textDecoration: "none" }}>
            <li className="flex gap-1 my-1 cursor-pointer">
              <ExploreIcon className={`${mode ? 'text-black' : 'text-white'}`} />
              <p className={`${mode ? 'text-black' : 'text-white'}`}>Explore</p>
            </li>
          </Link>
          <Link to={status?"/subcriptions":"/login"}>
            <li className="flex gap-1 my-1">
              <SubscriptionsIcon className={`${mode ? 'text-black' : 'text-white'}`} />
              <p className={`${mode ? 'text-black' : 'text-white'}`}>Subscriptions</p>
            </li>
          </Link>

          <hr className="m-4" />
          <Link to={status?"/libary":"/login"}>
            <li className="flex gap-1 my-1">
              <LibraryAddIcon className={`${mode ? 'text-black' : 'text-white'}`} />
              <p className={`${mode ? 'text-black' : 'text-white'}`}>Libary</p>
            </li>
          </Link>
         

          <hr className="m-4" />
          {
            status ? <button
              className="bg-black text-white border border-white px-4 py-2 rounded m-4"
              onClick={handleLogout}><p className='text-white'>SIGN OUT</p></button> :
              <div>
                <p className={`${mode ? 'text-black' : 'text-white'}`}>if you want to explore<br></br> new things plz sign in</p>
                <button className="bg-black text-white border border-white px-4 py-2 rounded m-4" onClick={() => navigate("/login")}>SIGN IN</button>
              </div>
          }

        </ul>
      </div>
    </div>

  )
}

export default Menubar
