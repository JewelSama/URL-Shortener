const express = require('express')
const validUrl = require('valid-url')
const shortid = require('shortid')
const config = require('config')

const router = express.Router();

const Url = require('../models/Url');

//@route POST/api/url/shorten
//@desc  Create short URL

router.post('/shorten', async(req, res) => {
    const {longUrl} = req.body;
    const baseUrl = config.get('baseURI');


    //Check base Url
    if(!validUrl.isUri(baseUrl)){
        return res.status(401).json('Invalid base Url')
    }

    
    //Create url code
    const urlCode = shortid.generate();

    //Check long url
    if(validUrl.isUri(longUrl)){
        try{
            let url = await Url.findOne({longUrl});
            if(url){
                res.json(url);
            } else {
                const shortUrl = baseUrl + '/' + urlCode;

                url = new Url({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date: new Date()
                });

                await url.save();

                res.json(url);
            }
        } catch(err) {
            console.log(err);
            res.status(500).json('Server error')
        }
    } else {
        res.status(401).json('Invalid long Url')
    }

});

module.exports = router;