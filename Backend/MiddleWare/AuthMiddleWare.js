const jwt=require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET||'zomato-secret-key';

const generateToken=(user)=>{
    return jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '1h'});
}
const authenticateToken=(req,res,next)=>{
    const authHeader = req.headers['authorization']
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: 'Unauthorized'})
    }
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({message: 'Unauthorized'})
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
}



module.exports = { generateToken, authenticateToken }; 