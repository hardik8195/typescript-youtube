import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/model";

interface userState {
    user: User | null
    status:boolean
}

let initialState:userState = {
    user:null,
    status:false

}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        loginSuccess:(state,action:PayloadAction<User>)=>{
            state.user = action.payload
            state.status = true
        },
        Logout:(state) => {
            state.user = null
            state.status = false
        },
        subscription: (state, action) => {
            if (state.user?.data.subscribedUsers.includes(action.payload)) {
                state.user.data.subscribedUsers.splice(
                    state.user.data.subscribedUsers.findIndex(
                        (channelId) => channelId === action.payload
                    ),
                    1
                );
            } else {
                state.user?.data.subscribedUsers.push(action.payload)
            }
        },
        savedVideos : (state,action) => {
            if (state.user?.data.savedVideos.includes(action.payload)) {
                state.user.data.savedVideos.splice(
                    state.user.data.savedVideos.findIndex(
                        (VideoId) => VideoId === action.payload
                    ),
                    1
                );
            } else {
                state.user?.data.savedVideos.push(action.payload)
            }
        },
        deleteUser:(state) => {
            state.user = null
            state.status = false
        },

    }
})

export const { loginSuccess,Logout,subscription,deleteUser,savedVideos} = userSlice.actions;

export default userSlice.reducer;

