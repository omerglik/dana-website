import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Star, Users, Award, Heart, MessageCircle, User, Calendar, CheckCircle2, Facebook, Instagram, Menu, X } from 'lucide-react';
import emailjs, { EMAIL_CONFIG } from './emailConfig';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'קביעת תור ראשוני',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'שם מלא הוא שדה חובה';
        if (value.trim().length < 2) return 'שם חייב להכיל לפחות 2 תווים';
        return '';
      case 'phone':
        if (!value.trim()) return 'מספר טלפון הוא שדה חובה';
        const phoneRegex = /^0[2-9]\d{1,2}-?\d{7}$|^05[0-9]-?\d{7}$/;
        if (!phoneRegex.test(value.replace(/[-\s]/g, ''))) return 'מספר טלפון לא תקין';
        return '';
      case 'email':
        if (!value.trim()) return 'כתובת אימייל היא שדה חובה';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'כתובת אימייל לא תקינה';
        return '';
      case 'message':
        if (!value.trim()) return 'הודעה היא שדה חובה';
        if (value.trim().length < 10) return 'ההודעה חייבת להכיל לפחות 10 תווים';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mark field as touched
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const requiredFields = ['name', 'phone', 'email', 'message'];
    const errors: {[key: string]: string} = {};
    let hasErrors = false;

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        errors[field] = error;
        hasErrors = true;
      }
    });

    setFieldErrors(errors);
    setTouchedFields({
      name: true,
      phone: true,
      email: true,
      message: true
    });

    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const result = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          to_email: 'tabachnik.dana@gmail.com'
        }
      );

      if (result.status === 200) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          subject: 'קביעת תור ראשוני',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-assistant" dir="rtl">
      {/* Skip Links for Screen Readers */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 bg-primary-600 text-white px-4 py-2 rounded-lg z-50">
        דלג לתוכן הראשי
      </a>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50" role="banner">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">דנה גליקמן</h1>
              <p className="text-sm text-gray-600">קלינאית תקשורת</p>
            </div>
            
            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex space-x-8 space-x-reverse items-center absolute left-1/2 transform -translate-x-1/2" role="navigation" aria-label="תפריט ניווט ראשי">
              <a href="#home" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">בית</a>
              <a href="#about" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">אודות</a>
              <a href="#services" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">שירותים</a>
              <a href="#testimonials" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">המלצות</a>
              <a href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">צור קשר</a>
            </nav>
            
            {/* Spacer for balance */}
            <div className="hidden md:block w-20"></div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "סגור תפריט" : "פתח תפריט"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo - Left Side */}
            <div className="hidden md:block absolute left-6 top-1/2 transform -translate-y-1/2 z-60">
              <img 
                src="/dana-logo.png" 
                alt="לוגו דנה גליקמן - קלינאית תקשורת" 
                className="h-40 w-auto hover:scale-105 transition-transform duration-300"
                role="img"
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-200" id="mobile-menu" role="navigation" aria-label="תפריט ניווט נייד">
              <div className="flex flex-col space-y-4 pt-4">
                <a href="#home" className="text-gray-700 hover:text-primary-600 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>בית</a>
                <a href="#about" className="text-gray-700 hover:text-primary-600 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>אודות</a>
                <a href="#services" className="text-gray-700 hover:text-primary-600 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>שירותים</a>
                <a href="#testimonials" className="text-gray-700 hover:text-primary-600 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>המלצות</a>
                <a href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>צור קשר</a>
                
                {/* Mobile Logo */}
                <div className="pt-4 flex justify-center">
                  <img 
                    src="/dana-logo.png" 
                    alt="לוגו דנה גליקמן - קלינאית תקשורת" 
                    className="h-32 w-auto"
                    role="img"
                  />
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section id="main-content" className="bg-gradient-to-l from-primary-50 to-secondary-50 py-20" role="main" aria-labelledby="hero-heading">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 id="hero-heading" className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                מקצועיות,
                <span className="text-purple-500 block">אמפתיה וחדשנות</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed font-semibold">
                שמי דנה גליקמן קלינאית תקשורת עם רישיון משרד הבריאות עם ניסיון של מעל 6 שנים, אני מספקת טיפול מותאם אישית לכל מטופל.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#contact" className="bg-purple-500 text-white px-8 py-4 rounded-full hover:bg-purple-600 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover-lift inline-block text-center">
                  שלחו הודעה
                </a>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="w-full h-96 rounded-3xl shadow-2xl overflow-hidden">
                  <img 
                    src="/dana-photo.png" 
                    alt="דנה גליקמן יושבת במשרדה המקצועי, מחייכת ועובדת על מחשב נייד. קלינאית תקשורת מוסמכת עם ניסיון של 5 שנים" 
                    className="w-full h-full object-cover"
                    style={{objectPosition: 'center 70%'}}
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl animate-float" aria-hidden="true">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center shadow-xl animate-float" style={{animationDelay: '1s'}} aria-hidden="true">
                  <Star className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">אודותיי</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                אני דנה גליקמן, קלינאית תקשורת מוסמכת עם התמחות בטיפול בילדים ומבוגרים. בעלת תואר בקלינאות התקשורת וותק של למעלה מ-5 שנים.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                אני מאמינה בגישה הוליסטית המתחשבת בצרכים הייחודיים של כל מטופל. המטרה שלי היא לעזור לכם להגיע לפוטנציאל המלא שלכם בתחום התקשורת.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-primary-600 ml-2" />
                  <span className="text-gray-700">מוסמכת משר"פ</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-secondary-500 ml-2" />
                  <span className="text-gray-700">מומחית מוכרת</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-primary-600 ml-2" />
                  <span className="text-gray-700">500+ מטופלים</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-secondary-500 ml-2" />
                  <span className="text-gray-700">גישה אמפתית</span>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white p-8 rounded-3xl shadow-xl hover-lift">
                <h4 className="text-2xl font-bold text-gray-900 mb-6">ההכשרות והסמכות</h4>
                <div className="space-y-4">
                  <div className="border-r-4 border-primary-600 pr-4">
                    <h5 className="font-semibold text-gray-900">תואר ראשון בקלינאות התקשורת</h5>
                    <p className="text-gray-600">אוניברסיטת תל אביב</p>
                  </div>
                  <div className="border-r-4 border-secondary-500 pr-4">
                    <h5 className="font-semibold text-gray-900">תעודת מטפלת בשיטת Li-CBT</h5>
                    <p className="text-gray-600">טיפול קוגניטיבי התנהגותי</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">השירותים שלי</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              מגוון רחב של שירותים קליניים מותאמים לכל גיל ולכל צורך
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover-lift">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">טיפול בהפרעות דיבור</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                טיפול מקצועי בהפרעות דיבור כמו גמגום, קשיי הגייה, ובעיות בקצב הדיבור.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  גמגום וחסימות
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  קשיי הגייה
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  הפרעות קצב ומקצב
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover-lift">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <User className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">פיתוח שפה אצל ילדים</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                עבודה מקצועית על פיתוח כישורי שפה, אוצר מילים והבנת הנקרא אצל ילדים.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  פיתוח אוצר מילים
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  הבנת הנקרא
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  כישורי תקשורת
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover-lift">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">טיפול באוטיזם</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                גישה מותאמת לילדים ומבוגרים עם אוטיזם, כולל פיתוח כישורי תקשורת חברתית.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  תקשורת חברתית
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  כישורי פרגמטיקה
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  תקשורת תומכת
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover-lift">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">ייעוץ למשפחות</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                הדרכה וייעוץ למשפחות להמשך הטיפול בבית ושיפור התקשורת המשפחתית.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  הדרכת הורים
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  תרגילי בית
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  מעקב רציף
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover-lift">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">הערכות אבחון</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                אבחונים מקצועיים מקיפים לזיהוי מדויק של הפרעות תקשורת ודיבור.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  הערכה מקיפה
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  מבחנים סטנדרטיים
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  דוח מפורט
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover-lift">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">טיפול קבוצתי</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                קבוצות טיפול מותאמות גיל לפיתוח כישורי תקשורת חברתית בסביבה תומכת.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  קבוצות קטנות
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  מותאם גיל
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-2" />
                  אווירה תומכת
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-l from-primary-50 to-secondary-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">מה אומרים עליי</h3>
            <p className="text-xl text-gray-600">
              המלצות ממשפחות ומטופלים שעברו טיפול מוצלח
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl hover-lift">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "דנה עזרה לבן שלי להתגבר על בעיות דיבור בצורה מדהימה. הגישה שלה חמה ומקצועית, והתוצאות היו מעבר לציפיות שלנו."
              </p>
              <div className="font-semibold text-gray-900">רחל לוי</div>
              <div className="text-gray-500">אמא לגיל בן 6</div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover-lift">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "הטיפול עם דנה שינה את חיי. סוף סוף אני יכולה לתקשר בביטחון וללא חרדה. ממליצה בחום לכל מי שזקוק לעזרה מקצועית."
              </p>
              <div className="font-semibold text-gray-900">יעל דוד</div>
              <div className="text-gray-500">מבוגרת, גיל 28</div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl hover-lift">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "מקצועיות ברמה הגבוהה ביותר. ההתקדמות של הבת שלי הייתה מהירה ומרשימה. דנה יודעת בדיוק איך לטפל בכל מקרה."
              </p>
              <div className="font-semibold text-gray-900">אמיר כהן</div>
              <div className="text-gray-500">אבא למיכל בת 8</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">בואו נתחיל</h3>
              <p className="text-xl text-gray-600 mb-8">
                מוכנה לעזור לכם או לילדכם להגיע לפוטנציאל המלא בתחום התקשורת. צרו קשר לקביעת פגישת הכרות ראשונה.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center ml-4 animate-pulse-glow">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">טלפון</div>
                    <div className="text-gray-600">052-579-2787</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center ml-4 animate-pulse-glow" style={{animationDelay: '0.5s'}}>
                    <Mail className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">אימייל</div>
                    <div className="text-gray-600">tabachnik.dana@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center ml-4 animate-pulse-glow" style={{animationDelay: '1s'}}>
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">כתובת</div>
                    <div className="text-gray-600">קהילת וילנה 4, חולון</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center ml-4 animate-pulse-glow" style={{animationDelay: '1.5s'}}>
                    <Clock className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">שעות קבלה</div>
                    <div className="text-gray-600">א'-ה': 8:00-18:00</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-3xl">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">שלחו הודעה</h4>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg" role="alert" aria-live="polite">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 ml-2" aria-hidden="true" />
                    <span>ההודעה נשלחה בהצלחה! דנה תחזור אליכם בהקדם.</span>
                  </div>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert" aria-live="assertive">
                  <span>שגיאה בשליחת ההודעה. אנא נסו שוב או צרו קשר בטלפון.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="טופס יצירת קשר">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium mb-2 transition-colors ${
                    touchedFields.name && fieldErrors.name 
                      ? 'text-red-600' 
                      : touchedFields.name && !fieldErrors.name 
                        ? 'text-green-600' 
                        : 'text-gray-700'
                  }`}>
                    שם מלא *
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      aria-describedby={touchedFields.name && fieldErrors.name ? "name-error" : undefined}
                      aria-invalid={touchedFields.name && fieldErrors.name ? "true" : "false"}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors focus-ring ${
                        touchedFields.name && fieldErrors.name
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : touchedFields.name && !fieldErrors.name
                            ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                      }`}
                    />
                    {touchedFields.name && fieldErrors.name && (
                      <div id="name-error" className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg z-10" role="alert" aria-live="polite">
                        {fieldErrors.name}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className={`block text-sm font-medium mb-2 transition-colors ${
                    touchedFields.phone && fieldErrors.phone 
                      ? 'text-red-600' 
                      : touchedFields.phone && !fieldErrors.phone 
                        ? 'text-green-600' 
                        : 'text-gray-700'
                  }`}>
                    טלפון *
                  </label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      aria-describedby={touchedFields.phone && fieldErrors.phone ? "phone-error" : undefined}
                      aria-invalid={touchedFields.phone && fieldErrors.phone ? "true" : "false"}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors focus-ring ${
                        touchedFields.phone && fieldErrors.phone
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : touchedFields.phone && !fieldErrors.phone
                            ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                      }`}
                    />
                    {touchedFields.phone && fieldErrors.phone && (
                      <div id="phone-error" className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg z-10" role="alert" aria-live="polite">
                        {fieldErrors.phone}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 transition-colors ${
                    touchedFields.email && fieldErrors.email 
                      ? 'text-red-600' 
                      : touchedFields.email && !fieldErrors.email 
                        ? 'text-green-600' 
                        : 'text-gray-700'
                  }`}>
                    אימייל *
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      aria-describedby={touchedFields.email && fieldErrors.email ? "email-error" : undefined}
                      aria-invalid={touchedFields.email && fieldErrors.email ? "true" : "false"}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors focus-ring ${
                        touchedFields.email && fieldErrors.email
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : touchedFields.email && !fieldErrors.email
                            ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                      }`}
                    />
                    {touchedFields.email && fieldErrors.email && (
                      <div id="email-error" className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg z-10" role="alert" aria-live="polite">
                        {fieldErrors.email}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">נושא הפנייה</label>
                  <div className="relative">
                    <select 
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors focus-ring appearance-none bg-white"
                      style={{backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'left 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em'}}
                    >
                      <option value="קביעת תור ראשוני">קביעת תור ראשוני</option>
                      <option value="שאלות כלליות">שאלות כלליות</option>
                      <option value="בירורים לגבי טיפול">בירורים לגבי טיפול</option>
                      <option value="אחר">אחר</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className={`block text-sm font-medium mb-2 transition-colors ${
                    touchedFields.message && fieldErrors.message 
                      ? 'text-red-600' 
                      : touchedFields.message && !fieldErrors.message 
                        ? 'text-green-600' 
                        : 'text-gray-700'
                  }`}>
                    הודעה *
                  </label>
                  <div className="relative">
                    <textarea 
                      rows={4} 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      aria-describedby={touchedFields.message && fieldErrors.message ? "message-error" : undefined}
                      aria-invalid={touchedFields.message && fieldErrors.message ? "true" : "false"}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors focus-ring ${
                        touchedFields.message && fieldErrors.message
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : touchedFields.message && !fieldErrors.message
                            ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                      }`}
                    ></textarea>
                    {touchedFields.message && fieldErrors.message && (
                      <div id="message-error" className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-lg z-10" role="alert" aria-live="polite">
                        {fieldErrors.message}
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmitting || (Object.values(touchedFields).some(touched => touched) && (Object.values(fieldErrors).some(error => error !== '') || !formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.message.trim()))}
                  className={`w-full py-4 rounded-lg font-medium text-lg transition-all duration-300 transform hover:-translate-y-1 hover-lift ${
                    isSubmitting || (Object.values(touchedFields).some(touched => touched) && (Object.values(fieldErrors).some(error => error !== '') || !formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.message.trim()))
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? 'שולח...' : 'שלח הודעה'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" role="contentinfo">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h5 className="text-lg font-bold">דנה גליקמן</h5>
                  <p className="text-gray-400 text-sm">קלינאית תקשורת מוסמכת</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                מתמחה בטיפול בהפרעות תקשורת, דיבור ושפה. עם ניסיון של מעל 5 שנים, אני מספקת טיפול מותאם אישית לכל מטופל.
              </p>
            </div>
            
            <div>
              <h5 className="text-lg font-bold mb-4">עקבו אחריי</h5>
              <div className="flex space-x-4 space-x-reverse">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-all duration-300 transform hover:scale-110"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
              </div>
              <p className="text-gray-400 text-sm mt-3">
                תכנים מקצועיים וטיפים לשיפור התקשורת
              </p>
            </div>
            
            <div>
              <h5 className="text-lg font-bold mb-4">פרטי התקשרות</h5>
              <div className="space-y-2">
                <p className="text-gray-400">052-579-2787</p>
                <p className="text-gray-400">tabachnik.dana@gmail.com</p>
                <p className="text-gray-400">קהילת וילנה 4, חולון</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 דנה גליקמן - קלינאית תקשורת. כל הזכויות שמורות.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 