import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PRODUCT_GROUPS as INITIAL_CATEGORIES,
  PROJECTS as INITIAL_PROJECTS,
  CONTACT as INITIAL_CONTACT,
  HERO_CYCLE,
} from '../data/content';
import { BLOG_POSTS as INITIAL_BLOGS } from '../data/blog';

const AdminDataContext = createContext();

const STORAGE_KEY = 'kcr_admin_data_v2';
const AUTH_KEY = 'kcr_admin_auth_v1';

// Initial seed inquiries for demonstration
const INITIAL_INQUIRIES = [
  {
    id: 'inq-1',
    name: 'Bikash Shrestha',
    phone: '+977 9851023456',
    email: 'bikash@himalayandairy.com.np',
    interest: 'Chilling Vat (2000L)',
    district: 'Kavrepalanchok',
    details: 'Need double-jacketed BMC for our milk cooperative collection depot with 3-phase connection.',
    status: 'New',
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: 'Interested in government dairy subsidy layout.',
  },
  {
    id: 'inq-2',
    name: 'Suman Thapa',
    phone: '+977 9841987654',
    email: 'suman@pokharacold.com',
    interest: 'Cold Storage Room (50 MT)',
    district: 'Kaski, Pokhara',
    details: 'Planning apple & potato cold storage chamber. Want estimate for 120mm PUF panels and Bitzer scroll unit.',
    status: 'Contacted',
    date: new Date(Date.now() - 3600000 * 24).toISOString(),
    notes: 'Sent preliminary technical sizing specs. Follow up on site laser measurement.',
  },
  {
    id: 'inq-3',
    name: 'Ramesh Chaudhary',
    phone: '+977 9801234567',
    email: 'ramesh@chitwanagro.com',
    interest: 'Blast Chiller (50 kg/batch)',
    district: 'Chitwan, Bharatpur',
    details: 'Poultry meat shock freezing system. Need +70C to -18C rapid cycle.',
    status: 'Quoted',
    date: new Date(Date.now() - 3600000 * 48).toISOString(),
    notes: 'Quotation sent via WhatsApp: NPR 850,000 including delivery and installation.',
  },
];

