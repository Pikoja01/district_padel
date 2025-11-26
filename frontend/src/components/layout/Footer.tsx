import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">District Padel Club</h3>
            <p className="text-sm text-muted-foreground">
              Najmoderniji padel centar u Srbiji. Pridružite se našoj zajednici i uživajte u vrhunskim terenima.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigacija</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">O nama</Link></li>
              <li><Link to="/courts" className="hover:text-primary transition-colors">Teren i Teretana</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Cenovnik</Link></li>
              <li><Link to="/league" className="hover:text-primary transition-colors">Liga</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Informacije</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/padel-srbija" className="hover:text-primary transition-colors">Padel Srbija</Link></li>
              <li><Link to="/padel-sremska-mitrovica" className="hover:text-primary transition-colors">Padel Sremska Mitrovica</Link></li>
              <li><Link to="/padel-liga-srbija" className="hover:text-primary transition-colors">Padel Liga Srbija</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Fruškogorska 71, Sremska Mitrovica
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+381691999151" className="hover:text-primary transition-colors">
                  +381 69 1999151
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:districtmedialtd@gmail.com" className="hover:text-primary transition-colors">
                  districtmedialtd@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <h5 className="font-semibold mb-2 text-sm">Društvene Mreže</h5>
              <div className="flex gap-3">
                <a 
                  href="https://www.instagram.com/district_padelclub" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61582273652583" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-white" />
                </a>
                <a 
                  href="https://www.tiktok.com/@district.padel.club" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} District Padel Club. Sva prava zadržana.</p>
        </div>
      </div>
    </footer>
  );
}
