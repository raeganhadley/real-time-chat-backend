import { betterAuth } from "better-auth";
import { Pool, PoolConfig } from "pg";
import { testUtils } from "better-auth/plugins";
import { configDotenv } from "dotenv";
import { sendEmail } from "./email.js";

configDotenv();

const config: PoolConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB_NAME,
  password: process.env.PG_PASS,
  port: parseInt(process.env.PG_PORT || "5432"),

  max: 20, // Maximum number of clients allowed in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error if a connection takes over 2 seconds
};

const testConfig: PoolConfig = {
  connectionString: process.env.PG_TEST_CONN,
};
//authentication

export const auth = betterAuth({
  database: new Pool(process.env.NODE_ENV == "test" ? testConfig : config),
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token}, request) => {
      //integrate with resend
      try{
        await sendEmail({
				to: user.email,
				subject: 'Verify Your Email',
        text: "click to verify your email",
				html: `
          <h1>Verify Your Email</h1>
          <p>Click the link below to verify:</p>
          <a href="${url}">Verify Email</a>`,
      });
      }catch(error){
        console.error("Failed to send verification email", error);
      }
    },
    sendOnSignUp: true,
  },
  plugins: [...(process.env.NODE_ENV === "test" ? [testUtils()] : [])],
});