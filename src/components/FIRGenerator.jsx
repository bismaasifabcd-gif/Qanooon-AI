import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, FileText, Download } from 'lucide-react';
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
  const [generatedContent, setGeneratedContent] = useState('');

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

    // Save and show an in-app preview (user downloads from there).
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
      setGeneratedContent(content);
    } catch (err) {
      console.error(err);
      setGeneratedContent(content); // still show it even if saving failed
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFIRPdf = (content) => {
    const doc = new jsPDF();

    // Letterhead
    doc.setFillColor(27, 42, 74);
    doc.rect(0, 0, 210, 26, 'F');
    doc.setTextColor(201, 168, 76);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('QANOON AI', 105, 13, { align: 'center' });
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Legal Document Draft', 105, 20, { align: 'center' });

    doc.setTextColor(27, 42, 74);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('FIRST INFORMATION REPORT (FIR)', 105, 37, { align: 'center' });
    doc.setDrawColor(201, 168, 76);
    doc.setLineWidth(0.5);
    doc.line(15, 41, 195, 41);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 20, 20);

    const sanitizedContent = content
      .replace(/━/g, '-').replace(/•/g, '-').replace(/■/g, '-').replace(/□/g, '[ ]')
      .replace(/★/g, '*').replace(/[\u2014\u2015]/g, '-')
      .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');

    const lines = doc.splitTextToSize(sanitizedContent, 180);
    let y = 50;
    const pageHeight = doc.internal.pageSize.height;
    lines.forEach((line) => {
      if (y > pageHeight - 18) { doc.addPage(); y = 20; }
      doc.text(line, 15, y);
      y += 6;
    });

    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text('Generated by Qanoon AI · ' + new Date().toLocaleDateString() + ' · Draft — verify before submission', 105, 290, { align: 'center' });

    doc.save('FIR-Draft-QanoonAI.pdf');
  };

  const L = {
    complainantName: language === 'urdu' ? 'مدعی کا نام' : 'Complainant Name',
    fatherName: language === 'urdu' ? 'والد کا نام' : "Father's Name",
    cnic: language === 'urdu' ? 'شناختی کارڈ نمبر' : 'CNIC Number',
    phone: language === 'urdu' ? 'فون نمبر' : 'Phone Number',
    address: language === 'urdu' ? 'رہائشی پتہ' : 'Home Address',
    incidentDate: language === 'urdu' ? 'واقعے کی تاریخ' : 'Incident Date',
    city: language === 'urdu' ? 'ضلع / شہر' : 'District / City',
    incidentLocation: language === 'urdu' ? 'واقعے کا مقام' : 'Incident Location',
    accusedName: language === 'urdu' ? 'ملزم کا نام (اختیاری)' : 'Accused Name (optional)',
    reason: language === 'urdu' ? 'واقعے کی تفصیل' : 'What happened? (details)',
  };
  const field = "w-full bg-white border border-primary/15 rounded-lg py-2.5 px-3.5 outline-none font-medium text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all";
  const lbl = "block text-[11px] font-bold text-primary/50 mb-1";

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4 bg-primary/50 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl border border-primary/5 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-5 py-4 flex items-center justify-between flex-shrink-0 border-b-2 border-accent/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-accent/15 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className={`text-white font-black text-base ${language === 'urdu' ? 'font-urdu text-lg' : ''}`}>
                {language === 'urdu' ? 'ایف آئی آر ڈرافٹ' : 'FIR Draft'}
              </h3>
              <p className="text-white/50 text-[10px] font-medium">
                {generatedContent ? (language === 'urdu' ? 'تیار شدہ دستاویز' : 'Generated document') : (language === 'urdu' ? 'تفصیلات درج کریں' : 'Fill in the details')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:bg-white/20 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {generatedContent ? (
          /* ---- Document preview ---- */
          <>
            <div className="flex-1 overflow-y-auto p-4 bg-surface">
              <div className="bg-white rounded-lg border border-primary/10 shadow-sm p-5 text-primary text-[13px] leading-relaxed whitespace-pre-line font-mono">
                {generatedContent}
              </div>
            </div>
            <div className="p-4 flex gap-3 flex-shrink-0 border-t border-primary/5">
              <button onClick={onClose} className="flex-1 border border-primary/15 hover:bg-primary/5 text-primary/60 font-bold py-2.5 rounded-lg transition-all text-sm">
                {language === 'urdu' ? 'بند کریں' : 'Close'}
              </button>
              <button onClick={() => generateFIRPdf(generatedContent)} className="flex-1 bg-accent text-primary font-black py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#B3933C] transition-all text-sm">
                <Download className="w-4 h-4" />
                <span>{language === 'urdu' ? 'پی ڈی ایف' : 'Download PDF'}</span>
              </button>
            </div>
          </>
        ) : isGenerating ? (
          <div className="py-16 px-6 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-3 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
            <h4 className="text-primary font-black text-sm">{language === 'urdu' ? 'ڈرافٹ تیار ہو رہا ہے...' : 'Preparing your FIR draft...'}</h4>
            <p className="text-primary/40 text-xs mt-1">{language === 'urdu' ? 'براہ کرم انتظار کریں' : 'This takes a few seconds'}</p>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="flex-1 overflow-y-auto p-5 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-xs font-bold border border-red-100">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={lbl}>{L.complainantName}</label>
                <input type="text" required value={formData.complainantName} onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })} className={field} />
              </div>
              <div>
                <label className={lbl}>{L.fatherName}</label>
                <input type="text" required value={formData.fatherName} onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })} className={field} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={lbl}>{L.cnic}</label>
                <input type="text" required maxLength={15} placeholder="35201-1234567-9" value={formData.cnic} onChange={(e) => setFormData({ ...formData, cnic: e.target.value })} className={field} />
              </div>
              <div>
                <label className={lbl}>{L.phone}</label>
                <input type="tel" required placeholder="0300 1234567" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={field} />
              </div>
            </div>

            <div>
              <label className={lbl}>{L.address}</label>
              <input type="text" required placeholder={language === 'urdu' ? 'مکمل پتہ' : 'Full residential address'} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={field} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={lbl}>{L.incidentDate}</label>
                <input type="date" required value={formData.incidentDate} onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })} className={field} />
              </div>
              <div>
                <label className={lbl}>{L.city}</label>
                <select value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={field}>
                  {majorCities.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={lbl}>{L.incidentLocation}</label>
                <input type="text" required placeholder={language === 'urdu' ? 'مثلاً گلبرگ، لاہور' : 'e.g. Gulberg, Lahore'} value={formData.incidentLocation} onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })} className={field} />
              </div>
              <div>
                <label className={lbl}>{L.accusedName}</label>
                <input type="text" placeholder={language === 'urdu' ? 'نامعلوم چھوڑ دیں' : 'or leave blank'} value={formData.accusedName} onChange={(e) => setFormData({ ...formData, accusedName: e.target.value })} className={field} />
              </div>
            </div>

            <div>
              <label className={lbl}>{L.reason}</label>
              <textarea
                placeholder={language === 'urdu' ? 'واقعہ کیا ہوا، کب اور کیسے — مختصر مگر واضح لکھیں۔' : 'Describe what happened, when and how — briefly but clearly.'}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
                className={`${field} resize-none`}
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 border border-primary/15 hover:bg-primary/5 text-primary/60 font-bold py-2.5 rounded-lg transition-all text-sm">
                {language === 'urdu' ? 'منسوخ' : 'Cancel'}
              </button>
              <button type="submit" className="flex-1 bg-accent hover:bg-[#B3933C] text-primary font-black py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{language === 'urdu' ? 'ڈرافٹ بنائیں' : 'Generate Draft'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FIRGenerator;
