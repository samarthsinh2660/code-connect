"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
}

const faqData = [
  {
    question: "Do I need to install anything first?",
    answer: "No, CodeConnect runs entirely in your browser. No installation required!",
  },
  {
    question: "What programming languages does CodeConnect support?",
    answer: "We currently support JavaScript, Python, Java, and C++ with full syntax highlighting and error checking.",
  },
  {
    question: "Will my code be saved if I close the browser?",
    answer: "Your code is temporary and not saved on our servers. Make sure to copy or download before closing.",
  },
  {
    question: "Can I customize the editor appearance?",
    answer: "Yes! You can customize the font size, switch themes, and adjust the layout to your liking.",
  },
  {
    question: "How can I use the AI assistant effectively?",
    answer: "The AI assistant can help debug code, explain segments, suggest optimizations, answer questions, and generate examples—all while being contextually aware of your codebase.",
  },
] as const

export default function FAQSection() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 max-w-5xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="text-center mb-12"
      >
        <motion.span
          variants={itemVariants}
          className="text-orange-400 font-medium mb-4 block"
        >
          FREQUENTLY ASKED QUESTIONS
        </motion.span>
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl font-bold text-white"
        >
          You ask? We{" "}
          <span className="italic font-serif text-slate-300">answer</span>
        </motion.h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8"
      >
        <Accordion type="single" collapsible className="space-y-4">
          <AnimatePresence>
            {faqData.map((faq, index) => (
              <motion.div
                key={`item-${index + 1}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
              >
                <AccordionItem value={`item-${index + 1}`} className="border-none">
                  <AccordionTrigger className="flex justify-between items-center w-full py-4 text-left text-lg font-semibold text-white hover:no-underline">
                    {({ isExpanded }) => (
                      <>
                        <span>{faq.question}</span>
                        <motion.div
                          className="shrink-0 ml-4 p-2 rounded-full border border-slate-700"
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        >
                          {isExpanded ? (
                            <Minus className="h-4 w-4 text-orange-400" />
                          ) : (
                            <Plus className="h-4 w-4 text-slate-400" />
                          )}
                        </motion.div>
                      </>
                    )}
                  </AccordionTrigger>

                  <AccordionContent className="text-slate-300 pt-2 pb-4 italic">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 150, damping: 15 }}
                    >
                      "{faq.answer}"
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </Accordion>
      </motion.div>
    </section>
  )
}