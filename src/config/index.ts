export default {
  server: {
    port: Number(process.env.PORT) || 3000,
  },
  auth: {
    secretKey: process.env.AUTH_SECRET_KEY,
    accessTokenExpiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    rounds: Number(process.env.PASSWORD_SALT_ROUNDS),
  },
};
