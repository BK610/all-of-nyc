import Image from "next/image";
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
  if (!url) return null;

  const [upvotes, setUpvotes] = useState(url.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  useEffect(() => {
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
        toast.error("Failed to check upvote status");
      }
    };

    checkUpvote();
  }, [url.domain_name]);

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

  const handleCopyDomain = async () => {
    try {
      await navigator.clipboard.writeText(url.domain_name);
      toast.success(
        <div className="flex flex-col w-full">
          <p className="text-sm">Copied domain name!</p>
          <p className="line-clamp-1 text-gray-700">{url.domain_name}</p>
        </div>
      );
    } catch (err) {
      console.error("Failed to copy domain name:", err);
    }
  };

  const handleCopyUrl = async () => {
    const shareUrl = new URL(window.location.origin);
    shareUrl.searchParams.set("q", url.domain_name);
    shareUrl.hash = `domain-${url.domain_name}`;

    try {
      const stringShareUrl = shareUrl.toString();

      await navigator.clipboard.writeText(stringShareUrl);
      toast.success(
        <div className="flex flex-col w-full">
          <p className="text-sm">Copied sharable link!</p>
          <p className="w-full line-clamp-1 text-gray-700">{stringShareUrl}</p>
        </div>
      );
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <Card
      id={`domain-${url.domain_name}`}
      className={`gap-2 w-full overflow-hidden text-primary rounded-lg shadow-lg hover:shadow-xl transition-all duration-75
        outline outline-nyc-medium-gray hover:outline-nyc-blue focus:outline-nyc-orange focus:outline-4 focus-within:outline-4 focus-within:outline-nyc-orange hover:focus-within:outline-nyc-orange
        bg-gradient-to-br from-gray-50 to-gray-50
        hover:not-focus:to-amber-50
        focus:from-white focus:to-amber-100
        focus-within:from-white focus-within:to-amber-100
        hover:focus-within:from-white hover:focus-within:to-amber-100
      ${!url.is_url_found && "pointer-events-none opacity-70"}`} // Set disabled-esque styling if found_url is false
      tabIndex={0}
    >
      <CardHeader className="gap-2">
        <AspectRatio ratio={1200 / 627} className="pb-2 font-medium">
          <div className="h-full w-full flex items-center rounded-md bg-gradient-to-br from-nyc-light-gray to-nyc-medium-gray shadow-md">
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
            <h3 className=" font-semibold text-sm">Title</h3>
            <p className="line-clamp-2">{url.title}</p>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="grow flex flex-col gap-2">
        <div className="h-full flex flex-col gap-2">
          <div className="text-base text-gray-700 space-y-0.5">
            <p className="font-semibold text-sm">Description</p>
            <p className="line-clamp-5">{url.description}</p>
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
                  className={`outline hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 ${
                    hasUpvoted ? "bg-blue-100" : ""
                  } ${isUpvoting ? "opacity-50" : ""}`}
                  onClick={handleUpvote}
                  disabled={hasUpvoted || isUpvoting}
                >
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={16} />
                    <span className="text-sm">{upvotes}</span>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{!hasUpvoted && "Upvote this domain"}</p>
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
      <CardFooter>
        <Accordion className="w-full overflow-hidden" type="single" collapsible>
          <AccordionItem value="metadata">
            <AccordionTrigger className="font-semibold text-gray-700 hover:cursor-pointer">
              View metadata
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden">
              <ul className="font-mono list-inside border border-gray-300 bg-nyc-medium-gray rounded-md px-1 py-1 overflow-y-hidden overflow-x-auto text-nowrap">
                <li>
                  Status:{" "}
                  <Badge className="font-semibold" variant="secondary">
                    {status}
                  </Badge>
                </li>
                <li>Final URL: {url.final_url}</li>
                <li>Registered: {formattedRegistrationDate}</li>
                <li>Updated: {formattedUpdatedDate}</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}

export function SkeletonDomainCard(): React.ReactElement {
  return (
    <Card
      className={`gap-2 w-full overflow-hidden text-primary rounded-lg shadow-lg hover:shadow-xl transition-all duration-75
        outline outline-nyc-medium-gray focus:outline-4 focus:outline-nyc-orange focus-within:outline-4 focus-within:outline-nyc-orange
        bg-gray-50 hover:bg-white focus-within:bg-gradient-to-br focus:bg-gradient-to-br from-white to-amber-100
      `}
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
      <CardFooter>
        <Accordion className="w-full overflow-hidden" type="single" collapsible>
          <AccordionItem value="metadata">
            <AccordionTrigger className="font-semibold text-gray-700 hover:cursor-pointer">
              View metadata
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}
