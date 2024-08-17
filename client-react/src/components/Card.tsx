import { format } from "timeago.js"
import { User, Video } from "../models/model"
import { Link} from "react-router-dom"
import { useAppSelector } from "../store/hooks"
import { useEffect, useState } from "react"
import axios from "axios"
import { apiUrl } from "../URL/url"


interface Props {
  video: Video
}
const Card: React.FC<Props> = ({ video }) => {

  const status = useAppSelector((state) => state.user.status)
  const [channel,setChannel] = useState<User["data"]>()
  const {mode} = useAppSelector(state=>state.mode)

  useEffect(()=>{
    (async () => {
      const res = await axios.get(`${apiUrl}/users/find/${video.userId}`)
      setChannel(res.data)
    })()
  },[video.userId])

  return (
    <>
    <Link to={status?`/video/${video._id}`:'/login'}>
      <div className="w-360 mb-45 cursor-pointer">
        
          <img className="w-full h-202 rounded-lg" src={video.thumbnail} alt="" />
          <div className={`my-3 flex flex-wrap gap-2`}>
            <img src={channel?.avatar} alt="" className="w-9 h-9 border rounded-full bg-black" />
            <p className={`${mode?'text-black':'text-white'}`}>{video.title}</p>
          </div>
          <div  className={`${mode?'text-black':'text-white'}`}>
            <p>{channel?.fullName}</p>
            <div className="flex gap-3">
              <p>{video.views} views - {format(video.createdAt)} </p>
              <p></p>
            </div>
          </div>
       
      </div>
      </Link>

    </>
  )
}

export default Card
