import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Users, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEOHead } from "@/components/layout/SEOHead";
import { useTheme } from "next-themes";
import logo from "@/assets/district-logo.png";
import logoBlack from "@/assets/district_padel_black.png";
import heroBackground from "@/assets/hero-pozadina_1.jpg";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use black logo for light mode, regular logo for dark mode
  const currentLogo = mounted && theme === "light" ? logoBlack : logo;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "District Padel Club",
    description: "Najmoderniji padel centar u Srbiji - Vrhunski teren, liga i turniri",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Fruškogorska 71",
      addressLocality: "Sremska Mitrovica",
      addressCountry: "RS",
    },
    sport: "Padel",
    url: "https://districtpadelclub.com",
  };

  return (
    <>
      <SEOHead
        title="District Padel Club - Najbolji Padel Centar u Srbiji | Sremska Mitrovica"
        description="District Padel Club - vrhunski padel teren i privatna teretana u Sremskoj Mitrovici. Naša liga, turniri i moderna oprema. Rezervišite teren danas!"
        keywords="padel srbija, padel sremska mitrovica, padel klub srbija, padel teren srbija, padel liga srbija, district padel"
        canonicalUrl="https://districtpadelclub.com/"
        structuredData={structuredData}
      />

      <main>
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-30 dark:opacity-20" />
          <div
            className="absolute inset-0 bg-cover bg-center dark:opacity-20 opacity-40"
            style={{ backgroundImage: `url(${heroBackground})` }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="flex justify-center mb-8">
                <img src={currentLogo} alt="District Padel Club" className="w-full max-w-2xl h-auto" />
              </div>
              <p className="text-xl md:text-2xl text-foreground">
                Najmoderniji padel centar u Srbiji. Vrhunski teren, naša liga i nezaboravna iskustva.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Button size="lg" className="gradient-hero text-primary-foreground" asChild>
                  <Link to="/contact">
                    Rezerviši teren <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary" asChild>
                  <Link to="/league">Pogledaj ligu</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass p-8 hover:glow-primary transition-all">
                <Trophy className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Naša Liga</h3>
                <p className="text-muted-foreground">
                  Pridružite se našoj prijateljskoj ligi i takmičite se protiv sjajnih lokalnih timova.
                </p>
                <Button variant="link" className="mt-4 text-primary p-0" asChild>
                  <Link to="/padel-liga-srbija">Saznaj više →</Link>
                </Button>
              </Card>

              <Card className="glass p-8 hover:glow-secondary transition-all">
                <Users className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Vrhunski Teren</h3>
                <p className="text-muted-foreground">
                  Moderan teren sa staklenim zidovima, profesionalnim osvetljenjem i perfektnom podlogom.
                </p>
                <Button variant="link" className="mt-4 text-secondary p-0" asChild>
                  <Link to="/courts">Pogledaj teren →</Link>
                </Button>
              </Card>

              <Card className="glass p-8 hover:glow-accent transition-all">
                <Calendar className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-2xl font-bold mb-2">Laka Rezervacija</h3>
                <p className="text-muted-foreground">
                  Rezervišite termin online za nekoliko minuta. Dostupno 7 dana u nedelji.
                </p>
                <Link 
                  to="/contact" 
                  className="mt-4 inline-flex items-center link-accent underline-offset-4 hover:underline transition-colors"
                >
                  Kontaktiraj nas →
                </Link>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">Šta je Padel?</h2>
              <p className="text-lg text-muted-foreground">
                Padel je sport koji kombinuje elemente tenisa i skvošа. Igra se u paru na terenu okruženom staklenim zidovima. 
                Brz, dinamičan i neverovatno zabavan - padel je sport koji osvaja Srbiju!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                <div className="text-left p-6 rounded-lg bg-card/40 border border-border/50">
                  <h3 className="font-semibold text-xl mb-2">📏 Dimenzije Terena</h3>
                  <p className="text-muted-foreground">10m x 20m sa staklenim zidovima visine 3m</p>
                </div>
                <div className="text-left p-6 rounded-lg bg-card/40 border border-border/50">
                  <h3 className="font-semibold text-xl mb-2">👥 Broj Igrača</h3>
                  <p className="text-muted-foreground">4 igrača (2 vs 2) - timski sport</p>
                </div>
                <div className="text-left p-6 rounded-lg bg-card/40 border border-border/50">
                  <h3 className="font-semibold text-xl mb-2">🎾 Pravila Bodovanja</h3>
                  <p className="text-muted-foreground">Ista kao u tenisu: 15, 30, 40, game</p>
                </div>
                <div className="text-left p-6 rounded-lg bg-card/40 border border-border/50">
                  <h3 className="font-semibold text-xl mb-2">⏱️ Trajanje Meča</h3>
                  <p className="text-muted-foreground">Prosečno 60-90 minuta (best of 3 seta)</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
