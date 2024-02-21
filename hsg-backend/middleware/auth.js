import jwt from 'jsonwebtoken';

export default function auth(allowed_roles) {
    return function (req, res, next) {
        const authHeader = req.headers['Authorization'] || req.headers['authorization'];
        console.log("🚀 ~ file: auth.js:46 ~ authHeader:", authHeader);

        const token = authHeader && authHeader.split(' ')[1];
        console.log("🚀 ~ file: auth.js:48 ~ token:", token)

        if (token == null) {
            console.log('Token is missing');

            return res.status(401).json({
                status: 401,
                message: "Access token missing"
            });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log('Token verification failed', err);

                return res.status(403).json({
                    status: 403,
                    message: "Access forbidden, token invalid"
                });
            }

            console.log("Token verified successfully. User:", user);

            req.user = user;


            if (!allowed_roles.includes(user.role)) {
                console.log('User role is not allowed. User Role:', user.role, 'Allowed roles:', allowed_roles);

                return res.status(403).json({
                    status: 403,
                    message: "Access forbidden, user role invalid"
                });
            }
            console.log("User role is allowed. Proceeding to next middleware.");

            next();
        });
    }
}