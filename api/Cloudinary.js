require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dzysrtemd',
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure: true
});
const upload = cloudinary.url('paek0nrmxhr38ub0fran',{
    transformation:[
        {
        quality: 'auto'
        },
        {
            fetch_format: 'auto'
        },
        {
            width: 1200,
        }
    ]
})
