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

    // Create particles
    const particlesArray: Particle[] = []
    const particleCount = 50

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 10 + 1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
        this.color = isDark
          ? `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.1})` // Blue with opacity for dark theme
          : `rgba(37, 99, 235, ${Math.random() * 0.3 + 0.05})` // Darker blue with lower opacity for light theme
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX
        }

        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY
        }
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.strokeStyle = isDark ? "rgba(96, 165, 250, 0.3)" : "rgba(37, 99, 235, 0.2)"
        ctx.lineWidth = 2

        // Draw square instead of circle for QR code aesthetic
        const squareSize = this.size * 2
        ctx.beginPath()
        ctx.rect(this.x, this.y, squareSize, squareSize)
        ctx.fill()
        ctx.stroke()
      }
    }

    // Create particles
    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle())
      }
    }

    // Connect particles with lines
    const connect = () => {
      let opacityValue = 1

      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x
          const dy = particlesArray[a].y - particlesArray[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            opacityValue = 1 - distance / 150
            ctx.strokeStyle = isDark
              ? `rgba(96, 165, 250, ${opacityValue * 0.5})`
              : `rgba(37, 99, 235, ${opacityValue * 0.3})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particlesArray[a].x + particlesArray[a].size, particlesArray[a].y + particlesArray[a].size)
            ctx.lineTo(particlesArray[b].x + particlesArray[b].size, particlesArray[b].y + particlesArray[b].size)
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Add grid pattern
      const gridSize = 30
      ctx.strokeStyle = isDark ? "rgba(96, 165, 250, 0.1)" : "rgba(37, 99, 235, 0.05)"
      ctx.lineWidth = 1

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

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

