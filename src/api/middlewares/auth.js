import jwt from 'jsonwebtoken';


const authMiddleware = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isUserAuth = false;
        return res.status(401).json({ success: false, message: 'Access denied. \'authorization\' header required.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
        req.isUserAuth = false;
        return res.status(401).json({ success: false, message: 'access denied. invalid token supplied.' });
    }
    let decodedToken;
    try {
        decodedToken = await jwt.verify(token, process.env.JWT_USER_SK);
    } catch (error) {
        req.isUserAuth = false;
        return res.status(401).json({ success: false, message: 'token expired or invalid token supplied.' });
    }
    if (!decodedToken) {
        req.isUserAuth = false;
        return res.status(401).json({ success: false, message: 'access denied. invalid token supplied.' });
    }
    req.isUserAuth = true;
    req.userId = decodedToken.id;
    next();
};

export default authMiddleware;