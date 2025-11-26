import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SEOHead } from "@/components/layout/SEOHead";

const Index = () => {
  return (
    <>
      <SEOHead
        title="Dobrodošli u District Padel"
        description="Vaša vrhunska padel destinacija u Sremskoj Mitrovici"
        keywords="padel srbija, padel sremska mitrovica, padel klub srbija, padel teren srbija, district padel, dobrodošli"
        canonicalUrl="https://districtpadel.rs/"
      />
      <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <h1 className="mb-4 text-4xl md:text-5xl font-bold">Dobrodošli u District Padel</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Vaša vrhunska padel destinacija u Sremskoj Mitrovici
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button size="lg" asChild>
            <Link to="/home">
              Otkrij više <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/contact">Kontakt</Link>
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Index;
  