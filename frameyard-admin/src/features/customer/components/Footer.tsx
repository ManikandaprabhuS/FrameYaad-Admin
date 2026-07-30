import React, { FormEvent, useState } from 'react';
import { BriefcaseBusiness, Camera, LucideIcon, Mail, MapPin, Phone, Send, Share2 } from 'lucide-react';
import { showError, showSuccess } from '../../../utils/toast';
import frameWorker1 from '../../../assets/frame_worker_1.png';
import frameWorker2 from '../../../assets/frame_worker_2.png';
import frameWorker3 from '../../../assets/frame_worker_3.png';
import frameWorker4 from '../../../assets/frame_worker_4.png';
import frameWorker5 from '../../../assets/frame_worker_5.png';

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
      className="block h-44 w-full sm:h-56 lg:h-64"
      viewBox="0 0 1440 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="FrameYaad handcrafted footer illustration with makers preparing, inspecting, and packaging frames"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="1440" height="260" fill="#ffffff" />
      <defs>
        <clipPath id="footer-worker-clip-1"><rect x="0" y="50" width="245" height="210" /></clipPath>
        <clipPath id="footer-worker-clip-2"><rect x="225" y="36" width="275" height="224" /></clipPath>
        <clipPath id="footer-worker-clip-3"><rect x="500" y="18" width="330" height="242" /></clipPath>
        <clipPath id="footer-worker-clip-4"><rect x="820" y="34" width="292" height="226" /></clipPath>
        <clipPath id="footer-worker-clip-5"><rect x="1095" y="34" width="300" height="226" /></clipPath>
      </defs>
      <path
        d="M0 143C92 182 191 188 296 149C391 114 488 105 594 134C701 164 809 181 932 148C1055 115 1144 111 1261 146C1335 168 1393 162 1440 139V260H0V143Z"
        fill="#111827"
      />

      <image
        href={frameWorker1}
        x="0"
        y="65"
        width="245"
        height="245"
        preserveAspectRatio="xMinYMax meet"
        clipPath="url(#footer-worker-clip-1)"
      />
      <image
        href={frameWorker2}
        x="228"
        y="44"
        width="310"
        height="245"
        preserveAspectRatio="xMidYMax meet"
        clipPath="url(#footer-worker-clip-2)"
      />
      <image
        href={frameWorker3}
        x="500"
        y="26"
        width="360"
        height="250"
        preserveAspectRatio="xMidYMax meet"
        clipPath="url(#footer-worker-clip-3)"
      />
      <image
        href={frameWorker4}
        x="822"
        y="42"
        width="330"
        height="250"
        preserveAspectRatio="xMidYMax meet"
        clipPath="url(#footer-worker-clip-4)"
      />
      <image
        href={frameWorker5}
        x="1094"
        y="42"
        width="342"
        height="250"
        preserveAspectRatio="xMaxYMax meet"
        clipPath="url(#footer-worker-clip-5)"
      />

      <path
        d="M0 249H1440V260H0V249Z"
        fill="#111827"
      />
    </svg>
    <div className="sr-only">
      <span>FrameYaad craftsmanship process: frame crafting, photo framing, quality inspection, and packaging.</span>
    </div>
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
