export const adminMiddleware = (req, res, next) => {
    const user = req.user;
    if(user && user.role === 'ADMIN'){
        next();
    }
    else{
        res.status(403).json({message:" Access denied. Admins only can access."});
    }
}

