
import { createSlice,PayloadAction } from "@reduxjs/toolkit"

interface modeState{
    mode:Boolean
}

let initialState:modeState={
    mode:false
}

export const modeSlice = createSlice({
    name:"mode",
    initialState,
    reducers:{
        LightMode:(state,action:PayloadAction<Boolean>) => {
            state.mode = action.payload
        },
        DarkMode:(state,action:PayloadAction<Boolean>) => {
            state.mode = action.payload
        }
    }
})

export const {LightMode,DarkMode} = modeSlice.actions
export default modeSlice.reducer
