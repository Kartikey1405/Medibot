import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { 
  Menu, 
  X, 
  Heart, 
  Users, 
  MessageSquare, 
  Brain, 
  UserPlus, 
  ClipboardList,
  ChevronRight,
  ChevronLeft,
  Star,
  Send,
  Activity,
  Shield,
  Zap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  LogOut,
  User,
  FileText,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ============= INTERFACES =============
interface UserData {
  fullName: string;
  age: string;
  aadhar: string;
  gender: string;
  email: string;
  password: string;
  medicalHistory: string;
}

interface DiagnosisEntry {
  id: string;
  date: string;
  symptoms: string[];
  predictions: {
    disease: string;
    confidence: number;
  }[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  predictions?: {
    disease: string;
    confidence: number;
  }[];
}

interface Testimonial {
  quote: string;
  name: string;
  profession: string;
  rating: number;
}

// ============= MOCK DATA =============
const testimonials: Testimonial[] = [
  {
    quote: "MediBot has revolutionized how I approach preliminary diagnosis. It's fast, accurate, and incredibly helpful.",
    name: "Dr. Sarah Mitchell",
    profession: "General Physician",
    rating: 5
  },
  {
    quote: "As a busy professional, MediBot helps me understand when I really need to see a doctor. Peace of mind at my fingertips.",
    name: "James Anderson",
    profession: "Software Engineer",
    rating: 5
  },
  {
    quote: "The AI-powered insights are impressive. It's like having a medical assistant available 24/7.",
    name: "Dr. Robert Chen",
    profession: "Internal Medicine Specialist",
    rating: 5
  }
];

// ============= NAVBAR COMPONENT =============
const Navbar: React.FC<{
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isLoggedIn: boolean;
  handleLogout: () => void;
}> = ({ currentPage, setCurrentPage, isLoggedIn, handleLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md shadow-[var(--shadow-soft)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setCurrentPage('home')}
          >
            <div className="bg-gradient-to-r from-primary via-secondary to-accent p-2 rounded-lg group-hover:shadow-[var(--shadow-glow)] transition-all duration-300">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              MediBot
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Button
              variant="nav"
              onClick={() => setCurrentPage('home')}
              className={currentPage === 'home' ? 'text-primary font-semibold' : ''}
            >
              Home
            </Button>
            <Button
              variant="nav"
              onClick={() => setCurrentPage('about')}
              className={currentPage === 'about' ? 'text-primary font-semibold' : ''}
            >
              About Us
            </Button>
            <Button
              variant="nav"
              onClick={() => setCurrentPage('diagnose')}
              className={currentPage === 'diagnose' ? 'text-primary font-semibold' : ''}
            >
              Diagnose Symptoms
            </Button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentPage('login')}
                >
                  Login
                </Button>
                <Button
                  variant="cta"
                  onClick={() => setCurrentPage('signup')}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentPage('reports')}
                >
                  <FileText className="h-4 w-4" />
                  My Reports
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentPage('profile')}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setCurrentPage('home');
                setMobileMenuOpen(false);
              }}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setCurrentPage('about');
                setMobileMenuOpen(false);
              }}
            >
              About Us
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setCurrentPage('diagnose');
                setMobileMenuOpen(false);
              }}
            >
              Diagnose Symptoms
            </Button>
            {!isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setCurrentPage('login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="cta"
                  className="w-full"
                  onClick={() => {
                    setCurrentPage('signup');
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setCurrentPage('reports');
                    setMobileMenuOpen(false);
                  }}
                >
                  My Reports
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setCurrentPage('profile');
                    setMobileMenuOpen(false);
                  }}
                >
                  Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

// ============= FOOTER COMPONENT =============
const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-secondary to-accent p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">MediBot</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Intelligent diagnosis powered by advanced AI. Your health companion for better understanding of symptoms.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li className="hover:text-accent cursor-pointer transition-colors">Home</li>
              <li className="hover:text-accent cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Diagnose</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Contact</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li className="hover:text-accent cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Cookie Policy</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Disclaimer</li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="space-y-2 text-sm text-primary-foreground/80 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@medibot.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Jaipur,Rajasthan</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Facebook className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 hover:text-accent cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; 2025 MediBot. All rights reserved. This AI assistant is not a substitute for professional medical advice.</p>
        </div>
      </div>
    </footer>
  );
};

