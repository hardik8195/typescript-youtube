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
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const dispatch = useAppDispatch()
    
    useEffect(()=>{
        const fetchComments = async()=> {
            if (!video?._id || !user?.access_token) return;
            
            setLoading(true);
            setError("");
            
            try {
                const res = await axios.get(`${apiUrl}/comments/${video._id}`,{
                    headers: {
                        "Authorization": `Bearer ${user.access_token}`
                      }
                })
                dispatch(setComments(res.data || []))
                
            } catch (error) {
                console.log("fetching comments error", error)
                setError("Failed to load comments")
                dispatch(setComments([])) // Set empty array on error
            } finally {
                setLoading(false)
            }
        }
        
        fetchComments();
    },[video?._id, user?.access_token, dispatch])
    
    // Safety check for Redux Persist hydration
    if (!comments) {
        return (
            <div className="my-3">
                <div className="text-gray-500 text-sm">Loading comments...</div>
            </div>
        )
    }

    const handleAdd =async () => {
        if (!comment.trim() || !video?._id || !user?.data._id) return;
        
        try {
            const res = await axios.post(`${apiUrl}/comments`,{
                desc: comment.trim(),
                videoId: video._id,
                userId: user.data._id
            },{
                headers: {
                    "Authorization": `Bearer ${user.access_token}`
                  }
            })
            dispatch(addComment({
                _id: res.data._id,
                userId: res.data.userId,
                desc: res.data.desc,
                videoId: res.data.videoId
            }))
            setComment("")
        } catch (error) {
            console.log("Error adding comment", error)
            setError("Failed to add comment")
        }
    }
    
  return (
    <div className="my-3">
      <div className="gap-2 flex-1">
        <input
          className="w-10/12 h-20 border rounded-md p-2"
          placeholder="Add a comment ..."
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
          disabled={loading}
        />
        <div>
          <button 
            onClick={handleAdd} 
            className="mt-2 px-4 py-2 border border-white bg-black text-white rounded-md disabled:opacity-50"
            disabled={loading || !comment.trim()}
          >
            {loading ? "ADDING..." : "ADD"}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="text-gray-500 text-sm mt-2">
          Loading comments...
        </div>
      )}
      
      <div>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <Comment key={comment._id} comment={comment}/>
          ))
        ) : !loading && !error ? (
          <div className="text-gray-500 text-sm mt-4">
            No comments yet. Be the first to comment!
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CommentSection;
