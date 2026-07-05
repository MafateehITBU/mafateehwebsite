import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env, smtpConfigured, contactNotifyRecipientCount } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { publicRouter } from "./routes/public.routes";
import { adminRouter } from "./routes/admin/index";
import { initCloudinary } from "./lib/cloudinary";

initCloudinary();

const app = express();
const e = env();

app.use(helmet());
app.use(express.json({ limit: "2mb" }));

const corsOrigin =
  e.CORS_ORIGIN === "*"
    ? "*"
    : e.CORS_ORIGIN.split(",").map((s) => s.trim());
app.use(cors({ origin: corsOrigin }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    smtp: smtpConfigured(),
    contactNotifyRecipients: contactNotifyRecipientCount(),
  });
});

app.use("/api/public", publicRouter);
app.use("/api/admin", adminRouter);

app.use(errorHandler);

export { app };
