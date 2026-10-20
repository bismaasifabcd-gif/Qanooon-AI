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
      {/* Header — rectangular, matches dashboard */}
      <header className="bg-primary px-5 md:px-8 pt-6 pb-6 border-b-2 border-accent/30">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all flex-shrink-0">
            <ArrowLeft className={`w-5 h-5 ${language === 'urdu' ? 'rotate-180' : ''}`} />
          </button>
          <img src={logo} alt="Qanoon AI Logo" className="app-logo w-9 h-9 object-cover border border-white/10" />
          <h1 className={`text-white text-xl md:text-2xl font-black ${language === 'urdu' ? 'font-urdu text-2xl' : ''}`}>
            {t.myProfile}
          </h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 md:px-8 pt-6 space-y-5">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-5 md:p-6 border border-primary/8 relative overflow-hidden">
          {showSuccess && (
            <div className="absolute top-0 left-0 right-0 bg-success text-white py-2.5 px-4 flex items-center justify-center gap-2 z-10">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-black text-[11px] uppercase tracking-widest">{t.profileUpdated}</span>
            </div>
          )}

          <div className="flex flex-col items-center mb-6 pt-2">
            <div className="relative group">
              <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center border-2 border-primary/8 relative overflow-hidden">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-accent text-3xl font-black">{getInitials()}</span>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-primary/40 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="w-7 h-7 text-white animate-spin" />
                  </div>
                )}
              </div>
              <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-lg shadow hover:bg-accent hover:text-primary transition-all cursor-pointer z-20 border-2 border-white">
                <Camera className="w-4 h-4" />
                <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handlePhotoChange} disabled={isUploading} />
              </label>
            </div>
            <h2 className={`mt-3 text-xl font-black text-primary ${language === 'urdu' ? 'font-urdu text-2xl' : ''}`}>{name || (language === 'urdu' ? 'صارف' : 'Your Name')}</h2>
            {user?.email && <p className="text-primary/40 text-xs font-medium">{user.email}</p>}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <InputWrapper icon={User} label={language === 'urdu' ? 'پورا نام' : 'Full Name'}>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-surface border border-primary/8 focus:border-accent rounded-lg py-3 ${language === 'urdu' ? 'pr-11 pl-4 font-urdu text-lg' : 'pl-11 pr-4'} text-primary font-semibold transition-all outline-none text-sm`}
                required
              />
            </InputWrapper>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputWrapper icon={Phone} label={t.phoneNumber}>
                <input 
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`w-full bg-surface border border-primary/8 focus:border-accent rounded-lg py-3 ${language === 'urdu' ? 'pr-11 pl-4 font-urdu text-lg' : 'pl-11 pr-4'} text-primary font-semibold transition-all outline-none text-sm`}
                />
              </InputWrapper>
              <InputWrapper icon={MapPin} label={t.city}>
                <select 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`w-full bg-surface border border-primary/8 focus:border-accent rounded-lg py-3 ${language === 'urdu' ? 'pr-11 pl-4 font-urdu text-lg' : 'pl-11 pr-4'} text-primary font-semibold transition-all appearance-none outline-none cursor-pointer text-sm`}
                >
                  <option value="">{language === 'urdu' ? 'شہر منتخب کریں' : 'Select City'}</option>
                  {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </InputWrapper>
            </div>

            <button 
              type="submit"
              disabled={isSaving}
              className="w-full bg-accent text-primary font-black py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[#B3933C] transition-all text-sm mt-1"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t.saveChanges}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-xl border border-primary/8 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-primary font-black text-lg leading-none">{chatCount}</p>
              <p className="text-primary/40 text-[10px] font-bold mt-0.5">{language === 'urdu' ? 'گفتگو' : 'Chats'}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-primary/8 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-primary/40" />
            </div>
            <div className="min-w-0">
              <p className="text-primary font-black text-xs leading-tight">{userData?.createdAt?.toDate().toLocaleDateString() || 'Today'}</p>
              <p className="text-primary/40 text-[10px] font-bold mt-0.5">{t.memberSince}</p>
            </div>
          </div>
        </div>

        {/* Settings quick link */}
        <button 
          onClick={() => navigate('/settings')}
          className="w-full bg-white p-4 rounded-xl border border-primary/8 shadow-sm flex items-center justify-between group hover:border-accent/30 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface text-accent rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-left rtl:text-right">
              <p className="text-primary font-black text-sm">{t.settings}</p>
              <p className="text-primary/40 text-[11px] font-medium">{language === 'urdu' ? 'زبان، رازداری اور مزید' : 'Language, privacy & more'}</p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 text-primary/20 group-hover:text-accent ${language === 'urdu' ? 'rotate-180' : ''}`} />
        </button>
      </main>
    </div>
  );
};

export default Profile;
