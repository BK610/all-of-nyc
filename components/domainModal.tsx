"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.back();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
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
                onClick={handleClose}
                className="absolute -right-2 -top-2 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
              <DomainCard url={url} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
