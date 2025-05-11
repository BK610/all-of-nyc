"use client";

import { X } from "lucide-react";
import StyledCard from "@/components/customShadcn/styledCard";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThumbsUp, Copy, Share, MoveRight } from "lucide-react";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import throwConfettiOnElement from "@/utils/confetti.utils";

interface DomainModalProps {
  url: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function DomainModal({
  url,
  isOpen,
  onClose,
}: DomainModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div
          className="relative w-full max-w-5xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -right-2 -top-2 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="w-full">
            <DomainModalCard url={url} isOpen={isOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DomainModalCard({ url, isOpen }: { url: any; isOpen: boolean }) {
  const [upvotes, setUpvotes] = useState(url?.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-focus the card when the modal opens
    if (isOpen && cardRef.current) {
      cardRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!url) return;
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
      const button = document.getElementById(`modal-upvote-${url.domain_name}`);
      throwConfettiOnElement({ element: button });
    } catch (error) {
      console.error("Error upvoting:", error);
    } finally {
      setIsUpvoting(false);
    }
  };

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
        </div>
      );
    } catch (err) {
      console.error("Failed to copy URL:", err);
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

  return (
    <StyledCard
      url={url}
      className="w-full"
      tabIndex={0}
      ref={cardRef}
      onClick={(e) => {
        // Prevent action if clicking on buttons or interactive elements
        if (
          (e.target as HTMLElement).closest("button") ||
          (e.target as HTMLElement).closest("a")
        ) {
          return;
        }

        // Set focus on the card element
        e.currentTarget.focus();
      }}
    >
      <CardHeader className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-mono font-bold break-all">
            {url.domain_name}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Upvotes:</span>
          <span className="text-lg font-semibold">{upvotes}</span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  id={`modal-upvote-${url.domain_name}`}
                  className={`hover:cursor-pointer hover:border-nyc-blue hover:bg-gradient-to-br hover:from-amber-50 hover:to-amber-300 active:bg-gray-200 ${
                    hasUpvoted && "bg-gray-200"
                  } ${isUpvoting && "opacity-50"}`}
                  onClick={handleUpvote}
                  disabled={hasUpvoted || isUpvoting}
                >
                  <ThumbsUp size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{hasUpvoted ? "Upvoted!" : "Upvote this domain"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12">
        {/* Left column: text content */}
        <div className="order-2 md:order-1 flex-1 flex flex-col gap-4">
          <div className="space-y-2">
            <h3 className="text-gray-700 text-lg font-semibold">Title</h3>
            <p className="break-words whitespace-pre-line">{url.title}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-gray-700 text-lg font-semibold">Description</h3>
            <p className="whitespace-pre-wrap break-words">{url.description}</p>
          </div>
        </div>
        {/* Right column: image */}
        <div className="order-1 md:order-2 w-full self-center">
          <AspectRatio ratio={1200 / 627} className="w-full">
            <div className="h-full w-full flex items-center rounded-lg bg-gradient-to-br from-nyc-light-gray to-nyc-medium-gray shadow-md overflow-hidden">
              {url.is_og_image_found ? (
                <img
                  className="h-full w-full object-cover"
                  src={decodeURI(url.image)}
                  alt={`OpenGraph image for ${url.domain_name}`}
                />
              ) : (
                <p className="text-center w-full font-mono text-lg md:text-xl">
                  {url.domain_name}
                </p>
              )}
            </div>
          </AspectRatio>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-6 pt-4">
        <div className="w-full flex flex-row gap-2">
          <Button
            className="flex-1 font-semibold hover:bg-accent shadow-md hover:shadow-lg text-white min-w-[120px]"
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
                  size="default"
                  className="hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200"
                  onClick={handleCopyDomain}
                >
                  <span className="hidden sm:inline">Copy</span>
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
                  size="default"
                  className="hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200"
                  onClick={handleCopyUrl}
                >
                  <span className="hidden sm:inline">Share</span>
                  <Share />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share this domain</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="w-full space-y-2">
          <h3 className="text-gray-700 text-lg font-semibold">Metadata</h3>
          <ul className="text-sm p-2 font-mono list-inside bg-gradient-to-br from-nyc-light-gray to-nyc-medium-gray shadow-md rounded-md overflow-y-hidden overflow-x-auto text-nowrap">
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
        </div>
      </CardFooter>
    </StyledCard>
  );
}
