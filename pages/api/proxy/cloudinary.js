/*
import { createProxyMiddleware } from 'http-proxy-middleware';
const cloudinary = require('cloudinary').v2;

// CLOUDINARY_NAME
// CLOUDINARY_ENV_VAR
// CLOUDINARY_API_KEY
// process.env.CLOUDINARY_API_SECRET
// Create proxy instance outside of request handler function to avoid unnecessary re-creation
const apiProxy = createProxyMiddleware({
    target: 'http://cloudinary',
    changeOrigin: true,
    pathRewrite: { [`^/api/proxy/cloudinary`]: '' },
    secure: false,
});

export default function (req, res) {
    apiProxy(req, res, (result) => {
        if (result instanceof Error) {
            throw result;
        }

        throw new Error(`Request '${req.url}' is not proxied! We should never reach here!`);
    });
}
*/

/*
// Get the timestamp in seconds
var timestamp = Math.round((new Date).getTime()/1000);

// Show the timestamp
console.log('Timestamp:',timestamp);

// Get the signature using the Node.js SDK method api_sign_request
var signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
    eager: 'w_400,h_300,c_pad|w_260,h_200,c_crop',
    public_id: 'sample_image'}, process.env.API_SECRET);

// Show the signature
console.log('Signature:', signature);

// ====================================================================================================

// Having got the timestamp and signature of the parameters to sign, we can now build the curl command.  

// URL of the file to upload
var file='https://upload.wikimedia.org/wikipedia/commons/b/b1/VAN_CAT.png';

// Build the curl command
var curl_command = 'curl -d "file=' + file + 
   '&api_key=323127161127519&eager=w_400,h_300,c_pad|w_260,h_200,c_crop&public_id=sample_image' + 
   '&timestamp=' + timestamp +
   '&signature=' + signature +
   '" -X POST http://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload';

// Show the curl command
console.log('curl command:', curl_command);

*/

// https://github.com/vercel/next.js/discussions/14057
// https://api.cloudinary.com/v1_1/<cloud name>/<resource_type>/upload
// https://cloudinary.com/documentation/upload_images#generating_authentication_signatures

/*

Required parameters for authenticated requests:
file - The file to upload. Can be the actual data (byte array buffer), the Data URI (Base64 encoded), a remote FTP, HTTP or HTTPS URL of an existing file, or a private storage bucket (S3 or Google Storage) URL of a whitelisted bucket.
api_key - The unique API Key of your Cloudinary account.
timestamp - Unix time in seconds of the current time (e.g., 1315060076).
signature - A signature of all request parameters including the 'timestamp' parameter but excluding the 'api_key', 'resource_type', 'cloud_name' and 'file' parameters, based on the API Secret of your Cloudinary account. The signature is valid for 1 hour. See Generating authentication signatures for more details.
*/