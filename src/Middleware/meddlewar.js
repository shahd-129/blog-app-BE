import jwt from "jsonwebtoken";

export const auth = () => {
  return async (req, res, next) => {
    const { token } = req.headers;
    if (!token) return res.json({ message: "please signin" });

    jwt.verify(token, "secret_token", async (error, decoded) => {
      if (error)
        return res.status(498).json({ message: "Invalid Token", error });

      req.user = decoded;
      next();
    });
  };
};
