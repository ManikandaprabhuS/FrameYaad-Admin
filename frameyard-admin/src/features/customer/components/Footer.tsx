import React, { FormEvent, useState } from 'react';
import { BriefcaseBusiness, Camera, LucideIcon, Mail, MapPin, Phone, Send, Share2 } from 'lucide-react';
import { showError, showSuccess } from '../../../utils/toast';

interface SocialLink {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface ContactItem {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
}

const socialLinks: SocialLink[] = [
  { name: 'Facebook', href: 'https://facebook.com', icon: Share2 },
  { name: 'Instagram', href: 'https://instagram.com', icon: Camera },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: BriefcaseBusiness },
];

const contactItems: ContactItem[] = [
  { label: 'Phone', value: '+91 98765 43210', icon: Phone },
  { label: 'Email', value: 'hello@frameyaad.com', icon: Mail },
  {
    label: 'Address',
    value: (
      <>
        FrameYaad
        <br />
        Oddanchatram, Tamil Nadu
        <br />
        India
      </>
    ),
    icon: MapPin,
  },
];

const quickLinks = ['Privacy Policy', 'Terms & Conditions', 'Refund Policy'];

const FooterIllustration: React.FC = () => (
  <div className="relative overflow-hidden bg-white">
    <svg
      className="block h-48 w-full sm:h-56 lg:h-72"
      viewBox="0 0 1440 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="FrameYaad handcrafted framing process illustration"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="1440" height="320" fill="#ffffff" />
      <path d="M0 260C230 216 362 250 548 224C758 195 856 119 1054 142C1217 161 1308 221 1440 198V320H0V260Z" fill="#111827" />
      <path d="M130 188H275V258H130V188Z" fill="#F7F3EF" stroke="#111827" strokeWidth="5" />
      <path d="M157 208H248V258H157V208Z" fill="#D9C2A3" />
      <path d="M172 238L196 216L224 246L238 232L256 258H158L172 238Z" fill="#111827" opacity="0.82" />
      <circle cx="335" cy="238" r="20" fill="#F7F3EF" stroke="#111827" strokeWidth="4" />
      <path d="M326 238H344M335 229V247" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
      <rect x="458" y="156" width="122" height="100" rx="10" fill="#F7F3EF" stroke="#111827" strokeWidth="5" />
      <rect x="486" y="181" width="66" height="50" fill="#ffffff" stroke="#C07D42" strokeWidth="4" />
      <path d="M665 245C710 197 767 197 810 245" stroke="#F7F3EF" strokeWidth="12" strokeLinecap="round" />
      <path d="M695 242L736 197L779 242" stroke="#C07D42" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="900" cy="205" r="42" fill="#F7F3EF" stroke="#111827" strokeWidth="5" />
      <path d="M878 206C892 188 910 188 924 206C910 224 892 224 878 206Z" stroke="#111827" strokeWidth="5" strokeLinejoin="round" />
      <circle cx="901" cy="206" r="8" fill="#C07D42" />
      <rect x="1045" y="174" width="118" height="82" rx="8" fill="#F7F3EF" stroke="#111827" strokeWidth="5" />
      <path d="M1045 203H1163M1080 174V256" stroke="#111827" strokeWidth="4" opacity="0.65" />
      <path d="M1218 217H1320L1347 256H1190L1218 217Z" fill="#F7F3EF" stroke="#111827" strokeWidth="5" />
      <path d="M1234 217L1260 193H1300L1320 217" stroke="#C07D42" strokeWidth="5" strokeLinecap="round" />
      <circle cx="109" cy="112" r="5" fill="#C07D42" />
      <circle cx="1217" cy="113" r="6" fill="#C07D42" />
      <circle cx="713" cy="89" r="5" fill="#111827" opacity="0.22" />
    </svg>
  </div>
);

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showError('Please enter a valid email address');
      return;
    }

    showSuccess('Thank you for subscribing to FrameYaad');
    setEmail('');
  };

  return (
    <footer className="animate-fade-in bg-white">
      <FooterIllustration />

      <div className="-mt-px rounded-t-[2rem] bg-[#111827] text-white sm:rounded-t-[2.5rem]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-14">
            <section aria-labelledby="newsletter-heading">
              <h2 id="newsletter-heading" className="text-2xl font-black">Subscribe to our Newsletter</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/60">
                Get updates on new frame collections, exclusive offers, and product launches.
              </p>
              <form onSubmit={handleSubscribe} className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <label htmlFor="footer-newsletter-email" className="sr-only">Email address</label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="min-h-12 w-full rounded-xl border border-white/15 bg-white/8 px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#c07d42] focus:bg-white/12 focus:ring-4 focus:ring-[#c07d42]/15"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-[#111827] transition hover:-translate-y-0.5 hover:bg-[#f7f3ef] hover:shadow-[0_18px_40px_rgba(255,255,255,0.12)] sm:w-auto"
                >
                  Subscribe <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            </section>

            <section aria-labelledby="follow-heading">
              <h2 id="follow-heading" className="text-2xl font-black">Follow Us</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">Stay close to our latest handcrafted frame stories.</p>
              <div className="mt-6 flex gap-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition hover:scale-110 hover:border-[#c07d42] hover:bg-[#c07d42] hover:shadow-[0_16px_36px_rgba(192,125,66,0.24)]"
                      aria-label={`Follow FrameYaad on ${link.name}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="text-2xl font-black">Contact Us</h2>
              <div className="mt-6 space-y-5">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/8 text-[#c07d42]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/35">{item.label}</p>
                        <p className="mt-1 text-sm leading-6 text-white/75">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6">
            <div className="flex flex-col gap-5 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
              <p>© 2026 FrameYaad. All Rights Reserved.</p>
              <nav className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6" aria-label="Footer quick links">
                {quickLinks.map((link) => (
                  <a key={link} href="#" className="transition hover:text-white">
                    {link}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
