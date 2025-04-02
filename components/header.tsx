"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Scan } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Necesario para evitar errores de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <motion.header
      className="flex justify-between items-center mb-12 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 w-12 h-12 rounded-lg grid place-items-center shadow-lg">
            <Scan className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 dark:bg-blue-300 rounded-full animate-pulse-slow" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200">
            QR Nexus
          </h1>
          <p className="text-xs text-blue-500 dark:text-blue-400 tracking-widest uppercase font-light">
            Future of QR Technology
          </p>
        </div>
      </motion.div>

      {mounted && (
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-300 shadow-md backdrop-blur-sm bg-white/80 dark:bg-black/20"
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-blue-300" /> : <Moon className="h-5 w-5 text-blue-600" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </motion.div>
      )}
    </motion.header>
  )
}

