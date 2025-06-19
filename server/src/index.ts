import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { supabase } from "./supabase-client";
import { sendDiscordWebhook } from "./utils/webhook";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.set('trust proxy', [
"173.245.48.0/20",
"103.21.244.0/22",
"103.22.200.0/22",
"103.31.4.0/22",
"141.101.64.0/18",
"108.162.192.0/18",
"190.93.240.0/20",
"188.114.96.0/20",
"197.234.240.0/22",
"198.41.128.0/17",
"162.158.0.0/15",
"104.16.0.0/13",
"104.24.0.0/14",
"172.64.0.0/13",
"131.0.72.0/22"]);

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log("Client IP:", req.ip);
  next();
});

const joinWaitlistLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: "Too many requests from this IP, please try again later.",
});

app.post(
  "/join-waitlist",
  joinWaitlistLimiter,
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
      }
      const { data, error } = await supabase
        .from("email_waitlist")
        .insert({ email: req.body.email });

      if (error) {
        let message = error.message;
        if (error.code === "23505") {
          message =
            "Already signed up, looks like you can't wait for the launch";
        }
        res.status(400).json({ message: message });
        return;
      }

      res.status(200).json("You are Subscribed");
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  }
);

app.post(
  "/track-user",
  joinWaitlistLimiter,
  async (req: Request, res: Response) => {
    try {
      const { fingerprint } = req.body;

      if(!fingerprint || fingerprint.fingerprint_hash){
        res.status(200).json("Fingerprint missing");
      }

      const { data, error } = await supabase.from("user_fingerprints").select("*").eq("fingerprint_hash", fingerprint.fingerprint_hash).single();
      
      if(error){
        if(data === null){
          const { data, error } = await supabase.from("user_fingerprints").insert(fingerprint).select().single();

          if(!error){
            const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;

            if(webhookUrl){
              await sendDiscordWebhook(webhookUrl, "Visitor", `IP : ${data.ip_address}\nTimeZone : ${data.timezone}`, "#3498DB")
            }
          }
        }
      }
      
      res.status(200);
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  }
);

app.post(
  "/viewed-presenting",
  joinWaitlistLimiter,
  async (req: Request, res: Response) => {
    try {
      const { hash } = req.body;

      if(!hash){
        res.status(200).json("Fingerprint missing");
      }

      await supabase.from("user_fingerprints").update({viewed_presenting: true}).eq("fingerprint_hash", hash);
      
      res.status(200);
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  }
);

app.get(
  "/view-count",
  joinWaitlistLimiter,
  async (req: Request, res: Response) => {
    try {
      const { count, error } = await supabase
        .from("user_fingerprints")
        .select("*", { count: "exact", head: true })
        .eq("viewed_presenting", true);
      res.status(200).json({ views: count });
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
