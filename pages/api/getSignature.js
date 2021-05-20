// CLOUDINARY_NAME
// CLOUDINARY_ENV_VAR
// CLOUDINARY_API_KEY
// process.env.CLOUDINARY_API_SECRET
const cloudinary = require('cloudinary').v2;

export default function handler(req, res) {
    if (req.method === 'POST') {
        console.log(req.body);

        var timestamp = Math.round((new Date).getTime()/1000);
        var signature = cloudinary.utils.api_sign_request({
            timestamp: timestamp,
        }, process.env.CLOUDINARY_API_SECRET);
        
        console.log('Timestamp: ',timestamp);
        console.log('Signature: ', signature);

        res.send({
            signature: signature,
            timestamp: timestamp,
        });
    }
    else {
        // Handle any other HTTP method
        res.status(200).send('Nothing to see here.')
    }
}