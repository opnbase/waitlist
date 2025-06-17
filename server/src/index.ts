import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { supabase } from "./supabase-client";
import cors from "cors";
import dotenv from "dotenv"

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true
}));


const joinWaitlistLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
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
      
      if(error){
            let message = error.message;
            if(error.code === '23505'){
              message = "Already signed up, looks like you can't wait for the launch"
            }
            res.status(400).json( { message: message } );
            return;
        }
        
        res.status(200).json("You are Subscribed");
    } catch (error) {
        res.status(500).json("Internal server error");   
    }
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
