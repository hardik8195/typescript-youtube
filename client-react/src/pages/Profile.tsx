import { useState } from "react";
import Changeprofile from "../components/Changeprofile";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import axios from "axios";
import { apiUrl } from "../URL/url";
import { deleteUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user } = useAppSelector((state) => state.user);
    const [isChangingProfile, setIsChangingProfile] = useState<boolean>(false);
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const handleDetails = () => {
        setIsChangingProfile(true)
    }

    const handleDelete = () => {
        try {
            axios.delete(`${apiUrl}/users/delete-user`,{
                headers : {
                    "Authorization": `Bearer ${user?.access_token}`
                  }
            })
            dispatch(deleteUser())
            navigate("/")
            

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
        {
            isChangingProfile ? 
            <Changeprofile setIsChangingProfile={setIsChangingProfile}/> :
        <div className="flex flex-col items-center justify-center p-6 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl flex flex-col items-center">
                <img
                    src={user?.data.avatar}
                    alt="User Avatar"
                    className="w-40 h-40 border rounded-full mb-4 bg-black"
                />
                <div className="text-center mb-4">
                    <h1 className="text-xl font-semibold">Username: {user?.data.username}</h1>
                    <h1 className="text-xl font-semibold">Full Name: {user?.data.fullName}</h1>
                    <h1 className="text-xl font-semibold">Email: {user?.data.email}</h1>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleDetails}

                     className="text-white p-2 bg-black rounded-xl">Change Account Details</button>
                    <button  onClick={handleDelete}
                    className="text-white p-2 bg-black rounded-xl">Delete Account
                        </button> 
                </div>
            </div>
        </div>
        }
        </>
    );
};

export default Profile;
