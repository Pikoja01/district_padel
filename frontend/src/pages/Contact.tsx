import { SEOHead } from "@/components/layout/SEOHead";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";

export default function Contact() {
  return (
    <>
      <SEOHead
        title="Kontakt - District Padel Club | Rezervacija i Informacije"
        description="Kontaktirajte District Padel Club za rezervacije, informacije i upit e. Nalazimo se u Sremskoj Mitrovici. Pozovite nas danas!"
        keywords="kontakt padel, rezervacija padel, padel srbija kontakt, district padel kontakt, sremska mitrovica padel"
        canonicalUrl="https://districtpadel.rs/contact"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold">
              <span className="gradient-text">Kontakt</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Stupite u kontakt sa nama i rezervišite svoj termin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Adresa</h3>
                  <p className="text-muted-foreground">
                    Fruškogorska 71<br />
                    Sremska Mitrovica<br />
                    Srbija
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Telefon</h3>
                  <p className="text-muted-foreground">
                    +381 69 1999151<br />
                    Pozovite za rezervaciju
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Email</h3>
                  <p className="text-muted-foreground">
                    districtmedialtd@gmail.com
                  </p>
                </div>
              </div>
            </Card>

            <Card className="glass p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">Radno Vreme</h3>
                  <p className="text-muted-foreground">
                    Pon - Pet: 07:00 - 23:00<br />
                    Sub - Ned: 08:00 - 23:00<br />
                    Otvoreni 7 dana u nedelji
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <section className="glass rounded-lg p-8 space-y-6">
            <h2 className="text-3xl font-bold text-center">Društvene Mreže</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass p-6 text-center hover:bg-primary/10 transition-colors">
                <a 
                  href="https://www.instagram.com/district_padelclub" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center">
                    <Instagram className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Instagram</h3>
                  <p className="text-sm text-muted-foreground">@district_padelclub</p>
                </a>
              </Card>

              <Card className="glass p-6 text-center hover:bg-primary/10 transition-colors">
                <a 
                  href="https://www.facebook.com/profile.php?id=61582273652583" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                    <Facebook className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Facebook</h3>
                  <p className="text-sm text-muted-foreground">District Padel Club</p>
                </a>
              </Card>

              <Card className="glass p-6 text-center hover:bg-primary/10 transition-colors">
                <a 
                  href="https://www.tiktok.com/@district.padel.club" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg">TikTok</h3>
                  <p className="text-sm text-muted-foreground">@district.padel.club</p>
                </a>
              </Card>
            </div>
            <p className="text-center text-muted-foreground text-sm mt-4">
              Pratite nas za najnovije vesti, rezervišite teren putem Instagrama (@district_padelclub), ili sačekajte našu aplikaciju koja uskoro stiže!
            </p>
          </section>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Česta Pitanja</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Kako rezervisati teren?</h3>
                <p className="text-muted-foreground">
                  Rezervacije možete izvršiti pozivom na telefon +381 69 1999151, putem Instagrama (@districtpadel), ili putem email-a. 
                  Takođe, uskoro stiže naša mobilna aplikacija koja će omogućiti još lakše rezervisanje termina!
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Mogu li doći bez rezervacije?</h3>
                <p className="text-muted-foreground">
                  Preporučujemo rezervaciju unapred, ali možete proveriti dostupnost termina i na licu mesta.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Da li nudite opremu za iznajmljivanje?</h3>
                <p className="text-muted-foreground">
                  Da! Rakete i lopte možete iznajmiti za 350 RSD po terminu.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Kako se prijaviti za ligu?</h3>
                <p className="text-muted-foreground">
                  Pozovite nas na +381 69 1999151 i dobićete sve informacije o prijavi za narednu sezonu.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

