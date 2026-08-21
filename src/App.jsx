import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import FrostCanvas from './components/FrostCanvas.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import IndustryShowcase from './components/IndustryShowcase.jsx';
import Products from './components/Products.jsx';
import PromoBanners from './components/PromoBanners.jsx';
import ColdCalculator from './components/ColdCalculator.jsx';
import TechEdge from './components/TechEdge.jsx';
import Projects from './components/Projects.jsx';
import Certifications from './components/Certifications.jsx';
import Sectors from './components/Sectors.jsx';
import WhyUs from './components/WhyUs.jsx';
import Clients from './components/Clients.jsx';
import CtaBand from './components/CtaBand.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import FloatingActions from './components/FloatingActions.jsx';
import ScrollManager from './components/ScrollManager.jsx';
import BlogPreview from './components/blog/BlogPreview.jsx';
import { useSeo } from './hooks/useSeo';
import { AdminDataProvider } from './context/AdminDataContext.jsx';

// Lazy-loaded routes for ultra-fast production performance
const ProductDetail = lazy(() => import('./components/ProductDetail.jsx'));
const BlogList = lazy(() => import('./components/blog/BlogList.jsx'));
const BlogPost = lazy(() => import('./components/blog/BlogPost.jsx'));
const NotFound = lazy(() => import('./components/blog/NotFound.jsx'));

// Standalone Public Pages (Lazy Loaded)
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ProductsPage = lazy(() => import('./pages/ProductsPage.jsx'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage.jsx'));
const TechnologyPage = lazy(() => import('./pages/TechnologyPage.jsx'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'));
const SectorsPage = lazy(() => import('./pages/SectorsPage.jsx'));
const WhyUsPage = lazy(() => import('./pages/WhyUsPage.jsx'));
const PromotionsPage = lazy(() => import('./pages/PromotionsPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));

// Admin Suite (Lazy Loaded)
const AdminLayout = lazy(() => import('./admin/AdminLayout.jsx'));
const AdminLogin = lazy(() => import('./admin/AdminLogin.jsx'));
const ProtectedRoute = lazy(() => import('./admin/ProtectedRoute.jsx'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard.jsx'));
const AdminProducts = lazy(() => import('./admin/AdminProducts.jsx'));
const AdminProjects = lazy(() => import('./admin/AdminProjects.jsx'));
const AdminStory = lazy(() => import('./admin/AdminStory.jsx'));
const AdminBlogs = lazy(() => import('./admin/AdminBlogs.jsx'));
const AdminInquiries = lazy(() => import('./admin/AdminInquiries.jsx'));
const AdminPromotions = lazy(() => import('./admin/AdminPromotions.jsx'));
const AdminSettings = lazy(() => import('./admin/AdminSettings.jsx'));

function PageLoader() {
  return (
    <div style={{ minHeight: '55vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div className="live-pulse" style={{ width: '22px', height: '22px', background: 'var(--ice)', boxShadow: '0 0 20px var(--ice)' }}></div>
      <span className="mono" style={{ color: 'var(--steel-dim)', fontSize: '11px', letterSpacing: '0.12em' }}>
        LOADING REFRIGERATION MODULE...
      </span>
    </div>
  );
}

function Home() {
  useSeo({
    title: 'Cold Storage Room & Dairy Equipment Manufacturer in Nepal',
    description:
      'Leading cold room, walk-in freezer, blast chiller, chilling vat and turnkey dairy processing plant manufacturer in Kathmandu, Nepal. Custom engineering and 24/7 service.',
    canonical: 'https://kathmanduchilling.com.np/',
  });
  return (
    <>
      <Hero />
      <Marquee />
      <IndustryShowcase />
      <Products />
      <PromoBanners />
      <ColdCalculator />
      <TechEdge />
      <Projects />
      <Certifications />
      <Sectors />
      <WhyUs />
      <Clients />
      <BlogPreview />
      <CtaBand />
      <Contact />
    </>
  );
}

function PublicLayout() {
  return (
    <>
      <FrostCanvas />
      <Header />
      <FloatingActions />
      <main id="top">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AdminDataProvider>
      <BrowserRouter>
        <ScrollManager />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Admin Authentication & Suite Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="story" element={<AdminStory />} />
                <Route path="team" element={<AdminStory />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="promotions" element={<AdminPromotions />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* Public Website Routes with Shared Header & Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/our-story" element={<AboutPage />} />
              <Route path="/team" element={<AboutPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/product-detail" element={<ProductDetail />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/technology" element={<TechnologyPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/sectors" element={<SectorsPage />} />
              <Route path="/why-us" element={<WhyUsPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
        <SpeedInsights />
      </BrowserRouter>
    </AdminDataProvider>
  );
}