// Initial Promotions Data
const INITIAL_PROMOTIONS = [
  {
    id: 'dairy-day',
    tag: 'DAIRY & COLD CHAIN',
    tagColor: '#35d6ff',
    title: 'PURE MILK. ZERO SPOILAGE.',
    highlight: 'TRUST KCR.',
    subtitle: 'From milking point to urban collection hubs, Kathmandu Chilling keeps Nepal’s dairy fresh below 4°C with rapid dimple vats.',
    badge: '🏆 #1 Dairy Partner in Nepal',
    bgGradient: 'linear-gradient(135deg, #0b2546 0%, #0d4b75 50%, #081d38 100%)',
    accentColor: '#35d6ff',
    icon: '🥛',
    footerText: 'Special Cooperative Subsidy Layout Available',
    actionText: 'Inquire Dairy Setup',
    waMsg: 'Hi Kathmandu Chilling, I saw your Pure Milk & Dairy Cold Chain promotion. Please send details and quotation for dairy cooling systems.',
    active: true,
  },
  {
    id: 'rockwell-freezer',
    tag: 'EXCLUSIVE OFFER',
    tagColor: '#ff7a45',
    title: 'ROCKWELL COMMERCIAL FREEZER',
    highlight: 'LIMITED STOCK',
    subtitle: 'High-efficiency hard-top deep freezers with 10-year anti-corrosion tank warranty and sub-zero quick freezing technology.',
    badge: '❄️ Heavy-Duty Tropicalized',
    bgGradient: 'linear-gradient(135deg, #2b1408 0%, #54220b 50%, #170904 100%)',
    accentColor: '#ff7a45',
    icon: '🧊',
    footerText: 'Instant Delivery Across Kathmandu Valley',
    actionText: 'Claim Rockwell Offer',
    waMsg: 'Hi Kathmandu Chilling, I am interested in the Rockwell Commercial Freezer offer. Please send me pricing and specifications.',
    active: true,
  },
  {
    id: 'trade-expo',
    tag: 'EXPO 2026',
    tagColor: '#10b981',
    title: 'NEPAL FOOD & AGRO EXPO 2026',
    highlight: 'VISIT OUR STALL',
    subtitle: 'Experience live 3D thermal simulations, high-efficiency inverter cold room condensing units, and turnkey dairy plant blueprints.',
    badge: '📍 Bhrikutimandap, Kathmandu',
    bgGradient: 'linear-gradient(135deg, #06281e 0%, #0d4a37 50%, #061a14 100%)',
    accentColor: '#10b981',
    icon: '🎪',
    footerText: 'Book VIP 1-on-1 Engineering Consultation',
    actionText: 'Book Expo Meeting',
    waMsg: 'Hi Kathmandu Chilling, I would like to book a VIP engineering meeting at the upcoming Nepal Food & Agro Expo.',
    active: true,
  },
  {
    id: 'nationwide-reach',
    tag: 'NATIONWIDE SERVICE',
    tagColor: '#a855f7',
    title: 'ALL 7 PROVINCES COVERAGE',
    highlight: 'TERAI TO HIMALAYAS',
    subtitle: 'Over 450+ turnkey installations backed by mobile rapid-response technicians and genuine factory spares across Nepal.',
    badge: '🇳🇵 2-Year Full On-Site Warranty',
    bgGradient: 'linear-gradient(135deg, #240d3a 0%, #461972 50%, #150624 100%)',
    accentColor: '#a855f7',
    icon: '🚚',
    footerText: '24/7 Rapid Emergency Response Fleet',
    actionText: 'Contact Service Team',
    waMsg: 'Hi Kathmandu Chilling, I need cold storage installation/support in my district. Please connect me with your regional engineer.',
    active: true,
  },
];

// Initial Company Story, Mission, Nation Building & Future Plans
const INITIAL_STORY = {
  headline: 'Engineered in Nepal, Built for the Nation',
  tagline: 'Empowering Agriculture, Dairy Cooperatives & Small Businesses Across 7 Provinces',
  mission:
    'To eliminate post-harvest agricultural losses and dairy spoilage across Nepal by engineering energy-efficient, robust, and accessible refrigeration systems built with pride in Kathmandu.',
  vision:
    'To build a self-reliant Nepal where every farmer, cooperative, and food entrepreneur has access to decentralized, world-class cold chain infrastructure without relying on expensive foreign imports.',
  nationBuilding:
    'By manufacturing 100% of our refrigeration and dairy machinery locally in Naikap, Kathmandu, we create high-skill engineering jobs for Nepalese youth, reduce national import dependency, and keep capital circulating within the local economy.',
  smallBusinessImpact:
    'We actively support grassroots agro-entrepreneurs, dairy cooperatives, and SME startups with free DPR layout consultations, flexible installment structures, and government subsidy paperwork assistance to make industrial cooling affordable for all.',
  statYears: '14+',
  statProjects: '450+',
  statProvinces: '7 / 7',
  statJobs: '85+ Engineers & Fabricators',
  milestones: [
    {
      year: '2012',
      title: 'Foundation & Precision Engineering Workshop',
      desc: 'Started in Kathmandu as a specialized commercial refrigeration engineering unit focusing on precision PUF panel installations and custom food chillers.',
    },
    {
      year: '2016',
      title: 'First 50+ Dairy Chilling Installations',
      desc: 'Pioneered double-jacketed Bulk Milk Coolers (BMC) across Kavre, Chitwan, and Makwanpur, slashing rural milk spoilage by over 80%.',
    },
    {
      year: '2019',
      title: 'Turnkey Industrial Cold Storage Expansion',
      desc: 'Expanded into large-scale multi-commodity controlled-atmosphere storage chambers and shock blast freezers for poultry and horticulture.',
    },
    {
      year: '2022',
      title: 'Frequency Inverter Tech & ISO Quality Standards',
      desc: 'Introduced smart inverter condensing units, saving commercial clients up to 35% on electricity bills while operating seamlessly on Nepal grid voltages.',
    },
    {
      year: '2026 & Beyond',
      title: 'Nationwide Footprint & 450+ Installations',
      desc: 'Operating a cutting-edge fabrication plant in Naikap, supporting 450+ active installations across all 7 provinces with 24/7 mobile engineer fleets.',
    },
  ],
  futurePlans: [
    {
      icon: '☀️',
      title: 'Solar-Powered Mountain Cold Rooms',
      desc: 'Developing decentralized, off-grid solar cold storage units for remote apple and cardamom farmers in Mustang, Jumla, and Taplejung.',
    },
    {
      icon: '📡',
      title: 'IoT Cold Chain Cloud Telemetry',
      desc: 'Deploying smart IoT telemetry sensors for 24/7 smartphone temperature monitoring, automatic SMS breach alerts, and predictive compressor maintenance.',
    },
    {
      icon: '🤝',
      title: 'Micro-Dairy Cooperative Financing Fund',
      desc: 'Partnering with agricultural development banks to provide zero-collateral machinery leasing and subsidy-backed cold chain equipment for women-led cooperatives.',
    },
  ],
};

