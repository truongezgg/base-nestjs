export default {
  authentication: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    rounds: Number(process.env.PASSWORD_ROUNDS),
  },
};
