import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SEOHead } from "@/components/layout/SEOHead";
import { ArrowRight, Trophy, Users, Target } from "lucide-react";

export default function PadelSrbija() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Kako rezervisati padel teren u Srbiji?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rezervaciju možete izvršiti pozivom na telefon +381 69 1999151, putem Instagrama (@district_padelclub), ili putem email-a. Naš tim je dostupan 7 dana u nedelji i potvrđuje termin odmah.",
        },
      },
      {
        "@type": "Question",
        name: "Kako se igra padel liga?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Padel liga se igra u grupama sa sistemom bodovanja: pobeda 3 boda, poraz 0 bodova. Timovi se rangiraju po bodovima, broju pobeda, set razlici i gem razlici.",
        },
      },
      {
        "@type": "Question",
        name: "Koliko traje padel meč?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Prosečan padel meč traje između 60 i 90 minuta. Meč se igra na najbolje od 3 seta, sa super tie-break trećim setom ako je potrebno.",
        },
      },
      {
        "@type": "Question",
        name: "Ko sme da se prijavi za padel ligu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Liga je otvorena za sve nivoe igrača. Potreban je tim od 2-3 igrača (2 glavna + opciono 1 rezerva). Prijavite se pozivom na +381 69 1999151, putem Instagrama (@district_padelclub), ili kontaktirajte nas putem email-a.",
        },
      },
      {
        "@type": "Question",
        name: "Koja je razlika između tenisa i padela?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Padel se igra na manjem terenu okruženom staklenim zidovima, loptom koja se ne sme odbijati od zemlje pre prvog dodira, i igra se isključivo u paru. Rakete su kraće i pune, bez žica.",
        },
      },
      {
        "@type": "Question",
        name: "Koliko košta padel u Srbiji?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cene variraju od 2.200 RSD za 60-minutne termine (do 16h) do 4.000 RSD za 120-minutne termine (od 16h). Najpopularnija opcija je 90 minuta koja košta 3.000 RSD (do 16h) ili 3.600 RSD (od 16h).",
        },
      },
    ],
  };

  return (
    <>
      <SEOHead
        title="Padel Srbija - Sve o Padelu u Srbiji | District Padel Club"
        description="Kompletan vodič o padelu u Srbiji. Gde igrati, kako početi, pravila igre, liga, teren i turniri. District Padel - najbolji padel klub u Srbiji."
        keywords="padel srbija, padel u srbiji, šta je padel, padel pravila, padel sport srbija, kako igrati padel, padel klub"
        canonicalUrl="https://districtpadel.rs/padel-srbija"
        structuredData={structuredData}
      />

      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto space-y-12">
          <header className="text-center space-y-4">
            <h1 className="text-5xl font-bold">
              <span className="gradient-text">Padel u Srbiji</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Sve što treba da znate o najbrže rastućem sportu u Srbiji
            </p>
          </header>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Šta je Padel?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Padel je dinamičan sport koji kombinuje elemente tenisa i skvošа, nastao u Meksiku 1960-ih godina. 
              Igra se u paru (2 vs 2) na terenu dimenzija 10m x 20m, okruženom staklenim zidovima visine 3 metra. 
              Za razliku od tenisa, padel koristi kraće rakete bez žica, a lopta mora biti servirana ispod nivoa struka.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Ono što čini padel posebnim je upotreba zidova - lopta se može odbiti od zida i nastaviti igru, slično kao u skvošu. 
              Ova dinamika čini padel neverovatno zabavnim i pristupačnim za sve uzraste i nivoe igrača.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass p-6">
              <Trophy className="w-10 h-10 text-primary mb-3" />
              <h3 className="font-bold text-xl mb-2">Brz razvoj</h3>
              <p className="text-muted-foreground text-sm">
                Padel je najbrže rastuća sportska disciplina na svetu sa preko 18 miliona igrača
              </p>
            </Card>
            <Card className="glass p-6">
              <Users className="w-10 h-10 text-secondary mb-3" />
              <h3 className="font-bold text-xl mb-2">Društvena igra</h3>
              <p className="text-muted-foreground text-sm">
                Timski sport koji podstiče druženje i izgradnju zajednice
              </p>
            </Card>
            <Card className="glass p-6">
              <Target className="w-10 h-10 text-accent mb-3" />
              <h3 className="font-bold text-xl mb-2">Lako za učenje</h3>
              <p className="text-muted-foreground text-sm">
                Pravila za savladavanje osnovnih pravila igre za nekoliko treninga
              </p>
            </Card>
          </div>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Osnovna Pravila Padela</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">1. Servis</h3>
                <p className="text-muted-foreground">
                  Lopta se servira ispod nivoa struka, dijagonalno u polje protivnika. Servira se po jedan poen, bez drugog servisa.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">2. Bodovanje</h3>
                <p className="text-muted-foreground">
                  Isti sistem kao u tenisu: 15, 30, 40, game. Set se igra do 6 gemova sa razlikom od 2. Pri 6:6 ide tie-break do 7 poena.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">3. Upotreba Zidova</h3>
                <p className="text-muted-foreground">
                  Lopta se može odbiti od sopstvenog zida pre prelaska mreže. Može se koristiti i protivnički zid posle prelaska mreže.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">4. Dvostruke linije</h3>
                <p className="text-muted-foreground">
                  Ako lopta dva puta dodirne pod na vašoj strani pre nego što je vratite, gubite poen. Lopta ne sme da se odbije dva puta od zida pre prvog kontakta sa podom.
                </p>
              </div>
            </div>
          </section>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Padel u Srbiji - Trenutno stanje</h2>
            <p className="text-muted-foreground leading-relaxed">
              Padel doživljava pravu revoluciju u Srbiji. Poslednjih godina otvara se sve više terena širom zemlje, 
              posebno u Beogradu, Novom Sadu i Sremskoj Mitrovici. District Padel Club je jedan od pionira koji 
              aktivno radi na popularizaciji ovog sporta kroz organizovanje naše lige, turnira i treninga.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Današnji padel zajednica u Srbiji broji preko 1.000 aktivnih igrača, sa tendencijom eksponencijalnog rasta. 
              Sportisti svih uzrasta, od dece do seniora, pronalaze u padelu savršenu kombinaciju fizičke aktivnosti i zabave.
            </p>
          </section>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Gde igrati Padel u Srbiji?</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>District Padel Club u Sremskoj Mitrovici</strong> nudi jedan vrhunski teren sa staklenim zidovima, 
              profesionalnim LED osvetljenjem i perfektnom veštačkom travom, kao i privatnu teretanu. Naši objekti projektovani su prema 
              međunarodnim standardima i pružaju najbolje uslove za igru u regionu.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="gradient-hero text-primary-foreground" asChild>
                <Link to="/contact">
                  Rezerviši teren <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/courts">Pogledaj teren</Link>
              </Button>
            </div>
          </section>

          <section className="glass rounded-lg p-8 space-y-4">
            <h2 className="text-3xl font-bold">Često Postavljana Pitanja</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Kako rezervisati padel teren u Srbiji?</h3>
                <p className="text-muted-foreground">
                  Rezervacije možete izvršiti pozivom na telefon +381 69 1999151, putem Instagrama (@district_padelclub), ili putem email-a. 
                  Naš tim će vam potvrditi dostupnost termina u najkraćem roku.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Kako se igra padel liga?</h3>
                <p className="text-muted-foreground">
                  Padel liga se igra u grupama sa sistemom bodovanja: pobeda 3 boda, poraz 0 bodova. 
                  Timovi se rangiraju po bodovima, broju pobeda, set razlici i gem razlici.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Koliko traje padel meč?</h3>
                <p className="text-muted-foreground">
                  Prosečan padel meč traje između 60 i 90 minuta. Meč se igra na najbolje od 3 seta, 
                  sa super tie-break trećim setom ako je potrebno.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Ko sme da se prijavi za padel ligu?</h3>
                <p className="text-muted-foreground">
                  Liga je otvorena za sve nivoe igrača. Potreban je tim od 2-3 igrača (2 glavna + opciono 1 rezerva). 
                  Prijavite se pozivom na +381 69 1999151, putem Instagrama (@district_padelclub), ili kontaktirajte nas putem email-a.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Koja je razlika između tenisa i padela?</h3>
                <p className="text-muted-foreground">
                  Padel se igra na manjem terenu okruženom staklenim zidovima, loptom koja se ne sme odbijati od zemlje pre prvog dodira, 
                  i igra se isključivo u paru. Rakete su kraće i pune, bez žica.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Koliko košta padel u Srbiji?</h3>
                <p className="text-muted-foreground">
                  Cene variraju od 2.200 RSD za 60-minutne termine (do 16h) do 4.000 RSD za 120-minutne termine (od 16h). 
                  Najpopularnija opcija je 90 minuta koja košta 3.000 RSD (do 16h) ili 3.600 RSD (od 16h).
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