// Initial Team Members
const INITIAL_TEAM = [
  {
    id: 'tm-1',
    name: 'Er. Ramesh Yadav',
    role: 'Managing Director & Founder',
    department: 'Executive Leadership',
    experience: '18+ Years in Thermal Engineering',
    bio: 'Pioneered modular cold room manufacturing in Nepal. Has overseen 450+ turnkey installations across all 7 provinces with a vision for national food security.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    specialization: 'Industrial Refrigeration & Turnkey EPC',
  },
  {
    id: 'tm-2',
    name: 'Er. Binod Shrestha',
    role: 'Chief Thermal & Inverter Systems Engineer',
    department: 'Engineering & R&D',
    experience: '14+ Years Experience',
    bio: 'Specializes in thermodynamic heat-load simulations, inverter scroll compressors, and rapid sub-zero blast freezer engineering for extreme tropical climates.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    specialization: 'Inverter Units & Thermodynamic Heat-Load',
  },
  {
    id: 'tm-3',
    name: 'Suman Thapa',
    role: 'Head of Dairy Plant Fabrication',
    department: 'Sanitary Manufacturing',
    experience: '15+ Years Experience',
    bio: 'Expert in SS 304/316 food-grade orbital argon welding, sanitary CIP loops, and high-pressure pasteurization machinery assembly.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    specialization: 'Sanitary SS Fabrication & CIP Systems',
  },
  {
    id: 'tm-4',
    name: 'Pooja Karki',
    role: 'Lead Agro-Subsidy & DPR Consultant',
    department: 'Client Advisory & Projects',
    experience: '8+ Years Experience',
    bio: 'Assists cooperatives and agricultural entrepreneurs in preparing detailed project reports (DPR) and securing government cold chain subsidies.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    specialization: 'DPR Preparation & Govt. Agro Subsidies',
  },
  {
    id: 'tm-5',
    name: 'Bikash Adhikari',
    role: 'Nationwide Service & Field Support Head',
    department: '24/7 Operations',
    experience: '11+ Years Experience',
    bio: 'Leads our rapid mobile field service fleet across Nepal, ensuring zero downtime for critical dairy and cold storage facilities.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    specialization: 'Emergency Diagnostics & Commissioning',
  },
];