// ============= HOME PAGE COMPONENT =============
const HomePage: React.FC<{ setCurrentPage: (page: string) => void }> = ({ setCurrentPage }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // const handleContactSubmit = (e: FormEvent) => {
  //   e.preventDefault();
  //   alert('Thank you for your message! We will get back to you soon.');
  //   setContactForm({ name: '', email: '', message: '' });
  // };

  const handleContactSubmit = (e: FormEvent) => {
  e.preventDefault();

  if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
    alert("All fields are required.");
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(contactForm.email)) {
    alert("Please enter a valid email address.");
    return;
  }

  alert('Thank you for your message! We will get back to you soon.');
  setContactForm({ name: '', email: '', message: '' });
};


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(56,189,248,0.2),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(20,184,166,0.2),transparent_50%)]"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-6 animate-fade-in">
            <div className="inline-block bg-gradient-to-r from-primary via-secondary to-accent p-4 rounded-full shadow-[var(--shadow-glow)] mb-6">
              <Activity className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
            Intelligent Diagnosis,
            <br />
            Instant Clarity.
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            MediBot leverages advanced AI to help you understand your symptoms. Get started on your path to wellness today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              variant="hero"
              size="lg"
              onClick={() => setCurrentPage('diagnose')}
              className="text-lg px-8 py-6"
            >
              Diagnose My Symptoms Now
              <ChevronRight className="ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentPage('about')}
              className="text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Trusted by Professionals
          </h2>
          
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl shadow-[var(--shadow-large)] p-8 md:p-12">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-accent text-accent" />
                ))}
              </div>
              
              <p className="text-xl text-center text-foreground mb-6 italic">
                "{testimonials[currentTestimonial].quote}"
              </p>
              
              <div className="text-center">
                <p className="font-semibold text-primary">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonials[currentTestimonial].profession}
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 hidden md:block"
            >
              <ChevronLeft className="h-8 w-8 text-primary hover:text-accent transition-colors" />
            </button>
            
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 hidden md:block"
            >
              <ChevronRight className="h-8 w-8 text-primary hover:text-accent transition-colors" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            A Simple Path to Peace of Mind
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our streamlined process makes it easy to get the insights you need
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: UserPlus,
                title: 'Create Your Profile',
                description: 'Securely sign up to keep a private record of your health history.',
                step: '01'
              },
              {
                icon: MessageSquare,
                title: 'Describe Your Symptoms',
                description: 'Use our intuitive chat interface to detail how you\'re feeling.',
                step: '02'
              },
              {
                icon: Brain,
                title: 'Receive AI-Powered Insights',
                description: 'Get an instant analysis of potential conditions based on our advanced model.',
                step: '03'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
                <div className="relative bg-card rounded-2xl shadow-[var(--shadow-medium)] p-8 hover:shadow-[var(--shadow-large)] transition-all duration-300">
                  <div className="absolute -top-4 -right-4 text-6xl font-bold text-primary/10">
                    {item.step}
                  </div>
                  <div className="bg-gradient-to-br from-primary to-accent p-4 rounded-xl inline-block mb-4 group-hover:shadow-[var(--shadow-glow)] transition-all duration-300">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-muted">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Get in Touch
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Have questions? We're here to help.
          </p>
          
          <form onSubmit={handleContactSubmit} className="bg-card rounded-2xl shadow-[var(--shadow-large)] p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Message
                </label>
                <textarea
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

// ============= ABOUT PAGE COMPONENT =============
const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            About MediBot
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering individuals with AI-driven health insights for better decision-making
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-card rounded-2xl shadow-[var(--shadow-large)] p-8">
            <h2 className="text-3xl font-bold mb-4 text-primary">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              At MediBot, we believe everyone deserves access to reliable health information. Our mission is to bridge the gap between symptoms and understanding, providing AI-powered insights that help people make informed decisions about their health. We combine cutting-edge machine learning with medical knowledge to deliver accurate, accessible, and actionable health guidance.
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-[var(--shadow-large)] p-8">
            <h2 className="text-3xl font-bold mb-4 text-primary">Our Technology</h2>
            <p className="text-muted-foreground leading-relaxed">
              MediBot utilizes advanced machine learning algorithms trained on vast medical datasets. Our AI model analyzes symptom patterns and cross-references them with medical literature to provide the most likely conditions. While our technology is sophisticated, we always emphasize that MediBot is a tool for preliminary understanding, not a replacement for professional medical consultation.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Privacy First',
                description: 'Your health data is encrypted and never shared without your consent.'
              },
              {
                icon: Brain,
                title: 'AI Excellence',
                description: 'We continuously improve our models with the latest research.'
              },
              {
                icon: Heart,
                title: 'User-Centric',
                description: 'Designed with empathy and care for your health journey.'
              }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-primary to-accent p-4 rounded-xl inline-block mb-4 shadow-[var(--shadow-glow)]">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-[var(--shadow-large)] p-8 border-l-4 border-primary">
          <h2 className="text-2xl font-bold mb-4 text-primary">Important Disclaimer</h2>
          <p className="text-muted-foreground leading-relaxed">
            MediBot is designed to provide general health information and symptom analysis based on AI algorithms. It is not intended to diagnose, treat, cure, or prevent any disease, and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or received from MediBot.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============= SIGNUP PAGE COMPONENT =============
