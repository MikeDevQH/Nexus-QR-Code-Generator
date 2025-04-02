import QrGenerator from "@/components/qr-generator"
import Header from "@/components/header"
import AnimatedBackground from "@/components/animated-background"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50/70 to-blue-100/70 dark:from-blue-950/80 dark:to-blue-900/80 transition-colors duration-300">
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-8">
        <Header />
        <QrGenerator />
      </div>
    </main>
  )
}

