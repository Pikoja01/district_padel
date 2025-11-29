import { SEOHead } from "@/components/layout/SEOHead";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Pricing() {
  return (
    <>
      <SEOHead
        title="Cenovnik - District Padel Club | Cene Terena i Teretane"
        description="Pogledajte cenovnik District Padel Club-a. Povoljni termini za padel, paketi za teretanu i iznajmljivanje opreme. Najbolje cene u Srbiji."
        keywords="padel cene, cenovnik padel, iznajmljivanje terena cena, teretana cena, padel srbija cene"
        canonicalUrl="https://districtpadelclub.com/pricing"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold">
              <span className="gradient-text">Cenovnik</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Transparentne cene za padel i teretanu
            </p>
          </div>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Padel Teren</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">60 Minuta</h3>
                  <p className="text-sm text-muted-foreground">Idealno za rekreativce</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Do 16h:</span>
                    <span className="text-3xl font-bold text-primary">2.200 RSD</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Od 16h:</span>
                    <span className="text-3xl font-bold text-primary">2.500 RSD</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Najpovoljnija opcija</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Savršeno za 1 set</span>
                  </li>
                </ul>
              </Card>

              <Card className="glass p-8 space-y-6 border-2 border-primary relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold">
                  NAJPOPULARNIJE
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">90 Minuta</h3>
                  <p className="text-sm text-muted-foreground">Optimalno vreme za igru</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Do 16h:</span>
                    <span className="text-3xl font-bold text-primary">3.000 RSD</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Od 16h:</span>
                    <span className="text-3xl font-bold text-primary">3.600 RSD</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Najbolja vrednost</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Dovoljno za 2 seta</span>
                  </li>
                </ul>
              </Card>

              <Card className="glass p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">120 Minuta</h3>
                  <p className="text-sm text-muted-foreground">Za prave entuzijaste</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Do 16h:</span>
                    <span className="text-3xl font-bold text-primary">3.600 RSD</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Od 16h:</span>
                    <span className="text-3xl font-bold text-primary">4.000 RSD</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Ceo trening blok</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Do 3 seta</span>
                  </li>
                </ul>
              </Card>
            </div>
          </section>

          <section className="glass rounded-lg p-8 space-y-6">
            <h2 className="text-3xl font-bold text-center">Teretana - Paketi</h2>
            <p className="text-center text-muted-foreground">
              Privatni 90-minutni treninzi u potpuno ekskluzivnom prostoru
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card/40 p-6 space-y-4 text-center">
                <h3 className="text-xl font-bold text-secondary">1 Termin</h3>
                <div className="text-4xl font-bold text-primary">600 RSD</div>
                <p className="text-sm text-muted-foreground">90 minuta privatnog treninga</p>
              </Card>

              <Card className="bg-card/40 p-6 space-y-4 text-center">
                <h3 className="text-xl font-bold text-secondary">8 Termina</h3>
                <div className="text-4xl font-bold text-primary">4.000 RSD</div>
                <p className="text-sm text-muted-foreground">500 RSD po terminu</p>
              </Card>

              <Card className="bg-card/40 p-6 space-y-4 text-center border-2 border-primary relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                  NAJPOPULARNIJE
                </div>
                <h3 className="text-xl font-bold text-secondary">12 Termina</h3>
                <div className="text-4xl font-bold text-primary">6.000 RSD</div>
                <p className="text-sm text-muted-foreground">500 RSD po terminu</p>
              </Card>

              <Card className="bg-card/40 p-6 space-y-4 text-center">
                <h3 className="text-xl font-bold text-secondary">30 Termina</h3>
                <div className="text-4xl font-bold text-primary">9.000 RSD</div>
                <p className="text-sm text-muted-foreground">300 RSD po terminu</p>
              </Card>
            </div>
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                *Trenutno za više informacija kontaktirajte nas
              </p>
            </div>
          </section>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Oprema i Dodaci</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card/20 p-6">
                <h3 className="font-bold text-lg mb-2">Reket</h3>
                <div className="text-3xl font-bold text-primary mb-2">350 RSD</div>
                <p className="text-sm text-muted-foreground">Iznajmljivanje reketa po terminu</p>
              </Card>
              <Card className="bg-card/20 p-6">
                <h3 className="font-bold text-lg mb-2">Loptice</h3>
                <div className="text-3xl font-bold text-primary mb-2">1.200 RSD</div>
                <p className="text-sm text-muted-foreground">Prodaja - nova kutija loptica</p>
              </Card>
            </div>
          </section>

          <div className="text-center">
            <Button size="lg" className="gradient-hero text-primary-foreground" asChild>
              <Link to="/contact">Kontaktirajte nas za rezervaciju</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
