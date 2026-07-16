import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-(--line-color) px-6 md:px-10 py-10">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-(--shuttle)" />
            <span className="font-display text-lg sm:text-2xl font-bold tracking-tight whitespace-nowrap">
              <span>
                Imus Drive <span className="text-(--primary)">&</span> Smash
              </span>
            </span>
          </div>
          <p className="text-sm text-(--foreground)/50 max-w-xs">
            Imus Drive & Smash Badminton Court — your home court for
            competitive and casual play.
          </p>
        </div>

        
        <div className="flex flex-col gap-3 text-sm">
          <h3 className="font-display font-semibold text-(--foreground)/80 uppercase tracking-wide text-xs mb-1">
            For Inquiries
          </h3>

          <div className="flex items-start gap-2 text-(--foreground)/60">
            <MapPin className="w-4 h-4 mt-0.5 text-(--primary) shrink-0" />
            <span>4th Floor Lotus Mall Nueno Ave, City of Imus Cavite</span>
          </div>

          <div className="flex items-center gap-2 text-(--foreground)/60">
            <Phone className="w-4 h-4 text-(--primary) shrink-0" />
            <div className="flex flex-col sm:flex-row sm:gap-3">
              <a href="tel:+639257123786" className="hover:text-(--primary) transition-colors">
                +63 925 712 3786
              </a>
              <a href="tel:+639189854711" className="hover:text-(--primary) transition-colors">
                +63 918 985 4711
              </a>
              <a href="tel:0464722898" className="hover:text-(--primary) transition-colors">
                (046) 472 2898
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-(--foreground)/60">
            <Mail className="w-4 h-4 text-(--primary) shrink-0" />
            <a href="mailto:ids_cavite@yahoo.com" className="hover:text-(--primary) transition-colors">
              ids_cavite@yahoo.com
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-(--line-color)">
        <p className="text-sm text-(--foreground)/50 text-center">
          © 2026 Imus Drive & Smash Badminton Court. All rights reserved.
        </p>
      </div>
    </footer>
  );
}