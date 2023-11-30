const express = require("express")
const {handleGenerateNewShortUrl, handleGetAllUrls, handleRouteUrl, handleGetAnalytics} = require('../controllers/url')

const router = express.Router();

router.route("/")
.get(handleGetAllUrls)
.post(handleGenerateNewShortUrl)

router.get("/test", (req,res)=> {
    return res.render("home")
}
)

router.get("/:shortid", handleRouteUrl)

router.get("/analytics/:shortId", handleGetAnalytics)

module.exports = router;