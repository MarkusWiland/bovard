'use client'
import React, { useState } from 'react';
import { Home, FileText, Send, Zap, Shield, TrendingUp, ChevronRight, Check, Menu, X, Upload, Mail, Clock, Star, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary"></div>
            <span className="text-xl font-bold">HyresPortal</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Funktioner
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Priser
            </a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Logga in
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2">
              Kom igång gratis
            </button>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-sm font-medium">Funktioner</a>
              <a href="#pricing" className="text-sm font-medium">Priser</a>
              <a href="#faq" className="text-sm font-medium">FAQ</a>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10">
                Kom igång gratis
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="container pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-8">
            <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-muted-foreground">Använd av 1000+ hyresvärdar</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-6">
            Automatisera din{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              hyresadministration
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8 md:text-xl">
            Använd dina egna avtalsmallar. Fyll i variabler automatiskt. Skicka och spåra avtal med ett klick. 
            <strong className="text-foreground"> Helt på svenska.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
              Starta gratis 14-dagars prövotid
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
              Se hur det fungerar
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Inget kreditkort krävs</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Avsluta när som helst</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mx-auto max-w-5xl mt-16">
          <div className="rounded-xl border bg-card shadow-2xl p-4">
            <div className="rounded-lg border bg-muted/50 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Home className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-green-600">+2 denna månad</span>
                  </div>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Fastigheter</p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-green-600">100% inbetald</span>
                  </div>
                  <div className="text-2xl font-bold">147 500 kr</div>
                  <p className="text-xs text-muted-foreground">Månadshyra</p>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs text-blue-600">2 förnyas snart</span>
                  </div>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Aktiva kontrakt</p>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Senaste aktiviteter</h3>
                  <span className="text-sm text-primary">Se alla →</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-md bg-green-50 dark:bg-green-950/20 p-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm flex-1">Anna Andersson - Vasagatan 12A</span>
                    <span className="text-sm font-semibold">12 500 kr</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-md bg-green-50 dark:bg-green-950/20 p-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm flex-1">Erik Johansson - Storgatan 45</span>
                    <span className="text-sm font-semibold">9 800 kr</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y bg-muted/50 py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Aktiva hyresvärdar</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-sm text-muted-foreground">Hanterade fastigheter</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Nöjda kunder</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">250M+</div>
              <div className="text-sm text-muted-foreground">kr i hanterade hyror</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-24">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Så enkelt kommer du igång
          </h2>
          <p className="text-lg text-muted-foreground">
            Tre steg från ditt gamla avtal till automatiserad administration
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="relative">
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Ladda upp din mall</h3>
              <p className="text-muted-foreground">
                Använd ditt befintliga Word- eller PDF-avtal. Markera variabler som namn, adress och hyra med <code className="rounded bg-muted px-1">{'{{variabel}}'}</code>
              </p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 h-0.5 w-8 bg-border"></div>
          </div>

          <div className="relative">
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Fyll i uppgifter</h3>
              <p className="text-muted-foreground">
                För varje ny hyresgäst fyller du enkelt i namn, hyra och övriga detaljer. Vi genererar avtalet automatiskt.
              </p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 h-0.5 w-8 bg-border"></div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Skicka och spåra</h3>
            <p className="text-muted-foreground">
              Avtalet skickas automatiskt via e-post. Få notiser när hyresgästen öppnat och signerat dokumentet.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y bg-muted/50 py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Kraftfulla funktioner för{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                moderna hyresvärdar
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Allt du behöver för att hantera dina hyresfastigheter professionellt
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Dina egna mallar</h3>
              <p className="text-sm text-muted-foreground">
                Ladda upp ditt befintliga avtal. Inget juridiskt krångel - använd vad du redan har och litar på.
              </p>
            </div>

            <div className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Automatisk ifyllning</h3>
              <p className="text-sm text-muted-foreground">
                Definiera variabler en gång, fyll i värden för varje hyresgäst. Vi hanterar resten automatiskt.
              </p>
            </div>

            <div className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">E-post automation</h3>
              <p className="text-sm text-muted-foreground">
                Skicka avtal automatiskt via e-post. Inkludera PDF-bifogning och signeringslänk direkt.
              </p>
            </div>

            <div className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smarta påminnelser</h3>
              <p className="text-sm text-muted-foreground">
                Automatiska påminnelser om signering, hyresbetalningar och avtalsförnyelser. Aldrig missa något igen.
              </p>
            </div>

            <div className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">GDPR-säkert</h3>
              <p className="text-sm text-muted-foreground">
                All data krypteras och lagras säkert i Sverige. Regelbundna säkerhetskopior och GDPR-compliance.
              </p>
            </div>

            <div className="group rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ekonomiöversikt</h3>
              <p className="text-sm text-muted-foreground">
                Se alla hyresintäkter på ett ställe. Exportera till Excel eller ditt bokföringssystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-24">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Vad våra kunder säger
          </h2>
          <p className="text-lg text-muted-foreground">
            Från privatpersoner till småskaliga fastighetsägare
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm mb-4">
              "Sparar mig timmar varje månad! Istället för att manuellt fylla i avtal kan jag nu skicka dem automatiskt. Briljant!"
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10"></div>
              <div>
                <div className="font-semibold text-sm">Anna Svensson</div>
                <div className="text-xs text-muted-foreground">Hyr ut 3 lägenheter</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm mb-4">
              "Äntligen ett svenskt verktyg som förstår våra behov. Kan använda mina egna mallar utan att behöva anlita jurist igen."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10"></div>
              <div>
                <div className="font-semibold text-sm">Erik Andersson</div>
                <div className="text-xs text-muted-foreground">Fastighetsägare</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm mb-4">
              "Supernöjd! Fick igång systemet på 10 minuter och skickade mitt första avtal samma dag. Enklare blir det inte."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10"></div>
              <div>
                <div className="font-semibold text-sm">Maria Johansson</div>
                <div className="text-xs text-muted-foreground">Hyr ut sommarstugan</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-y bg-primary text-primary-foreground py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Redo att automatisera din hyresadministration?
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/90">
              Gå med över 1000 hyresvärdar som redan sparat hundratals timmar
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-background text-foreground hover:bg-background/90 h-11 px-8">
                Starta gratis idag
              </button>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-2 border-primary-foreground/20 bg-transparent hover:bg-primary-foreground/10 h-11 px-8">
                Boka demo
              </button>
            </div>
            <p className="text-sm mt-6 text-primary-foreground/80">
              14 dagar gratis • Inget kreditkort krävs • Avsluta när som helst
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary"></div>
                <span className="text-lg font-bold">HyresPortal</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Sveriges modernaste verktyg för hyresadministration
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Produkt</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Funktioner</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Priser</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Dokumentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Företag</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Om oss</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blogg</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Kontakt</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Juridiskt</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Integritetspolicy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Användarvillkor</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 HyresPortal. Alla rättigheter förbehållna.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}