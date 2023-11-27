const shortid = require("shortid") 
const URL = require("../models/url")

async function handleGenerateNewShortUrl(req,res) {
    const body = req.body;
    if(!body.url) return res.status(400).json({err: "Url is required"})

  const shortId = shortid(8);
  await URL.create({
    shortId: shortId,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.json({id: shortId})
}

async function handleGetAllUrls(req,res) {
  const AllUrls = await URL.find({});
  return res.send(AllUrls);
  
}


async function handleRouteUrl(req, res) {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
      shortId
    }, 
    {
      $push : {
          visitHistory: {
            timestamp: Date.now(),
          },
      }
    });
    res.redirect(entry.redirectURL)
  

}

async function handleGetAnalytics(req,res) {
   const shortId = req.params.shortId;
   const result = await URL.findOne({shortId});
   return res.json({totalClicks: result.visitHistory.length, analytics: result.visitHistory });
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGetAllUrls,
    handleRouteUrl,
    handleGetAnalytics
}