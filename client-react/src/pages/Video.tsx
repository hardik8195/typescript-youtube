import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { format } from 'timeago.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../URL/url';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setVideo, like, dislike } from '../store/videoSlice';
import { User } from '../models/model';
import { savedVideos, subscription } from '../store/userSlice';
import CommentSection from '../components/Comments';
import Recommendation from '../components/Recommendation';

const Video: React.FC = () => {
    const path = useLocation().pathname.split("/")[2]
    const video = useAppSelector(state => state.video.video)
    const user = useAppSelector(state => state.user.user)
    const mode = useAppSelector(state => state.mode.mode)
    const [channel, setChannel] = useState<User["data"]>()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const videoRes = await axios.get(`${apiUrl}/videos/find/${path}`)
            const userRes = await axios.get(`${apiUrl}/users/find/${videoRes.data.userId}`)

            dispatch(setVideo(videoRes.data))
            setChannel(userRes.data)
        }
        fetchData()
    }, [path, dispatch])

    const handleLike = async () => {
        await axios.put(`${apiUrl}/users/like/${video?._id}`, {}, {
            headers: {
                "Authorization": `Bearer ${user?.access_token}`
            }
        })

        dispatch(like(user?.data._id ?? ""));
    }
    const handleDislike = async () => {
        await axios.put(`${apiUrl}/users/dislike/${video?._id}`, {}, {
            headers: {
                "Authorization": `Bearer ${user?.access_token}`
            }
        })
        dispatch(dislike(user?.data._id ?? ""))
    }
    const handleSubscribe = async () => {
        user?.data.subscribedUsers.includes(channel?._id ?? "") ?
            await axios.put(`${apiUrl}/users/unsub/${channel?._id}`, {}, {
                headers: {
                    "Authorization": `Bearer ${user?.access_token}`
                }
            }) :
            await axios.put(`${apiUrl}/users/sub/${channel?._id}`, {}, {
                headers: {
                    "Authorization": `Bearer ${user?.access_token}`
                }
            })
        dispatch(subscription(channel?._id))
    }
    const handleLibary = async () => {
        user?.data.savedVideos.includes(video?._id ?? "") ?
            await axios.put(`${apiUrl}/users/unsave/${video?._id}`, {}, {
                headers: {
                    "Authorization": `Bearer ${user.access_token}`
                }
            }) :
            await axios.put(`${apiUrl}/users/save/${video?._id}`, {}, {
                headers: {
                    "Authorization": `Bearer ${user?.access_token}`
                }
            })

        dispatch(savedVideos(video?._id))
    }
    const handleDelete = async () => {
        try {
            await axios.delete(`${apiUrl}/videos/${video?._id}`, {
                headers: {
                    "Authorization": `Bearer ${user?.access_token}`
                }
            })

            navigate("/")
        } catch (error) {
            console.log("error in deleting the vedio")
        }
    }
    return (
        <>
            <div>
                <div className="flex gap-5 my-3">
                    <div className="flex-5 mx-2">
                        <iframe
                            width="100%"
                            style={{ height: "600px" }}
                            allowFullScreen
                            title={video?.title}
                            src={video?.videoFile}>

                            Your browser does not support the video tag.
                        </iframe>
                        <div className={`${mode ? 'text-black' : 'text-white'} my-3`}>
                            <h1>{video?.title}</h1>
                            <div className="flex">
                                <div className="flex flex-1 gap-3">
                                    <p>{video?.views} views </p>
                                    <p>{format(video?.createdAt ?? "")}</p>
                                </div>
                                <div className="flex gap-3">
                                    {
                                        user?.data._id === video?.userId && (

                                            <button onClick={handleDelete}>
                                                <DeleteIcon />
                                                Delete
                                            </button>
                                        )
                                    }
                                    <div className='flex gap-1' >
                                        <div className='cursor-pointer' onClick={handleLibary}>
                                            {user?.data.savedVideos?.includes(video?._id?? "") ?
                                                (<BookmarkIcon />) :
                                                (<BookmarkBorderIcon />)
                                            }
                                        </div>
                                        <p>{user?.data.savedVideos?.includes(video?._id ?? "") ?
                                            "Unsave" : "Save"
                                        }</p>
                                    </div>
                                    <div onClick={handleLike} className='flex gap-1'>
                                        <div className='cursor-pointer'>
                                            {
                                                video?.likes.includes(user?.data._id ?? "") ?
                                                    (<ThumbUpIcon />) :
                                                    (<ThumbUpOffAltIcon />)

                                            }
                                        </div>
                                        <p>Like</p>
                                    </div>
                                    <div className='flex gap-1'>
                                        <div onClick={handleDislike} className='cursor-pointer'>
                                            {video?.dislikes.includes(user?.data._id ?? "") ?
                                                (<ThumbDownIcon />) :
                                                (<ThumbDownOffAltIcon />)
                                            }
                                        </div>
                                        <p>Dislike</p>
                                    </div>
                                </div>
                            </div>
                            <hr className='my-4' />
                            <div className='flex my-3'>
                                <div className='flex gap-2 flex-1'>
                                    <img
                                        src={channel?.avatar}
                                        alt="Channel Avatar"
                                        className="w-9 h-9 border rounded-full bg-black"
                                    />
                                    <div>
                                        <h1 style={{ fontSize: 'large' }}>{channel?.username}</h1>
                                        <p style={{ fontSize: 'small' }}>{channel?.subscribers}</p>
                                        <p>{video?.desc}</p>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={handleSubscribe} className="bg-black text-white border border-white px-4 py-2 rounded m-4">
                                        {user?.data.subscribedUsers?.includes(channel?._id ?? "") ? "Subscribed" : "Subscribe"}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <CommentSection />
                    </div>
                    <div className="flex-2">
                        <Recommendation />
                    </div>
                </div>
            </div>

        </>
    )
}

export default Video
