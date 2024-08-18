import { useState } from "react";
import { useAppSelector } from "../store/hooks";
import axios from "axios";
import { apiUrl } from "../URL/url";
import { useNavigate } from "react-router-dom";

const UploadVideo = () => {
    const [title, setTitle] = useState<string>('');
    const [desc, setDesc] = useState<string>('')
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const {user} = useAppSelector((state)=>state.user)
    const [loading,setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setThumbnail(e.target.files[0]);
        }
    };

    const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setVideoFile(e.target.files[0]);
        }
    };
    const handleUpload = async () => {
        if (!title && !desc) {
            alert("all fields are required")
            return;
        }
        setLoading(true)
        const formData = new FormData()
        formData.append('title', title);
        formData.append('desc',desc );
        if (thumbnail) formData.append('thumbnail', thumbnail);
        if (videoFile) formData.append('videoFile', videoFile);

        try {
            const res = await axios.post(`${apiUrl}/videos`,formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${user?.access_token}`
                    
                },
            })
            setLoading(false)
            navigate("/")
        } catch (error) {
            console.log(error)
            alert("Upload Failed!! Try Again")
        }
    }

    return (
        <div className="flex flex-col items-center p-6 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-semibold mb-4">Upload Video</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoTitle">
                        Video Title
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="videoTitle"
                        type="text"
                        placeholder="Enter video title"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoDescription">
                        Video Description
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="videoDescription"
                        placeholder="Enter video description"
                        onChange={(e) => setDesc(e.target.value)}
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoFile">
                        Upload Video
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="videoFile"
                        type="file"
                        onChange={handleVideoFileChange}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoFile">
                        Attach thumbnail
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="videoFile"
                        type="file"
                        onChange={handleThumbnailChange}
                    />
                </div>


                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleUpload}
                >
               {loading?"Uploading... wait for a moment":"Upload"}
                </button>
            </div>
        </div>
    );
}

export default UploadVideo;
