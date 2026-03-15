/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Star, 
  ArrowRight,
  Mail,
  MessageCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { supabase } from './supabase';

const InquiryModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [formData, setFormData] = useState({ name: '', contact: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabase
        .from('inquiries')
        .insert([
          { 
            name: formData.name, 
            contact: formData.contact,
            created_at: new Date().toISOString()
          }
        ]);

      if (supabaseError) throw supabaseError;

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setFormData({ name: '', contact: '' });
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting inquiry:', err);
      setError(err.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-boho-dark/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-boho-cream w-full max-w-md p-10 rounded-sm shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-boho-dark/40 hover:text-boho-dark transition-colors"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="text-center py-10">
                <h3 className="text-3xl font-serif mb-4 italic">Thank You</h3>
                <p className="text-sm tracking-widest uppercase text-boho-dark/60">We'll be in touch soon.</p>
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-serif mb-2 italic">Inquire Now</h3>
                <p className="text-[10px] tracking-[0.2em] uppercase text-boho-dark/50 mb-8">Start your automation journey.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-boho-dark/40 mb-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border-b border-boho-dark/20 py-2 text-sm focus:outline-none focus:border-boho-rust transition-colors"
                      placeholder="Your name"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-boho-dark/40 mb-2">Email id or ph no</label>
                    <input 
                      required
                      type="text" 
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full bg-transparent border-b border-boho-dark/20 py-2 text-sm focus:outline-none focus:border-boho-rust transition-colors"
                      placeholder="Email id or ph no"
                      disabled={loading}
                    />
                  </div>
                  {error && (
                    <p className="text-[10px] text-red-500 uppercase tracking-widest">{error}</p>
                  )}
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full mt-8 bg-sunset-orange text-white py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-opacity-90 transition-all shadow-lg disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Inquire'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ onOpen }: { onOpen: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-boho-cream/40 backdrop-blur-[2px]">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="text-xl font-serif tracking-widest uppercase">DigiMenu</div>
      <div className="hidden md:flex items-center gap-8 text-[10px] tracking-[0.2em] uppercase font-medium text-boho-dark/70">
        <a href="#about" className="hover:text-boho-rust transition-colors">About</a>
        <a href="#efficiency" className="hover:text-boho-rust transition-colors">Process</a>
        <a href="#pricing" className="hover:text-boho-rust transition-colors">Pricing</a>
        <a href="#reviews" className="hover:text-boho-rust transition-colors">Stories</a>
      </div>
      <button 
        onClick={onOpen}
        className="text-[10px] tracking-[0.2em] uppercase font-bold text-sunset-orange border-b border-sunset-orange pb-1 hover:text-boho-dark hover:border-boho-dark transition-all"
      >
        Get Started
      </button>
    </div>
  </nav>
);

const Hero = () => (
  <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img 
        src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/fd00e1139c902073e903a6feb7192ad4_screen.jpg" 
        alt="Digital QR Menu Template" 
        className="w-full h-full object-cover opacity-70"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-boho-cream" />
    </div>
    
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative z-10 max-w-4xl mt-20"
    >
      <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-white drop-shadow-lg">
        Zero-Wait <br />
        <span className="italic font-light">Experience.</span>
      </h1>
      <p className="text-xl md:text-2xl font-normal font-sans text-boho-cream max-w-3xl mx-auto leading-loose mb-16 drop-shadow-md">
        Customers scan and order in seconds. No more waving down staff or waiting for a physical menu.
      </p>
      <motion.a
        href="https://app.menubly.com/p/democafe"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block px-10 py-4 bg-sunset-orange text-white rounded-full text-sm uppercase tracking-widest font-bold hover:bg-opacity-90 transition-all shadow-lg"
      >
        Show Demo Menu
      </motion.a>
    </motion.div>
  </section>
);

const About = () => (
  <section id="about" className="py-24 px-6 bg-boho-cream">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-24 space-y-6">
        <p className="text-3xl md:text-4xl font-light italic text-boho-dark/80">Why should you get a QR menu?</p>
        <div className="flex flex-col items-center gap-2 pt-4">
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl uppercase text-boho-dark/90 font-bold ml-[0.2em] leading-none"
          >
            Because
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl uppercase tracking-[0.2em] text-boho-dark/90 font-bold ml-[0.2em] leading-none"
          >
            It Is
          </motion.p>
        </div>
      </div>
      <div className="grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <img 
              src="https://www.mcdonaldwhsl.com/wp-content/uploads/2022/10/albert-hu-RII9HuLDz4M-unsplash.jpg" 
              alt="Contactless Dining with QR Menu" 
              className="rounded-sm shadow-2xl w-full"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-boho-beige -z-0" />
        </div>
        <div className="md:col-span-7 md:pl-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
              Engineered for <br /><span className="italic">Efficiency.</span>
            </h2>
            <p className="text-lg text-boho-dark/70 leading-relaxed mb-8">
              DigiMenu isn't just a digital menu—it's an operational upgrade. 
              We replace manual bottlenecks with automated workflows designed for high-volume restaurants.
            </p>
            <p className="text-sm text-boho-dark/60 leading-relaxed italic">
              "Our platform ensures that your staff focuses on hospitality while we handle the logistics."
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

const EfficiencyHub = ({ onOpen }: { onOpen: () => void }) => (
  <section id="efficiency" className="py-40 px-6 bg-boho-beige">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-24 items-start">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <img 
              src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80&w=800" 
              alt="Professional Food Photography" 
              className="rounded-sm shadow-xl w-full"
              referrerPolicy="no-referrer"
            />
            <div className="mt-4 text-[10px] tracking-[0.3em] uppercase font-bold text-boho-rust text-right">
              Our Photo Shoot
            </div>
          </motion.div>
          <div className="absolute -top-12 -left-12 w-full h-full border border-boho-rust/20 -z-0" />
        </div>
        
        <div className="pt-12">
          <h2 className="text-4xl font-light mb-12 italic">The Efficiency Hub</h2>
          <div className="space-y-12">
            {[
              {
                num: "01",
                title: "Cut Staff Costs",
                desc: "Run full-capacity shifts with 40% fewer servers. Our system becomes your most reliable digital waiter."
              },
              {
                num: "02",
                title: "Eliminate Human Error",
                desc: "Orders go directly from the customer's phone to your kitchen. No misheard items, no forgotten requests."
              },
              {
                num: "03",
                title: "Faster Table Rotations",
                desc: "Customers don't wait for menus or the bill. They scan, order, and pay instantly, increasing your daily table capacity."
              },
              {
                num: "04",
                title: "Professional Food Photography",
                desc: "We don't just build a digital menu; we click, edit, and enhance your food photos to drive more customers with professional visual storytelling."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="border-b border-boho-dark/10 pb-8"
              >
                <div className="flex items-start gap-6">
                  <span className="text-xs tracking-widest text-boho-rust font-medium">{item.num}</span>
                  <div>
                    <h3 className="text-xl font-medium mb-3 uppercase tracking-wider">{item.title}</h3>
                    <p className="text-sm text-boho-dark/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button 
            onClick={onOpen}
            className="mt-12 bg-sunset-orange text-white px-10 py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-opacity-90 transition-all shadow-lg"
          >
            Let's Work Together
          </button>
        </div>
      </div>
    </div>
  </section>
);

const Pricing = ({ onOpen }: { onOpen: () => void }) => (
  <section id="pricing" className="py-40 px-6 bg-boho-cream">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-light mb-4 italic">Pricing</h2>
      <p className="text-sm tracking-[0.2em] uppercase text-boho-dark/50 mb-20">Simple plans to automate your business.</p>
      
      <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <motion.div 
          whileHover={{ y: -10 }}
          className="bg-boho-beige/50 p-12 rounded-sm border border-boho-dark/5"
        >
          <h3 className="text-2xl font-light mb-2">Managed Pro</h3>
          <div className="text-boho-rust text-lg font-medium mb-8">₹6,000 Setup + ₹500/mo</div>
          <ul className="text-xs tracking-widest uppercase text-boho-dark/60 space-y-4 mb-12">
            <li>Professional Hardware</li>
            <li>Staff Training</li>
            <li>Professional Photo Shoot</li>
            <li>24/7 Support</li>
          </ul>
          <button 
            onClick={onOpen}
            className="w-full border border-boho-dark/20 py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-boho-dark hover:text-white transition-all"
          >
            Inquire Now
          </button>
        </motion.div>

        <motion.div 
          whileHover={{ y: -10 }}
          className="bg-boho-grey/30 p-12 rounded-sm border border-boho-dark/5"
        >
          <h3 className="text-2xl font-light mb-2">Enterprise Lifetime</h3>
          <div className="text-boho-rust text-lg font-medium mb-8">₹9,000 One-Time</div>
          <ul className="text-xs tracking-widest uppercase text-boho-dark/60 space-y-4 mb-12">
            <li>Permanent Infrastructure</li>
            <li>Professional Photo Shoot</li>
            <li>No Monthly Fees</li>
            <li>Lifetime Hosting</li>
          </ul>
          <button 
            onClick={onOpen}
            className="w-full bg-sunset-orange text-white py-4 text-[10px] tracking-[0.3em] uppercase font-bold hover:bg-opacity-90 transition-all shadow-lg"
          >
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  </section>
);

const Reviews = () => (
  <section id="reviews" className="py-40 px-6 bg-boho-beige">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-light italic mb-4">Trusted by Owners</h2>
        <p className="text-xs tracking-[0.2em] uppercase text-boho-dark/50">Real results from automated restaurants.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          {
            quote: "We cut our floor staff by 40% and haven't had a single order error since switching to DigiMenu.",
            author: "Bistro Owner"
          },
          {
            quote: "The faster table turnover paid for the system in the first month. It's a no-brainer for high-volume spots.",
            author: "Cafe Manager"
          },
          {
            quote: "My chefs are much calmer now that orders come in clearly through the KDS without manual entry.",
            author: "Head Chef"
          }
        ].map((review, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="text-center"
          >
            <div className="flex justify-center gap-1 text-boho-rust mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
            </div>
            <p className="text-lg italic mb-8 text-boho-dark/70 leading-relaxed">"{review.quote}"</p>
            <div className="text-[10px] tracking-[0.2em] uppercase font-bold text-boho-rust">— {review.author}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-24 px-6 bg-boho-grey/40">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-16 mb-20">
        <div className="md:col-span-1">
          <div className="text-xl font-serif tracking-widest uppercase mb-8">DigiMenu</div>
          <div className="flex gap-6 text-boho-dark/50">
            <a 
              href="mailto:raunakarora08@gmail.com" 
              className="hover:text-boho-rust transition-colors flex items-center gap-2"
              title="Gmail"
            >
              <Mail size={18} />
              <span className="text-[10px] tracking-widest uppercase font-bold">Gmail</span>
            </a>
            <a 
              href="https://wa.me/918570949108?text=I'm%20interested%20in%20getting%20a%20QR%20menu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-boho-rust transition-colors flex items-center gap-2"
              title="WhatsApp"
            >
              <MessageCircle size={18} />
              <span className="text-[10px] tracking-widest uppercase font-bold">WhatsApp</span>
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold mb-8">Company</h4>
          <ul className="text-xs space-y-4 text-boho-dark/60">
            <li><a href="#" className="hover:text-boho-rust">About</a></li>
            <li><a href="#" className="hover:text-boho-rust">Process</a></li>
            <li><a href="#" className="hover:text-boho-rust">Pricing</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold mb-8">Support</h4>
          <ul className="text-xs space-y-4 text-boho-dark/60">
            <li><a href="#" className="hover:text-boho-rust">Contact</a></li>
            <li><a href="#" className="hover:text-boho-rust">Privacy</a></li>
            <li><a href="#" className="hover:text-boho-rust">Terms</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold mb-8">Join the List</h4>
          <p className="text-xs text-boho-dark/60 mb-6">Get the latest news and updates.</p>
          <div className="flex border-b border-boho-dark/20 pb-2">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="bg-transparent text-xs w-full focus:outline-none"
            />
            <button className="text-[10px] tracking-[0.2em] uppercase font-bold text-boho-rust">Join</button>
          </div>
        </div>
      </div>
      <div className="text-center pt-12 border-t border-boho-dark/5">
        <p className="text-[10px] tracking-[0.2em] uppercase text-boho-dark/30">© 2026 DigiMenu Systems. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const FloatingWhatsApp = () => (
  <motion.a
    href="https://wa.me/918570949108?text=I'm%20interested%20in%20getting%20a%20QR%20menu"
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, scale: 0.5, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="fixed bottom-8 right-8 z-50 w-16 h-16 flex items-center justify-center"
    title="Chat with us on WhatsApp"
  >
    <div className="bg-[#25D366] w-full h-full rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_25px_rgba(37,211,102,0.4)] transition-all duration-300">
      <svg 
        viewBox="0 0 24 24" 
        className="w-10 h-10 text-white fill-current"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </div>
  </motion.a>
);

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar onOpen={() => setIsModalOpen(true)} />
      <main>
        <Hero />
        <About />
        <EfficiencyHub onOpen={() => setIsModalOpen(true)} />
        <Pricing onOpen={() => setIsModalOpen(true)} />
        <Reviews />
      </main>
      <Footer />
      <InquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <FloatingWhatsApp />
    </div>
  );
}
