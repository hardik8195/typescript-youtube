import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import axios from 'axios';
import { apiUrl } from '../URL/url';
import Comment from './Comment';
import { addComment, setComments } from '../store/commentSlice';

const CommentSection: React.FC = () => {
    const {video} = useAppSelector((state)=>state.video)
    const {user} = useAppSelector((state)=>state.user)
    const {comments} = useAppSelector(state=>state.comment)
    const [comment,setComment] = useState<string>("")
    const dispatch = useAppDispatch()
    useEffect(()=>{
        (async()=> {
            try {
                const res = await axios.get(`${apiUrl}/comments/${video?._id}`,{
                    headers: {
                        "Authorization": `Bearer ${user?.access_token}`
                      }
                })
                dispatch(setComments(res.data))
                
            } catch (error) {
                console.log("fetching comments error")
            }
        })()
    },[])

    const handleAdd =async () => {
        const res = await axios.post(`${apiUrl}/comments`,{desc:comment,videoId:video?._id,userId:user?.data._id},{
            headers: {
                "Authorization": `Bearer ${user?.access_token}`
              }
        })
        dispatch(addComment({_id:res.data._id,userId:res.data.userId,desc:res.data.desc,videoId:res.data.videoId}))
        setComment("")
    }
  return (
    <div className="my-3">
      <div className="gap-2 flex-1">
        <input
          className="w-10/12 h-20 border rounded-md p-2"
          placeholder="Add a comment ..."
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
          
        />
        <div>
          <button onClick={handleAdd} className="mt-2 px-4 py-2 border border-white bg-black text-white rounded-md">
            ADD
          </button>
        </div>
      </div>
      <div>
        {comments.map((comment)=>(
            <Comment key={comment._id} comment={comment}/>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
