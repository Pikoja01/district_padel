import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Courts from "./pages/Courts";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import League from "./pages/League";
import LeagueGroupA from "./pages/LeagueGroupA";
import LeagueGroupB from "./pages/LeagueGroupB";
import TeamDetail from "./pages/TeamDetail";
import Admin from "./pages/Admin";
import PadelSrbija from "./pages/PadelSrbija";
import PadelSremskaMitrovica from "./pages/PadelSremskaMitrovica";
import PadelLigaSrbija from "./pages/PadelLigaSrbija";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1 pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/courts" element={<Courts />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/league" element={<League />} />
              <Route path="/league/grupa-a" element={<LeagueGroupA />} />
              <Route path="/league/grupa-b" element={<LeagueGroupB />} />
              <Route path="/teams/:teamId" element={<TeamDetail />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/padel-srbija" element={<PadelSrbija />} />
              <Route path="/padel-sremska-mitrovica" element={<PadelSremskaMitrovica />} />
              <Route path="/padel-liga-srbija" element={<PadelLigaSrbija />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
