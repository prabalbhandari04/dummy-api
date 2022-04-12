const router = require("express").Router();
const Post = require("../models/postModels");
const User = require("../models/userModels");

// Create post
router.post("/", async (req, res) => {
    const newPost = await new Post(req.body);

    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }
    catch(err){
        res.status(500).json(err);
    }
})

// Update post
router.put("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({$set: req.body});
            res.status(200).json("Post updated");
        }
        else{
            res.status(401).send("You are not authorized to update this post");
        }
    }
    catch(err){
        res.status(500).json(err);
    }
});

// Delete post
router.delete("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.deleteOne();
            res.status(200).json("Post deleted");
        }
        else{
            res.status(401).send("You are not authorized to delete this post");
        }
    }
    catch(err){
        res.status(500).json(err);
    }
});

// Like/dislike post
router.put("/:id/like", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
           await post.updateOne({$push: {likes: req.body.userId}});
           res.status(200).json("Post liked");
           return true;
        }   
        else{
            await post.updateOne({$pull: {likes: req.body.userId}});
            res.status(200).json("Post disliked");
            return false;
        }
    }
    catch(err){
        res.status(500).json(err);
    }
})

// Get Post
router.get("/id/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }
    catch(err){
        res.status(500).json(err);
    }
})

// Get timeline posts
router.get("/timeline/:userId", async (req, res) => {
    try{
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId: currentUser._id});
        res.status(200).json(userPosts)
    }
    catch(err){
        console.log(err);
    }
});

// Get all posts
router.get("/all", async (req, res) => {
    try{
        const posts = await Post.find();
        res.status(200).json(posts);
    }
    catch(err){
        console.log(err)
        res.status(500).json(err);
    }
})

// Get only posts of users you are following
router.get("/posts/followings", async (req, res) => {
    let postArray = [];
    try{
        const currentUser = await User.findById(req.body.userId);
        if(currentUser.followings.length > 0){
            for(let i = 0; i < currentUser.followings.length; i++){
                const posts = await Post.find({userId: currentUser.followings[i]});
                postArray = postArray.concat(posts);
            }
        }
        res.status(200).json(postArray);
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;