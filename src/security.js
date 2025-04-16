require('dotenv').config();
const CryptoJS = require('crypto-js');

const ALGORITHM = 'HS256';
const jwtSecret = process.env.SECRET_KEY || 'your_jwt_secret';

function base64url(source) {
    let encodedSource = CryptoJS.enc.Base64.stringify(source);
    encodedSource = encodedSource.replace(/=+$/, ''); // Remove padding
    encodedSource = encodedSource.replace(/\+/g, '-'); // Replace `+` with `-`
    encodedSource = encodedSource.replace(/\//g, '_'); // Replace `/` with `_`
    return encodedSource;
}

function createToken(userInfo) {
    const header = {
        alg: ALGORITHM,
        typ: 'JWT'
    };

    const iat = Math.floor(Date.now() / 1000); // Issued at time in seconds
    const exp = iat + 7 * 24 * 60 * 60;       // Expire time in 7 days

    const payload = {
        id: userInfo.user_id,            // Ensure user_id is directly in the payload
        username: userInfo.username,          // Include username
        isAdmin: userInfo.isAdmin,            // Include isAdmin status
        iss: 'Fuse',                          // Issuer
        iat,                                  // Issued at
        exp                                   // Expiration
    };

    // Encode header and payload
    const encodedHeader = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(header)));
    const encodedPayload = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)));

    // Sign header and payload
    const dataToSign = `${encodedHeader}.${encodedPayload}`;
    const signature = base64url(CryptoJS.HmacSHA256(dataToSign, jwtSecret));

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

exports.createToken = createToken;