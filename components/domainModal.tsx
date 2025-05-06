"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import DomainCard from "@/components/domainCard";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed inset-4 flex items-center justify-center"
      >
        <motion.div
          className="relative w-full max-w-5xl"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            onClick={onClose}
            className="absolute -right-2 -top-2 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </motion.button>
          <motion.div layoutId={`card-${url.domain_name}`} className="w-full">
            <DomainCard url={url} layoutId={`card-${url.domain_name}`} />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
