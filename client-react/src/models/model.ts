export interface User {
    access_token: string
    data: {
        _id: string;
        username: string;
        email: string;
        fullName: string;
        avatar: string;
        refreshToken: string;
        subscribers: number;
        subscribedUsers: string[];
        savedVideos: string[];
    }
}
export interface Video {
    _id: string;
    userId: string;
    thumbnail: string;
    videoFile: string;
    title: string;
    desc: string;
    duration: string;
    tags: string[];
    views: number;
    likes: string[];
    dislikes: string[];
    createdAt: Date
}

export interface UserComment {
    _id:string;
    userId:string;
    videoId:string;
    desc:string
}