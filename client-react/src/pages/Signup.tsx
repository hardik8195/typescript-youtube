import axios from "axios";
import { useState } from "react";
import { apiUrl } from "../URL/url";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const [fullName, setFullname] = useState<string>("");
    const [username, setusername] = useState<string>("");
    const [email, setemail] = useState<string>("");
    const [password, setpassword] = useState<string>("");
    const [avatar, setavatar] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setavatar(e.target.files[0]);
        }
    }

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData()
        formData.append('fullName', fullName);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        if (avatar) formData.append('avatar', avatar);

        try {
            const res = await axios.post(`${apiUrl}/users/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            navigate("/login")
            setLoading(false)
        } catch (error) {
            if(axios.isAxiosError(error) && error.response){
                if(error.response.status===409){
                    alert("user already exist with this username and email")
                    return;
                } 
                if(error.response.status===500){
                    alert("something went wrong")
                    return;
                }
            }
        } 

    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="fullname" className="sr-only">
                                Fullname
                            </label>
                            <input
                                id="fullname"
                                name="fullname"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Fullname"
                                value={fullName}
                                onChange={(e) => setFullname(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setusername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                            />
                        </div>
                            {!avatar && (
                                <p className="mt-2 text-gray-500 text-sm">Please select an avatar</p>
                            )}
                        <div className="flex flex-col items-center">
                            <label htmlFor="avatar" className="sr-only">
                                Avatar
                            </label>
                            <input
                                id="avatar"
                                name="avatar"
                                type="file"
                                autoComplete="avatar"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                onChange={handleAvatar}
                                />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? "Saving your information" : "SignUp"}
                        </button>
                    </div>
                    <div>
                        already have an account ? <Link to="/login">SignIn</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup