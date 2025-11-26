import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEOHead } from "@/components/layout/SEOHead";
import { Trophy, Users, TrendingUp, Target } from "lucide-react";

export default function PadelLigaSrbija() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: "District Padel Liga",
    description: "Naša lokalna padel liga u Srbiji",
    location: {
      "@type": "SportsActivityLocation",
      name: "District Padel Club",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Fruškogorska 71",
        addressLocality: "Sremska Mitrovica",
        addressCountry: "RS",
      },
    },
    sport: "Padel",
    organizer: {
      "@type": "Organization",
      name: "District Padel Club",
      url: "https://districtpadel.rs",
    },
  };

  return (
    <>
      <SEOHead
        title="Padel Liga Srbija - District Padel Liga | Naša Lokalna Liga"
        description="Pridružite se najuzbudljivijoj padel ligi u Srbiji! District Padel Liga - naša lokalna liga sa praćenjem statistika, timovima i rangiranjem."
        keywords="padel liga srbija, padel turnir, padel takmičenje, district padel liga, padel league serbia"
        canonicalUrl="https://districtpadel.rs/padel-liga-srbija"
        structuredData={structuredData}
      />

      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h1 className="text-5xl font-bold">
              <span className="gradient-text">
                Padel Liga Srbija
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              District Padel Liga - Naša lokalna zajednica koja spaja najbolje rekreativce
            </p>
          </header>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">O District Padel Ligi</h2>
            <p className="text-muted-foreground leading-relaxed">
              District Padel Liga je lokalna padel liga osnovana 2024. godine. 
              Liga predstavlja prijateljsko takmičenje koje okuplja ljubitelje padela iz Sremske Mitrovice i okoline. 
              Sa ciljem popularizacije sporta i razvoja zajednice, liga pruža platformu za sve entuzijaste padela 
              da pokažu svoje veštine i takmiče se u prijateljskoj atmosferi.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Liga se održava u objektima District Padel Club-a u Sremskoj Mitrovici, 
              sa našim terenom i kompletnim praćenjem statistika.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass p-6">
              <Trophy className="w-10 h-10 text-primary mb-3" />
              <h3 className="font-bold text-xl mb-2">Organizacija Lige</h3>
              <p className="text-muted-foreground text-sm">
                Detaljno praćenje rezultata, statistika i rangiranja. Naš sudijski tim i moderna oprema.
              </p>
            </Card>
            <Card className="glass p-6">
              <Users className="w-10 h-10 text-secondary mb-3" />
              <h3 className="font-bold text-xl mb-2">Timski Duh</h3>
              <p className="text-muted-foreground text-sm">
                Timovi od 2-3 igrača. Izgradite hemiju sa partnerom i osvojite ligu zajedno!
              </p>
            </Card>
            <Card className="glass p-6">
              <TrendingUp className="w-10 h-10 text-accent mb-3" />
              <h3 className="font-bold text-xl mb-2">Progresija</h3>
              <p className="text-muted-foreground text-sm">
                Pratite svoj napredak kroz detaljne statistike i rangiranja. Postanite bolji igrač!
              </p>
            </Card>
            <Card className="glass p-6">
              <Target className="w-10 h-10 text-primary mb-3" />
              <h3 className="font-bold text-xl mb-2">Fair Play</h3>
              <p className="text-muted-foreground text-sm">
                Poštovanje protivnika, fer igra i sportski duh su osnova naše lige.
              </p>
            </Card>
          </div>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Format Takmičenja</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Grupna Faza</h3>
                <p className="text-muted-foreground">
                  Liga se igra u 2 grupe (Grupa A i Grupa B) sa po 10 timova. Svaki tim igra protiv svakog u svojoj grupi. 
                  Ukupno 9 kola grupne faze.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Sistem Bodovanja</h3>
                <ul className="text-muted-foreground space-y-1 ml-4">
                  <li>• Pobeda: 3 boda</li>
                  <li>• Poraz: 0 bodova</li>
                  <li>• Ranking kriterijumi: bodovi → pobede → set razlika → gem razlika</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Format Mečeva</h3>
                <p className="text-muted-foreground">
                  Svi mečevi se igraju na najbolje od 3 seta. Prvi dva seta do 6 gemova sa tie-break-om na 6:6. 
                  Treći set se igra kao super tie-break do 10 poena.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Završnica</h3>
                <p className="text-muted-foreground">
                  Prva četiri tima iz svake grupe prolaze u playoff fazu. Najbolji timovi se takmiče u polufinalima i finalu za titulu šampiona!
                </p>
              </div>
            </div>
          </section>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Nagrade</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500/50 p-6 text-center">
                <div className="text-5xl mb-2">🥇</div>
                <h3 className="text-2xl font-bold mb-2">1. Mesto</h3>
                <div className="text-3xl font-bold text-primary mb-1">30.000 RSD</div>
                <p className="text-sm text-muted-foreground">Šampionski trofej</p>
              </Card>
              <Card className="bg-gradient-to-br from-gray-400/20 to-gray-500/20 border-2 border-gray-400/50 p-6 text-center">
                <div className="text-5xl mb-2">🥈</div>
                <h3 className="text-2xl font-bold mb-2">2. Mesto</h3>
                <div className="text-3xl font-bold text-primary mb-1">20.000 RSD</div>
                <p className="text-sm text-muted-foreground">Srebrna medalja</p>
              </Card>
              <Card className="bg-gradient-to-br from-orange-600/20 to-orange-700/20 border-2 border-orange-600/50 p-6 text-center">
                <div className="text-5xl mb-2">🥉</div>
                <h3 className="text-2xl font-bold mb-2">3. Mesto</h3>
                <div className="text-3xl font-bold text-primary mb-1">10.000 RSD</div>
                <p className="text-sm text-muted-foreground">Bronzana medalja</p>
              </Card>
            </div>
          </section>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Trenutna Sezona</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <div className="text-3xl font-bold text-primary">20 Timova</div>
                  <div className="text-sm text-muted-foreground">Takmiči se za titulu</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">40+ Igrača</div>
                  <div className="text-sm text-muted-foreground">Aktivnih učesnika</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">9+ Kola</div>
                  <div className="text-sm text-muted-foreground">Grupna faza + playoff</div>
                </div>
              </div>
              <div className="pt-4">
                <Button size="lg" className="w-full gradient-hero text-primary-foreground" asChild>
                  <Link to="/league">Pogledaj trenutnu tabelu →</Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Kako Se Prijaviti?</h2>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Formirajte Tim</h3>
                  <p className="text-muted-foreground">
                    Potrebno je 2-3 igrača (2 glavna + 1 rezerva opciono). Smislite kreativno ime za svoj tim!
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Kontaktirajte Nas</h3>
                  <p className="text-muted-foreground">
                  Pozovite nas na +381 69 1999151, pošaljite poruku na Instagram (@district_padelclub), ili kontaktirajte nas putem email-a sa imenima igrača i kontakt informacijama.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Dobijte Potvrdu</h3>
                  <p className="text-muted-foreground">
                    Naš tim će vam poslati potvrdu prijave i detalje o rasporedu mečeva.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Počnite Sa Igrom!</h3>
                  <p className="text-muted-foreground">
                    Dođite na prvi meč i uživajte u najuzbudljivijem padel takmičenju u Srbiji!
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Prednosti Učešća u Ligi</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Redovna takmičenja</strong> - 
                  Zakazani mečevi svake nedelje tokom sezone
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Detaljno praćenje</strong> - 
                  Sve statistike i rezultati dostupni online
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Druženje i networking</strong> - 
                  Upoznajte nove ljude koji dele vašu strast prema padelu
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Poboljšajte igru</strong> - 
                  Takmičite se protiv različitih stilova igranja
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Nagrade i priznanja</strong> - 
                  Novčane nagrade: 30.000 RSD za 1. mesto, 20.000 RSD za 2. mesto, 10.000 RSD za 3. mesto
                </span>
              </li>
            </ul>
          </section>

          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Spremni Za Izazov?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pridružite se District Padel Ligi i postanite deo najuzbudljivijeg padel takmičenja u Srbiji. 
              Nove sezone počinju svaka 3 meseca!
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button size="lg" className="gradient-hero text-primary-foreground" asChild>
                <Link to="/contact">Prijavite tim</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/league">Pogledaj tabelu</Link>
              </Button>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
