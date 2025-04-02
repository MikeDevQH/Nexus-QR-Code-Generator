"use client"

import { useState, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, RefreshCw, Maximize2, Minimize2, Copy, Check } from "lucide-react"

export default function QrGenerator() {
  const [text, setText] = useState("https://github.com/MikeDevQH")
  const [size, setSize] = useState(200)
  const [fgColor, setFgColor] = useState("#0066FF")
  const [bgColor, setBgColor] = useState("#FFFFFF")
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const downloadQRCode = () => {
    if (!qrRef.current) return

    const svg = qrRef.current.querySelector("svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = size
      canvas.height = size
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      const downloadLink = document.createElement("a")
      downloadLink.download = "qrcode.png"
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  const resetColors = () => {
    setFgColor("#0066FF")
    setBgColor("#FFFFFF")
  }

  const copyText = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <Card className="border-blue-200 dark:border-blue-800 shadow-lg dark:shadow-blue-900/20 backdrop-blur-sm bg-white/80 dark:bg-blue-950/70 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 h-2" />
          <CardContent className="pt-6 space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="text" className="text-blue-700 dark:text-blue-300 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mr-1"></span>
                  <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mr-1"></span>
                  Text or URL
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyText}
                  className="h-6 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <Input
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text or URL"
                className="border-blue-200 dark:border-blue-800 focus:ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20 dark:text-blue-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size" className="text-blue-700 dark:text-blue-300 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mr-1"></span>
                <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mr-1"></span>
                Size: {size}px
              </Label>
              <Slider
                id="size"
                min={100}
                max={400}
                step={10}
                value={[size]}
                onValueChange={(value) => setSize(value[0])}
                className="py-4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fgColor" className="text-blue-700 dark:text-blue-300 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mr-1"></span>
                <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mr-1"></span>
                QR Code Color
              </Label>
              <div className="flex gap-2">
                <div className="relative h-10 w-12 overflow-hidden rounded-md">
                  <Input
                    id="fgColor"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="absolute top-0 left-0 h-full w-full border-blue-200 dark:border-blue-800 cursor-pointer"
                  />
                </div>
                <Input
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 dark:text-blue-100 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bgColor" className="text-blue-700 dark:text-blue-300 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mr-1"></span>
                <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mr-1"></span>
                Background Color
              </Label>
              <div className="flex gap-2">
                <div className="relative h-10 w-12 overflow-hidden rounded-md">
                  <Input
                    id="bgColor"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="absolute top-0 left-0 h-full w-full border-blue-200 dark:border-blue-800 cursor-pointer"
                  />
                </div>
                <Input
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 dark:text-blue-100 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={downloadQRCode}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md shadow-blue-500/20 dark:shadow-blue-900/30 border-0"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                onClick={resetColors}
                className="border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900 shadow-sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Colors
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-center items-center"
      >
        <motion.div
          ref={qrRef}
          className="relative overflow-hidden bg-white dark:bg-blue-950 rounded-xl shadow-lg border border-blue-200 dark:border-blue-800"
          layout
          transition={{
            layout: { duration: 0.3, ease: "easeInOut" },
            default: { duration: 0.3 },
          }}
          whileHover={{
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
          style={{
            backgroundColor: bgColor,
            width: expanded ? `${size * 1.5}px` : `${size}px`,
            height: expanded ? `${size * 1.5}px` : `${size}px`,
          }}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            layout
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <QRCodeSVG
              value={text || " "}
              size={expanded ? size * 1.3 : size * 0.9}
              fgColor={fgColor}
              bgColor={bgColor}
              level="H"
              includeMargin={false}
            />
          </motion.div>

          <motion.div
            className="absolute z-10 -right-3 -top-3"
            initial={false}
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => setExpanded(!expanded)}
              className="h-8 w-8 rounded-full bg-white dark:bg-blue-900 shadow-md border-blue-200 dark:border-blue-700"
            >
              {expanded ? (
                <Minimize2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <Maximize2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              )}
              <span className="sr-only">{expanded ? "Shrink" : "Expand"}</span>
            </Button>
          </motion.div>

          {/* Esquinas internas */}
          <motion.div
            className="absolute left-1 bottom-1 w-4 h-4 border-l border-b border-blue-500 dark:border-blue-400"
            layout
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-1 top-1 w-4 h-4 border-r border-t border-blue-500 dark:border-blue-400"
            layout
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-1 bottom-1 w-4 h-4 border-r border-b border-blue-500 dark:border-blue-400"
            layout
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-1 top-1 w-4 h-4 border-l border-t border-blue-500 dark:border-blue-400"
            layout
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />

          {/* Efecto de brillo contenido */}
          <motion.div
            className="absolute -z-1 inset-0 rounded-lg bg-gradient-to-br from-blue-400/10 to-blue-600/10 dark:from-blue-400/20 dark:to-blue-600/20 blur-sm"
            layout
            transition={{ duration: 0.3, ease: "easeInOut" }}
            animate={{
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              opacity: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
              layout: { duration: 0.3, ease: "easeInOut" },
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

