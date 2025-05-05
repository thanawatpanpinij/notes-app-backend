import app from "./src/app.js";
import { connectMongoDB, pingTurso } from "./src/config/database.js";

pingTurso();
connectMongoDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
