import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEOHead } from "@/components/layout/SEOHead";
import { MapPin, Clock, Trophy, Users } from "lucide-react";

export default function PadelSremskaMitrovica() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: "District Padel Club Sremska Mitrovica",
    description: "Najbolji padel centar u Sremskoj Mitrovici sa vrhunskim terenom i privatnom teretanom",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Fruškogorska 71",
      addressLocality: "Sremska Mitrovica",
      addressCountry: "RS",
    },
    sport: "Padel",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "23:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "08:00",
        closes: "23:00",
      },
    ],
  };

  return (
    <>
      <SEOHead
        title="Padel Sremska Mitrovica - District Padel Club | Najbolji Padel Tereni"
        description="District Padel Club - vodeći padel centar u Sremskoj Mitrovici. Jedan vrhunski teren, naša liga i privatna teretana. Rezervišite danas!"
        keywords="padel sremska mitrovica, padel klub sremska mitrovica, padel teren sremska mitrovica, district padel"
        canonicalUrl="https://districtpadelclub.com/padel-sremska-mitrovica"
        structuredData={structuredData}
      />

      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h1 className="text-5xl font-bold">
              <span className="gradient-text">
                Padel u Sremskoj Mitrovici
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              District Padel Club - Vaša destinacija za vrhunski padel
            </p>
          </header>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Dobrodošli u District Padel Club</h2>
            <p className="text-muted-foreground leading-relaxed">
              District Padel Club je prvi i jedini profesionalni padel centar u Sremskoj Mitrovici. 
              Otvoren 2024. godine, naš objekat predstavlja najmodernije sportske kapacitete u gradu, 
              projektovane prema najvišim međunarodnim standardima za padel.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nalazimo se u srcu Sremske Mitrovice, lako dostupni svim stanovnicima grada i okoline. 
              Sa jednim vrhunskim indoor terenom, privatnom teretanom i profesionalnim trenerom, 
              pružamo kompletno iskustvo padel sporta.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Lokacija</h3>
                <p className="text-muted-foreground text-sm">
                  Fruškogorska 71<br />
                  Sremska Mitrovica<br />
                  Centralno i lako dostupno
                </p>
              </div>
            </Card>

            <Card className="glass p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Radno Vreme</h3>
                <p className="text-muted-foreground text-sm">
                  Pon-Pet: 07:00 - 23:00<br />
                  Sub-Ned: 08:00 - 23:00<br />
                  Otvoreni 365 dana godišnje
                </p>
              </div>
            </Card>

            <Card className="glass p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Naša Liga</h3>
                <p className="text-muted-foreground text-sm">
                  Organizovano lokalno takmičenje<br />
                  2 grupe po 10 timova<br />
                  Praćenje statistika i rangiranja
                </p>
              </div>
            </Card>

            <Card className="glass p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2">Zajednica</h3>
                <p className="text-muted-foreground text-sm">
                  Aktivna zajednica igrača<br />
                  Svi uzrasti i nivoi<br />
                  Prijateljska atmosfera
                </p>
              </div>
            </Card>
          </div>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Naša Oprema i Tereni</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Profesionalni Teren</h3>
                <p className="text-muted-foreground">
                  Teren je opremljen 12mm kaljenim staklom, vrhunskom veštačkom travom i profesionalnim LED osvetljenjem. 
                  Dimenzije 10m x 20m prema FIP standardima.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Premium Gledališta</h3>
                <p className="text-muted-foreground">
                  Klimatizovani prostori za gledaoce sa odličnom vidljivošću našeg terena. Idealno za praćenje mečeva i turnira.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Svlačionice i Tuš kabine</h3>
                <p className="text-muted-foreground">
                  Prostrane, moderne svlačionice sa tuš kabinama, ormarićima i svim potrebnim pogodnostima.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Lounge Zona</h3>
                <p className="text-muted-foreground">
                  Opuštajuća zona sa kafićem gde možete uživati nakon meča i družiti se sa drugim članovima.
                </p>
              </div>
            </div>
          </section>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Zašto District Padel u Sremskoj Mitrovici?</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Jedini profesionalni padel centar u gradu</strong> - 
                  Kompletna ponuda usluga na jednom mestu
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Centralna lokacija</strong> - 
                  Lako dostupni svim delovima grada, besplatan parking
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Fleksibilni termini</strong> - 
                  Od ranog jutra do kasno uveče, 7 dana u nedelji
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Konkurentne cene</strong> - 
                  Najbolji odnos cene i kvaliteta u regionu
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-xl">✓</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Profesionalni trener</strong> - 
                  Sertifikovani instruktor dostupan za sve nivoe
                </span>
              </li>
            </ul>
          </section>

          <section className="glass rounded-lg p-8 space-y-4 text-center">
            <h2 className="text-3xl font-bold">Postanite Deo Naše Zajednice</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bilo da ste početnik ili iskusan igrač, District Padel Club je pravo mesto za vas. 
              Rezervišite svoj prvi termin danas i otkrijte zašto je padel najbrže rastuća sportska disciplina!
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button size="lg" className="gradient-hero text-primary-foreground" asChild>
                <Link to="/contact">Rezerviši teren</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/pricing">Pogledaj cenovnik</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/league">Pridruži se ligi</Link>
              </Button>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
