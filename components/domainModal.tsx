"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import DomainCard from "./domainCard";

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
  return (
    // <AnimatePresence>
    <>
      {isOpen && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-4xl">
              <button
                onClick={onClose}
                className="absolute -right-2 -top-2 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
              <DomainCard url={url} layoutId={url.domain_name} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
    // </AnimatePresence>
  );
}
