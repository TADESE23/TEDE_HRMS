module.exports = {
    secret: process.env.JWT_SECRET || "super-secret-key-change-it",
    jwtExpiration: 86400,           // 24 hour
    jwtRefreshExpiration: 2592000,  // 30 days
};
