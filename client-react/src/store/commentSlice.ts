import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { UserComment } from "../models/model";

interface CommentState {
    comments: UserComment[];
}

const initialState:CommentState = {
    comments: []
}

const commentSlice = createSlice({
    name:"comment",
    initialState,
    reducers:{
        addComment:(state,action:PayloadAction<UserComment>) => {
            // Ensure comments array exists
            if (!state.comments) {
                state.comments = [];
            }
            
            const comment:UserComment = {
                _id:action.payload._id,
                userId:action.payload.userId,
                videoId:action.payload.videoId,
                desc:action.payload.desc
            }
            state.comments.unshift(comment)
        },
        deleteComment:(state,action:PayloadAction<string>) => {
            // Ensure comments array exists
            if (!state.comments) {
                state.comments = [];
                return;
            }
            
            state.comments = state.comments.filter((item)=>item._id !== action.payload)
        },
        setComments:(state,action:PayloadAction<UserComment[]>) => {
            // Ensure we always set a valid array
            state.comments = action.payload || []
        },
        clearComments:(state) => {
            state.comments = []
        }
        
    }
})

export const { addComment, deleteComment, setComments, clearComments } = commentSlice.actions;

export default commentSlice.reducer;