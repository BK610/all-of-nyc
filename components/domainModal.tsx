"use client";

import { X } from "lucide-react";
import DomainCard from "@/components/domainCard";
import StyledCard from "@/components/customShadcn/styledCard";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
  CardAction,
} from "@/components/ui/card";

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
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="fixed inset-4 flex items-center justify-center">
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
            <StyledCard url={url}>
              <CardHeader>
                <CardTitle>Heyyo</CardTitle>
              </CardHeader>
            </StyledCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function DomainModalCard({ url }: { url: any }) {
  return (
    <StyledCard url={url}>
      <CardHeader>
        <CardTitle>Heyyo</CardTitle>
      </CardHeader>
    </StyledCard>
  );
}