export function AdminDataProvider({ children }) {
  // Load data from localStorage or fallback to defaults
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          categories: parsed.categories || INITIAL_CATEGORIES,
          projects: parsed.projects || INITIAL_PROJECTS,
          blogs: parsed.blogs || INITIAL_BLOGS,
          inquiries: parsed.inquiries || INITIAL_INQUIRIES,
          promotions: parsed.promotions || INITIAL_PROMOTIONS,
          contact: parsed.contact || INITIAL_CONTACT,
          story: parsed.story || INITIAL_STORY,
          team: parsed.team || INITIAL_TEAM,
          announcement: parsed.announcement || '★ NEPAL’S LEADING COLD ROOM & DAIRY EQUIPMENT MANUFACTURER · 24/7 NATIONWIDE SERVICE ★',
        };
      }
    } catch (e) {
      console.warn('Error reading admin storage:', e);
    }
    return {
      categories: INITIAL_CATEGORIES,
      projects: INITIAL_PROJECTS,
      blogs: INITIAL_BLOGS,
      inquiries: INITIAL_INQUIRIES,
      promotions: INITIAL_PROMOTIONS,
      contact: INITIAL_CONTACT,
      story: INITIAL_STORY,
      team: INITIAL_TEAM,
      announcement: '★ NEPAL’S LEADING COLD ROOM & DAIRY EQUIPMENT MANUFACTURER · 24/7 NATIONWIDE SERVICE ★',
    };
  });

  // Auth State
  const [auth, setAuth] = useState(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_KEY);
      if (savedAuth) {
        return JSON.parse(savedAuth);
      }
    } catch (e) {}
    return { isAuthenticated: false, user: null };
  });

  // Save to localStorage on data change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save admin data:', e);
    }
  }, [data]);

  // Save Auth on change
  useEffect(() => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    } catch (e) {}
  }, [auth]);

  // Real-time cross-tab and cross-window synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setData(JSON.parse(e.newValue));
        } catch (err) {
          console.warn('Storage sync error:', err);
        }
      }
      if (e.key === AUTH_KEY && e.newValue) {
        try {
          setAuth(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Auth Methods
  const login = (username, password) => {
    if (
      (username === 'admin' && password === 'kcr@2026') ||
      (username === 'kcr' && password === 'admin123')
    ) {
      const authObj = {
        isAuthenticated: true,
        user: { name: 'Admin Manager', role: 'Super Admin', username },
        token: 'kcr-admin-token-' + Date.now(),
      };
      setAuth(authObj);
      return { success: true };
    }
    return { success: false, message: 'Invalid username or password. Default: admin / kcr@2026' };
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, user: null });
    localStorage.removeItem(AUTH_KEY);
  };

  // CRUD for Inquiries
  const addInquiry = (inquiry) => {
    const newInq = {
      id: 'inq-' + Date.now(),
      date: new Date().toISOString(),
      status: 'New',
      ...inquiry,
    };
    setData((prev) => ({
      ...prev,
      inquiries: [newInq, ...prev.inquiries],
    }));
    return newInq;
  };

  const updateInquiryStatus = (id, status, notes) => {
    setData((prev) => ({
      ...prev,
      inquiries: prev.inquiries.map((inq) =>
        inq.id === id ? { ...inq, status: status || inq.status, notes: notes !== undefined ? notes : inq.notes } : inq
      ),
    }));
  };

  const deleteInquiry = (id) => {
    setData((prev) => ({
      ...prev,
      inquiries: prev.inquiries.filter((inq) => inq.id !== id),
    }));
  };

  // CRUD for Products
  const addProduct = (categoryId, product) => {
    const newProd = {
      id: 'prod-' + Date.now(),
      slug: product.slug || product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      ...product,
    };
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, items: [...cat.items, newProd] } : cat
      ),
    }));
  };

  const updateProduct = (categoryId, productId, updatedProduct) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: cat.items.map((item) =>
              item.id === productId || item.slug === productId ? { ...item, ...updatedProduct } : item
            ),
          };
        }
        return cat;
      }),
    }));
  };

  const deleteProduct = (categoryId, productId) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: cat.items.filter((item) => item.id !== productId && item.slug !== productId),
          };
        }
        return cat;
      }),
    }));
  };

  // CRUD for Projects
  const addProject = (project) => {
    const newProj = {
      id: 'proj-' + Date.now(),
      ...project,
    };
    setData((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
    }));
  };

  const updateProject = (id, updatedProject) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updatedProject } : p)),
    }));
  };

  const deleteProject = (id) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // CRUD for Blogs
  const addBlog = (blog) => {
    setData((prev) => ({
      ...prev,
      blogs: [
        {
          id: 'blog-' + Date.now(),
          slug: blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: 'Published',
          ...blog,
        },
        ...prev.blogs,
      ],
    }));
  };

  const updateBlog = (id, updatedBlog) => {
    setData((prev) => ({
      ...prev,
      blogs: prev.blogs.map((b) => (b.id === id ? { ...b, ...updatedBlog } : b)),
    }));
  };

  const deleteBlog = (id) => {
    setData((prev) => ({
      ...prev,
      blogs: prev.blogs.filter((b) => b.id !== id),
    }));
  };

  // CRUD for Promotions
  const updatePromotion = (id, updatedPromo) => {
    setData((prev) => ({
      ...prev,
      promotions: prev.promotions.map((p) => (p.id === id ? { ...p, ...updatedPromo } : p)),
    }));
  };

  // CRUD for Company Story & Mission
  const updateCompanyStory = (updatedStory) => {
    setData((prev) => ({
      ...prev,
      story: { ...prev.story, ...updatedStory },
    }));
  };

  // CRUD for Team Members
  const addTeamMember = (member) => {
    const newMember = {
      id: 'tm-' + Date.now(),
      image: member.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
      ...member,
    };
    setData((prev) => ({
      ...prev,
      team: [...(prev.team || []), newMember],
    }));
  };

  const updateTeamMember = (id, updatedMember) => {
    setData((prev) => ({
      ...prev,
      team: (prev.team || []).map((m) => (m.id === id ? { ...m, ...updatedMember } : m)),
    }));
  };

  const deleteTeamMember = (id) => {
    setData((prev) => ({
      ...prev,
      team: (prev.team || []).filter((m) => m.id !== id),
    }));
  };

  // Update Settings
  const updateSettings = (contactSettings, announcement) => {
    setData((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...contactSettings },
      announcement: announcement !== undefined ? announcement : prev.announcement,
    }));
  };

  // Backup & Restore
  const exportBackup = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `kcr-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackup = (jsonData) => {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (parsed.categories || parsed.projects || parsed.inquiries || parsed.story) {
        setData(parsed);
        return { success: true };
      }
      return { success: false, message: 'Invalid backup file structure' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  const resetToDefaults = () => {
    const defaultData = {
      categories: INITIAL_CATEGORIES,
      projects: INITIAL_PROJECTS,
      blogs: INITIAL_BLOGS,
      inquiries: INITIAL_INQUIRIES,
      promotions: INITIAL_PROMOTIONS,
      contact: INITIAL_CONTACT,
      story: INITIAL_STORY,
      team: INITIAL_TEAM,
      announcement: '★ NEPAL’S LEADING COLD ROOM & DAIRY EQUIPMENT MANUFACTURER · 24/7 NATIONWIDE SERVICE ★',
    };
    setData(defaultData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  };

  return (
    <AdminDataContext.Provider
      value={{
        data,
        auth,
        login,
        logout,
        // Inquiries
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        // Products
        addProduct,
        updateProduct,
        deleteProduct,
        // Projects
        addProject,
        updateProject,
        deleteProject,
        // Blogs
        addBlog,
        updateBlog,
        deleteBlog,
        // Promotions
        updatePromotion,
        // Story & Team (New)
        updateCompanyStory,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        // Settings
        updateSettings,
        // Utilities
        exportBackup,
        importBackup,
        resetToDefaults,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
}
