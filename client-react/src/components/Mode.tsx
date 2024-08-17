import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { DarkMode, LightMode } from '../store/modeSlice';
const Mode = () => {
    const {mode} = useAppSelector(state=>state.mode)
    const dispatch = useAppDispatch()

    const handleMode = () => {
        if(mode===false) dispatch(LightMode(true))

        else dispatch(DarkMode(false))    
    }
    return (
        <div onClick={handleMode}>
            {
                mode?<button className='text-black'><DarkModeIcon/></button> : <button className='text-white'><LightModeIcon/></button> 
            }
        </div>

    )


}
export default Mode;