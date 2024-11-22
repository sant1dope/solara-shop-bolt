import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import FooterNav from './footer-nav';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-accent-cream border-t border-amber-900 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column with Solara info and social media */}
          <div className="space-y-8">
            {/* Solara info */}
            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-primary-dark">SOLARA</h3>
              <p className="text-sm text-muted-foreground">
                Personalized Creations for Every Style.
              </p>
            </div>
            
            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="font-semibold">Follow Us</h3>
              <div className="flex space-x-4">
                <Link 
                  href="https://www.facebook.com/itsSolaraOfficial/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary flex items-center gap-2"
                >
                  <Facebook className="h-5 w-5" />
                  <span>Facebook</span>
                </Link>
                <Link 
                  href="https://www.instagram.com/itssolaraofficial/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary flex items-center gap-2"
                >
                  <Instagram className="h-5 w-5" />
                  <span>Instagram</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right column with Footer Nav */}
          <div>
            <FooterNav />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Solara. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}