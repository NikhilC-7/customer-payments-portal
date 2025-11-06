import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI is not set in .env");
  process.exit(1);
}

const run = async () => {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const users = db.collection("users");

  // Drop the existing username index if it exists
  const idx = await users.indexes();
  const hasUsername = idx.find(i => i.name === "username_1");
  if (hasUsername) {
    console.log("Dropping old index username_1 …");
    await users.dropIndex("username_1");
  } else {
    console.log("No old username_1 index found — continuing …");
  }

  // Recreate via partial filter (matches model)
  console.log("Creating partial unique index on username …");
  await users.createIndex(
    { username: 1 },
    { unique: true, partialFilterExpression: { username: { $exists: true } } }
  );

  console.log("✔ Index fixed");
  await mongoose.disconnect();
};
run().catch(e => { console.error(e); process.exit(1); });
