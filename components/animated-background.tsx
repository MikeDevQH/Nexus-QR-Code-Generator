"use client"

import { useRef, useEffect } from "react"
import { useTheme } from "next-themes"

export default function AnimatedBackground() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const isDark = theme === "dark"

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // QR code corner patterns
    const cornerPatterns = []
    for (let i = 0; i < 4; i++) {
      cornerPatterns.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 70 + 50, // Increased size
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
      })
    }

    // Create particles
    const particlesArray: Particle[] = []
    const particleCount = 100 // Increased count

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      isSquare: boolean
      rotation: number
      rotationSpeed: number
      opacity: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 10 + 3 // Slightly larger
        this.speedX = (Math.random() - 0.5) * 1
        this.speedY = (Math.random() - 0.5) * 1
        this.isSquare = Math.random() > 0.3
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.02
        this.opacity = Math.random() * 0.6 + 0.2 // Increased opacity

        this.color = isDark ? `rgba(59, 130, 246, ${this.opacity})` : `rgba(37, 99, 235, ${this.opacity * 0.8})` // Slightly more opaque
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.rotation += this.rotationSpeed

        if (this.x > canvas.width + 50) this.x = -50
        if (this.x < -50) this.x = canvas.width + 50
        if (this.y > canvas.height + 50) this.y = -50
        if (this.y < -50) this.y = canvas.height + 50
      }

      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)

        ctx.fillStyle = this.color
        ctx.strokeStyle = isDark
          ? `rgba(96, 165, 250, ${this.opacity * 1.3})`
          : `rgba(37, 99, 235, ${this.opacity * 1.1})`
        ctx.lineWidth = 1.5 // Thicker lines

        if (this.isSquare) {
          // Draw square for QR code aesthetic
          const squareSize = this.size * 1.5
          ctx.beginPath()
          ctx.rect(-squareSize / 2, -squareSize / 2, squareSize, squareSize)
          ctx.fill()
          ctx.stroke()
        } else {
          // Draw small dot
          ctx.beginPath()
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }
    }

    // Draw QR corner pattern
    const drawCornerPattern = (x: number, y: number, size: number, rotation: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)

      const outerSize = size
      const innerSize = size * 0.75
      const innerOffset = (outerSize - innerSize) / 2
      const centerSize = size * 0.25
      const centerOffset = (outerSize - centerSize) / 2

      // Outer square
      ctx.fillStyle = isDark ? "rgba(96, 165, 250, 0.2)" : "rgba(37, 99, 235, 0.15)" // More visible
      ctx.strokeStyle = isDark ? "rgba(96, 165, 250, 0.4)" : "rgba(37, 99, 235, 0.3)" // More visible
      ctx.lineWidth = 1.5 // Thicker lines
      ctx.beginPath()
      ctx.rect(-outerSize / 2, -outerSize / 2, outerSize, outerSize)
      ctx.fill()
      ctx.stroke()

      // Inner square
      ctx.fillStyle = isDark ? "rgba(96, 165, 250, 0.3)" : "rgba(37, 99, 235, 0.2)" // More visible
      ctx.beginPath()
      ctx.rect(-innerSize / 2, -innerSize / 2, innerSize, innerSize)
      ctx.fill()
      ctx.stroke()

      // Center square
      ctx.fillStyle = isDark ? "rgba(96, 165, 250, 0.4)" : "rgba(37, 99, 235, 0.3)" // More visible
      ctx.beginPath()
      ctx.rect(-centerSize / 2, -centerSize / 2, centerSize, centerSize)
      ctx.fill()
      ctx.stroke()

      ctx.restore()
    }

    // Create scanning effect
    let scanLineY = 0
    let scanDirection = 1
    const scanSpeed = 2

    // Create particles
    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle())
      }
    }

    // Connect particles with lines
    const connect = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x
          const dy = particlesArray[a].y - particlesArray[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 130) {
            // Increased connection distance
            const opacity = 1 - distance / 130
            ctx.strokeStyle = isDark
              ? `rgba(96, 165, 250, ${opacity * 0.25})` // More visible
              : `rgba(37, 99, 235, ${opacity * 0.15})` // More visible
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
            ctx.stroke()
          }
        }
      }
    }

    // Draw scan line
    const drawScanLine = () => {
      const gradient = ctx.createLinearGradient(0, scanLineY - 15, 0, scanLineY + 15) // Wider gradient

      if (isDark) {
        gradient.addColorStop(0, "rgba(96, 165, 250, 0)")
        gradient.addColorStop(0.5, "rgba(96, 165, 250, 0.4)") // More visible
        gradient.addColorStop(1, "rgba(96, 165, 250, 0)")
      } else {
        gradient.addColorStop(0, "rgba(37, 99, 235, 0)")
        gradient.addColorStop(0.5, "rgba(37, 99, 235, 0.3)") // More visible
        gradient.addColorStop(1, "rgba(37, 99, 235, 0)")
      }

      ctx.fillStyle = gradient
      ctx.fillRect(0, scanLineY - 15, canvas.width, 30) // Wider scan line

      // Update scan line position
      scanLineY += scanSpeed * scanDirection
      if (scanLineY > canvas.height || scanLineY < 0) {
        scanDirection *= -1
      }
    }

    // Draw data flow
    const drawDataFlow = () => {
      const dataPoints = 7 // More data points
      const time = Date.now() * 0.001

      for (let i = 0; i < dataPoints; i++) {
        const x = (Math.sin(time * 0.5 + i) * 0.5 + 0.5) * canvas.width
        const y = (Math.cos(time * 0.3 + i * 2) * 0.5 + 0.5) * canvas.height
        const size = Math.sin(time + i) * 6 + 12 // Larger

        ctx.fillStyle = isDark
          ? `rgba(96, 165, 250, 0.4)` // More visible
          : `rgba(37, 99, 235, 0.25)` // More visible
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()

        // Draw pulse
        ctx.strokeStyle = isDark
          ? `rgba(96, 165, 250, 0.15)` // More visible
          : `rgba(37, 99, 235, 0.1)` // More visible
        ctx.beginPath()
        ctx.arc(x, y, size * 2, 0, Math.PI * 2)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(x, y, size * 3, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // Draw grid pattern
    const drawGrid = () => {
      const gridSize = 40
      ctx.strokeStyle = isDark
        ? "rgba(96, 165, 250, 0.07)" // More visible
        : "rgba(37, 99, 235, 0.04)" // More visible
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background elements
      drawGrid()
      drawScanLine()
      drawDataFlow()

      // Update and draw corner patterns
      cornerPatterns.forEach((pattern) => {
        pattern.x += pattern.speedX
        pattern.y += pattern.speedY
        pattern.rotation += pattern.rotationSpeed

        // Bounce off edges
        if (pattern.x < pattern.size / 2 || pattern.x > canvas.width - pattern.size / 2) {
          pattern.speedX *= -1
        }
        if (pattern.y < pattern.size / 2 || pattern.y > canvas.height - pattern.size / 2) {
          pattern.speedY *= -1
        }

        drawCornerPattern(pattern.x, pattern.y, pattern.size, pattern.rotation)
      })

      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }

      connect()
    }

    init()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 opacity-70" />
}

