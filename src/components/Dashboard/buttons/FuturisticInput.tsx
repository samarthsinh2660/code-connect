"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface FuturisticInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: React.FC<React.SVGProps<SVGSVGElement>>
}

export const FuturisticInput: React.FC<FuturisticInputProps> = ({ label, icon: Icon, className, ...props }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="space-y-2 relative w-full">
      <label className="text-sm font-medium text-cyan-300" htmlFor={props.id}>
        {label}
      </label>

      <div className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {/* Text Input */}
        <input
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            `
            w-full bg-slate-900/80 
            border-3 border-cyan-500/30 
            text-cyan-50 placeholder:text-slate-500 
            rounded-lg px-2 py-2 pl-12
            outline-none transition-all duration-300 
            hover:border-cyan-400/50
            focus:border-cyan-400 focus:ring-3 focus:ring-cyan-400/30
          `,
            className,
          )}
        />

        {/* Input Icon */}
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 w-6 h-6 pointer-events-none" />

        {/* Animated border */}
        <AnimatePresence>
          {(isHovered || isFocused) && (
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 rounded-lg border-2 border-cyan-400"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{
                  strokeDasharray: "0 1",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Focus and hover effects */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {/* Pulsing glow */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                initial={{ boxShadow: "0 0 0 0 rgba(6,182,212,0.6)" }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(6,182,212,0.6)",
                    "0 0 25px 4px rgba(6,182,212,0.8)",
                    "0 0 0 0 rgba(6,182,212,0.6)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Neon-like glow on hover (behind input) */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none z-[-1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            boxShadow: "0 0 30px 5px rgba(6,182,212,0.4), inset 0 0 20px 2px rgba(6,182,212,0.3)",
          }}
        />

      </div>
    </div>
  )
}

