import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Smartphone, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Certily</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 text-balance">
              Professional Audit Platform for<span className="text-accent"> Modern Businesses</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
              Streamline your audit processes with comprehensive tracking, real-time reporting, and seamless
              collaboration. Perfect for retail chains, franchises, and multi-location businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg border-border hover:bg-secondary bg-transparent"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="p-6 bg-card border-border">
              <div className="text-3xl font-bold text-foreground mb-2">500+</div>
              <div className="text-muted-foreground">audits completed</div>
              <div className="mt-4 text-sm font-medium text-muted-foreground">THIS MONTH</div>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="text-3xl font-bold text-foreground mb-2">98%</div>
              <div className="text-muted-foreground">compliance rate achieved</div>
              <div className="mt-4 text-sm font-medium text-muted-foreground">AVERAGE</div>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="text-3xl font-bold text-foreground mb-2">75%</div>
              <div className="text-muted-foreground">faster audit completion</div>
              <div className="mt-4 text-sm font-medium text-muted-foreground">VS MANUAL</div>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
              <div className="text-muted-foreground">real-time monitoring</div>
              <div className="mt-4 text-sm font-medium text-muted-foreground">ALWAYS ON</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Smartphone className="w-6 h-6 text-accent" />
                <span className="text-accent font-medium">Mobile-First Auditing</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                Streamlined audits. Actionable insights.
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Conduct comprehensive audits on any device, capture evidence with photos, and generate detailed reports
                instantly. Perfect for quality assurance, compliance checks, and operational assessments.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-foreground">Offline audit capabilities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-foreground">Photo evidence capture</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-foreground">Real-time sync & reporting</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="p-8 bg-card border-border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Audit Progress</span>
                    <span className="text-sm text-accent font-medium">85% Complete</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-accent rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <div className="text-2xl font-bold text-foreground">47</div>
                      <div className="text-sm text-muted-foreground">Locations Audited</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">12</div>
                      <div className="text-sm text-muted-foreground">Issues Found</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
            Transform your audit process. <span className="text-accent">Collaborate seamlessly</span> with your team and
            stakeholders.
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Everything you need to conduct professional audits and maintain compliance standards.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
              Start Auditing Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Certily</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
