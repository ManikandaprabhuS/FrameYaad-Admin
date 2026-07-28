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
      className="block h-52 w-full sm:h-60 lg:h-72"
      viewBox="0 0 1440 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="FrameYaad handcrafted framing process illustration"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="1440" height="320" fill="#ffffff" />
      <path
        d="M0 214C91 247 185 247 286 218C381 190 463 172 563 196C672 223 775 238 900 214C1033 188 1101 160 1234 196C1313 218 1375 220 1440 198V320H0V214Z"
        fill="#111827"
      />

      <g stroke="#111827" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M93 176L158 200L218 164L256 200" />
        <path d="M146 172L146 111L230 99L230 185" />
        <path d="M154 118L222 108" />
        <path d="M262 202H323" />
        <path d="M302 174V205" />
        <path d="M294 185L312 194" />
        <path d="M87 205C116 191 145 188 177 192" />
        <path d="M70 155L112 169L130 202" />
        <path d="M85 138L110 151" />
        <path d="M98 124C112 126 118 140 111 153" />
        <path d="M84 132L76 160L64 185" />

        <path d="M500 184L558 154L616 184" />
        <path d="M523 169L539 113L602 143L585 196" />
        <path d="M548 123L594 145" />
        <path d="M493 201H632" />
        <path d="M455 207V128" />
        <path d="M475 204V115" />
        <path d="M477 147H495" />
        <path d="M512 94C530 98 535 115 524 130" />
        <path d="M502 103L492 134L480 158" />
        <path d="M521 126L545 149" />

        <path d="M733 196H856" />
        <path d="M753 165H816V208H753V165Z" />
        <path d="M827 172H889V205H827V172Z" />
        <path d="M712 202C729 189 747 187 767 194" />
        <path d="M695 126L695 203" />
        <path d="M672 127H718" />
        <path d="M695 127L687 147" />
        <path d="M766 94C782 98 787 114 777 128" />
        <path d="M756 103L747 134L738 163" />
        <path d="M775 127L803 153" />

        <path d="M1025 200L1093 170L1160 200" />
        <path d="M1057 170V111H1124V198" />
        <path d="M1070 124H1110" />
        <path d="M1026 118L1082 105" />
        <path d="M1018 208H1184" />
        <path d="M984 95C1002 99 1008 116 998 130" />
        <path d="M973 104L965 135L956 166" />
        <path d="M996 127L1028 153" />

        <path d="M1257 207H1365" />
        <path d="M1277 172H1352V207H1277V172Z" />
        <path d="M1290 190H1338" />
        <path d="M1368 169V124H1402" />
        <path d="M1385 124V207" />
        <path d="M1355 145C1370 143 1384 151 1386 168" />
        <path d="M1234 148L1274 164L1290 202" />
        <path d="M1249 131L1274 147" />
        <path d="M1262 117C1278 121 1282 137 1274 150" />
        <path d="M1248 124L1238 158L1226 184" />
      </g>

      <g stroke="#F7F3EF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M73 207H270" />
        <path d="M486 203H646" />
        <path d="M730 207H900" />
        <path d="M1014 207H1188" />
        <path d="M1238 209H1397" />
      </g>

      <g fill="#111827">
        <circle cx="103" cy="118" r="8" />
        <circle cx="518" cy="87" r="8" />
        <circle cx="772" cy="87" r="8" />
        <circle cx="990" cy="88" r="8" />
        <circle cx="1267" cy="110" r="8" />
      </g>

      <g stroke="#111827" strokeWidth="3" strokeLinecap="round">
        <path d="M372 194C383 178 392 178 403 194" />
        <path d="M388 178V148" />
        <path d="M913 185C924 169 936 169 947 185" />
        <path d="M930 169V139" />
        <path d="M1410 166C1417 153 1427 153 1434 166" />
      </g>

      <g fill="#111827" opacity="0.9">
        <path d="M369 208C380 196 392 196 405 208H369Z" />
        <path d="M909 202C921 190 936 190 951 202H909Z" />
        <path d="M1406 181C1416 169 1428 169 1440 181H1406Z" />
      </g>
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
