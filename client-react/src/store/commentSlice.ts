import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { UserComment } from "../models/model";

interface CommentState {
    comments: UserComment[];
}
const initialState:CommentState = {
    comments:[]
}



const commentSlice = createSlice({
    name:"comment",
    initialState,
    reducers:{
        addComment:(state,action:PayloadAction<UserComment>) => {
            const comment:UserComment = {
                _id:action.payload._id,
                userId:action.payload.userId,
                videoId:action.payload.videoId,
                desc:action.payload.desc
            }
            state.comments.unshift(comment)
        },
        deleteComment:(state,action:PayloadAction<string>) => {
            state.comments = state.comments.filter((item)=>item._id !== action.payload)
        },
        setComments:(state,action:PayloadAction<UserComment[]>) => {
            state.comments = action.payload
        }
        
    }
})

export const { addComment,deleteComment,setComments } = commentSlice.actions;

export default commentSlice.reducer;