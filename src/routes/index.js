import express from "express";
import tursoRouter from "./api/v1/turso/turso.js";
import mongoRouter from "./api/v1/mongo/mongo.js";

const router = express.Router();

export default (database) => {
  router.use("/turso", tursoRouter(database));
  router.use("/mongo", mongoRouter);
  return router;
};
