'use client'
import React, { useState, useEffect } from 'react';
import { Home, FileText, Send, Zap, Shield, TrendingUp, Check, Menu, X, Upload, Mail, Clock, Star, ArrowRight, ChevronRight, Play, Sparkles, Building2, Users, BarChart3, Lock, Globe, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] opacity-[0.015]" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b shadow-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 shadow-lg shadow-primary/25 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-primary/20 blur-sm -z-10" />
              </div>
              <span className="text-xl font-semibold tracking-tight">HyresPortal</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-1">
              {['Funktioner', 'Priser', 'Om oss', 'FAQ'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Logga in
              </Button>
              <Button size="sm" className="shadow-lg shadow-primary/25 px-6">
                Kom igång
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-2">
              {['Funktioner', 'Priser', 'Om oss', 'FAQ'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                >
                  {item}
                </a>
              ))}
              <Separator className="my-2" />
              <Button className="w-full mt-2">Kom igång gratis</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </div>
              <span className="text-sm text-muted-foreground">Ny funktion: AI-assisterad avtalsanalys</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Framtidens{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-primary via-primary to-chart-1 bg-clip-text text-transparent">
                  hyresadministration
                </span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8 T200,8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
              <br />är här
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Automatisera avtal, spåra betalningar och hantera hyresgäster på ett ställe. 
              <span className="text-foreground font-medium"> Byggt för svenska hyresvärdar.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-primary/30 px-8 h-12 text-base">
                Starta gratis provperiod
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 h-12 text-base group">
                <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Se demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
              {[
                'Inget kreditkort krävs',
                '14 dagars gratis test',
                'Avsluta när som helst'
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="max-w-6xl mx-auto mt-20 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-chart-1/20 to-primary/20 rounded-3xl blur-2xl opacity-50" />
              
              <Card className="relative overflow-hidden border-2 shadow-2xl">
                <div className="bg-muted/30 p-2 border-b">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-destructive/80" />
                      <div className="h-3 w-3 rounded-full bg-chart-4" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-muted rounded-md px-4 py-1 text-xs text-muted-foreground">
                        app.hyresportal.se/dashboard
                      </div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6 lg:p-8">
                  {/* Stats Grid */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                    {[
                      { icon: Building2, label: 'Fastigheter', value: '24', change: '+3 denna månad', color: 'text-primary' },
                      { icon: Users, label: 'Hyresgäster', value: '86', change: '98% nöjdhet', color: 'text-chart-1' },
                      { icon: TrendingUp, label: 'Månadshyra', value: '847 500 kr', change: '+12% YoY', color: 'text-green-600' },
                      { icon: FileText, label: 'Aktiva avtal', value: '82', change: '4 förnyas snart', color: 'text-chart-4' }
                    ].map((stat) => (
                      <Card key={stat.label} className="bg-muted/30 border-muted">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            <Badge variant="secondary" className="text-[10px] font-normal">
                              {stat.change}
                            </Badge>
                          </div>
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Activity Section */}
                  <Card className="bg-muted/30 border-muted">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Senaste betalningar</CardTitle>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Visa alla <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { name: 'Anna Andersson', address: 'Vasagatan 12A', amount: '12 500 kr', time: 'Idag 09:34' },
                        { name: 'Erik Johansson', address: 'Storgatan 45', amount: '9 800 kr', time: 'Idag 08:15' },
                        { name: 'Maria Lindberg', address: 'Kungsgatan 8B', amount: '14 200 kr', time: 'Igår 16:42' }
                      ].map((payment, i) => (
                        <div key={i} className="flex items-center gap-4 rounded-lg bg-green-500/5 border border-green-500/10 p-3">
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{payment.name}</div>
                            <div className="text-xs text-muted-foreground">{payment.address}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-sm text-green-600">{payment.amount}</div>
                            <div className="text-xs text-muted-foreground">{payment.time}</div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Logos */}
      <section className="py-16 border-y bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Förtroende från över 1 000 svenska hyresvärdar
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center max-w-4xl mx-auto">
            {[
              { value: '1 247', label: 'Aktiva användare' },
              { value: '5 800+', label: 'Hanterade fastigheter' },
              { value: '98.7%', label: 'Kundnöjdhet' },
              { value: '340M kr', label: 'Hanterade hyror/år' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="secondary" className="mb-4">Så fungerar det</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">
              Kom igång på minuter
            </h2>
            <p className="text-lg text-muted-foreground">
              Tre enkla steg från ditt gamla arbetssätt till automatiserad administration
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Ladda upp din mall',
                description: 'Använd ditt befintliga Word- eller PDF-avtal. Markera variabler som namn, adress och hyra med enkla taggar.',
                color: 'from-primary/20 to-primary/5'
              },
              {
                step: '02',
                icon: FileText,
                title: 'Fyll i uppgifter',
                description: 'För varje ny hyresgäst fyller du enkelt i information via ett smart formulär. Vi genererar avtalet automatiskt.',
                color: 'from-chart-1/20 to-chart-1/5'
              },
              {
                step: '03',
                icon: Send,
                title: 'Skicka och spåra',
                description: 'Avtalet skickas automatiskt via e-post. Få notiser när hyresgästen öppnat och signerat dokumentet.',
                color: 'from-green-500/20 to-green-500/5'
              }
            ].map((item, index) => (
              <div key={item.step} className="relative group">
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-border via-muted-foreground/20 to-border z-0" />
                )}
                
                <Card className="relative h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 hover:border-primary/20">
                  <CardContent className="p-8">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} mb-6`}>
                      <item.icon className="h-7 w-7 text-foreground" />
                    </div>
                    <div className="text-xs font-bold text-muted-foreground tracking-widest mb-2">
                      STEG {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funktioner" className="py-24 lg:py-32 bg-muted/30 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="secondary" className="mb-4">Funktioner</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">
              Allt du behöver för{' '}
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                professionell förvaltning
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Kraftfulla verktyg som sparar tid och ger dig full kontroll
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Layers,
                title: 'Egna avtalsmallar',
                description: 'Ladda upp dina befintliga avtal i Word eller PDF. Behåll ditt godkända juridiska ramverk.',
                badge: 'Populär'
              },
              {
                icon: Zap,
                title: 'Smart ifyllning',
                description: 'Definiera variabler en gång. System fyller i automatiskt för varje ny hyresgäst.',
                badge: null
              },
              {
                icon: Mail,
                title: 'E-postautomation',
                description: 'Skicka avtal, påminnelser och kvitton automatiskt. Anpassningsbara mallar.',
                badge: null
              },
              {
                icon: Clock,
                title: 'Smarta påminnelser',
                description: 'Automatiska notiser för signering, betalningar och avtalsförnyelser.',
                badge: null
              },
              {
                icon: Shield,
                title: 'GDPR-säkert',
                description: 'Krypterad data, svensk lagring, regelbundna säkerhetskopior. Fullständig GDPR-compliance.',
                badge: 'Certifierat'
              },
              {
                icon: BarChart3,
                title: 'Ekonomiöversikt',
                description: 'Realtidsöversikt över alla hyresintäkter. Export till Excel eller bokföringssystem.',
                badge: null
              },
              {
                icon: Globe,
                title: 'Hyresgästportal',
                description: 'Ge dina hyresgäster en egen portal för avtal, betalningar och kommunikation.',
                badge: 'Ny'
              },
              {
                icon: Lock,
                title: 'Digital signering',
                description: 'Juridiskt bindande e-signaturer via BankID. Spåra status i realtid.',
                badge: null
              },
              {
                icon: Sparkles,
                title: 'AI-assistent',
                description: 'Få hjälp med avtalsanalys, hyresjusteringar och automatiserade rekommendationer.',
                badge: 'Beta'
              }
            ].map((feature) => (
              <Card key={feature.title} className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    {feature.badge && (
                      <Badge variant={feature.badge === 'Ny' || feature.badge === 'Beta' ? 'default' : 'secondary'} className="text-[10px]">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="priser" className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="secondary" className="mb-4">Prissättning</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">
              Enkla, transparenta priser
            </h2>
            <p className="text-lg text-muted-foreground">
              Välj det som passar dina behov. Ingen bindningstid.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="relative border-2">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg font-medium">Starter</CardTitle>
                <CardDescription>För dig som hyr ut 1-3 objekt</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">149 kr</span>
                  <span className="text-muted-foreground">/mån</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">Starta gratis test</Button>
                <Separator />
                <ul className="space-y-3">
                  {[
                    'Upp till 3 fastigheter',
                    'Egna avtalsmallar',
                    'E-postsignering',
                    'Grundläggande rapporter',
                    'E-postsupport'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Pro Plan - Highlighted */}
            <Card className="relative border-2 border-primary shadow-xl scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="shadow-lg">Mest populär</Badge>
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg font-medium">Professional</CardTitle>
                <CardDescription>För aktiva hyresvärdar</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">349 kr</span>
                  <span className="text-muted-foreground">/mån</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full shadow-lg shadow-primary/25">Starta gratis test</Button>
                <Separator />
                <ul className="space-y-3">
                  {[
                    'Upp till 25 fastigheter',
                    'Allt i Starter',
                    'BankID-signering',
                    'Hyresgästportal',
                    'Automatiska påminnelser',
                    'Avancerade rapporter',
                    'API-integrationer',
                    'Prioriterad support'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="relative border-2">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg font-medium">Enterprise</CardTitle>
                <CardDescription>För större fastighetsbolag</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">Anpassat</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">Kontakta oss</Button>
                <Separator />
                <ul className="space-y-3">
                  {[
                    'Obegränsat antal fastigheter',
                    'Allt i Professional',
                    'Dedikerad kontaktperson',
                    'Custom integrationer',
                    'SLA-avtal',
                    'On-premise möjlighet',
                    'Utbildning & onboarding'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Alla priser exklusive moms. 14 dagars gratis provperiod på alla planer.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32 bg-muted/30 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="secondary" className="mb-4">Kundröster</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">
              Älskat av hyresvärdar
            </h2>
            <p className="text-lg text-muted-foreground">
              Se vad våra kunder säger om HyresPortal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                quote: 'Sparar mig timmar varje månad! Istället för att manuellt fylla i avtal kan jag nu skicka dem automatiskt. Helt fantastiskt verktyg.',
                name: 'Anna Svensson',
                role: 'Hyr ut 3 lägenheter i Stockholm',
                avatar: 'AS'
              },
              {
                quote: 'Äntligen ett svenskt verktyg som förstår våra behov. Kan använda mina egna mallar utan att behöva anlita jurist igen. Rekommenderar starkt!',
                name: 'Erik Andersson',
                role: 'Fastighetsägare i Göteborg',
                avatar: 'EA'
              },
              {
                quote: 'Supernöjd! Fick igång systemet på 10 minuter och skickade mitt första avtal samma dag. Supporten har varit otroligt hjälpsam.',
                name: 'Maria Johansson',
                role: 'Hyr ut sommarstugan',
                avatar: 'MJ'
              }
            ].map((testimonial) => (
              <Card key={testimonial.name} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-chart-4 text-chart-4" />
                    ))}
                  </div>
                  <blockquote className="text-sm leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4">
              Vanliga frågor
            </h2>
            <p className="text-lg text-muted-foreground">
              Har du fler frågor? Kontakta oss gärna.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  q: 'Kan jag använda mina egna avtalsmallar?',
                  a: 'Ja! Det är precis det som gör HyresPortal unikt. Ladda upp ditt befintliga Word- eller PDF-avtal och markera variabler med enkla taggar. Du behåller ditt godkända juridiska ramverk.'
                },
                {
                  q: 'Är signeringarna juridiskt bindande?',
                  a: 'Ja, våra elektroniska signaturer uppfyller kraven i eIDAS-förordningen och är juridiskt bindande i Sverige och hela EU. Med BankID-signering får du dessutom stark autentisering.'
                },
                {
                  q: 'Hur säker är min data?',
                  a: 'All data krypteras i vila och under överföring. Vi lagrar data i Sverige på certifierade datacenter. Vi är fullt GDPR-compliant med regelbundna säkerhetsrevisioner.'
                },
                {
                  q: 'Kan jag integrera med mitt bokföringssystem?',
                  a: 'Ja, vi har färdiga integrationer med Fortnox, Visma, Björn Lundén och flera andra. På Professional-planen och uppåt kan du även använda vårt API för egna integrationer.'
                },
                {
                  q: 'Vad händer efter provperioden?',
                  a: 'Du väljer själv om du vill fortsätta. Inget kreditkort krävs för att starta provperioden och vi debiterar dig inte automatiskt. Din data sparas i 30 dagar efter provperioden ifall du ändrar dig.'
                },
                {
                  q: 'Erbjuder ni support på svenska?',
                  a: 'Absolut! Hela vårt team sitter i Sverige och all support sker på svenska. Professional-kunder får dessutom prioriterad support med kortare svarstider.'
                }
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b">
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-medium">{item.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-chart-1" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] opacity-10" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6">
              Redo att automatisera din fastighetsförvaltning?
            </h2>
            <p className="text-lg mb-10 text-primary-foreground/90">
              Gå med över 1 200 svenska hyresvärdar som redan sparat hundratals timmar
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8 h-12 text-base shadow-xl">
                Starta gratis idag
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-12 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Boka en demo
              </Button>
            </div>
            <p className="text-sm text-primary-foreground/80">
              14 dagar gratis • Inget kreditkort • Avsluta när som helst
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold">HyresPortal</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Sveriges modernaste plattform för hyresadministration. Byggt med kärlek i Stockholm.
              </p>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">GDPR</Badge>
                <Badge variant="outline" className="text-xs">BankID</Badge>
                <Badge variant="outline" className="text-xs">SSL</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produkt</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {['Funktioner', 'Priser', 'Integrationer', 'Dokumentation', 'API'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Företag</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {['Om oss', 'Blogg', 'Karriär', 'Press', 'Kontakt'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Juridiskt</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {['Integritetspolicy', 'Användarvillkor', 'Cookiepolicy', 'GDPR', 'Säkerhet'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="mb-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 HyresPortal AB. Alla rättigheter förbehållna.
            </p>
            <div className="flex items-center gap-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a key={social} href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}