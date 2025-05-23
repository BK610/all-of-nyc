"use client";

import { MoveRight, Copy, Share, ThumbsUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import StyledCard from "@/components/customShadcn/styledCard";
import throwConfettiOnElement from "@/utils/confetti.utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface DomainCardProps {
  url: any;
}

export default function DomainCard({
  url,
}: DomainCardProps): React.ReactElement {
  const [upvotes, setUpvotes] = useState(url?.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  /**
   * Triggers on mount. Checks if the domain has been upvoted by the current session and sets the state accordingly.
   * @returns void
   */
  useEffect(() => {
    if (!url) return;

    // Check if this session has upvoted this domain
    const sessionId = localStorage.getItem("sessionId") || crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);

    const checkUpvote = async () => {
      try {
        const response = await fetch(
          `/api/upvote?domain=${url.domain_name}&sessionId=${sessionId}&check=true`
        );
        if (!response.ok) throw new Error("Failed to check upvote status");
        const data = await response.json();
        setHasUpvoted(data.hasUpvoted);
      } catch (error) {
        console.error("Error checking upvote status:", error);
      }
    };

    checkUpvote();
  }, [url?.domain_name]);

  if (!url) return null;

  /**
   * Handles the upvote event. Upvotes the domain and triggers a confetti animation.
   * @returns void
   */
  const handleUpvote = async () => {
    if (hasUpvoted || isUpvoting) return;

    setIsUpvoting(true);
    try {
      const sessionId = localStorage.getItem("sessionId");
      const response = await fetch("/api/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: url.domain_name,
          sessionId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upvote");
      }

      const data = await response.json();
      setUpvotes(data.upvotes);
      setHasUpvoted(true);

      // Get the button element and its position
      const button = document.getElementById(`upvote-${url.domain_name}`);
      throwConfettiOnElement({ element: button });
    } catch (error) {
      console.error("Error upvoting:", error);
    } finally {
      setIsUpvoting(false);
    }
  };

  const formattedRegistrationDate = new Date(
    url.domain_registration_date
  ).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const formattedUpdatedDate = new Date(url.last_updated_at).toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

  const status = url.is_url_found
    ? url.is_og_title_found
      ? "✅ Complete"
      : "❓ Live"
    : "💀 Down";

  /**
   * Handles the copy domain name event. Copies the domain name to the clipboard and launches a toast notification.
   * @returns void
   */
  const handleCopyDomain = async () => {
    try {
      await navigator.clipboard.writeText(url.domain_name);
      toast.success(
        <div className="flex flex-col w-full">
          <p className="text-sm">Copied domain name!</p>
        </div>
      );
    } catch (err) {
      console.error("Failed to copy domain name:", err);
    }
  };

  /**
   * Handles the copy URL event. Copies a sharable URL to the clipboard and launches a toast notification.
   * @returns void
   */
  const handleCopyUrl = async () => {
    const shareUrl = new URL(window.location.origin);
    shareUrl.searchParams.set("q", url.domain_name);
    // shareUrl.searchParams.set("filter", "is_complete");
    shareUrl.hash = `domain-${url.domain_name}`;

    try {
      const stringShareUrl = shareUrl.toString();

      await navigator.clipboard.writeText(stringShareUrl);
      toast.success(
        <div className="flex flex-col w-full">
          <p className="text-sm">Copied sharable link!</p>
        </div>
      );
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  /**
   * Handles the click event for the card. Sets the hash to the domain name when clicking on the card,
   * triggering the modal to open.
   * @param e - The click event
   * @returns void
   */
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on buttons or interactive elements
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("a")
    ) {
      return;
    }
    // Prevent default hash scrolling behavior
    e.preventDefault();

    // Store current scroll position
    const scrollPosition = window.scrollY;

    // Update hash without triggering scroll
    window.location.hash = `domain-${url.domain_name}`;

    // Restore scroll position
    window.scrollTo(0, scrollPosition);
  };

  return (
    <StyledCard
      id={`domain-${url.domain_name}`}
      className={`cursor-pointer ${
        !url.is_url_found && "pointer-events-none opacity-70"
      }`} // Set disabled-esque styling if found_url is false
      tabIndex={0}
      onClick={handleCardClick}
    >
      <CardHeader className="gap-2">
        <AspectRatio ratio={1200 / 627} className="pb-2 font-medium">
          <div className="h-full w-full flex items-center rounded-md bg-gradient-to-br from-nyc-light-gray to-nyc-medium-gray shadow-md">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    id={`upvote-${url.domain_name}`}
                    className={`absolute top-1 right-1 hover:cursor-pointer hover:border-nyc-blue hover:bg-gradient-to-br hover:from-amber-50 hover:to-amber-300 active:bg-gray-200 shadow-md ${
                      hasUpvoted && "bg-gray-200"
                    } ${isUpvoting && "opacity-50"}`}
                    onClick={handleUpvote}
                    disabled={hasUpvoted || isUpvoting}
                  >
                    <ThumbsUp size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{hasUpvoted ? "Upvoted!" : "Upvote this domain"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {url.is_og_image_found ? (
              <img
                className="h-full w-full object-cover rounded-md"
                src={decodeURI(url.image)}
                alt={`OpenGraph image for ${url.domain_name}`}
              />
            ) : (
              <p className="text-center w-full font-mono text-lg overflow-x-clip">
                {url.domain_name}
              </p>
            )}
          </div>
        </AspectRatio>
        <CardTitle className="w-full overflow-hidden">
          <div className="space-y-0.5 w-full overflow-hidden">
            <label
              htmlFor="domainName"
              className="text-gray-700 font-semibold text-sm"
            >
              Domain Name
            </label>
            <h2
              id="domainName"
              className="w-full font-mono text-xl text-nowrap truncate"
            >
              {url.domain_name}
            </h2>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="text-base text-gray-700 space-y-0.5">
            <h3 className="font-semibold text-sm">Title</h3>
            <p className="line-clamp-2">{url.title}</p>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="grow flex flex-col gap-2">
        <div className="h-full flex flex-col gap-2">
          <div className="text-base text-gray-700 space-y-0.5">
            <p className="font-semibold text-sm">Description</p>
            <p className="line-clamp-3">{url.description}</p>
          </div>
        </div>
        <div className="h-full flex flex-col gap-2">
          <div className="text-base text-gray-700 space-y-0.5">
            <p className="font-semibold text-sm">Upvotes</p>
            <p className="font-mono">{upvotes}</p>
          </div>
        </div>
        <div className="w-full flex gap-2">
          <Button
            className="flex-1 font-semibold hover:bg-accent text-white"
            asChild
          >
            <a
              href={url.is_url_found ? url.final_url : undefined}
              target={url.is_url_found ? "_blank" : undefined}
            >
              Visit <MoveRight />
            </a>
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="outline hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200"
                  onClick={handleCopyDomain}
                >
                  <Copy />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy domain name</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="outline hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200"
                  onClick={handleCopyUrl}
                >
                  <Share />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share this domain</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </StyledCard>
  );
}

export function SkeletonDomainCard(): React.ReactElement {
  return (
    <StyledCard
      className="disabled disabled:opacity-70 disabled:pointer-events-none"
      tabIndex={-1}
    >
      <CardHeader className="gap-2">
        <AspectRatio ratio={1200 / 627}>
          <Skeleton className="bg-nyc-medium-gray h-full w-full" />
        </AspectRatio>
        <CardTitle className="w-full overflow-hidden">
          <div className="space-y-0.5 w-full overflow-hidden">
            <label
              htmlFor="domainName"
              className="text-gray-700 font-semibold text-sm"
            >
              Domain Name
            </label>
            <h2
              id="domainName"
              className="w-full font-mono text-xl text-nowrapp truncate"
            >
              <Skeleton className="bg-nyc-medium-gray h-7 w-1/2" />
            </h2>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="text-base text-gray-700 space-y-0.5">
            <h3 className=" font-semibold text-sm">Title</h3>
            <Skeleton className="bg-nyc-medium-gray h-5 w-full" />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="grow flex flex-col gap-2">
        <div className="h-full flex flex-col gap-2">
          <div className="text-base text-gray-700 space-y-1">
            <p className="font-semibold text-sm">Description</p>
            <Skeleton className="bg-nyc-medium-gray h-5 w-full" />
            <Skeleton className="bg-nyc-medium-gray h-5 w-full" />
            <Skeleton className="bg-nyc-medium-gray h-5 w-full" />
            <Skeleton className="bg-nyc-medium-gray h-5 w-full" />
            <Skeleton className="bg-nyc-medium-gray h-5 w-full" />
          </div>
        </div>
        <CardAction className="w-full">
          <Button className="w-full font-semibold hover:bg-accent text-white">
            <Skeleton className="bg-gray-600 h-5 w-20" />
          </Button>
        </CardAction>
      </CardContent>
    </StyledCard>
  );
}
