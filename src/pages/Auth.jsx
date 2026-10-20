import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { KanoonLogo, AuthVisualIllustration, LawyerProfessionalAvatar } from '../components/SvgAssets';
import logo from '../assets/logo.png';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const InputField = ({ icon: Icon, type, name, placeholder, value, onChange, required, language, showPassword, setShowPassword }) => (
  <div className="space-y-1.5 animate-fade-up">
    <div className="relative group">
      <div className={`absolute inset-y-0 ${language === 'urdu' ? 'right-4' : 'left-4'} flex items-center text-primary/30 group-focus-within:text-accent transition-colors`}>
        <Icon className="w-5 h-5" />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full bg-white border-2 border-primary/5 focus:border-accent rounded-2xl py-4 ${language === 'urdu' ? 'pr-12 pl-6 font-urdu text-lg' : 'pl-12 pr-6'} text-primary font-bold transition-all outline-none shadow-sm placeholder:text-primary/20`}
      />
      {name === 'password' && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute inset-y-0 ${language === 'urdu' ? 'left-4' : 'right-4'} flex items-center text-primary/30 hover:text-primary transition-colors`}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  </div>
);

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { t, language } = useLanguage();

  const handleAfterAuth = async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    const userData = userDoc.data();
    if (userData?.name && userData?.name !== '') {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted. isLogin:", isLogin, "Email:", formData.email);
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        await handleAfterAuth(result.user.uid);
      } else {
        const result = await signup(formData.email, formData.password);
        await handleAfterAuth(result.user.uid);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row overflow-hidden">
      {/* Visual Side (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-primary relative items-center justify-center p-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10 space-y-10 flex flex-col items-center text-center">
          <div className="w-full flex justify-center animate-float">
            <AuthVisualIllustration className="w-80 h-80" />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-heading text-white font-black leading-tight">
              Legal Justice,<br />
              <span className="text-accent">Redefined by AI.</span>
            </h2>
            <p className="text-white/60 text-lg max-w-md font-medium mx-auto">
              Join thousands of citizens getting instant, grounded legal advice from Pakistani law.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => {
                const initials = ["AI", "PPC", "ADV", "JUD"][i - 1];
                return (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-primary overflow-hidden shadow-lg shadow-primary/40">
                    <LawyerProfessionalAvatar initials={initials} seedIndex={i} className="w-full h-full" />
                  </div>
                );
              })}
            </div>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Trust by the nation</p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-20 relative">
        <div className="w-full max-w-md space-y-8 animate-fade-up">
          {/* Logo center top: 120px x 120px */}
          <div className="flex justify-center w-full">
            <img src={logo} alt="Kanoon AI Logo" className="app-logo w-[120px] h-[120px] object-cover drop-shadow-lg" />
          </div>

          <div className="space-y-2">
            <h2 className={`text-4xl font-black text-primary ${language === 'urdu' ? 'font-urdu' : ''}`}>
              {isLogin ? (language === 'urdu' ? 'خوش آمدید' : 'Welcome Back') : (language === 'urdu' ? 'اکاؤنٹ بنائیں' : 'Create Account')}
            </h2>
            <p className="text-primary/40 font-medium">
              {isLogin ? (language === 'urdu' ? 'اپنا ای میل اور پاس ورڈ درج کریں' : 'Please enter your credentials to continue') : (language === 'urdu' ? 'پاکستان کے پہلے AI قانونی اسسٹنٹ کا حصہ بنیں' : 'Start your journey with Pakistan\'s first AI legal assistant')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              icon={Mail}
              type="email"
              name="email"
              placeholder={language === 'urdu' ? 'ای میل ایڈریس' : 'Email Address'}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              language={language}
            />
            <InputField
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder={language === 'urdu' ? 'پاس ورڈ' : 'Password'}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              language={language}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-justice w-full py-5 text-xl mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? (language === 'urdu' ? 'لاگ ان کریں' : 'Sign In') : (language === 'urdu' ? 'سائن اپ کریں' : 'Get Started')}</span>
                  <ArrowRight className={`w-6 h-6 ${language === 'urdu' ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary/40 font-bold hover:text-accent transition-colors py-2 px-4"
            >
              {isLogin ? 
                (language === 'urdu' ? 'نیا اکاؤنٹ بنانا چاہتے ہیں؟ سائن اپ کریں' : 'Don\'t have an account? Sign Up') : 
                (language === 'urdu' ? 'پہلے سے اکاؤنٹ موجود ہے؟ لاگ ان کریں' : 'Already have an account? Sign In')
              }
            </button>
          </div>
        </div>

        {/* Legal Disclaimer Footer */}
        <div className="mt-12 flex items-center justify-center space-x-2 text-primary/20">
          <KanoonLogo className="w-4 h-4 opacity-50" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Secured by Kanoon AI Infrastructure</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