const SignupPage: React.FC<{ setCurrentPage: (page: string) => void; setIsLoggedIn: (val: boolean) => void; setUserData: (data: UserData) => void }> = ({ setCurrentPage, setIsLoggedIn, setUserData }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserData>({
    fullName: '',
    age: '',
    aadhar: '',
    gender: '',
    email: '',
    password: '',
    medicalHistory: ''
  });

  // const handleNext = () => {
  //   if (step < 3) setStep(step + 1);
  // };
  const handleNext = () => {
  if (step === 1) {
    if (formData.fullName.trim().length < 3) {
      alert("Full name must be at least 3 characters.");
      return;
    }
    const ageNum = Number(formData.age);
    if (ageNum < 1 || ageNum > 120) {
      alert("Age must be between 1 and 120.");
      return;
    }
    if (!/^[0-9]{12}$/.test(formData.aadhar)) {
      alert("Aadhar number must be exactly 12 digits.");
      return;
    }
    if (!formData.gender) {
      alert("Please select a gender.");
      return;
    }
  }

  if (step === 2) {
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert("Please enter a valid email.");
      return;
    }
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }
  }

  if (step < 3) setStep(step + 1);
};


  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // const handleSubmit = (e: FormEvent) => {
  //   e.preventDefault();
  //   setUserData(formData);
  //   setIsLoggedIn(true);
  //   alert('Account created successfully! Welcome to MediBot.');
  //   setCurrentPage('diagnose');
  // };

  const handleSubmit = (e: FormEvent) => {
  e.preventDefault();

  // No mandatory validation in step 3 (medicalHistory optional)

  setUserData(formData);
  setIsLoggedIn(true);
  alert('Account created successfully! Welcome to MediBot.');
  setCurrentPage('diagnose');
};


  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-2xl shadow-[var(--shadow-large)] p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className="text-muted-foreground">
              Step {step} of 3
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    s <= step ? 'bg-gradient-to-r from-primary to-accent' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Personal Details</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Age *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="25"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Aadhar Card Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.aadhar}
                      onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="1234-5678-9012"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Gender *
                  </label>
                  <div className="flex gap-4">
                    {['Male', 'Female', 'Other'].map((gender) => (
                      <label key={gender} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          required
                          name="gender"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-foreground">{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="hero"
                  size="lg"
                  onClick={handleNext}
                  className="w-full"
                >
                  Next
                  <ChevronRight className="ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Account Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Account Details</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Must be at least 8 characters
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ChevronLeft className="mr-2" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="hero"
                    size="lg"
                    onClick={handleNext}
                    className="flex-1"
                  >
                    Next
                    <ChevronRight className="ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Medical History */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Medical History</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Previous Conditions, Allergies, or Relevant Information
                  </label>
                  <textarea
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Please describe any previous medical conditions, allergies, ongoing medications, or other relevant health information..."
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This information helps us provide more accurate insights
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ChevronLeft className="mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="flex-1"
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => setCurrentPage('login')}
                className="text-primary hover:text-accent font-semibold transition-colors"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= LOGIN PAGE COMPONENT =============
const LoginPage: React.FC<{ setCurrentPage: (page: string) => void; setIsLoggedIn: (val: boolean) => void }> = ({ setCurrentPage, setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const handleSubmit = (e: FormEvent) => {
  //   e.preventDefault();
  //   setIsLoggedIn(true);
  //   alert('Login successful! Welcome back.');
  //   setCurrentPage('diagnose');
  // };

  const handleSubmit = (e: FormEvent) => {
  e.preventDefault();

  if (!email.trim() || !password.trim()) {
    alert("Email and password are required.");
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert("Please enter a valid email.");
    return;
  }

  setIsLoggedIn(true);
  alert('Login successful! Welcome back.');
  setCurrentPage('diagnose');
};


  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card rounded-2xl shadow-[var(--shadow-large)] p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-primary via-secondary to-accent p-3 rounded-xl mb-4 shadow-[var(--shadow-glow)]">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Login to access your health insights
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
            >
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-primary hover:text-accent font-semibold transition-colors"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= DIAGNOSIS PAGE COMPONENT =============
const DiagnosisPage: React.FC<{ isLoggedIn: boolean; setCurrentPage: (page: string) => void; diagnosisHistory: DiagnosisEntry[]; setDiagnosisHistory: (history: DiagnosisEntry[]) => void }> = ({ isLoggedIn, setCurrentPage, diagnosisHistory, setDiagnosisHistory }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome! Please describe your symptoms in simple terms (e.g., fever, headache, sore throat).'
    }
  ]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSend = async () => {
    
    if (!input.trim()) {
      alert("Please enter at least one symptom.");
      return;
    }

    if (!isLoggedIn) {
      alert('Please login to use the diagnosis feature.');
      setCurrentPage('login');
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input; 
    setInput('');
    setIsAnalyzing(true);

    try {
      // Parse symptoms
      const symptoms = currentInput.toLowerCase().split(/[,;]/).map(s => s.trim()).filter(s => s);
      
      // Make API call
      const response = await axios.post('https://backend-medibot-y1e0.onrender.com/predict', {
        symptoms: symptoms
      });

      const data = response.data;

      // =========== ERROR HANDLING START ===========
      
      // 1. Backend reported a specific error (e.g. invalid symptoms)
      if (data.error) {
        const errorBotMessage: Message = {
          role: 'assistant',
          content: data.error
        };
        setMessages((prev) => [...prev, errorBotMessage]);
        setIsAnalyzing(false);
        return; 
      }

      const predictions = data.predictions || [];

      // 2. No specific error, but no predictions found (Safety check)
      if (predictions.length === 0) {
        const retryMessage: Message = {
          role: 'assistant',
          content: "I couldn't determine a diagnosis based on those details. Please write correct symptoms and send again."
        };
        setMessages((prev) => [...prev, retryMessage]);
        setIsAnalyzing(false);
        return; 
      }
      // =========== ERROR HANDLING END ===========

      const botMessage: Message = {
        role: 'assistant',
        content: `Based on your symptoms, here's my analysis:`,
        predictions: predictions
      };

      setMessages((prev) => [...prev, botMessage]);

      // Add to diagnosis history
      const newEntry: DiagnosisEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        symptoms: symptoms,
        predictions: predictions
      };
      setDiagnosisHistory([...diagnosisHistory, newEntry]);

    } catch (error) {
      console.error('Error calling API:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting to the diagnosis service. Please try again later or consult a healthcare professional.'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-7rem)] flex flex-col">
        <div className="bg-card rounded-2xl shadow-[var(--shadow-large)] flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary via-secondary to-accent p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">MediBot Diagnosis</h1>
                <p className="text-sm text-white/80">AI-Powered Symptom Analysis</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">MediBot</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.predictions && message.predictions.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="border-t border-border pt-3">
                        <p className="font-semibold text-primary mb-2">Primary Analysis:</p>
                        <div className="bg-card rounded-lg p-3 border border-primary/20">
                          <p className="font-semibold">{message.predictions[0].disease}</p>
                          <p className="text-sm text-muted-foreground">
                            Confidence: {(message.predictions[0].confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      {message.predictions.length > 1 && (
                        <div className="border-t border-border pt-3">
                          <p className="font-semibold text-primary mb-2">Other Possibilities:</p>
                          <div className="space-y-2">
                            {message.predictions.slice(1, 3).map((pred, idx) => (
                              <div key={idx} className="bg-card rounded-lg p-3 border border-border">
                                <p className="font-medium">{pred.disease}</p>
                                <p className="text-sm text-muted-foreground">
                                  Confidence: {(pred.confidence * 100).toFixed(1)}%
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mt-3">
                        <p className="text-xs text-destructive">
                          <strong>Disclaimer:</strong> MediBot provides AI-powered insights and is not a substitute for professional medical advice. Please consult a doctor.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isAnalyzing && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl p-4 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-primary">MediBot is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isAnalyzing}
                placeholder="Describe your symptoms (e.g., fever, headache, sore throat)..."
                className="flex-1 px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all disabled:opacity-50"
              />
              <Button
                onClick={handleSend}
                disabled={isAnalyzing || !input.trim()}
                variant="hero"
                size="lg"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};





// ============= REPORTS PAGE COMPONENT =============
const ReportsPage: React.FC<{ diagnosisHistory: DiagnosisEntry[] }> = ({ diagnosisHistory }) => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Reports
          </h1>
          <p className="text-muted-foreground">
            View your diagnosis history and insights
          </p>
        </div>

        {diagnosisHistory.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-[var(--shadow-large)] p-12 text-center">
            <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-foreground">No Reports Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start by describing your symptoms to get your first diagnosis
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {[...diagnosisHistory].reverse().map((entry) => (
              <div key={entry.id} className="bg-card rounded-2xl shadow-[var(--shadow-medium)] hover:shadow-[var(--shadow-large)] transition-all p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-primary mb-1">
                      Diagnosis Report
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-2">Symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.symptoms.map((symptom, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Analysis:</p>
                  <div className="space-y-2">
                    {entry.predictions.map((pred, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 bg-muted rounded-lg"
                      >
                        <span className="font-medium text-foreground">{pred.disease}</span>
                        <span className="text-sm text-muted-foreground">
                          {(pred.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============= PROFILE PAGE COMPONENT =============
const ProfilePage: React.FC<{ userData: UserData | null }> = ({ userData }) => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your personal and medical information
          </p>
        </div>

        {userData ? (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl shadow-[var(--shadow-large)] p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-full">
                  <User className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{userData.fullName}</h2>
                  <p className="text-muted-foreground">{userData.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Age</p>
                  <p className="text-lg text-foreground">{userData.age} years</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Gender</p>
                  <p className="text-lg text-foreground">{userData.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Aadhar Number</p>
                  <p className="text-lg text-foreground">{userData.aadhar}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-[var(--shadow-large)] p-8">
              <h3 className="text-xl font-semibold text-primary mb-4">Medical History</h3>
              {userData.medicalHistory ? (
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {userData.medicalHistory}
                </p>
              ) : (
                <p className="text-muted-foreground italic">
                  No medical history provided
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-[var(--shadow-large)] p-12 text-center">
            <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-foreground">No Profile Data</h2>
            <p className="text-muted-foreground">
              Please complete your profile to see your information here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============= FEEDBACK PAGE COMPONENT =============
const FeedbackPage: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert('Thank you for your feedback!');
    setRating(0);
    setFeedback('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-2xl shadow-[var(--shadow-large)] p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-primary to-accent p-3 rounded-xl mb-4 shadow-[var(--shadow-glow)]">
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Share Your Feedback
            </h1>
            <p className="text-muted-foreground">
              Help us improve MediBot with your valuable insights
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-4 text-center text-foreground">
                How would you rate your experience?
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-10 w-10 ${
                        star <= rating
                          ? 'fill-accent text-accent'
                          : 'fill-none text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                Your Feedback
              </label>
              <textarea
                required
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                placeholder="Tell us about your experience with MediBot..."
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={rating === 0}
            >
              Submit Feedback
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ============= MAIN APP COMPONENT =============
const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisEntry[]>([]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
      />

      {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'signup' && (
        <SignupPage
          setCurrentPage={setCurrentPage}
          setIsLoggedIn={setIsLoggedIn}
          setUserData={setUserData}
        />
      )}
      {currentPage === 'login' && (
        <LoginPage setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} />
      )}
      {currentPage === 'diagnose' && (
        <DiagnosisPage
          isLoggedIn={isLoggedIn}
          setCurrentPage={setCurrentPage}
          diagnosisHistory={diagnosisHistory}
          setDiagnosisHistory={setDiagnosisHistory}
        />
      )}
      {currentPage === 'reports' && <ReportsPage diagnosisHistory={diagnosisHistory} />}
      {currentPage === 'profile' && <ProfilePage userData={userData} />}
      {currentPage === 'feedback' && <FeedbackPage />}

      <Footer />
    </div>
  );
};

export default Index;


