import { SEOHead } from "@/components/layout/SEOHead";
import { Card } from "@/components/ui/card";
import { Trophy, Heart, Target, Zap } from "lucide-react";

export default function About() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "District Padel Club",
    description: "Najmoderniji padel centar u Srbiji",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Fruškogorska 71",
      addressLocality: "Sremska Mitrovica",
      addressCountry: "RS",
    },
  };

  return (
    <>
      <SEOHead
        title="O nama - District Padel Club | Najbolji Padel Klub u Srbiji"
        description="Upoznajte District Padel Club - vodeći padel centar u Srbiji. Naša misija, vrednosti i vizija. Pridružite se padel revoluciji!"
        keywords="o nama, padel klub srbija, district padel, padel centar, padel zajednica"
        canonicalUrl="https://districtpadelclub.com/about"
        structuredData={structuredData}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold">
              <span className="gradient-text">O nama</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              District Padel Club je prvi profesionalni padel centar u Sremskoj Mitrovici i jedan od vodećih u Srbiji.
            </p>
          </div>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Naša Priča</h2>
            <p className="text-muted-foreground leading-relaxed">
              Osnovani 2024. godine, District Padel Club nastao je iz strasti prema padelu i želje da donesemo ovaj neverovatno 
              dinamičan sport u srce Srbije. Počeli smo sa vizijom stvaranja prostora gde se ljudi okupljaju, takmiče se i stvaraju 
              nezaboravna iskustva.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Danas smo ponosni dom naše padel lige i modernog terena svetske klase. 
              Naši objekti projektovani su prema najvišim međunarodnim standardima, sa vrhunskim staklenim zidovima, profesionalnim 
              osvetljenjem i perfektnim terenskim podlogama.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass p-6 space-y-3">
              <Trophy className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">Naša Misija</h3>
              <p className="text-muted-foreground">
                Popularizacija padela u Srbiji kroz vrhunske objekte, profesionalnu organizaciju i izgradnju jake zajednice ljubitelja ovog sporta.
              </p>
            </Card>

            <Card className="glass p-6 space-y-3">
              <Target className="w-10 h-10 text-secondary" />
              <h3 className="text-xl font-bold">Naša Vizija</h3>
              <p className="text-muted-foreground">
                Postati vodeći padel centar u regionu i platforma koja će otkriti i razviti buduće šampione padela iz Srbije.
              </p>
            </Card>

            <Card className="glass p-6 space-y-3">
              <Heart className="w-10 h-10 text-accent" />
              <h3 className="text-xl font-bold">Naše Vrednosti</h3>
              <p className="text-muted-foreground">
                Posvećenost kvalitetu, fer plej, timski duh i stalna podrška našoj zajednici. Kod nas je svako dobrodošao.
              </p>
            </Card>

            <Card className="glass p-6 space-y-3">
              <Zap className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">Naša Energija</h3>
              <p className="text-muted-foreground">
                Dinamičan pristup, moderna infrastruktura i strast prema inovacijama čine nas jedinstvenim u Srbiji.
              </p>
            </Card>
          </div>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Zašto baš mi?</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Vrhunska infrastruktura:</strong> Moderan teren sa staklenim zidovima i profesionalnom opremom</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Naša liga:</strong> Organizovano takmičenje sa praćenjem statistika i rangiranjem</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Profesionalni trener:</strong> Sertifikovani trener dostupan za privatne časove</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Rastuća zajednica:</strong> Aktivna zajednica igrača svih uzrasta i nivoa</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span><strong>Fleksibilno radno vreme:</strong> Otvoreni 7 dana u nedelji, od ranog jutra do kasno uveče</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
