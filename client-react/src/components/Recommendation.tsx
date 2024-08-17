import { useEffect, useState } from "react"
import { Video } from "../models/model"
import axios from "axios"
import { apiUrl } from "../URL/url"
import Card from "./Card"
import { useAppSelector } from "../store/hooks"

const Recommendation = () => {
    const [videos,setVideos] = useState<Video[]>([])

    const {video} = useAppSelector(state=>state.video)

    const fetchedVidoes = videos.filter((Video)=>Video._id!==video?._id)
    useEffect(()=>{
        (async()=>{
            try {
                const res = await axios.get(`${apiUrl}/videos/random`)
                setVideos(res.data)
            } catch (error) {
                console.log("failed to fetch data")
            }
        })()
    },[])
    return (
        <div className='flex gap-3 m-5 flex-wrap p-6'>
        {fetchedVidoes.map((video) => (
          <Card key={video._id} video={video} />
        ))}
      </div>
    )
}

export default Recommendation