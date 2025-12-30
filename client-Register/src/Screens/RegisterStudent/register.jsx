import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Building2, Phone, Check, Loader2, Sparkles, ArrowRight, X, Calendar, MapPin } from 'lucide-react';

const ConferenceRegistration = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [particles, setParticles] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    setPageLoaded(true);
    generateParticles();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const generateParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 15
      });
    }
    setParticles(newParticles);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim().length >= 2 ? '' : 'Name must be at least 2 characters';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address';
      case 'company':
        return selectedType === 'professional' && value.trim().length < 2
          ? 'Company name is required'
          : '';
      case 'phone':
        return value && !/^\+?[\d\s-()]+$/.test(value) ? 'Invalid phone number' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    setValidFields(prev => ({ ...prev, [name]: !error && value.trim() !== '' }));
  };

  const handleSubmit = async () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key === 'company' && selectedType !== 'professional') return;
      if (key === 'phone' && !formData[key]) return;
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    if (selectedType === 'professional' && !formData.company) {
      alert('Company name is required for professional registration');
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_Base_API}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          registration_type: selectedType,
          company: selectedType === 'professional' ? formData.company : undefined,
          phone: formData.phone || undefined
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowSuccess(true);
        setFormData({ name: '', email: '', company: '', phone: '' });
        setValidFields({});
        setTimeout(() => {
          setShowSuccess(false);
          setSelectedType(null);
        }, 4000);
      } else {
        alert(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const theme = {
    bg: darkMode ? '#0a0118' : '#faf8ff',
    cardBg: darkMode ? 'rgba(25, 10, 45, 0.85)' : 'rgba(255, 255, 255, 0.85)',
    text: darkMode ? '#f5f0ff' : '#1a0b2e',
    textSecondary: darkMode ? '#b794f6' : '#6b46c1',
    border: darkMode ? 'rgba(183, 148, 246, 0.2)' : 'rgba(107, 70, 193, 0.15)',
    inputBg: darkMode ? 'rgba(10, 1, 24, 0.6)' : 'rgba(255, 255, 255, 0.95)',
    accent: darkMode ? '#b794f6' : '#6b46c1',
    accentBright: darkMode ? '#d8b4fe' : '#8b5cf6'
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: darkMode 
        ? 'radial-gradient(ellipse at top, #1a0b2e 0%, #0a0118 50%, #000000 100%)'
        : 'radial-gradient(ellipse at top, #f3e8ff 0%, #faf8ff 50%, #ffffff 100%)',
      fontFamily: "'Space Grotesk', 'Syne', 'Outfit', sans-serif",
      color: theme.text,
      padding: '0',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: pageLoaded ? 1 : 0,
      position: 'relative',
      overflow: 'hidden'
    },
    particleCanvas: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1
    },
    particle: (particle) => ({
      position: 'absolute',
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      background: darkMode 
        ? `radial-gradient(circle, rgba(183, 148, 246, 0.6), rgba(139, 92, 246, 0.2))`
        : `radial-gradient(circle, rgba(139, 92, 246, 0.4), rgba(107, 70, 193, 0.1))`,
      borderRadius: '50%',
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite alternate`,
      filter: 'blur(1px)',
      boxShadow: darkMode 
        ? '0 0 20px rgba(183, 148, 246, 0.3)'
        : '0 0 15px rgba(139, 92, 246, 0.2)'
    }),
    cursorGlow: {
      position: 'fixed',
      width: '600px',
      height: '600px',
      background: darkMode
        ? 'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%)'
        : 'radial-gradient(circle, rgba(139, 92, 246, 0.08), transparent 70%)',
      borderRadius: '50%',
      pointerEvents: 'none',
      left: `${mousePosition.x}px`,
      top: `${mousePosition.y}px`,
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 2,
      filter: 'blur(60px)'
    },
    mainContent: {
      position: 'relative',
      zIndex: 10,
      padding: '2rem'
    },
    navbar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      padding: '1.5rem 3rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
      background: scrollY > 50 
        ? darkMode 
          ? 'rgba(10, 1, 24, 0.8)'
          : 'rgba(255, 255, 255, 0.8)'
        : 'transparent',
      backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
      borderBottom: scrollY > 50 ? `1px solid ${theme.border}` : 'none',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    logo: {
      fontSize: '24px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentBright})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.02em'
    },
    navRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem'
    },
    navLink: {
      fontSize: '14px',
      fontWeight: '500',
      color: theme.textSecondary,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      padding: '0.5rem 0'
    },
    darkModeToggle: {
      background: theme.cardBg,
      backdropFilter: 'blur(20px)',
      border: `2px solid ${theme.border}`,
      borderRadius: '50px',
      padding: '0.6rem 1.2rem',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      color: theme.text,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: darkMode
        ? '0 4px 20px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        : '0 4px 20px rgba(107, 70, 193, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
    },
    hero: {
      textAlign: 'center',
      paddingTop: '12rem',
      paddingBottom: '4rem',
      position: 'relative',
      transform: `translateY(${scrollY * 0.2}px)`
    },
    heroLabel: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1.2rem',
      background: theme.cardBg,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${theme.border}`,
      borderRadius: '50px',
      fontSize: '13px',
      fontWeight: '600',
      color: theme.accent,
      marginBottom: '2rem',
      animation: 'fadeSlideDown 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: darkMode
        ? '0 4px 20px rgba(139, 92, 246, 0.2)'
        : '0 4px 20px rgba(107, 70, 193, 0.1)'
    },
    heroTitle: {
      fontSize: '72px',
      fontWeight: '800',
      marginBottom: '1.5rem',
      background: `linear-gradient(135deg, ${theme.text} 0%, ${theme.accent} 50%, ${theme.accentBright} 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      lineHeight: '1.1',
      letterSpacing: '-0.03em',
      animation: 'fadeSlideUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both',
      textShadow: darkMode 
        ? '0 0 80px rgba(139, 92, 246, 0.3)'
        : '0 0 60px rgba(107, 70, 193, 0.2)'
    },
    heroSubtitle: {
      fontSize: '22px',
      color: theme.textSecondary,
      fontWeight: '500',
      maxWidth: '700px',
      margin: '0 auto 3rem',
      lineHeight: '1.6',
      animation: 'fadeSlideUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both'
    },
    heroDetails: {
      display: 'flex',
      justifyContent: 'center',
      gap: '3rem',
      flexWrap: 'wrap',
      animation: 'fadeSlideUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both'
    },
    heroDetail: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '15px',
      color: theme.textSecondary,
      fontWeight: '500'
    },
    cardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '2.5rem',
      maxWidth: '1200px',
      margin: '0 auto 5rem',
      padding: '0 2rem',
      animation: 'fadeSlideUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.8s both'
    },
    card: (type, isSelected) => ({
      background: theme.cardBg,
      backdropFilter: 'blur(30px)',
      border: isSelected 
        ? `3px solid ${theme.accentBright}`
        : `2px solid ${theme.border}`,
      borderRadius: '32px',
      padding: '3rem',
      cursor: 'pointer',
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isSelected 
        ? 'scale(1.05) translateY(-10px) rotateX(2deg)'
        : hoveredCard === type
        ? 'scale(1.03) translateY(-5px)'
        : 'scale(1) translateY(0)',
      boxShadow: isSelected 
        ? darkMode
          ? '0 30px 80px rgba(139, 92, 246, 0.4), 0 0 0 1px rgba(183, 148, 246, 0.2) inset'
          : '0 30px 80px rgba(107, 70, 193, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.2) inset'
        : hoveredCard === type
        ? darkMode
          ? '0 20px 60px rgba(139, 92, 246, 0.3)'
          : '0 20px 60px rgba(107, 70, 193, 0.2)'
        : darkMode
        ? '0 10px 40px rgba(0, 0, 0, 0.3)'
        : '0 10px 40px rgba(107, 70, 193, 0.08)',
      position: 'relative',
      overflow: 'hidden',
      perspective: '1000px'
    }),
    cardGlow: (isSelected, type) => ({
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: darkMode
        ? 'radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 60%)'
        : 'radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 60%)',
      opacity: isSelected ? 1 : hoveredCard === type ? 0.6 : 0,
      transition: 'opacity 0.5s ease',
      pointerEvents: 'none'
    }),
    cardContent: {
      position: 'relative',
      zIndex: 1
    },
    cardIcon: {
      fontSize: '56px',
      marginBottom: '1.5rem',
      display: 'block',
      filter: 'drop-shadow(0 4px 20px rgba(139, 92, 246, 0.3))',
      transition: 'all 0.3s ease'
    },
    cardBadge: {
      display: 'inline-block',
      padding: '0.4rem 1rem',
      background: darkMode
        ? 'rgba(139, 92, 246, 0.2)'
        : 'rgba(139, 92, 246, 0.1)',
      border: `1px solid ${theme.accent}`,
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '700',
      color: theme.accent,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      marginBottom: '1rem'
    },
    cardTitle: {
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '1rem',
      color: theme.text,
      letterSpacing: '-0.02em'
    },
    cardDescription: {
      fontSize: '16px',
      color: theme.textSecondary,
      lineHeight: '1.7',
      marginBottom: '2rem'
    },
    cardFeatures: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      marginBottom: '2rem'
    },
    cardFeature: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '14px',
      color: theme.textSecondary,
      fontWeight: '500'
    },
    cardButton: (isSelected) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      width: '100%',
      padding: '1rem',
      background: isSelected
        ? `linear-gradient(135deg, ${theme.accent}, ${theme.accentBright})`
        : theme.border,
      color: isSelected ? 'white' : theme.textSecondary,
      border: 'none',
      borderRadius: '16px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isSelected
        ? darkMode
          ? '0 10px 30px rgba(139, 92, 246, 0.4)'
          : '0 10px 30px rgba(107, 70, 193, 0.3)'
        : 'none'
    }),
    formContainer: {
      maxWidth: '700px',
      margin: '0 auto',
      background: theme.cardBg,
      backdropFilter: 'blur(30px)',
      border: `2px solid ${theme.border}`,
      borderRadius: '40px',
      padding: '4rem',
      boxShadow: darkMode
        ? '0 30px 100px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(183, 148, 246, 0.1) inset'
        : '0 30px 100px rgba(107, 70, 193, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
      animation: selectedType ? 'formSlideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      opacity: selectedType ? 1 : 0,
      transform: selectedType ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
      transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      display: selectedType ? 'block' : 'none',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: '5rem'
    },
    formGlow: {
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      height: '200px',
      background: darkMode
        ? 'radial-gradient(ellipse, rgba(139, 92, 246, 0.3), transparent 70%)'
        : 'radial-gradient(ellipse, rgba(139, 92, 246, 0.2), transparent 70%)',
      filter: 'blur(40px)',
      pointerEvents: 'none'
    },
    formHeader: {
      position: 'relative',
      zIndex: 1,
      textAlign: 'center',
      marginBottom: '3rem'
    },
    formIcon: {
      fontSize: '48px',
      marginBottom: '1rem',
      display: 'block'
    },
    formTitle: {
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '0.5rem',
      color: theme.text,
      letterSpacing: '-0.02em'
    },
    formSubtitle: {
      fontSize: '16px',
      color: theme.textSecondary,
      fontWeight: '500'
    },
    formBody: {
      position: 'relative',
      zIndex: 1
    },
    inputGroup: {
      marginBottom: '2rem',
      position: 'relative'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '0.75rem',
      color: theme.text,
      letterSpacing: '0.02em',
      textTransform: 'uppercase'
    },
    inputWrapper: {
      position: 'relative'
    },
    input: (hasError, isValid) => ({
      width: '100%',
      padding: '1.1rem 1.2rem 1.1rem 3.5rem',
      fontSize: '16px',
      border: `2px solid ${
        hasError 
          ? '#ef4444' 
          : isValid 
          ? theme.accentBright 
          : theme.border
      }`,
      borderRadius: '20px',
      background: theme.inputBg,
      backdropFilter: 'blur(10px)',
      color: theme.text,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      outline: 'none',
      boxShadow: hasError 
        ? '0 0 0 4px rgba(239, 68, 68, 0.1)'
        : isValid 
        ? darkMode
          ? '0 0 0 4px rgba(139, 92, 246, 0.15)'
          : '0 0 0 4px rgba(107, 70, 193, 0.08)'
        : 'none',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      fontWeight: '500'
    }),
    inputIcon: (hasError, isValid) => ({
      position: 'absolute',
      left: '1.2rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: hasError 
        ? '#ef4444' 
        : isValid 
        ? theme.accentBright 
        : theme.textSecondary,
      transition: 'all 0.3s ease',
      pointerEvents: 'none',
      zIndex: 1
    }),
    validIcon: {
      position: 'absolute',
      right: '1.2rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: theme.accentBright,
      pointerEvents: 'none',
      animation: 'checkPop 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    error: {
      color: '#ef4444',
      fontSize: '13px',
      marginTop: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontWeight: '500',
      animation: 'errorShake 0.4s ease'
    },
    submitButton: {
      width: '100%',
      padding: '1.3rem',
      fontSize: '17px',
      fontWeight: '700',
      color: 'white',
      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentBright})`,
      border: 'none',
      borderRadius: '20px',
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: darkMode
        ? '0 15px 40px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        : '0 15px 40px rgba(107, 70, 193, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      marginTop: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      opacity: isSubmitting ? 0.7 : 1,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
      position: 'relative',
      overflow: 'hidden'
    },
    buttonShine: {
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
      transition: 'left 0.6s ease',
      pointerEvents: 'none'
    },
    successModal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: showSuccess 
        ? 'translate(-50%, -50%) scale(1) rotateX(0deg)' 
        : 'translate(-50%, -50%) scale(0.8) rotateX(10deg)',
      background: theme.cardBg,
      backdropFilter: 'blur(30px)',
      border: `3px solid ${theme.accentBright}`,
      borderRadius: '40px',
      padding: '4rem',
      boxShadow: darkMode
        ? '0 40px 120px rgba(139, 92, 246, 0.5), 0 0 0 1px rgba(183, 148, 246, 0.2) inset'
        : '0 40px 120px rgba(107, 70, 193, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
      zIndex: 1001,
      textAlign: 'center',
      opacity: showSuccess ? 1 : 0,
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: showSuccess ? 'all' : 'none',
      maxWidth: '500px',
      width: '90%'
    },
    successIconWrapper: {
      width: '100px',
      height: '100px',
      margin: '0 auto 2rem',
      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentBright})`,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: showSuccess ? 'successPulse 1s ease-in-out' : 'none',
      boxShadow: darkMode
        ? '0 20px 60px rgba(139, 92, 246, 0.5)'
        : '0 20px 60px rgba(107, 70, 193, 0.4)'
    },
    successIcon: {
      fontSize: '48px',
      filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.2))'
    },
    successTitle: {
      fontSize: '32px',
      fontWeight: '700',
      marginBottom: '1rem',
      color: theme.text,
      letterSpacing: '-0.02em'
    },
    successMessage: {
      fontSize: '16px',
      color: theme.textSecondary,
      lineHeight: '1.6',
      marginBottom: '2rem',
      fontWeight: '500'
    },
    successDetails: {
      padding: '1.5rem',
      background: darkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)',
      borderRadius: '20px',
      border: `1px solid ${theme.border}`,
      marginBottom: '2rem'
    },
    successDetail: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '14px',
      color: theme.textSecondary,
      fontWeight: '500'
    },
    closeButton: {
      padding: '0.8rem 2rem',
      background: 'transparent',
      border: `2px solid ${theme.border}`,
      borderRadius: '16px',
      color: theme.textSecondary,
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    overlay: {
      position: 'fixed',
      inset: 0,
      background: darkMode 
        ? 'rgba(10, 1, 24, 0.8)' 
        : 'rgba(107, 70, 193, 0.2)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      opacity: showSuccess ? 1 : 0,
      transition: 'opacity 0.4s ease',
      pointerEvents: showSuccess ? 'all' : 'none'
    },
    footer: {
      textAlign: 'center',
      padding: '4rem 2rem',
      color: theme.textSecondary,
      fontSize: '14px',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Syne:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          @keyframes float {
            from { transform: translateY(0px); }
            to { transform: translateY(-30px); }
          }

          @keyframes fadeSlideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeSlideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes formSlideUp {
            from {
              opacity: 0;
              transform: translateY(50px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes checkPop {
            0% { transform: translateY(-50%) scale(0); }
            50% { transform: translateY(-50%) scale(1.2); }
            100% { transform: translateY(-50%) scale(1); }
          }

          @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          @keyframes successPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          input:focus {
            transform: translateY(-2px);
          }

          button:not(:disabled):hover .button-shine {
            left: 100%;
          }

          @media (max-width: 768px) {
            .hero-title { 
              font-size: 42px !important; 
              line-height: 1.2 !important;
            }
            .hero-subtitle { 
              font-size: 18px !important; 
            }
          }

          @media (max-width: 480px) {
            .hero-title { 
              font-size: 32px !important; 
            }
          }

          ::selection {
            background: ${darkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(107, 70, 193, 0.2)'};
            color: ${theme.text};
          }
        `}
      </style>

      {/* Particles */}
      <div style={styles.particleCanvas}>
        {particles.map((particle, i) => (
          <div key={i} style={styles.particle(particle)} />
        ))}
      </div>

      {/* Cursor Glow */}
      <div style={styles.cursorGlow} />

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <Sparkles size={24} />
          <span>FutureTech 2025</span>
        </div>
        <div style={styles.navRight}>
          <div 
            style={styles.navLink}
            onMouseEnter={(e) => {
              e.target.style.color = theme.accent;
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = theme.textSecondary;
              e.target.style.transform = 'translateY(0)';
            }}
          >
            About
          </div>
          <div 
            style={styles.navLink}
            onMouseEnter={(e) => {
              e.target.style.color = theme.accent;
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = theme.textSecondary;
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Schedule
          </div>
          <div 
            style={styles.navLink}
            onMouseEnter={(e) => {
              e.target.style.color = theme.accent;
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = theme.textSecondary;
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Speakers
          </div>
        
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <div style={styles.heroLabel}>
            <Sparkles size={14} />
            <span>March 15-17, 2025 • San Francisco</span>
          </div>
          <h1 className="hero-title" style={styles.heroTitle}>
            Shape the Future<br />of Technology
          </h1>
          <p className="hero-subtitle" style={styles.heroSubtitle}>
            Join 10,000+ innovators, builders, and dreamers at the world's most transformative tech conference
          </p>
          <div style={styles.heroDetails}>
            <div style={styles.heroDetail}>
              <Calendar size={18} />
              <span>3 Days of Innovation</span>
            </div>
            <div style={styles.heroDetail}>
              <MapPin size={18} />
              <span>Moscone Center, SF</span>
            </div>
            <div style={styles.heroDetail}>
              <Sparkles size={18} />
              <span>50+ World-Class Speakers</span>
            </div>
          </div>
        </div>

        {/* Registration Cards */}
        <div style={styles.cardsContainer}>
          <div
            style={styles.card('student', selectedType === 'student')}
            onClick={() => setSelectedType('student')}
            onMouseEnter={() => setHoveredCard('student')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardGlow(selectedType === 'student', 'student')} />
            <div style={styles.cardContent}>
              <div style={styles.cardIcon}>🎓</div>
              <div style={styles.cardBadge}>Student Pass</div>
              <h3 style={styles.cardTitle}>Student</h3>
              <p style={styles.cardDescription}>
                Special pricing for students ready to learn, network, and launch their tech careers.
              </p>
              <div style={styles.cardFeatures}>
                <div style={styles.cardFeature}>
                  <Check size={16} color={theme.accent} />
                  <span>Full conference access</span>
                </div>
                <div style={styles.cardFeature}>
                  <Check size={16} color={theme.accent} />
                  <span>Workshop sessions</span>
                </div>
                <div style={styles.cardFeature}>
                  <Check size={16} color={theme.accent} />
                  <span>Student networking lounge</span>
                </div>
                <div style={styles.cardFeature}>
                  <Check size={16} color={theme.accent} />
                  <span>Digital resource pack</span>
                </div>
              </div>
              <button
                style={styles.cardButton(selectedType === 'student')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = darkMode
                    ? '0 15px 40px rgba(139, 92, 246, 0.5)'
                    : '0 15px 40px rgba(107, 70, 193, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = selectedType === 'student'
                    ? darkMode
                      ? '0 10px 30px rgba(139, 92, 246, 0.4)'
                      : '0 10px 30px rgba(107, 70, 193, 0.3)'
                    : 'none';
                }}
              >
                {selectedType === 'student' ? (
                  <>
                    <Check size={18} />
                    Selected
                  </>
                ) : (
                  <>
                    Register Now
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>

          <div
            style={styles.card('professional', selectedType === 'professional')}
            onClick={() => setSelectedType('professional')}
            onMouseEnter={() => setHoveredCard('professional')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardGlow(selectedType === 'professional', 'professional')} />
            <div style={styles.cardContent}>
              <div style={styles.cardIcon}>💼</div>
              <div style={styles.cardBadge}>Professional Pass</div>
              <h3 style={styles.cardTitle}>Professional</h3>
              <p style={styles.cardDescription}>
                Premium access for industry professionals looking to expand their network and expertise.
              </p>
              <div style={styles.cardFeatures}>
                <div style={styles.cardFeature}>
                  <Check size={16} color={theme.accent} />
                  <span>VIP conference access</span>
                </div>
                <div style={styles.cardFeature}>
                  <Check size={16} color={theme.accent} />
                  <span>Executive networking events</span>
                </div>
                <div style={styles.cardFeature}>
                  <Check size={16} color={theme.accent} />
                  <span>1-on-1 expert sessions</span>
                </div>
                <div style={styles.cardFeature}>
                  <Check size={16} color={theme.accent} />
                  <span>Premium swag & materials</span>
                </div>
              </div>
              <button
                style={styles.cardButton(selectedType === 'professional')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = darkMode
                    ? '0 15px 40px rgba(139, 92, 246, 0.5)'
                    : '0 15px 40px rgba(107, 70, 193, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = selectedType === 'professional'
                    ? darkMode
                      ? '0 10px 30px rgba(139, 92, 246, 0.4)'
                      : '0 10px 30px rgba(107, 70, 193, 0.3)'
                    : 'none';
                }}
              >
                {selectedType === 'professional' ? (
                  <>
                    <Check size={18} />
                    Selected
                  </>
                ) : (
                  <>
                    Register Now
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        {selectedType && (
          <div style={styles.formContainer}>
            <div style={styles.formGlow} />
            
            <div style={styles.formHeader}>
              <div style={styles.formIcon}>
                {selectedType === 'student' ? '🎓' : '💼'}
              </div>
              <h2 style={styles.formTitle}>
                Complete Your Registration
              </h2>
              <p style={styles.formSubtitle}>
                {selectedType === 'student' 
                  ? 'Join as a Student Member'
                  : 'Join as a Professional Member'}
              </p>
            </div>

            <div style={styles.formBody}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <User size={14} />
                  Full Name
                </label>
                <div style={styles.inputWrapper}>
                  <User size={20} style={styles.inputIcon(errors.name, validFields.name)} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={styles.input(errors.name, validFields.name)}
                    placeholder="Enter your full name"
                  />
                  {validFields.name && (
                    <Check size={20} style={styles.validIcon} />
                  )}
                </div>
                {errors.name && <div style={styles.error}>⚠️ {errors.name}</div>}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Mail size={14} />
                  Email Address
                </label>
                <div style={styles.inputWrapper}>
                  <Mail size={20} style={styles.inputIcon(errors.email, validFields.email)} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={styles.input(errors.email, validFields.email)}
                    placeholder="your.email@example.com"
                  />
                  {validFields.email && (
                    <Check size={20} style={styles.validIcon} />
                  )}
                </div>
                {errors.email && <div style={styles.error}>⚠️ {errors.email}</div>}
              </div>

              {selectedType === 'professional' && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <Building2 size={14} />
                    Company Name
                  </label>
                  <div style={styles.inputWrapper}>
                    <Building2 size={20} style={styles.inputIcon(errors.company, validFields.company)} />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      style={styles.input(errors.company, validFields.company)}
                      placeholder="Your company name"
                    />
                    {validFields.company && (
                      <Check size={20} style={styles.validIcon} />
                    )}
                  </div>
                  {errors.company && <div style={styles.error}>⚠️ {errors.company}</div>}
                </div>
              )}

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Phone size={14} />
                  Phone Number (Optional)
                </label>
                <div style={styles.inputWrapper}>
                  <Phone size={20} style={styles.inputIcon(errors.phone, validFields.phone)} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={styles.input(errors.phone, validFields.phone)}
                    placeholder="+1 (555) 000-0000"
                  />
                  {validFields.phone && (
                    <Check size={20} style={styles.validIcon} />
                  )}
                </div>
                {errors.phone && <div style={styles.error}>⚠️ {errors.phone}</div>}
              </div>

              <button
                onClick={handleSubmit}
                style={styles.submitButton}
                disabled={isSubmitting}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = darkMode
                      ? '0 20px 50px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      : '0 20px 50px rgba(107, 70, 193, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = darkMode
                    ? '0 15px 40px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    : '0 15px 40px rgba(107, 70, 193, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                }}
              >
                <div className="button-shine" style={styles.buttonShine} />
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={styles.footer}>
          <p>© 2025 FutureTech Conference. All rights reserved.</p>
        </footer>
      </div>

      {/* Success Modal */}
      <div style={styles.overlay} onClick={() => {
        setShowSuccess(false);
        setSelectedType(null);
      }} />
      <div style={styles.successModal}>
        <div style={styles.successIconWrapper}>
          <div style={styles.successIcon}>✨</div>
        </div>
        <h2 style={styles.successTitle}>Registration Complete!</h2>
        <p style={styles.successMessage}>
          Welcome to FutureTech 2025! You're all set to join us for an incredible experience.
        </p>
        <div style={styles.successDetails}>
          <div style={styles.successDetail}>
            <Calendar size={16} />
            <span>March 15-17, 2025</span>
          </div>
        </div>
        <button
          style={styles.closeButton}
          onClick={() => {
            setShowSuccess(false);
            setSelectedType(null);
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.accent;
            e.currentTarget.style.color = theme.accent;
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.border;
            e.currentTarget.style.color = theme.textSecondary;
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ConferenceRegistration;