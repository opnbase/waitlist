import express, { Request, Response } from "express";
import { supabase } from "./supabase-client";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  })
);

app.post(
  "/join-waitlist",
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
