
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addComment = asyncHandler(async(req,res)=>{
    const {desc,videoId} = req.body

    if(!desc) throw new ApiError(401,'comment is required');

    const comment = await Comment.create({
        userId:req.user._id,
        videoId:videoId,
        desc
    })

    return res
    .status(201)
    .json(comment)
})

const deleteComment = asyncHandler(async(req,res)=>{
    const comment = await Comment.findById(req.params.id);
    try {
        if (req.user._id == comment.userId) {
          await Comment.findByIdAndDelete(req.params.id);
          return res
          .status(200)
          .json("Successfully deleted comment")
        } else {
          return new ApiError(401,"You are not the owner")
        }
    } catch (error) {
        console.log(error)
    }

})

const getComment = asyncHandler(async(req,res)=>{
    const comments = await Comment.find({ videoId: req.params.videoId });
    return res
    .status(201)
    .json(comments)
})

export {
    addComment,
    deleteComment,
    getComment
}