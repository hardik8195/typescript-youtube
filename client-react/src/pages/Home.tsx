import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import axios from 'axios';
import { Video } from '../models/model';
import { apiUrl } from '../URL/url';
import { useAppSelector } from '../store/hooks';

interface Props {
  type: string
}
const Home: React.FC<Props> = ({ type }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const { user } = useAppSelector((state) => state.user)

  useEffect(() => {
    (async () => {
      try {
        let config = {}
        if (type === "sub" || type==="save") {
          config = {
            headers: {
              "Authorization": `Bearer ${user?.access_token}`
            }
          }
        }
        const res = await axios.get<Video[]>(`${apiUrl}/videos/${type}`,config);
        setVideos(res.data);
      } catch (error) {
        console.error('Failed to fetch videos', error);
      }
    })();
  }, [type,user?.access_token]);

  return (
    <div className='flex gap-3 m-5 flex-wrap p-6'>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </div>
  );
}

export default Home;
