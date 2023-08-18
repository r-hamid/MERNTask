import { createHmac } from "crypto";

function hashPassword(password) {
  if (!(typeof password === "string" && password.length > 0)) return false;

  //:- Second param is hashing secret
  const hashPassword = createHmac("sha256", "MERNTask")
    .update(password)
    .digest("hex");
  return hashPassword;
}

export default hashPassword;
