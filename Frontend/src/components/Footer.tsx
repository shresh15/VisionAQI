import { Github, Instagram, Linkedin, Wind } from "lucide-react";
import { Link } from "wouter";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Analyze Image", href: "/analyze" },
  { label: "Health & Safety", href: "/health" },
  { label: "About Air Quality", href: "/results" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/visionaq", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/visionaq", icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com/visionaq", icon: Instagram },
];

export function Footer() {
  return (
    <footer className="bg-primary/5 border-t border-border text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-primary font-display text-2xl font-semibold">
              <span className="bg-primary/10 p-2 rounded-xl">
                <Wind className="h-6 w-6" />
              </span>
              VisionAQI
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              AI-powered air quality awareness for smarter, healthier cities.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">
              Quick Links
            </p>
            <ul className="mt-4 space-y-2 text-sm font-medium">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">
              Contact & Social
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>© 2026 VisionAQI. Built for Smart Cities & Public Health.</p>
        </div>
      </div>
    </footer>
  );
}
