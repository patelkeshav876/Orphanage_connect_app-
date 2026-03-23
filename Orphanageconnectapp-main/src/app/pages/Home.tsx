import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Heart,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Users,
  Gift,
  Calendar,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  Facebook,
} from 'lucide-react';
import { mockAshrams, mockNeeds, mockEvents } from '../data/mock';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useUser } from '../context/UserContext';
import { api } from '../lib/api';
import {
  Ashram,
  type Event as EventType,
  Need,
} from '../types';
import { ScrollReveal } from '../components/ScrollReveal';
import { FloatingQuickContact } from '../components/FloatingQuickContact';

export function Home() {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [ashram, setAshram] = useState<Ashram>(mockAshrams[0]);
  const [needs, setNeeds] = useState<Need[]>(mockNeeds);
  const [upcomingEvents, setUpcomingEvents] = useState<EventType[]>(() =>
    mockEvents.slice(0, 3),
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [needsData, ashramsData, eventsData] = await Promise.all([
        api.getNeeds(),
        api.getAshrams(),
        api.getEvents(),
      ]);
      if (needsData.length > 0) setNeeds(needsData);
      if (ashramsData.length > 0) setAshram(ashramsData[0]);
      if (eventsData.length > 0) {
        const sorted = [...eventsData].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
        setUpcomingEvents(sorted.slice(0, 3));
      }
    } catch {
      // Keep mock data
    }
  };

  const getFirstName = (name: string) => name.split(' ')[0];

  // Calculate stats
  const urgentNeeds = needs.filter(n => n.urgency === 'high');
  const mainRef = useRef<HTMLElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const heroPanelRef = useRef<HTMLDivElement | null>(null);

  const handleHeroPointerMove = (e: any) => {
    const el = heroPanelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const py = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    const ry = (px - 0.5) * 10; // rotateY
    const rx = (0.5 - py) * 8; // rotateX
    setTilt({ rx, ry });
  };

  const handleHeroPointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative min-h-[360px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80')] opacity-15 bg-cover bg-center" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

        {/* Light sweeps */}
        <motion.div
          aria-hidden
          className="absolute -top-28 -left-28 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl"
          animate={{ x: [0, 26, 0], y: [0, 16, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-36 -right-24 h-80 w-80 rounded-full bg-cyan-200/15 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, -14, 0] }}
          transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          ref={heroPanelRef}
          onPointerMove={handleHeroPointerMove}
          onPointerLeave={handleHeroPointerLeave}
          className="relative px-4 pt-10 pb-10"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_30px_90px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="p-5">
              {/* Top strip */}
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.7)]" />
                  Verified NGO
                </div>
                <div className="text-xs text-white/70 tracking-wide whitespace-nowrap">
                  {ashram.location}
                </div>
              </div>

              {/* Greeting */}
              <div className="flex justify-between items-center mb-6 mt-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold tracking-tight">
                    Namaste, {currentUser ? getFirstName(currentUser.name) : 'Guest'}
                  </h1>
                  <p className="text-sm text-white/80">Welcome to our family</p>
                </div>
                <Link to="/profile">
                  <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-bold text-lg border border-white/25 shadow-[0_18px_60px_rgba(0,0,0,0.25)] transition-transform hover:scale-110">
                    {currentUser ? currentUser.name.charAt(0) : 'G'}
                  </div>
                </Link>
              </div>

              {/* Institute Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-serif font-bold mb-2">{ashram.name}</h2>
                <div className="flex items-center gap-2 text-white/90 mb-4">
                  <MapPin className="h-4 w-4 text-emerald-200/90" />
                  <p className="text-sm">{ashram.location}</p>
                </div>
                <p className="text-sm text-white/90 leading-relaxed line-clamp-3">
                  {ashram.description}
                </p>
              </motion.div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <Card className="relative bg-white/10 backdrop-blur-sm border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-300/60 to-cyan-200/50 opacity-70" />
                  <CardContent className="p-4 text-center relative z-10">
                    <Users className="h-5 w-5 mx-auto mb-2 text-emerald-200/90" />
                    <p className="text-2xl font-bold text-white">50+</p>
                    <p className="text-xs text-white/80">Children</p>
                  </CardContent>
                </Card>
                <Card className="relative bg-white/10 backdrop-blur-sm border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-300/60 to-cyan-200/50 opacity-70" />
                  <CardContent className="p-4 text-center relative z-10">
                    <Gift className="h-5 w-5 mx-auto mb-2 text-cyan-200/90" />
                    <p className="text-2xl font-bold text-white">{needs.length}</p>
                    <p className="text-xs text-white/80">Active Needs</p>
                  </CardContent>
                </Card>
                <Card className="relative bg-white/10 backdrop-blur-sm border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-300/60 to-cyan-200/50 opacity-70" />
                  <CardContent className="p-4 text-center relative z-10">
                    <Heart className="h-5 w-5 mx-auto mb-2 text-rose-200/80" />
                    <p className="text-2xl font-bold text-white">₹1.2L</p>
                    <p className="text-xs text-white/80">This Month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <div className="text-xs text-white/80 leading-tight">
                  {urgentNeeds.length} urgent need{urgentNeeds.length === 1 ? '' : 's'} right now
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="bg-white/15 text-white hover:bg-white/20 h-8"
                  onClick={() => {
                    mainRef.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }}
                >
                  Explore <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <ScrollReveal>
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer transform-gpu hover:-translate-y-0.5 hover:scale-[1.02]"
            onClick={() => navigate(`/donate/${ashram.id}`)}
          >
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-1">Donate Now</h3>
              <p className="text-xs text-muted-foreground">Support our children</p>
            </CardContent>
          </Card>

          <Card 
            className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer transform-gpu hover:-translate-y-0.5 hover:scale-[1.02]"
            onClick={() => navigate('/about')}
          >
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-1">About Us</h3>
              <p className="text-xs text-muted-foreground">Our story & mission</p>
            </CardContent>
          </Card>
        </div>
        </ScrollReveal>

        <ScrollReveal delay={0.06}>
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/events')}
          >
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-orange-500/10 rounded-full flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-bold mb-1">Visit Us</h3>
              <p className="text-xs text-muted-foreground">Book your visit</p>
            </CardContent>
          </Card>

          <Card 
            className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/earn-support')}
          >
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-3">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-1">Shop</h3>
              <p className="text-xs text-muted-foreground">Support & earn</p>
            </CardContent>
          </Card>
        </div>
        </ScrollReveal>

        {/* Urgent Needs */}
        {urgentNeeds.length > 0 && (
          <ScrollReveal delay={0.08}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  Urgent Needs
                </h2>
                <p className="text-xs text-muted-foreground">Help us reach our goals</p>
              </div>
              <Link to="/needs">
                <Button variant="ghost" size="sm" className="text-primary h-auto p-0">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {urgentNeeds.slice(0, 3).map((need, i) => (
                <motion.div
                  key={need.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer transform-gpu hover:-translate-y-0.5 hover:scale-[1.02]"
                    onClick={() => navigate(`/donate/${need.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img 
                          src={need.imageUrl} 
                          alt={need.title}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-sm line-clamp-1">{need.title}</h3>
                            <Badge variant="destructive" className="text-[10px] ml-2">
                              Urgent
                            </Badge>
                          </div>
                          <Badge variant="secondary" className="text-[10px] mb-2">
                            {need.category}
                          </Badge>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">
                                ₹{need.quantityFulfilled.toLocaleString()} / ₹{need.quantityRequired.toLocaleString()}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${(need.quantityFulfilled / need.quantityRequired) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          </ScrollReveal>
        )}

        {/* Upcoming Events */}
        <ScrollReveal delay={0.06}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Upcoming Events
              </h2>
              <p className="text-xs text-muted-foreground">Join us and make memories</p>
            </div>
            <Link to="/events">
              <Button variant="ghost" size="sm" className="text-primary h-auto p-0">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer transform-gpu hover:-translate-y-0.5 hover:scale-[1.02]"
                  onClick={() => navigate('/events')}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm mb-1 line-clamp-1">{event.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        </ScrollReveal>

        {/* Marketplace CTA */}
        <ScrollReveal>
        <Card className="border-none shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold">Shop & Support</h3>
                  <Badge className="bg-orange-600 hover:bg-orange-700 text-[10px]">
                    <Sparkles className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Browse handmade products from local vendors. 15% of every sale supports our children!
                </p>
                <Button 
                  size="sm" 
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => navigate('/earn-support')}
                >
                  Explore Marketplace
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        </ScrollReveal>

        {/* Contact Info */}
        <ScrollReveal delay={0.05}>
        <Card className="border-none shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-5">
            <h3 className="font-bold mb-3">Get in Touch</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <a href={`tel:${ashram.contact.phone}`} className="text-muted-foreground hover:text-primary">
                  {ashram.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${ashram.contact.email}`} className="text-muted-foreground hover:text-primary">
                  {ashram.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{ashram.location}</span>
              </div>
              {ashram.facebookUrl ? (
                <div className="flex items-center gap-3 text-sm">
                  <Facebook className="h-4 w-4 text-primary" />
                  <a
                    href={ashram.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary">
                    Follow us on Facebook
                  </a>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
        </ScrollReveal>
      </main>
      <FloatingQuickContact ashram={ashram} />
    </div>
  );
}