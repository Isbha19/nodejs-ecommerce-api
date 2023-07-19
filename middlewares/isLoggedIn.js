import { getTokenFromHeader } from "../utils/getTokenfromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = (req, res, next) => {
  //get token from header
  const token = getTokenFromHeader(req);
  //verify
  const decodedUser = verifyToken(token);

  if (!decodedUser) {
    throw new Error("Invalid/expired token, please login again");
  } else {
    //save the user into the req obj
    req.userAuthId = decodedUser?.id;
    next();
  }
};
