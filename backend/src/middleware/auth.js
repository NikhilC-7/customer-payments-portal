import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function requireAuth(role) {
  return (req, res, next) => {
    try {
      const hdr = req.headers.authorization || "";
      const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
      if (!token) return res.status(401).json({ message: "Missing token" });
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (role && payload.role !== role) return res.status(403).json({ message: "Forbidden" });
      req.user = payload;
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  };
}

export function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, name: user.fullName || user.username },
    process.env.JWT_SECRET,
    { expiresIn: "8h", algorithm: "HS256" }
  );
}
