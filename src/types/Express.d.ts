declare namespace Express {
  /**
   * Middleware verify the access token & assign more information to the Request params.
   */
  interface Request {
    payload: {
      id: number;
      type: number;
    };
    user?: Express.User;
  }
}
