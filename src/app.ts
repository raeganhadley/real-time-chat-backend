// Import required libraries and constants
import express, { Request, Response, Application } from "express";
import { IDP_ROUTE_ROOT } from "./constants.js";
import idpRouter from "./routes/idp.js";
import { configDotenv } from "dotenv";
import cors from "cors";
import connectDb from "./db_conn.js";
import { auth } from "./auth.js";
import { toNodeHandler } from "better-auth/node";



// Configure .env file if present into the process of the execution
configDotenv();

// Create the express server application
const app: Application = express();

// Initialize database connection
if (process.env.NODE_ENV != "test") {
  connectDb();
}

app.all("/api/auth/{*any}", toNodeHandler(auth));

// Configure the express server to allow for cors and set dedicated origin
app.use(
  cors({
    credentials: true,
    origin:
      process.env.STAGE === "prod"
        ? process.env.PROD_HOST
        : "http://localhost:3000",
  }),
);

// Configure express app to include json parser
app.use(express.json());

// Add server routes from ./routes directory
app.use(IDP_ROUTE_ROOT, idpRouter);

// Un-Authorized Route: General server ping for checking health of server
app.get("/", (req: Request, res: Response) => {
  res.json("Hello from Node.js, Express, and TypeScript!");
});



// Export server app so that this app can be used in tests
export default app;
