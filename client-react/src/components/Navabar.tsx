import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VideoCallIcon from '@mui/icons-material/VideoCall';
import SearchIcon from '@mui/icons-material/Search';
import { useAppSelector } from '../store/hooks';
import Mode from './Mode';

const Navabar = () => {
    const { status, user } = useAppSelector(state => state.user)
    const navigate = useNavigate()
    const { mode } = useAppSelector(state => state.mode)
    const [q, setQ] = useState<string>("")
    return (
        <nav className=" px-4 py-2">
            <div className="container mx-auto flex items-center justify-between">
                <div className="relative flex items-center">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        type="text" placeholder="Search"
                        className="border border-gray-300 bg-white h-8 px-4 pr-8 rounded-l-full focus:outline-none focus:border-blue-500" />
                    <button
                        onClick={() => navigate(`/search?q=${q}`)}
                        className="bg-blue-500 text-white h-8 px-4 rounded-r-full hover:bg-blue-600">
                        <SearchIcon />
                    </button>
                </div>
                {status ? (<div className="my-3 flex gap-4 mx-2">
                    <Mode />
                    <Link to="/addVideo"><VideoCallIcon style={{ color: `${mode ? 'black' : 'white'}`, fontSize: '30px' }} /></Link>
                    <Link to="/profile"><img src={user?.data.avatar} alt="" className="w-9 h-9 border rounded-full bg-black" /></Link>
                    <Link to="/profile"><p className={`${mode ? 'text-black' : 'text-white'}`}>{user?.data.fullName}</p></Link>
                </div>) : (
                    <div className='flex gap-7 justify-center items-center'>
                        <Mode />
                        <button onClick={() => navigate("/login")} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                            Sign In

                        </button>
                    </div>
                )}

            </div>
        </nav>
    )
}

export default Navabar
