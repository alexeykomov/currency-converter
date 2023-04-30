import admin from '../services/firebase-service.js'

const getAuthToken = (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        // @ts-ignore
        req.authToken = req.headers.authorization.split(' ')[1];
    } else {
        // @ts-ignore
        req.authToken = null;
    }
    next();
};

export const checkIfAuthenticated = (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            // @ts-ignore
            const {authToken} = req;
            const userInfo = await admin
                .auth()
                .verifyIdToken(authToken);
            // @ts-ignore
            req.authId = userInfo.uid;
            return next();
        } catch (e) {
            return res
                .status(401)
                .send({error: 'You are not authorized to make this request'});
        }
    });
};
