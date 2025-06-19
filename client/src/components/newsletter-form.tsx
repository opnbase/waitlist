import { comingSoonPageContent, navigationLinks } from "@/lib/page-content";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { useState } from "react";
import { api } from "@/lib/api-client";
import { AxiosError } from "axios";
import { useNotification } from "@/context/notification";
import { Link } from "react-router-dom";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const notification = useNotification();

  const socialLinks = navigationLinks.filter(
    (link) => link.name === "Github" || link.name === "Discord"
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await api.joinWaitlist(email);

      if (response.status == 200) {
        setEmail("");
        setSubscribed(false);
        notification.love("Thank you for signing up!");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.status === 429) {
          notification.error("Too many requests, please try after some time");
        } else {
          notification.info(error.response?.data.message);
        }
      }
    }
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
            required
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

      <div className="mt-8 flex items-center space-x-4 md:hidden lg:hidden">
        <p className="text-sm text-neutral-400">Join our community:</p>
        <div className="flex flex-1 items-center space-x-4">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 border border-neutral-700 text-neutral-300 hover:bg-white/20 hover:border-neutral-600 hover:text-white transition-all duration-200 ease-in-out"
              >
                {Icon && <Icon size={22} />} 
                
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default NewsletterForm;
