import { comingSoonPageContent } from "@/lib/page-content";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { useState } from "react";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", { email, subscribed });
    alert("Thank you for signing up!");
  };
  return (
    <>
      <p className="text-base sm:text-lg text-neutral-300 mb-8 sm:mb-10 max-w-md">
        {comingSoonPageContent.description}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-300 mb-1"
          >
            {comingSoonPageContent.emailLabel}
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full sm:w-1/2 bg-white/5 border-white/20 placeholder-neutral-500 text-white focus:border-white focus:ring-1 focus:ring-white/80 rounded-lg py-3 px-4"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="subscribe"
            checked={subscribed}
            onCheckedChange={(v) => setSubscribed(v === true)}
            className="h-4 w-4 rounded border-neutral-400 data-[state=checked]:bg-white data-[state=checked]:text-black"
          />
          <Label
            htmlFor="subscribe"
            className="text-sm text-neutral-300 cursor-pointer"
          >
            {comingSoonPageContent.subscribeLabel}
          </Label>
        </div>
        <Button
          type="submit"
          className="w-full sm:w-auto bg-white text-black hover:bg-neutral-200 focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2 focus:ring-offset-transparent px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          {comingSoonPageContent.buttonText}
        </Button>{" "}
      </form>
    </>
  );
};

export default NewsletterForm;
