"use client";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { use } from "react";
import DomainModal from "@/components/domainModal";

interface DomainPageProps {
  params: Promise<{
    domain: string;
  }>;
}

export default function DomainPage({ params }: DomainPageProps) {
  const { domain } = use(params);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    console.log("Domain page loaded with domain:", domain);
  }, [domain]);

  // For now, we'll create a mock domain data object
  const domainData = {
    domain_name: decodeURIComponent(domain),
    is_url_found: true,
    // Add other required properties
    upvotes: 0,
    title: "Loading...",
    description: "Loading...",
    domain_registration_date: new Date().toISOString(),
    last_updated_at: new Date().toISOString(),
    is_og_title_found: false,
    is_og_image_found: false,
    image: "",
    final_url: `https://${decodeURIComponent(domain)}`,
  };

  return (
    <DomainModal
      url={domainData}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}
