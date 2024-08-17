import axios from "axios";
import { useState } from "react";
import { apiUrl } from "../URL/url";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";

interface Props {
  
    setIsChangingProfile: (isChanging: boolean) => void;
}
const Changeprofile:React.FC<Props> = ({setIsChangingProfile}) => {
    const [email, setemail] = useState<string>("");
    const [username, setusername] = useState<string>("");
    const [fullName, setFullname] = useState<string>("");
    const {user} = useAppSelector((state)=>state.user)
    const navigate = useNavigate()

    const handleChange =async (e:any)=>{
        e.preventDefault()
        try {
            const res = await axios.patch(`${apiUrl}/users/update-account`,{email:email,username:username,fullName:fullName},{
                headers : {
                    "Authorization": `Bearer ${user?.access_token}`
                  }
            })
            if (res.status === 200) {
                alert("Your details have been updated. Please log in again with new details to see changes.");
                navigate("/login")
            }

        } catch (error) {
            console.log(error)
        }

        
    }

    return (
        <div className="flex flex-col items-center p-6 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Enter new Email :
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="text"
                        required
                        onChange={(e)=>setemail(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Enter new Username :
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        required
                        onChange={(e)=>setusername(e.target.value)}


                    ></input>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullname">
                        Enter new Fullname :
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                        onChange={(e)=>setFullname(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleChange}
                >
                    CONFIRM CHANGES
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={()=>setIsChangingProfile(false)}
                >
                   BACK
                </button>
                </div>
               
            </div>
        </div>
    )
}

export default Changeprofile
