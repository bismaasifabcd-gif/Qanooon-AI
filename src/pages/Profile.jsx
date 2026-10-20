import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Globe,
  Lock,
  Save, 
  Loader2,
  CheckCircle2,
  Calendar,
  MessageCircle,
  ShieldCheck,
  Award,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, collection, getCountFromServer } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { db, storage, auth } from '../firebase/config';
import { KanoonLogo, ProfilePremiumBadge } from '../components/SvgAssets';
import logo from '../assets/logo.png';

const PAKISTAN_CITIES = [
  'Lahore', 'Karachi', 'Islamabad', 'Peshawar', 'Quetta', 
  'Faisalabad', 'Multan', 'Rawalpindi', 'Gujranwala', 'Sialkot'
];

const Profile = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { user, userData, refreshUserData } = useAuth();
  
  const [name, setName] = useState(userData?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || '');
  const [city, setCity] = useState(userData?.city || '');
  const [profilePhoto, setProfilePhoto] = useState(userData?.profilePhoto || null);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [chatCount, setChatCount] = useState(0);

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setPhoneNumber(userData.phoneNumber || '');
      setCity(userData.city || '');
      setProfilePhoto(userData.profilePhoto || null);
      fetchChatCount();
    }
  }, [userData]);

  const fetchChatCount = async () => {
    if (!user) return;
    const historyRef = collection(db, "users", user.uid, "history");
    const snapshot = await getCountFromServer(historyRef);
    setChatCount(snapshot.data().count);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setIsUploading(true);
    try {
      const storageRef = ref(storage, `users/${user.uid}/profile_photo.jpg`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, "users", user.uid), { profilePhoto: url });
      setProfilePhoto(url);
      await refreshUserData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { name, phoneNumber, city, updatedAt: new Date().toISOString() });
      await refreshUserData();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  const InputWrapper = ({ icon: Icon, label, children }) => (
    <div className="space-y-2">
      <label className="text-primary/40 text-[10px] font-black uppercase tracking-[0.2em] px-2">{label}</label>
      <div className="relative group">
        <div className={`absolute ${language === 'urdu' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-accent transition-colors`}>
          <Icon className="w-5 h-5" />
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Premium Profile Header */}
      <header className="bg-primary pt-12 pb-32 px-6 rounded-b-[4rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute right-16 bottom-0 w-36 h-36 opacity-15 pointer-events-none hidden md:block">
          <ProfilePremiumBadge className="w-full h-full" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button onClick={() => navigate('/dashboard')} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all border border-white/10">
              <ArrowLeft className={`w-6 h-6 ${language === 'urdu' ? 'rotate-180' : ''}`} />
            </button>
            <img src={logo} alt="Kanoon AI Logo" className="app-logo w-9 h-9 object-cover" />
            <h1 className={`text-white text-3xl font-black ${language === 'urdu' ? 'font-urdu text-4xl' : ''}`}>
              {t.myProfile}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 -mt-20 relative z-20 space-y-8">
        {/* Profile Card Redesign */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-primary/10 p-8 border border-primary/5 relative overflow-hidden">
          {showSuccess && (
            <div className="absolute top-0 left-0 right-0 bg-success text-white py-4 px-6 flex items-center justify-center space-x-3 animate-slide-down z-10">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-black text-xs uppercase tracking-widest">{t.profileUpdated}</span>
            </div>
          )}

          <div className="flex flex-col items-center mb-10 pt-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
              <div className="w-32 h-32 bg-surface rounded-full flex items-center justify-center border-4 border-white shadow-2xl relative z-10 overflow-hidden group-hover:border-accent transition-all">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary/20 text-5xl font-black">{getInitials()}</span>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-primary/40 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-primary text-white p-3 rounded-2xl shadow-2xl hover:bg-accent hover:text-primary transition-all cursor-pointer z-20 border-4 border-white group-hover:scale-110">
                <Camera className="w-5 h-5" />
                <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handlePhotoChange} disabled={isUploading} />
              </label>
            </div>
            <div className="mt-6 text-center space-y-1">
              <h2 className={`text-3xl font-black text-primary ${language === 'urdu' ? 'font-urdu' : ''}`}>{name || 'Legal Citizen'}</h2>
              <div className="flex items-center justify-center space-x-2 text-primary/30">
                <Award className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified Justice Identity</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <InputWrapper icon={User} label={language === 'urdu' ? 'پورا نام' : 'Full Name'}>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-surface border-2 border-transparent focus:border-accent rounded-[1.5rem] py-5 ${language === 'urdu' ? 'pr-14 pl-6 font-urdu text-xl' : 'pl-14 pr-6'} text-primary font-black transition-all outline-none`}
                required
              />
            </InputWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper icon={Phone} label={t.phoneNumber}>
                <input 
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`w-full bg-surface border-2 border-transparent focus:border-accent rounded-[1.5rem] py-5 ${language === 'urdu' ? 'pr-14 pl-6 font-urdu text-xl' : 'pl-14 pr-6'} text-primary font-black transition-all outline-none`}
                />
              </InputWrapper>
              <InputWrapper icon={MapPin} label={t.city}>
                <select 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`w-full bg-surface border-2 border-transparent focus:border-accent rounded-[1.5rem] py-5 ${language === 'urdu' ? 'pr-14 pl-6 font-urdu text-xl' : 'pl-14 pr-6'} text-primary font-black transition-all appearance-none outline-none cursor-pointer`}
                >
                  <option value="">Select City</option>
                  {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </InputWrapper>
            </div>

            <button 
              type="submit"
              disabled={isSaving}
              className="btn-justice w-full py-5 text-xl mt-4"
            >
              {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  <Save className="w-6 h-6" />
                  <span>{t.saveChanges}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Stats Grid Redesign */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-primary/5 flex flex-col items-center text-center group hover:bg-primary transition-all">
            <div className="p-4 bg-accent/10 rounded-2xl mb-4 group-hover:bg-accent transition-all">
              <MessageCircle className="w-8 h-8 text-accent group-hover:text-primary" />
            </div>
            <p className="text-primary font-black text-3xl group-hover:text-white transition-all">{chatCount}</p>
            <p className="text-primary/30 text-[10px] font-black uppercase tracking-widest group-hover:text-white/40 transition-all">Legal Consultations</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-primary/5 flex flex-col items-center text-center group hover:bg-primary transition-all">
            <div className="p-4 bg-primary/5 rounded-2xl mb-4 group-hover:bg-white/10 transition-all">
              <Calendar className="w-8 h-8 text-primary/20 group-hover:text-white" />
            </div>
            <p className="text-primary font-black text-sm group-hover:text-white transition-all">{userData?.createdAt?.toDate().toLocaleDateString() || 'Today'}</p>
            <p className="text-primary/30 text-[10px] font-black uppercase tracking-widest group-hover:text-white/40 transition-all">{t.memberSince}</p>
          </div>
        </div>

        {/* Security Quick Link */}
        <button 
          onClick={() => navigate('/settings')}
          className="w-full bg-white p-6 rounded-[2rem] shadow-xl border border-primary/5 flex items-center justify-between group hover:border-accent transition-all"
        >
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
              <Lock className="w-6 h-6" />
            </div>
            <div className="text-left rtl:text-right">
              <p className="text-primary font-black">{t.changePassword}</p>
              <p className="text-primary/30 text-[10px] font-bold uppercase">Update your security credentials</p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 text-primary/20 group-hover:text-accent ${language === 'urdu' ? 'rotate-180' : ''}`} />
        </button>
      </main>

      {/* Trust Seal Footer */}
      <div className="mt-12 mb-20 flex flex-col items-center justify-center opacity-10">
        <ShieldCheck className="w-12 h-12 text-primary" />
        <p className="text-[8px] font-black uppercase tracking-[0.6em] mt-2">Certified Justice Account</p>
      </div>
    </div>
  );
};

export default Profile;
