import axios from "axios"
import { apiUrl } from "../URL/url"
import { User, UserComment } from "../models/model"
import { useEffect, useState } from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { deleteComment } from "../store/commentSlice";

interface Props {
    comment:UserComment
}
const Comment:React.FC<Props> = ({comment}) => {
    const {user}  = useAppSelector(state=>state.user)
    const [userComment,setuserComment] = useState<User["data"]>()
    const {mode} = useAppSelector(state=>state.mode)
    const dispatch = useAppDispatch()
    useEffect(()=>{
        (async()=>{
          try {
            const res = await axios.get(`${apiUrl}/users/find/${comment.userId}`,{
              headers: {
                "Authorization": `Bearer ${user?.access_token}`
              }
            }
    
            )
            setuserComment(res.data)
          } catch (error) {
            console.log(error)
          }
        })()
      },[comment.userId,user?.access_token])

      const handleDelete =async (e:React.FormEvent) => {
        e.preventDefault();
    
        try {
          await axios.delete(`${apiUrl}/comments/${comment._id}`,{
            headers: {
              "Authorization": `Bearer ${user?.access_token}`
            }
          })
          dispatch(deleteComment(comment._id))
        } catch (error) {
          console.log(error)
        }
      }
  return (
    <div  className={`${mode?'text-black':'text-white'} flex justify-between my-3`}>
      <div className='flex gap-2 '>
        <img src={userComment?.avatar} className="w-9 h-9 border rounded-full bg-black" alt="" />
        <div>
          <h1 style={{ fontSize: 'large' }}>{userComment?.fullName}</h1>
          <p style={{ fontSize: 'medium' }}>{comment.desc}</p>
        </div>
      </div>
      {
        user?.data._id===comment.userId && (
            <button onClick={handleDelete} className='cursor-pointer'>
            <DeleteIcon/>
          </button>
        )
      }

    </div>
  )
}

export default Comment
