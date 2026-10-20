import React, { useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { callGeminiForDocument } from '../services/geminiService';

const FIRGenerator = ({ session, onClose }) => {
  const { user, userData } = useAuth();
  const { language } = useLanguage();
  
  const [formData, setFormData] = useState({
    complainantName: userData?.name || user?.displayName || 'Citizen',
    fatherName: '',
    cnic: '',
    address: '',
    phone: userData?.phone || '',
    incidentDate: new Date().toISOString().split('T')[0],
    incidentLocation: '',
    city: 'Lahore',
    accusedName: '',
    reason: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const majorCities = [
    'Lahore', 'Karachi', 'Islamabad', 'Peshawar', 'Quetta', 
    'Rawalpindi', 'Faisalabad', 'Multan', 'Sialkot', 'Gujranwala'
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    const chatHistoryText = (session.messages || [])
      .map(m => `${m.role === 'user' ? 'User' : 'AskLex'}: ${m.content}`)
      .join('\n');

    const prompt = `Based on this conversation:
${chatHistoryText}

Generate a formal FIR draft
with these user details:
- Complainant Name: ${formData.complainantName}
- Father Name: ${formData.fatherName}
- CNIC: ${formData.cnic}
- Address: ${formData.address}
- Incident Date: ${formData.incidentDate}
- Incident Location: ${formData.incidentLocation}
- City: ${formData.city}
- Accused Name: ${formData.accusedName || 'Unknown'}
- Additional Details / Complainant's Statement: ${formData.reason || 'None provided'}

Format exactly like this:

FIRST INFORMATION REPORT (FIR)
----------------------------------
FIR Number: ____/2026
Police Station: ____________
District: ${formData.city}
Date: ${formData.incidentDate}

COMPLAINANT DETAILS:
Name: ${formData.complainantName}
Father Name: ${formData.fatherName}
CNIC: ${formData.cnic}
Address: ${formData.address}

INCIDENT DETAILS:
Date: ${formData.incidentDate}
Location: ${formData.incidentLocation}

DESCRIPTION:
[detailed incident description based on conversation and complainant's additional details]

APPLICABLE LAW:
[law name and section from chat]

ACCUSED DETAILS:
[accused info or Unknown]

RELIEF SOUGHT:
[what complainant wants]

Complainant Signature: ____________
Date: ${new Date().toLocaleDateString()}

Respond in user language: ${language === 'urdu' ? 'Urdu' : 'English'}`;

    let content = "";
    try {
      // Groq-backed document generation via secure Firebase Callable Function.
      content = await callGeminiForDocument(prompt, language);
      if (!content || !content.trim()) {
        throw new Error('Empty draft returned from AI');
      }

    } catch (err) {
      console.warn("AI call failed, generating localized backup legal document template instead:", err);
      
      const todayStr = new Date().toLocaleDateString();
      if (language === 'urdu') {
        content = `پہلی اطلاع رپورٹ (ایف آئی آر) ڈرافٹ
----------------------------------
رپورٹ نمبر: 2026/___     تھانہ: متعلقہ ایس ایچ او
ضلع: ${formData.city}     تاریخ: ${formData.incidentDate}

1۔ مستغیث کی تفصیلات:
نام: ${formData.complainantName}
ولدیت: ${formData.fatherName}
شناختی کارڈ نمبر: ${formData.cnic}
مستقل پتہ: ${formData.address}
فون نمبر: ${formData.phone}

2۔ وقوعہ کی تفصیلات:
تاریخ و وقتِ وقوعہ: ${formData.incidentDate}
مقامِ وقوعہ: ${formData.incidentLocation}
مبینہ ملزم کا نام: ${formData.accusedName || 'نامعلوم'}

3۔ تفصیلی بیانِ مستغیث / وجہ شکایت:
میں مسمی ${formData.complainantName} ولد ${formData.fatherName} حلفیہ بیان کرتا ہوں کہ مورخہ ${formData.incidentDate} کو مقام ${formData.incidentLocation} پر درج ذیل واقعہ پیش آیا:
${formData.reason || 'مذکورہ بالا تاریخ پر ملزم نے میرے خلاف غیر قانونی کارروائی کی جس سے مجھے شدید نقصان اور ذہنی اذیت کا سامنا کرنا پڑا۔'}

4۔ استدعا / دادرسی:
لہذا استدعا ہے کہ نامزد ملزمان کے خلاف زیر دفعہ 154 ضابطہ فوجداری (Cr.P.C) مقدمہ درج فرما کر قانونی کارروائی عمل میں لائی جائے۔

دستخط مستغیث: ________________
تاریخ: ${todayStr}`;
      } else {
        content = `FIRST INFORMATION REPORT (FIR) DRAFT
----------------------------------
FIR Number: ____/2026
Police Station: Concerned S.H.O
District: ${formData.city}
Date of Report: ${todayStr}

1. COMPLAINANT DETAILS:
Name: ${formData.complainantName}
Father Name: ${formData.fatherName}
CNIC: ${formData.cnic}
Address: ${formData.address}
Phone: ${formData.phone}

2. INCIDENT DETAILS:
Date & Time of Incident: ${formData.incidentDate}
Location of Incident: ${formData.incidentLocation}
Accused Details: ${formData.accusedName || 'Unknown'}

3. COMPLAINANT STATEMENT / INCIDENT DESCRIPTION:
I, ${formData.complainantName} son of ${formData.fatherName}, resident of ${formData.address}, state that on ${formData.incidentDate} at ${formData.incidentLocation}, the following event transpired:
${formData.reason || 'The accused committed unauthorized and unlawful acts causing financial and physical distress/harm to the complainant.'}

4. RELIEF SOUGHT:
It is respectfully prayed that a First Information Report (FIR) under Section 154 of the Code of Criminal Procedure (Cr.P.C) be registered against the accused, and formal investigation be initiated in accordance with the law of the Land.

Complainant Signature: ____________
Date: ${todayStr}`;
      }
    }

    // Save and generate PDF
    try {
      if (user) {
        await addDoc(collection(db, "users", user.uid, "documents"), {
          type: "fir_draft",
          content: content,
          generatedAt: serverTimestamp(),
          title: `FIR Draft: ${formData.city}`,
          status: "draft"
        });
      }
      generateFIRPdf(content, formData.complainantName);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Error saving legal document to profile.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFIRPdf = (content, userName) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(27, 42, 74);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(201, 168, 76);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('KANOON AI', 105, 12, {align: 'center'});
    
    doc.setFontSize(10);
    doc.text('Qanoon Sabke Liye Hai', 105, 20, {align: 'center'});
    
    doc.setTextColor(27, 42, 74);
    doc.setFontSize(14);
    doc.text('FIRST INFORMATION REPORT', 105, 40, {align: 'center'});
    
    doc.line(10, 44, 200, 44);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    // Sanitization step: Replace ALL occurrences of unicode separators and formatting chars (such as ━) that cause % signs to show in jsPDF
    const sanitizedContent = content
      .replace(/━/g, "-")
      .replace(/•/g, "-")
      .replace(/■/g, "-")
      .replace(/□/g, "[]")
      .replace(/★/g, "*")
      .replace(/[\u2014\u2015]/g, "-") // em dashes
      .replace(/[\u2018\u2019]/g, "'") // smart single quotes
      .replace(/[\u201C\u201D]/g, '"'); // smart double quotes

    const lines = doc.splitTextToSize(sanitizedContent, 180);
    
    let y = 52;
    const pageHeight = doc.internal.pageSize.height;
    lines.forEach((line) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 15, y);
      y += 6;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      'Generated by Kanoon AI | ' + 
      new Date().toLocaleDateString() +
      ' | This is a draft document',
      105, 285, 
      {align: 'center'}
    );
    
    doc.save('FIR-Draft-KanoonAI.pdf');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-primary/5 max-h-[90vh] overflow-y-auto relative text-left">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 w-10 h-10 bg-surface rounded-full flex items-center justify-center text-primary/40 hover:text-red-500 transition-all border border-primary/5 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-primary text-xl font-black">{language === 'urdu' ? 'ایف آئی آر ڈرافٹ کی تفصیلات' : 'FIR Draft Details'}</h3>
            <p className="text-primary/40 text-xs font-semibold">{language === 'urdu' ? 'براہ کرم ڈرافٹ تیار کرنے کے لئے درج ذیل معلومات فراہم کریں۔' : 'Please provide the details to compile the official FIR.'}</p>
          </div>
        </div>

        {isGenerating ? (
          <div className="py-16 text-center space-y-6">
            <div className="w-20 h-20 bg-accent/10 border-2 border-accent rounded-full flex items-center justify-center mx-auto animate-spin">
              <Sparkles className="w-10 h-10 text-accent" />
            </div>
            <div>
              <h4 className="text-primary font-black text-lg">Generating FIR Draft...</h4>
              <p className="text-primary/40 text-xs font-semibold mt-1">AskLex is translating your case facts into formal legal text...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center space-x-2 text-xs font-bold border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-primary/50">Complainant Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.complainantName}
                  onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
                  className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-primary/50">Father's Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Father's full name"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-primary/50">CNIC Number</label>
                <input 
                  type="text" 
                  required
                  maxLength={13}
                  placeholder="e.g. 3520112345678"
                  value={formData.cnic}
                  onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                  className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-primary/50">Phone Number</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 03001234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-primary/50">Home Address</label>
              <input 
                type="text" 
                required
                placeholder="Full residential address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-primary/50">Incident Date</label>
                <input 
                  type="date" 
                  required
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                  className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-primary/50">District / City</label>
                <select 
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40 bg-white"
                >
                  {majorCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-primary/50">Incident Location</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sector Y, DHA, Lahore"
                  value={formData.incidentLocation}
                  onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })}
                  className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-primary/50">Accused Name (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe (or leave blank)"
                  value={formData.accusedName}
                  onChange={(e) => setFormData({ ...formData, accusedName: e.target.value })}
                  className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                />
              </div>
            </div>

            {/* Custom open ended Details / Statement block */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-primary/50">Incident Summary / Reason for FIR (Open-Ended Details)</label>
              <textarea 
                placeholder="Type specific details, reasons why you are registering this FIR, or additional context about the event..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
                className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40 resize-none"
              />
            </div>

            <div className="flex space-x-4 rtl:space-x-reverse mt-6">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 border-2 border-primary/5 hover:bg-primary/5 text-primary/60 font-bold py-4 rounded-2xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 bg-[#C9A84C] hover:bg-[#B3933C] text-[#0F1E36] font-bold py-4 rounded-2xl transition-all shadow-xl shadow-[#C9A84C]/25 cursor-pointer"
              >
                Generate & Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FIRGenerator;
