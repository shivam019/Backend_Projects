//Blog Route

const {Router} = require("express")
const router = Router();
const multer = require('multer');
const path = require('path')
const Blog = require('../models/Blog')


//Configuration for Multer to store the Blog Image in the /public/uploads/:id path
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads/'))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}` 
      cb(null, fileName);

    }
  })
  const upload = multer({ storage: storage })


//Route to load Blog page
router.get("/add-new", (req,res)=> {
    return res.render("addBlog", {
        user: res.user,
    })
})

//Route to handle Add Blog Request
router.post("/", upload.single("coverImage"),  async(req,res)=> {
    const {title, body} = req.body;

    if (!req.file) {
        return res.status(400).send("Please upload an image.");
    }

    console.log(body,title);

    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });
 
    return res.redirect(`/blog/${blog._id}`);

    
})
module.exports = router;