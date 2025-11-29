import { SEOHead } from "@/components/layout/SEOHead";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export default function Courts() {
  return (
    <>
      <SEOHead
        title="Padel Teren i Teretana - District Padel Club | Sremska Mitrovica"
        description="Vrhunski padel teren i moderna privatna teretana u Sremskoj Mitrovici. Profesionalna oprema, stakleni zidovi, 90-minutni ekskluzivni treninzi."
        keywords="padel teren srbija, teretana sremska mitrovica, privatna teretana, padel court, gym"
        canonicalUrl="https://districtpadelclub.com/courts"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold">
              <span className="gradient-text">Naši Prostori</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Vrhunski padel teren i moderna teretana dizajnirani prema najvišim standardima
            </p>
          </div>

          <section className="glass rounded-lg p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-3xl font-bold">Padel Teren</h2>
              <Badge className="bg-primary text-primary-foreground px-4 py-2 text-lg">
                Profesionalni Teren
              </Badge>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Padel je sport koji kombinuje elemente tenisa, skvosa i tenisa na zidu. Stvarajući tako prvi padel teren gde se uobičajeno igra u dublovima, što doprinosi opuštenoj i prijateljskoj atmosferi. Pravila su laka za savladati, a teren je manji od teniskog, što olakšava igru.
            </p>            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/40 p-6 space-y-4">
                <h3 className="text-xl font-bold text-primary">Dimenzije</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Dužina: 20 metara</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Širina: 10 metara</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Visina staklenih zidova: 3 metra</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Ukupna visina plafona: 7 metara</span>
                  </li>
                </ul>
              </Card>

              <Card className="bg-card/40 p-6 space-y-4">
                <h3 className="text-xl font-bold text-primary">Podloga i Površina</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Profesionalna veštačka trava</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Anti-slip površina</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Optimalna apsorpcija udara</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Pravilna drenažna podloga</span>
                  </li>
                </ul>
              </Card>

              <Card className="bg-card/40 p-6 space-y-4">
                <h3 className="text-xl font-bold text-primary">Zidovi i Ograđivanje</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>12mm kaljeno staklo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Metalna mreža u gornjim zonama</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Robusna čelična konstrukcija</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Dvostruka zaštitna vrata</span>
                  </li>
                </ul>
              </Card>

              <Card className="bg-card/40 p-6 space-y-4">
                <h3 className="text-xl font-bold text-primary">Osvetljenje</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>LED reflektori nove generacije</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>400+ lux osvetljenost</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Bez zasenjivanja i refleksija</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Idealno za večernje mečeve</span>
                  </li>
                </ul>
              </Card>
            </div>
          </section>

          <section className="glass rounded-lg p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-3xl font-bold">Teretana</h2>
              <Badge className="bg-secondary text-secondary-foreground px-4 py-2 text-lg">
                Privatni Treninzi
              </Badge>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Zašto je District teretana idealno mesto za tvoj trening? Zato što smo možda jedini koji nudi potpunu privatnost - 90 minuta treninga u prostoru gde nema guzve i gde ti niko neće zauzeti spravu. Ovde imaš sve na svom mestu: kvalitetne sprave koje omogućavaju optimalan trening, a ti sam biraš muziku koja će te motivisati tokom celog procesa. Sve usluge koje pratiš, od personalnog pristupa do ekskluzivnosti prostora, doprinose stvaranju savršenog ambijenta za tvoje fitness ciljeve.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/40 p-6 space-y-4">
                <h3 className="text-xl font-bold text-primary">Ekskluzivnost</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>90 minuta privatnog treninga</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Potpuna privatnost bez gužve</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Tvoja muzika, tvoja pravila</span>
                  </li>
                </ul>
              </Card>

              <Card className="bg-card/40 p-6 space-y-4">
                <h3 className="text-xl font-bold text-primary">Oprema</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Kvalitetne profesionalne sprave</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Optimalan trening za sve nivoe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Personalni pristup</span>
                  </li>
                </ul>
              </Card>
            </div>
          </section>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Dodatne Pogodnosti</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card/20 p-4 text-center">
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="font-semibold mb-1">Gledališta</h3>
                <p className="text-sm text-muted-foreground">Klimatizovani prostori za gledaoce</p>
              </Card>
              <Card className="bg-card/20 p-4 text-center">
                <div className="text-4xl mb-2">🚿</div>
                <h3 className="font-semibold mb-1">Svlačionice</h3>
                <p className="text-sm text-muted-foreground">Moderne svlačionice sa tuševima</p>
              </Card>
              <Card className="bg-card/20 p-4 text-center">
                <div className="text-4xl mb-2">☕</div>
                <h3 className="font-semibold mb-1">Lounge zona</h3>
                <p className="text-sm text-muted-foreground">Opuštanje posle meča</p>
              </Card>
              <Card className="bg-card/20 p-4 text-center">
                <div className="text-4xl mb-2">🅿️</div>
                <h3 className="font-semibold mb-1">Privatni Parking</h3>
                <p className="text-sm text-muted-foreground">Preko 20 parking mesta</p>
              </Card>
              <Card className="bg-card/20 p-4 text-center">
                <div className="text-4xl mb-2">🛍️</div>
                <h3 className="font-semibold mb-1">Pro Shop</h3>
                <p className="text-sm text-muted-foreground">Oprema i rekviziti</p>
              </Card>
              <Card className="bg-card/20 p-4 text-center">
                <div className="text-4xl mb-2">📱</div>
                <h3 className="font-semibold mb-1">WiFi</h3>
                <p className="text-sm text-muted-foreground">Besplatan internet</p>
              </Card>
            </div>
          </section>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Radno Vreme</h2>
            <div className="space-y-2 text-lg">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ponedeljak - Petak:</span>
                <span className="font-semibold">07:00 - 23:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subota - Nedelja:</span>
                <span className="font-semibold">08:00 - 23:00</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
