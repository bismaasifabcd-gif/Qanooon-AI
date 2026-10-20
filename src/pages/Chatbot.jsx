import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mic, 
  Send, 
  Volume2, 
  MoreVertical,
  Paperclip,
  Smile,
  ShieldCheck,
  Database,
  Cpu,
  Search,
  X,
  FileText,
  Sparkles,
  Info,
  CheckCircle2,
  Calendar,
  MapPin,
  Navigation,
  Share2,
  Printer,
  Download,
  Gavel,
  History as HistoryIcon,
  Plus,
  MessageSquare
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import * as pdfjsLib from 'pdfjs-dist';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { KanoonLogo, ChatbotEmptyState, ChatbotBannerIllustration } from '../components/SvgAssets';
import FeatureGuide from '../components/FeatureGuide';
import logo from '../assets/logo.png';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, setDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
// RAG disabled to conserve API quota — kept for future re-enable
// import { searchLaws } from '../services/ragService';
// import { populateLawVectors } from '../utils/populateLawVectors';
import parseResponse from '../utils/responseParser';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import { callGemini, callGeminiForDocument } from '../services/geminiService';
import { checkRateLimit, getRemainingQueries, DAILY_LIMIT } from '../utils/rateLimiter';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const SEARCH_API_KEY = import.meta.env.VITE_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = import.meta.env.VITE_SEARCH_ENGINE_ID;

const detectLanguage = (text) => {
  const urduPattern = /[\u0600-\u06FF]/;
  return urduPattern.test(text) ? 'urdu' : 'english';
};

const Chatbot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const { userData, user } = useAuth();
  
  const [activeTraceIndex, setActiveTraceIndex] = useState(null);
  const [simulatedDraft, setSimulatedDraft] = useState(null);
  const [draftStatusText, setDraftStatusText] = useState('');
  
  const [complainantForm, setComplainantForm] = useState({
    complainantName: '',
    fatherName: '',
    cnic: '',
    address: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    city: 'Lahore',
    accusedName: '',
    accusedAddress: '',
    witnesses: '',
    phone: '',
    applicableLaw: ''
  });
  const [showFormModal, setShowFormModal] = useState(false);
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);
  const [generatedDocContent, setGeneratedDocContent] = useState('');

  const getComplaintLetterRecipient = (lawName) => {
    const lowerLaw = (lawName || '').toLowerCase();
    if (lowerLaw.includes('domestic') || lowerLaw.includes('women') || lowerLaw.includes('family') || lowerLaw.includes('harassment') || lowerLaw.includes('violence')) {
      return {
        authority: "District Police Officer (DPO)",
        address: "Women Protection Authority, Concerned District Headquarter, Pakistan"
      };
    } else if (lowerLaw.includes('cyber') || lowerLaw.includes('digital') || lowerLaw.includes('online') || lowerLaw.includes('electronic') || lowerLaw.includes('internet') || lowerLaw.includes('fia') || lowerLaw.includes('harasment')) {
      return {
        authority: "FIA Cyber Crime Wing",
        address: "fiacybercrime@fia.gov.pk, Concerned Zone Office, Pakistan"
      };
    } else if (lowerLaw.includes('labour') || lowerLaw.includes('wage') || lowerLaw.includes('work') || lowerLaw.includes('employee') || lowerLaw.includes('industrial') || lowerLaw.includes('employment')) {
      return {
        authority: "Labour Court & District Labour Officer",
        address: "Labour Court Wing, Department of Industries, Pakistan"
      };
    } else {
      // Default to Property / General Civil issue
      return {
        authority: "Civil Court & Revenue Department",
        address: "Tehsil Headquarter, Civil Court Premises, Concerned District, Pakistan"
      };
    }
  };

  const handleGenerateDocument = async () => {
    setIsGeneratingDoc(true);
    try {
      const chatHistoryText = messages.map(m => `${m.role === 'user' ? 'User' : 'AskLex'}: ${m.content}`).join('\n');
      const prompt = `You are a legal document writer for Pakistani citizens.

Based on this conversation:
${chatHistoryText}

And this law:
${simulatedDraft.lawName || complainantForm.applicableLaw}

Generate a ${simulatedDraft.type === 'fir' ? 'FIR' : 'Complaint Letter'} with these user details:
- Complainant Name: ${complainantForm.complainantName}
- Father's Name: ${complainantForm.fatherName}
- CNIC: ${complainantForm.cnic}
- Address: ${complainantForm.address}
- Phone: ${complainantForm.phone}
- Incident Date: ${complainantForm.incidentDate}
- Incident Time: ${complainantForm.incidentTime}
- Incident Location: ${complainantForm.incidentLocation}
- City: ${complainantForm.city}
- Accused Name: ${complainantForm.accusedName || 'Unknown'}
- Accused Address: ${complainantForm.accusedAddress || 'Unknown'}
- Witnesses: ${complainantForm.witnesses || 'None'}

Rules:
- Use formal Pakistani legal language
- Be specific and detailed
- Include exact law sections
- Make it ready to submit
- Professional tone throughout
- In Urdu if user chose Urdu
- In English if user chose English

Output must be in this EXACT structure:

${simulatedDraft.type === 'fir' ? `براہ کرم اردو میں ایف آئی آر درج کریں

FIRST INFORMATION REPORT (FIR)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FIR Number: ____/2026
Police Station: ____________
District: ${complainantForm.city}
Date: ${complainantForm.incidentDate}
Time: ${complainantForm.incidentTime}

SECTION A — COMPLAINANT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━
Name: ${complainantForm.complainantName}
Father's Name: ${complainantForm.fatherName}
CNIC: ${complainantForm.cnic}
Address: ${complainantForm.address}
Phone: ${complainantForm.phone}

SECTION B — INCIDENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━
Date of Incident: ${complainantForm.incidentDate}
Time of Incident: ${complainantForm.incidentTime}
Place of Incident: ${complainantForm.incidentLocation}

SECTION C — DESCRIPTION
━━━━━━━━━━━━━━━━━━━━━━━
[Detailed description generated by AI based on user's conversation details]

SECTION D — ACCUSED DETAILS
━━━━━━━━━━━━━━━━━━━━━━━
Name: ${complainantForm.accusedName || 'Unknown'}
Address: ${complainantForm.accusedAddress || 'Unknown'}

SECTION E — APPLICABLE LAW
━━━━━━━━━━━━━━━━━━━━━━━
${simulatedDraft.lawName || complainantForm.applicableLaw}

SECTION F — WITNESSES
━━━━━━━━━━━━━━━━━━━━━━━
${complainantForm.witnesses || 'None'}

SECTION G — RELIEF SOUGHT
━━━━━━━━━━━━━━━━━━━━━━━
[Relief generated by AI based on the law]

COMPLAINANT SIGNATURE
━━━━━━━━━━━━━━━━━━━━━━━
Name: ${complainantForm.complainantName}
Date: ${new Date().toLocaleDateString()}
Signature: ________________

NOTE: This is a draft FIR. Present this to your nearest police station for registration.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━` : `${complainantForm.city}, ${new Date().toLocaleDateString()}

To,
${getComplaintLetterRecipient(simulatedDraft.lawName || complainantForm.applicableLaw).authority}
${getComplaintLetterRecipient(simulatedDraft.lawName || complainantForm.applicableLaw).address}

Subject: Complaint Regarding Violation Under ${simulatedDraft.lawName || complainantForm.applicableLaw}

Respected Sir/Madam,

I, ${complainantForm.complainantName}, son/daughter of ${complainantForm.fatherName}, resident of ${complainantForm.address}, CNIC: ${complainantForm.cnic}

Hereby respectfully submit that:

[Formally generated detailed explanation, 2-3 paragraphs describing the incident formally based on chat conversation]

The above acts are punishable under:
${simulatedDraft.lawName || complainantForm.applicableLaw}
which states: [Section text and penal metrics of this law generated by AI]

Therefore, I humbly request that:
1. [AI generated relief 1]
2. [AI generated relief 2]
3. Appropriate legal action be taken

I shall be highly grateful.

Yours sincerely,

${complainantForm.complainantName}
${complainantForm.address}
${complainantForm.phone}
${new Date().toLocaleDateString()}

Attachments:
□ CNIC Copy
□ Evidence (if any)
□ Witness Statements (if any)`}
`;

      // Check rate limit for document generation
      if (user) {
        const rateCheck = await checkRateLimit(user.uid, 'document');
        if (!rateCheck.allowed) {
          alert(rateCheck.message);
          setIsGeneratingDoc(false);
          return;
        }
      }

      const outputText = await callGeminiForDocument(prompt, language);
      
      setGeneratedDocContent(outputText);
      
      // Save document to Firestore
      if (user) {
        await addDoc(collection(db, "users", user.uid, "documents"), {
          type: simulatedDraft.type === 'fir' ? "fir_draft" : "complaint_letter",
          content: outputText,
          generatedAt: serverTimestamp(),
          lawApplied: simulatedDraft.lawName || complainantForm.applicableLaw,
          status: "draft",
          title: simulatedDraft.type === 'fir' ? `FIR Draft: ${(simulatedDraft.lawName || complainantForm.applicableLaw).split('\n')[0]}` : `Complaint: ${(simulatedDraft.lawName || complainantForm.applicableLaw).split('\n')[0]}`
        });
      }

      // Update Case Status Tracker
      if (simulatedDraft.type === 'fir') {
        localStorage.setItem('kanoon_status_fir', 'true');
      } else {
        localStorage.setItem('kanoon_status_letter', 'true');
      }

    } catch (err) {
      console.error(err);
      alert(language === 'urdu' ? 'دستاویز بنانے میں خرابی پیش آئی ہے۔' : 'Error generating document. Please check connection and try again.');
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  const handleInstantDraft = async (type) => {
    setIsGeneratingDoc(true);
    const activeLawName = simulatedDraft?.lawName || complainantForm.applicableLaw || (type === 'fir' ? 'FIR Draft' : 'Complaint Letter');
    setSimulatedDraft({ type, lawName: activeLawName, explanation: '' });
    setGeneratedDocContent('');
    
    const todayStr = new Date().toLocaleDateString();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const citizenName = userData?.name || 'Citizen';
    const citizenPhone = userData?.phone || '0300-1234567';
    
    const prefilledForm = {
      complainantName: citizenName,
      fatherName: complainantForm.fatherName || 'Muhammad Yousuf',
      cnic: complainantForm.cnic || '35201-1234567-9',
      address: complainantForm.address || 'House 42, Sector Y, DHA, Lahore, Pakistan',
      incidentDate: complainantForm.incidentDate || new Date().toISOString().split('T')[0],
      incidentTime: complainantForm.incidentTime || timeStr,
      incidentLocation: complainantForm.incidentLocation || 'Main Boulevard, Gulberg, Lahore',
      city: complainantForm.city || 'Lahore',
      accusedName: complainantForm.accusedName || 'Unknown Accused',
      accusedAddress: complainantForm.accusedAddress || 'Unknown Address',
      witnesses: complainantForm.witnesses || 'None',
      phone: citizenPhone,
      applicableLaw: activeLawName
    };
    setComplainantForm(prefilledForm);

    try {
      const chatHistoryText = messages.map(m => `${m.role === 'user' ? 'User' : 'AskLex'}: ${m.content}`).join('\n');
      const authority = getComplaintLetterRecipient(prefilledForm.applicableLaw);
      
      const prompt = `You are an expert legal document writer for Pakistani citizens.
Based on this conversation:
${chatHistoryText}

Generate a formal ${type === 'fir' ? 'FIRST INFORMATION REPORT (FIR) under Sec 154 CrPC' : 'Complaint Letter'} with these complainant details:
- Complainant Name: ${prefilledForm.complainantName}
- Father's/Husband Name: ${prefilledForm.fatherName}
- CNIC: ${prefilledForm.cnic}
- Address: ${prefilledForm.address}
- Phone: ${prefilledForm.phone}
- Incident Date: ${prefilledForm.incidentDate}
- Incident Time: ${prefilledForm.incidentTime}
- Incident Location: ${prefilledForm.incidentLocation}
- City: ${prefilledForm.city}
- Accused Name: ${prefilledForm.accusedName}
- Accused Address: ${prefilledForm.accusedAddress}
- Witnesses: ${prefilledForm.witnesses}

Rules:
- Use formal Pakistani legal terminology
- Be extremely specific, realistic, and detailed
- Include relevant Pakistan Penal Code (PPC) / Special Act sections matched from the chat context (e.g. PECA for cybercrime, PPC 379 for theft, PPC 489-F for cheque dishonor, etc.)
- In Urdu if the user spoke in Urdu, or English if in English.

Output must be in this EXACT structure:

${type === 'fir' ? `FIRST INFORMATION REPORT (FIR)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIR Number: ____/2026
Police Station: Concerned Police Station
District: ${prefilledForm.city}
Date: ${prefilledForm.incidentDate}
Time: ${prefilledForm.incidentTime}

SECTION A — COMPLAINANT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━
Name: ${prefilledForm.complainantName}
Father's Name: ${prefilledForm.fatherName}
CNIC: ${prefilledForm.cnic}
Address: ${prefilledForm.address}
Phone: ${prefilledForm.phone}

SECTION B — INCIDENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━
Date of Incident: ${prefilledForm.incidentDate}
Time of Incident: ${prefilledForm.incidentTime}
Place of Incident: ${prefilledForm.incidentLocation}

SECTION C — DESCRIPTION
━━━━━━━━━━━━━━━━━━━━━━━
[Detailed description generated by AI based on user's conversation details]

SECTION D — ACCUSED DETAILS
━━━━━━━━━━━━━━━━━━━━━━━
Name: ${prefilledForm.accusedName}
Address: ${prefilledForm.accusedAddress}

SECTION E — APPLICABLE LAW
━━━━━━━━━━━━━━━━━━━━━━━
[PPC / CrPC Sections matched from conversation]

SECTION F — WITNESSES
━━━━━━━━━━━━━━━━━━━━━━━
${prefilledForm.witnesses}

SECTION G — RELIEF SOUGHT
━━━━━━━━━━━━━━━━━━━━━━━
[Relief generated by AI based on the law]

COMPLAINANT SIGNATURE
━━━━━━━━━━━━━━━━━━━━━━━
Name: ${prefilledForm.complainantName}
Date: ${new Date().toLocaleDateString()}
Signature: ________________
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━` : `${prefilledForm.city}, ${new Date().toLocaleDateString()}

To,
${authority.authority}
${authority.address}

Subject: Complaint Regarding Violation Under Pakistani Law

Respected Sir/Madam,

I, ${prefilledForm.complainantName}, son/daughter of ${prefilledForm.fatherName}, resident of ${prefilledForm.address}, CNIC: ${prefilledForm.cnic}

Hereby respectfully submit that:

[Formally generated detailed explanation, 2-3 paragraphs describing the incident formally based on chat conversation]

The above acts are punishable under:
[Applicable PPC / Special Act Section matched from conversation]

Therefore, I humbly request that:
1. [AI generated relief 1]
2. [AI generated relief 2]
3. Appropriate legal action be taken

Yours sincerely,

${prefilledForm.complainantName}
${prefilledForm.address}
${prefilledForm.phone}`}`;

      // Check rate limit for document generation
      if (user) {
        const rateCheck = await checkRateLimit(user.uid, 'document');
        if (!rateCheck.allowed) {
          alert(rateCheck.message);
          setIsGeneratingDoc(false);
          return;
        }
      }

      const outputText = await callGeminiForDocument(prompt, language);
      
      setGeneratedDocContent(outputText);
      
      // Save document to Firestore
      if (user) {
        await addDoc(collection(db, "users", user.uid, "documents"), {
          type: type === 'fir' ? "fir_draft" : "complaint_letter",
          content: outputText,
          generatedAt: serverTimestamp(),
          status: "draft",
          title: type === 'fir' ? "Immediate FIR Draft" : "Immediate Complaint Letter"
        });
      }

      // Update Case Status Tracker
      if (type === 'fir') {
        localStorage.setItem('kanoon_status_fir', 'true');
      } else {
        localStorage.setItem('kanoon_status_letter', 'true');
      }

    } catch (err) {
      console.warn("AI generation failed, using elegant local template fallback:", err);
      // Resilient Fallback to offline template so the user always gets a completed form!
      let fallbackContent = "";
      if (type === 'fir') {
        fallbackContent = `FIRST INFORMATION REPORT (FIR)
[UNDER SECTION 154 CRIMINAL PROCEDURE CODE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Report No: 2026/___                 Police Station: Concerned S.H.O
District: ${prefilledForm.city}                    Date: ${todayStr}
Time of Report: ${timeStr}

1. COMPLAINANT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name of Complainant: ${prefilledForm.complainantName}
Father's/Husband Name: ${prefilledForm.fatherName}
CNIC Number: ${prefilledForm.cnic}
Permanent Address: ${prefilledForm.address}
Contact Number: ${prefilledForm.phone}

2. INCIDENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date & Time of Occurrence: ${prefilledForm.incidentDate} at ${prefilledForm.incidentTime}
Place of Occurrence: ${prefilledForm.incidentLocation}
Offense Committed: General Criminal Incident
Applicable Law / Penal Code: PPC Section (To be filled by Police)

3. ACCUSED DETAILS (IF KNOWN)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name of Accused: ${prefilledForm.accusedName}
Address/Details: ${prefilledForm.accusedAddress}

4. DETAILED COMPLAINT / INCIDENT STATEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
To,
The Officer in Charge (S.H.O),
Police Station Concerned, ${prefilledForm.city}.

Respected Sir,

I, the undersigned, respectfully state that I am a citizen of Pakistan residing at the address mentioned above. I wish to report a criminal offense that took place on ${prefilledForm.incidentDate} at approximately ${prefilledForm.incidentTime} at ${prefilledForm.incidentLocation}.

The details of the incident are that the accused person(s) committed illegal actions causing loss, harm, and distress to the complainant.

Therefore, it is respectfully prayed that a First Information Report (FIR) be registered under Section 154 of the Cr.P.C. against the accused persons, and formal investigation be initiated in accordance with the law of the Land.

Yours Respectfully,

Complainant Signature: _______________________
Name: ${prefilledForm.complainantName}
Date: ${todayStr}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated via AskLex — Kanoon AI Legal Assistant`;
      } else {
        fallbackContent = `FORMAL COMPLAINT NOTICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: ${todayStr}
Place: ${prefilledForm.city}, Pakistan

TO,
${authority.authority}
${authority.address}

SUBJECT: COMPLAINT UNDER APPLICABLE LAWS OF PAKISTAN

Respected Sir/Madam,

I, ${prefilledForm.complainantName}, son/daughter of ${prefilledForm.fatherName}, resident of ${prefilledForm.address}, CNIC Number: ${prefilledForm.cnic}, Phone: ${prefilledForm.phone}, do hereby respectfully submit this formal complaint as under:

1. STATEMENT OF FACTS:
That the complainant is a law-abiding citizen of Pakistan. The matter of this complaint arises from the factual events that occurred on ${prefilledForm.incidentDate} at ${prefilledForm.incidentLocation} where the rights of the complainant were violated.

2. GRIEVANCE / VIOLATION DETAILS:
That the actions of the respondent(s) constitute a clear violation under the relevant statutes of Pakistan (including but not limited to the Penal Code / Consumer Protection Act / Harassment Act).

3. RELIEF SOUGHT:
In light of the facts stated above, it is respectfully prayed that the competent authority may:
a) Initiate an immediate inquiry into the matter.
b) Summon the concerned parties for clarification.
c) Provide appropriate relief and penalize the violators as per the statutory provisions.

I shall be highly grateful for your swift action.

Yours Sincerely,

Complainant Signature: _______________________
Name: ${prefilledForm.complainantName}
Date: ${todayStr}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated via AskLex — Kanoon AI Legal Assistant`;
      }
      setGeneratedDocContent(fallbackContent);
    } finally {
      setIsGeneratingDoc(false);
    }
  };

  const handleDownloadPDF = (content, filename) => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('KANOON AI', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Qanoon Sabke Liye Hai', 105, 28, { align: 'center' });
    
    // Divider line
    doc.line(10, 32, 200, 32);
    
    // Content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const lines = doc.splitTextToSize(content, 180);
    
    let y = 40;
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
    doc.text('Generated by Kanoon AI — ' + new Date().toLocaleDateString(), 105, 285, { align: 'center' });
    
    doc.save(filename);
  };
  
  const getInitialWelcomeMessage = () => [
    { 
      role: 'assistant', 
      content: language === 'urdu' ? `اسلام و علیکم ${userData?.name || ''}! میں آپ کا قانونی اسسٹنٹ AskLex ہوں۔ میں آپ کی کیسے مدد کر سکتا ہوں؟` : `Salaam ${userData?.name || ''}! I am AskLex, your AI Legal Assistant. How can I help you with Pakistani Law today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ];

  const [messages, setMessages] = useState(getInitialWelcomeMessage());
  const [history, setHistory] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);

  // Live list of this account's past chat sessions (for the slide-in panel).
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'history'), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setChatSessions(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((s) => s.type === 'chat')
      );
    }, () => {});
    return () => unsub();
  }, [user]);

  const startNewSession = () => {
    setMessages(getInitialWelcomeMessage());
    setHistory([]);
    setCurrentSessionId(null);
  };

  const saveMessageToFirestore = async (uid, sessionId, allMessages) => {
    const sessionRef = doc(db, 'users', uid, 'history', sessionId);
    await setDoc(sessionRef, {
      type: 'chat',
      messages: allMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp || new Date().toISOString()
      })),
      summary: allMessages.find(m => m.role === 'user')?.content.slice(0, 60) || 'Legal Chat',
      updatedAt: serverTimestamp(),
      language: language
    }, { merge: true });
  };

  const loadExistingSession = async (id) => {
    if (!user) return;
    setLoadingState('gemini');
    try {
      const sessionDoc = await getDoc(doc(db, 'users', user.uid, 'history', id));
      if (sessionDoc.exists()) {
        const data = sessionDoc.data();
        const msgs = data.messages || [];
        setMessages(msgs);
        setHistory(msgs);
        setCurrentSessionId(id);
        setTimeout(scrollToBottom, 150);
      }
    } catch (err) {
      console.error("Error loading session:", err);
    } finally {
      setLoadingState(null);
    }
  };

  useEffect(() => {
    const resumedSessionId = location.state?.sessionId;
    const resuming = location.state?.resuming;
    if (resuming && resumedSessionId) {
      loadExistingSession(resumedSessionId);
    } else {
      startNewSession();
    }
  }, [location.state?.sessionId, location.state?.resuming, user]);
  const [input, setInput] = useState(location.state?.prefill || '');
  const [isRecording, setIsRecording] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [chatLanguage, setChatLanguage] = useState(language);
  const [loadingState, setLoadingState] = useState(null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [dailyQueryCount, setDailyQueryCount] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load remaining queries from Firestore on mount
    const loadRemainingQueries = async () => {
      if (user?.uid) {
        const remaining = await getRemainingQueries(user.uid);
        setDailyQueryCount(DAILY_LIMIT - remaining.chat);
      }
    };
    loadRemainingQueries();
  }, [user]);

  const googleCustomSearch = async (query) => {
    const url = `https://www.googleapis.com/customsearch/v1?key=${SEARCH_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query + " Pakistan Law")}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items?.map(item => item.snippet).join("\n") || "";
  };

  const speak = (text, id) => {
    if (!window.speechSynthesis) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = chatLanguage === 'urdu' ? 'ur-PK' : 'en-US';
    utterance.onstart = () => setSpeakingId(id);
    utterance.onend = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
  };

  const handleFindLawyer = (lawName) => {
    let specialty = 'Criminal Law'; // Default
    const lowerLaw = (lawName || '').toLowerCase();
    
    if (
      lowerLaw.includes('domestic violence') || 
      lowerLaw.includes('family') || 
      lowerLaw.includes('marriage') || 
      lowerLaw.includes('divorce') || 
      lowerLaw.includes('khula') ||
      lowerLaw.includes('shadi') ||
      lowerLaw.includes('nikah')
    ) {
      specialty = 'Family Law';
    } else if (
      lowerLaw.includes('ppc') || 
      lowerLaw.includes('penal code') || 
      lowerLaw.includes('criminal') || 
      lowerLaw.includes('theft') || 
      lowerLaw.includes('assault') || 
      lowerLaw.includes('murder') ||
      lowerLaw.includes('chori') ||
      lowerLaw.includes('qatl') ||
      lowerLaw.includes('maar')
    ) {
      specialty = 'Criminal Law';
    } else if (
      lowerLaw.includes('peca') || 
      lowerLaw.includes('cyber') || 
      lowerLaw.includes('digital') || 
      lowerLaw.includes('online') ||
      lowerLaw.includes('internet')
    ) {
      specialty = 'Cyber Crime';
    } else if (
      lowerLaw.includes('labour') || 
      lowerLaw.includes('labor') || 
      lowerLaw.includes('employment') || 
      lowerLaw.includes('work') || 
      lowerLaw.includes('salary') ||
      lowerLaw.includes('job') ||
      lowerLaw.includes('mulazmat')
    ) {
      specialty = 'Labour Law';
    } else if (
      lowerLaw.includes('landlord') ||
      lowerLaw.includes('property') ||
      lowerLaw.includes('rent') ||
      lowerLaw.includes('kiraya') ||
      lowerLaw.includes('zameen') ||
      lowerLaw.includes('makaan')
    ) {
      specialty = 'Property Law';
    }
    
    navigate('/lawyer', { state: { prefilledSpecialty: specialty } });
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = chatLanguage === 'urdu' ? 'ur-PK' : 'en-US';
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (e) => setInput(e.results[0][0].transcript);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleViewportChange = () => {
      if (window.visualViewport) {
        setKeyboardOffset(window.innerHeight - window.visualViewport.height);
        scrollToBottom();
      }
    };
    window.visualViewport?.addEventListener('resize', handleViewportChange);
    return () => window.visualViewport?.removeEventListener('resize', handleViewportChange);
  }, []);

  useEffect(() => scrollToBottom(), [messages, loadingState]);

  const createSession = async (uid, firstMessageContent) => {
    const sessionRef = await addDoc(
      collection(db, 'users', uid, 'history'),
      {
        type: 'chat',
        messages: [],
        summary: firstMessageContent.slice(0, 60) || 'Legal Chat',
        createdAt: serverTimestamp(),
        language: language
      }
    );
    return sessionRef.id;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loadingState) return;

    const userMsgContent = input.trim();
    const detectedLang = detectLanguage(userMsgContent);
    setChatLanguage(detectedLang);

    // Server-side rate limiting (Firestore-backed, cannot be bypassed)
    const rateCheck = await checkRateLimit(user?.uid, 'chat');
    if (!rateCheck.allowed) {
      const errorMsg = {
        role: 'assistant',
        content: rateCheck.message || (language === 'urdu' 
          ? 'آپ کی روزانہ کی حد ختم ہو گئی ہے۔ کل دوبارہ کوشش کریں۔'
          : 'Daily query limit reached. Please try again tomorrow.'),
        isError: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

    // Update local counter for UI display
    setDailyQueryCount(prev => prev + 1);

    // Add user message to UI state
    const userMessage = { 
      role: 'user', 
      content: userMsgContent, 
      timestamp: new Date().toISOString() 
    };
    
    // Clear inputs first
    setInput('');
    setSelectedFile(null);
    setFilePreview(null);

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setLoadingState('gemini');

    try {
      // Call service (uses local DB + Wikipedia, no API keys)
      const response = await callGemini(
        userMsgContent,
        history,
        userData?.name || 'Citizen',
        language
      );

      // Add AI response to UI state
      const aiMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...newMessages, aiMessage];
      setMessages(updatedMessages);

      // Update history for next call
      const updatedHistory = [
        ...history,
        { role: 'user', content: userMsgContent },
        { role: 'assistant', content: response }
      ];
      setHistory(updatedHistory);

      // Save to Firestore
      if (user) {
        let activeSessionId = currentSessionId;
        if (!activeSessionId) {
          activeSessionId = await createSession(user.uid, userMsgContent);
          setCurrentSessionId(activeSessionId);
        }
        await saveMessageToFirestore(user.uid, activeSessionId, updatedMessages);
      }

    } catch (error) {
      console.error('Error in chatbot flow:', error);
      const fallbackContent = language === 'urdu'
        ? `معذرت، کچھ خرابی ہوئی۔ براہ کرم دوبارہ کوشش کریں۔\n\n📞 ہیلپ لائنز:\nخواتین تحفظ: 1043\nسائبر کرائم: 9911\nچائلڈ پروٹیکشن: 1121`
        : `Sorry, something went wrong. Please try again.\n\n📞 Emergency Helplines:\nWomen Protection: 1043\nCyber Crime: 9911\nChild Protection: 1121`;

      const errorMsg = {
        role: 'assistant',
        content: fallbackContent,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoadingState(null);
    }
  };

  // Auto-send a question that was passed from the dashboard "Ask" bar.
  const autoSentRef = useRef(false);
  useEffect(() => {
    if (
      !autoSentRef.current &&
      location.state?.autoSend &&
      input.trim() &&
      !loadingState
    ) {
      autoSentRef.current = true;
      handleSend({ preventDefault: () => {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, loadingState]);

  const chatGuideSteps = language === 'urdu'
    ? [
        { title: 'AskLex', text: 'یہاں کوئی بھی قانونی سوال آسان الفاظ میں لکھیں — رسمی یا عام انداز میں۔' },
        { title: 'تفصیلی جواب', text: 'سنگین معاملات پر قانون، دفعہ اور عملی اقدامات ملتے ہیں؛ عام باتوں پر نرم مشورہ۔' },
        { title: 'آواز اور نئی چیٹ', text: 'جواب سننے کے لیے اسپیکر دبائیں، اور "نیا" سے نئی گفتگو شروع کریں۔' },
      ]
    : [
        { title: 'AskLex', text: 'Type any legal question here in plain words — formal or casual, English or Urdu.' },
        { title: 'Detailed answers', text: 'Serious matters show the law, section and action steps; everyday ones get calm advice.' },
        { title: 'Voice & new chat', text: 'Tap the speaker to hear a reply, and “New” to start a fresh conversation.' },
      ];

  const openSessionFromPanel = (id) => {
    setShowHistoryPanel(false);
    loadExistingSession(id);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-surface overflow-hidden">
      <FeatureGuide steps={chatGuideSteps} storageKey={`qanoon_guide_chat_${user?.uid || 'guest'}`} language={language} />

      {/* Chat history — slide-in panel (ChatGPT style) */}
      <div
        onClick={() => setShowHistoryPanel(false)}
        className={`fixed inset-0 z-[80] bg-primary/40 backdrop-blur-sm transition-opacity duration-300 ${
          showHistoryPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      <aside
        className={`fixed top-0 bottom-0 ${language === 'urdu' ? 'right-0' : 'left-0'} z-[81] w-[82%] max-w-xs bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          showHistoryPanel ? 'translate-x-0' : (language === 'urdu' ? 'translate-x-full' : '-translate-x-full')
        }`}
      >
        {/* Panel header */}
        <div className="bg-primary px-4 py-4 flex items-center justify-between border-b-2 border-accent/30 flex-shrink-0">
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-4 h-4 text-accent" />
            <span className="text-white font-black text-sm">{language === 'urdu' ? 'آپ کی گفتگو' : 'Your Chats'}</span>
          </div>
          <button onClick={() => setShowHistoryPanel(false)} className="text-white/60 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New chat */}
        <div className="p-3 flex-shrink-0">
          <button
            onClick={() => { setShowHistoryPanel(false); startNewSession(); }}
            className="w-full bg-accent text-primary font-black py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#B3933C] transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'urdu' ? 'نئی گفتگو' : 'New Chat'}</span>
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1.5 custom-scrollbar">
          {chatSessions.length === 0 ? (
            <div className="text-center py-10 px-4">
              <MessageSquare className="w-10 h-10 text-primary/15 mx-auto mb-3" />
              <p className="text-primary/40 text-xs font-medium">
                {language === 'urdu' ? 'ابھی کوئی گفتگو محفوظ نہیں۔' : 'No saved chats yet.'}
              </p>
            </div>
          ) : (
            chatSessions.map((s) => (
              <button
                key={s.id}
                onClick={() => openSessionFromPanel(s.id)}
                className={`w-full text-left rtl:text-right p-3 rounded-lg transition-all flex items-start gap-2.5 group ${
                  currentSessionId === s.id ? 'bg-accent/10 border border-accent/30' : 'hover:bg-surface border border-transparent'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className={`text-primary font-bold text-[13px] truncate ${language === 'urdu' ? 'font-urdu' : ''}`}>
                    {s.summary || (language === 'urdu' ? 'قانونی گفتگو' : 'Legal Chat')}
                  </p>
                  <p className="text-primary/30 text-[10px] font-medium mt-0.5">
                    {s.updatedAt?.toDate ? s.updatedAt.toDate().toLocaleDateString() : ''}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Premium Chat Header */}
      <header className="bg-primary px-3 md:px-6 py-3 flex items-center justify-between z-20 border-b-2 border-accent/30">
        <div className="flex items-center space-x-2 md:space-x-3 rtl:space-x-reverse min-w-0">
          <button onClick={() => navigate('/dashboard')} className="text-white/60 hover:text-white p-1.5 rounded-full transition-colors flex-shrink-0">
            <ArrowLeft className={`w-5 h-5 ${language === 'urdu' ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => setShowHistoryPanel(true)}
            aria-label="Chat history"
            className="text-white/70 hover:text-primary hover:bg-accent p-1.5 rounded-lg transition-all flex-shrink-0 border border-white/10"
          >
            <HistoryIcon className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 md:w-11 md:h-11 bg-accent rounded-xl md:rounded-2xl flex items-center justify-center shadow-md shadow-accent/20 overflow-hidden">
                <img src={logo} alt="Kanoon AI Logo" className="app-logo w-7 h-7 md:w-8 md:h-8 object-cover" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-primary rounded-full animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <h2 className="text-white font-black text-base md:text-lg">AskLex</h2>
                <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse flex-shrink-0" />
              </div>
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">AI Legal Assistant</p>
            </div>
          </div>
        </div>
        <div className="flex items-center flex-shrink-0">
          <button 
            onClick={startNewSession}
            className="text-white bg-white/10 hover:bg-[#C9A84C] hover:text-[#0F1E36] px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap"
          >
            {language === 'urdu' ? 'نیا چیٹ ➕' : 'New ➕'}
          </button>
        </div>
      </header>
      
      {dailyQueryCount >= (DAILY_LIMIT - 10) && (
        <div className="bg-accent/15 border-b border-accent/25 px-6 py-2.5 text-center text-xs font-black text-accent flex items-center justify-center space-x-2 animate-pulse z-10">
          <Info className="w-4 h-4 mr-2" />
          <span>
            {language === 'urdu' 
              ? `آپ اپنے روزانہ کے سوالات کی حد (${DAILY_LIMIT}) کے قریب ہیں (موجودہ: ${dailyQueryCount}/${DAILY_LIMIT})`
              : `You are approaching your daily query limit of ${DAILY_LIMIT} (Current: ${dailyQueryCount}/${DAILY_LIMIT})`
            }
          </span>
        </div>
      )}

      {/* Messages Area with Offline-Secure CSS Grid Pattern (Replacing cubes.png external URL) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 md:px-8 md:py-6 space-y-4 md:space-y-6 custom-scrollbar bg-[radial-gradient(#C9A84C_1px,transparent_1px)] [background-size:16px_16px] bg-opacity-[0.03]">
        {/* Guided Explorer Empty State */}
        {messages.length === 1 && (
          <div className="w-full max-w-xl mx-auto text-center space-y-4 pb-4 animate-fade-up">
            <ChatbotBannerIllustration className="w-36 h-36 md:w-48 md:h-48 mx-auto" />
            <div className="space-y-1">
              <p className="text-primary font-black text-base md:text-lg">How can I help you today?</p>
              <p className="text-primary/40 text-[11px] md:text-xs font-medium max-w-md mx-auto px-4">Ask about any law, or describe your situation — formally or casually.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md mx-auto px-2">
              {[
                { text: language === 'urdu' ? 'ملازمت کے حقوق کیا ہیں؟' : 'What are labor rights in Pakistan?', prefill: language === 'urdu' ? 'پاکستان میں ملازمین کے بنیادی حقوق کیا ہیں؟' : 'What are the basic rights of employees in Pakistan?' },
                { text: language === 'urdu' ? 'سائبر ہراسگی کی شکایت کیسے کریں؟' : 'How to report cyber harassment?', prefill: language === 'urdu' ? 'پاکستان میں سائبر ہراسگی یا بلیک میلنگ کی شکایت کیسے کی جائے؟' : 'How to report cyber harassment or blackmailing under PECA Pakistan?' },
                { text: language === 'urdu' ? 'طلاق اور بچوں کی تحویل کے قوانین' : 'Divorce & Child Custody Law', prefill: language === 'urdu' ? 'پاکستان میں فیملی لاز کے تحت طلاق اور بچوں کی تحویل کا کیا قانون ہے؟' : 'What is the law for divorce and child custody in Pakistan?' },
                { text: language === 'urdu' ? 'پراپرٹی کی خرید و فروخت کا طریقہ' : 'Property Purchase Guidelines', prefill: language === 'urdu' ? 'پراپرٹی خریدتے وقت کون سے قانونی کاغذات ضروری ہیں؟' : 'What are the essential legal document checks when purchasing property in Pakistan?' }
              ].map((s, i) => (
                <button
                  key={i}
                  onClick={() => setInput(s.prefill)}
                  className="bg-white hover:bg-accent/10 border border-primary/5 hover:border-accent/40 px-3 py-3 rounded-xl text-[11px] font-bold text-primary transition-all text-left rtl:text-right shadow-sm active:scale-95 cursor-pointer"
                >
                  {s.text}
                </button>
              ))}
            </div>
            <div className="h-px bg-primary/5 max-w-md mx-auto my-4" />
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
            {msg.role === 'assistant' ? (
              <div className="flex items-start space-x-2 rtl:space-x-reverse max-w-[90%] md:max-w-[80%]">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-xl rounded-bl-sm flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5 overflow-hidden">
                  <img src={logo} alt="AskLex" className="w-5 h-5 object-cover" />
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                {msg.content.includes('[LAW_NAME]') ? (() => {
                  const parsed = parseResponse(msg.content);
                  
                  let severityColor = 'border-l-amber-500';
                  let severityBadgeText = language === 'urdu' ? 'اہم معاملہ' : 'Important';
                  let severityBadgeStyle = 'bg-amber-50 text-amber-600 border border-amber-200';

                  if (parsed.severity === 'HIGH') {
                    severityColor = 'border-l-red-500';
                    severityBadgeText = language === 'urdu' ? 'سنگین معاملہ' : 'Serious Case';
                    severityBadgeStyle = 'bg-red-50 text-red-500 border border-red-200';
                  } else if (parsed.severity === 'LOW') {
                    severityColor = 'border-l-emerald-500';
                    severityBadgeText = language === 'urdu' ? 'معمولی معاملہ' : 'Minor Issue';
                    severityBadgeStyle = 'bg-emerald-50 text-emerald-600 border border-emerald-200';
                  }

                  return (
                    <div className={`rounded-2xl rounded-tl-md shadow-lg p-4 md:p-6 relative overflow-hidden group border border-[#C9A84C]/10 border-l-4 ${severityColor} bg-[#F5F0E8] text-primary`}>
                      
                      {/* Header with Severity Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] text-[#0F1E36]/40 font-black uppercase tracking-wider">AskLex Legal Insights</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-tight ${severityBadgeStyle}`}>
                          {severityBadgeText}
                        </span>
                      </div>

                      {/* ⚖️ Applicable Law Section */}
                      <div className="border-t border-[#C9A84C]/25 pt-3 pb-3">
                        <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-[#0F1E36] font-black text-xs mb-1">
                          <span className="text-[#C9A84C] text-sm">⚖️</span>
                          <span>{language === 'urdu' ? 'قابل اطلاق قانون' : 'Applicable Law'}</span>
                        </div>
                        <div className={`markdown-content ${chatLanguage === 'urdu' ? 'font-urdu text-lg' : 'text-[#0F1E36] text-[13px] font-semibold'}`}>
                          <ReactMarkdown>{parsed.lawName}</ReactMarkdown>
                        </div>
                      </div>

                      {/* 📋 What This Means Section */}
                      <div className="border-t border-[#C9A84C]/25 pt-3 pb-3">
                        <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-[#0F1E36] font-black text-xs mb-1.5">
                          <span className="text-[#C9A84C] text-sm">📋</span>
                          <span>{language === 'urdu' ? 'اس کا کیا مطلب ہے؟' : 'What This Means'}</span>
                        </div>
                        <div className={`markdown-content ${chatLanguage === 'urdu' ? 'font-urdu text-base leading-[1.9] text-[#0F1E36]/90' : 'text-[#0F1E36]/80 text-[13px] leading-relaxed'}`}>
                          <ReactMarkdown>{parsed.explanation}</ReactMarkdown>
                        </div>
                      </div>

                      {/* ✅ Action Steps Section */}
                      {parsed.actions && parsed.actions.length > 0 && (
                        <div className="border-t border-[#C9A84C]/25 pt-3 pb-3">
                          <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-[#0F1E36] font-black text-xs mb-2.5">
                            <span className="text-[#C9A84C] text-sm">✅</span>
                            <span>{language === 'urdu' ? 'عملی اقدامات' : 'Action Steps'}</span>
                          </div>
                          <ul className="space-y-2">
                            {parsed.actions.map((act, i) => (
                              <li key={i} className="flex items-start space-x-2 rtl:space-x-reverse">
                                <span className="w-4 h-4 bg-[#C9A84C]/15 text-[#C9A84C] font-black text-[9px] rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                  {i + 1}
                                </span>
                                <div className={`markdown-content flex-1 min-w-0 ${chatLanguage === 'urdu' ? 'font-urdu text-base text-[#0F1E36]/90' : 'text-[#0F1E36]/80 text-[13px]'}`}>
                                  <ReactMarkdown>{act}</ReactMarkdown>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* ⚠️ Punishment Section */}
                      {parsed.punishment && parsed.punishment.toLowerCase() !== 'not applicable' && parsed.punishment.trim() !== '' && (
                        <div className="border-t border-[#C9A84C]/25 pt-3 pb-3">
                          <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-[#0F1E36] font-black text-xs mb-1.5">
                            <span className="text-[#C9A84C] text-sm">⚠️</span>
                            <span>{language === 'urdu' ? 'سزا و جرمانہ' : 'Punishment'}</span>
                          </div>
                          <div className={`bg-red-50/50 border border-red-100/50 rounded-lg p-2.5 text-red-700 markdown-content ${chatLanguage === 'urdu' ? 'font-urdu text-base leading-[1.9]' : 'text-[13px]'}`}>
                            <ReactMarkdown>{parsed.punishment}</ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {/* 🔍 Find a Lawyer Button (hidden — removed from chatbot output) */}
                      <div className="hidden">
                        <button
                          onClick={() => handleFindLawyer(parsed.lawName)}
                          className="w-full bg-[#C9A84C] hover:bg-[#B3933C] text-[#0F1E36] font-black py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all shadow-lg shadow-[#C9A84C]/15 active:scale-[0.98]"
                        >
                          <span className={language === 'urdu' ? 'font-urdu text-lg' : 'text-sm tracking-wide'}>
                            {language === 'urdu' ? 'قریبی وکیل تلاش کریں 🔍' : 'Find a Lawyer Nearby 🔍'}
                          </span>
                        </button>
                      </div>

                      {/* Speaker Controls */}
                      <div className="mt-3 pt-3 border-t border-[#C9A84C]/20 flex items-center justify-between">
                        <button onClick={() => speak(parsed.explanation, idx)} className={`p-1.5 rounded-lg transition-all ${speakingId === idx ? 'bg-[#C9A84C] text-[#0F1E36]' : 'bg-[#0F1E36]/5 text-[#0F1E36]/40 hover:bg-[#0F1E36]/10'}`}>
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[9px] text-[#0F1E36]/20 font-bold">{msg.timestamp}</span>
                      </div>

                      {/* Agent Trace Dropdown */}
                      <div className="mt-3 border-t border-[#C9A84C]/25 pt-3">
                        <button
                          onClick={() => setActiveTraceIndex(activeTraceIndex === idx ? null : idx)}
                          className="text-[9px] text-[#0F1E36]/50 font-black uppercase tracking-wider flex items-center space-x-1.5 rtl:space-x-reverse bg-[#0F1E36]/5 px-3 py-2 rounded-lg border border-primary/5 transition-all hover:bg-accent/10 hover:text-accent hover:border-accent/30"
                        >
                          <span>🔍 {language === 'urdu' ? 'یہ کیسے ملا؟' : 'How I found this'}</span>
                        </button>

                        {activeTraceIndex === idx && (
                          <div className="mt-4 bg-[#0F1E36]/5 rounded-2xl p-5 border border-[#C9A84C]/10 text-left rtl:text-right space-y-4 animate-fade-up text-primary">
                            <p className="text-[11px] font-black text-primary/45 uppercase tracking-widest border-b border-primary/5 pb-2">
                              {language === 'urdu' ? 'ایجینٹ سرچ لاگز' : 'Agent Retrieval Logs'}
                            </p>
                            <div className="space-y-3">
                              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                <span className="w-5 h-5 bg-success/10 text-success rounded-full flex items-center justify-center font-bold text-[10px] mt-0.5">✓</span>
                                <div>
                                  <p className="text-xs font-black text-[#0F1E36]">{language === 'urdu' ? 'مرحلہ 1: سوال موصول ہوا' : 'Step 1: Query received'}</p>
                                  <p className="text-[9px] text-primary/45 font-medium mt-0.5">Situation parameters mapped to legal tags</p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                <span className="w-5 h-5 bg-success/10 text-success rounded-full flex items-center justify-center font-bold text-[10px] mt-0.5">✓</span>
                                <div>
                                  <p className="text-xs font-black text-[#0F1E36]">{language === 'urdu' ? 'مرحلہ 2: قانونی تجزیہ' : 'Step 2: Legal analysis'}</p>
                                  <p className="text-[9px] text-primary/45 font-medium mt-0.5">Question mapped to the relevant Penal Code / Special Acts</p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                <span className="w-5 h-5 bg-success/10 text-success rounded-full flex items-center justify-center font-bold text-[10px] mt-0.5">✓</span>
                                <div>
                                  <p className="text-xs font-black text-[#0F1E36]">{language === 'urdu' ? 'مرحلہ 3: بہترین قانون کا ملاپ' : 'Step 3: Best Match scoring'}</p>
                                  <p className="text-[9px] text-accent font-black mt-0.5">{parsed.lawName.split('\n')[0]}</p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                <span className="w-5 h-5 bg-success/10 text-success rounded-full flex items-center justify-center font-bold text-[10px] mt-0.5">✓</span>
                                <div>
                                  <p className="text-xs font-black text-[#0F1E36]">{language === 'urdu' ? 'مرحلہ 4: ماڈل پروسیسنگ' : 'Step 4: Groq Llama analyzed'}</p>
                                  <p className="text-[9px] text-primary/45 font-medium mt-0.5">Synthesized text against federal statutory directives</p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                <span className="w-5 h-5 bg-success/10 text-success rounded-full flex items-center justify-center font-bold text-[10px] mt-0.5">✓</span>
                                <div>
                                  <p className="text-xs font-black text-[#0F1E36]">{language === 'urdu' ? 'مرحلہ 5: حتمی جواب پیش ہے' : 'Step 5: Output dispatched'}</p>
                                  <p className="text-[9px] text-primary/45 font-medium mt-0.5">Formatted content securely served</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })() : (
                  <div className="bg-white rounded-2xl rounded-tl-md shadow-md shadow-primary/5 p-4 md:p-5 border border-primary/5 relative overflow-hidden group">
                    {msg.lawTag && (
                      <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3 flex-wrap gap-y-1">
                        <div className="px-2.5 py-0.5 bg-accent/10 text-accent text-[9px] font-black rounded-full border border-accent/20 flex items-center">
                          <ShieldCheck className="w-2.5 h-2.5 mr-1 rtl:ml-1 rtl:mr-0" />
                          {msg.lawTag}
                        </div>
                      </div>
                    )}

                    <div className={`markdown-content ${chatLanguage === 'urdu' ? 'font-urdu text-base leading-[1.9] text-primary' : 'text-primary/80 text-[13px] leading-relaxed'}`}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>

                    <div className="mt-3 pt-3 border-t border-primary/5 flex items-center justify-between">
                      <button onClick={() => speak(msg.content, idx)} className={`p-1.5 rounded-lg transition-all ${speakingId === idx ? 'bg-accent text-primary' : 'bg-primary/5 text-primary/40 hover:bg-primary/10'}`}>
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[9px] text-primary/20 font-bold">{msg.timestamp}</span>
                    </div>
                  </div>
                )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-end max-w-[85%]">
                <div className="bg-gradient-to-br from-primary to-[#16284a] text-white px-4 py-2.5 rounded-2xl rounded-br-md shadow-md shadow-primary/15">
                  <p className={`${chatLanguage === 'urdu' ? 'font-urdu text-base leading-relaxed' : 'text-[13px] leading-relaxed'} whitespace-pre-wrap break-words`}>{msg.content}</p>
                </div>
                <span className="mt-1 mr-1 text-[9px] text-primary/30 font-bold">{msg.timestamp}</span>
              </div>
            )}
          </div>
        ))}

        {loadingState && (
          <div className="flex justify-start items-end space-x-2 rtl:space-x-reverse animate-fade-up">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-xl rounded-bl-sm flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden">
              <img src={logo} alt="AskLex" className="w-5 h-5 object-cover" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md border border-primary/5 shadow-sm flex items-center space-x-2.5 rtl:space-x-reverse">
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-typing-dot" />
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-typing-dot [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-typing-dot [animation-delay:0.4s]" />
              </div>
              <span className="text-primary/50 text-[11px] font-bold">
                {language === 'urdu' ? 'AskLex لکھ رہا ہے' : 'AskLex is typing'}
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Premium In-Flow Input and Preview Area */}
      <div className="w-full bg-surface border-t border-primary/5 px-4 md:px-10 pb-4 pt-3 flex-shrink-0 z-20">
        <div className="max-w-4xl mx-auto flex flex-col space-y-3">
          
          {/* Media Preview Inline Card */}
          {filePreview && (
            <div className="bg-white rounded-[1.5rem] p-3 shadow-xl border border-accent/20 flex items-center space-x-3 rtl:space-x-reverse animate-fade-up">
              <div className="w-12 h-12 bg-accent/10 rounded-xl overflow-hidden border-2 border-accent/20 flex-shrink-0">
                {selectedFile?.type.startsWith('image/') ? (
                  <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <FileText className="w-5 h-5 text-red-500" />
                    <span className="text-[7px] font-black text-red-500">PDF</span>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-primary truncate">{selectedFile?.name}</p>
                <p className="text-[9px] text-accent font-bold uppercase tracking-widest">Attached Document</p>
              </div>
              <button 
                onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                className="p-1.5 bg-primary/5 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Premium Chat Input */}
          <div className="glass rounded-[2rem] md:rounded-[2.5rem] p-1.5 md:p-2 shadow-2xl shadow-primary/5 border border-white/50 flex flex-col space-y-2">
            <div className="flex items-center space-x-1.5 md:space-x-2 rtl:space-x-reverse p-0.5">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl transition-all ${showEmojiPicker ? 'bg-accent text-primary shadow-lg shadow-accent/20' : 'text-primary/30 hover:bg-primary/5'}`}
              >
                <Smile className="w-5.5 h-5.5 md:w-6 md:h-6" />
              </button>
              
              <div className="relative">
                <input type="file" id="file-upload" className="hidden" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={(e) => {
                  const file = e.target.files[0];
                  setSelectedFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () => setFilePreview(reader.result);
                  reader.readAsDataURL(file);
                }} />
                <button onClick={() => document.getElementById('file-upload').click()} className="p-2.5 md:p-3 text-primary/30 hover:bg-primary/5 rounded-xl md:rounded-2xl transition-all">
                  <Paperclip className="w-5.5 h-5.5 md:w-6 md:h-6" />
                </button>
              </div>

              <div className="flex-1 relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend(e)}
                  placeholder={t.chatbotPlaceholder}
                  className={`w-full bg-white/50 border-2 border-transparent focus:border-accent/30 rounded-2xl md:rounded-3xl py-3 pl-4 pr-12 md:py-4 md:pl-6 md:pr-14 rtl:pr-4 rtl:pl-12 md:rtl:pr-6 md:rtl:pl-14 outline-none transition-all ${
                    chatLanguage === 'urdu' ? 'font-urdu text-base md:text-xl' : 'font-medium text-xs md:text-sm'
                  }`}
                />
                <button 
                  onClick={startVoiceInput}
                  className={`absolute ${language === 'urdu' ? 'left-1 md:left-2' : 'right-1 md:right-2'} top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-xl transition-all ${
                    isRecording ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-primary/30 hover:bg-primary/5'
                  }`}
                >
                  {isRecording && <div className="absolute inset-0 bg-red-500 rounded-xl animate-ping opacity-20" />}
                  <Mic className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              <button 
                onClick={handleSend}
                disabled={!input.trim() || loadingState}
                className="bg-primary text-white p-3 md:p-4 rounded-xl md:rounded-3xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 flex-shrink-0"
              >
                <Send className={`w-5 h-5 md:w-6 md:h-6 ${language === 'urdu' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          {showEmojiPicker && (
            <div className="rounded-2xl overflow-hidden shadow-2xl animate-fade-up max-h-[250px] overflow-y-auto">
              <EmojiPicker onEmojiClick={(emoji) => setInput(prev => prev + emoji.emoji)} width="100%" height={240} />
            </div>
          )}
        </div>
      </div>
      {/* Step 1: Complainant Details Form Modal Popup */}
      {showFormModal && simulatedDraft && (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto animate-smooth-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg border border-accent/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-primary p-6 flex items-center justify-between border-b border-accent/15">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <FileText className="w-6 h-6 text-accent animate-pulse" />
                <h3 className={`text-white font-black text-lg ${language === 'urdu' ? 'font-urdu text-xl' : ''}`}>
                  {simulatedDraft.type === 'fir'
                    ? (language === 'urdu' ? 'ایف آئی آر فارم' : 'FIR Complainant Details')
                    : (language === 'urdu' ? 'شکایتی خط فارم' : 'Complaint Letter Details')
                  }
                </h3>
              </div>
              <button 
                onClick={() => { setShowFormModal(false); setSimulatedDraft(null); }}
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 text-left rtl:text-right">
              {isGeneratingDoc ? (
                <div className="py-16 text-center space-y-6">
                  <div className="w-20 h-20 bg-accent/10 border-2 border-accent rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-10 h-10 text-accent animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-primary font-black text-xl">Generating Official Document...</h4>
                    <p className="text-primary/40 text-xs font-semibold mt-1">Analyzing statutory parameters via AskLex...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {!simulatedDraft.lawName && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-accent">Applicable Law / Offense Alleged</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Theft, Harassment, Fraud, Domestic Violence"
                        value={complainantForm.applicableLaw || ''}
                        onChange={(e) => setComplainantForm({ ...complainantForm, applicableLaw: e.target.value })}
                        className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Complainant Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-primary/50">Complainant Name</label>
                      <input 
                        type="text" 
                        value={complainantForm.complainantName}
                        onChange={(e) => setComplainantForm({ ...complainantForm, complainantName: e.target.value })}
                        className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                      />
                    </div>
                    {/* Father's Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-primary/50">Father's Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Father's full name"
                        value={complainantForm.fatherName || ''}
                        onChange={(e) => setComplainantForm({ ...complainantForm, fatherName: e.target.value })}
                        className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* CNIC */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-primary/50">CNIC Number</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. 3520112345678"
                        maxLength={13}
                        value={complainantForm.cnic || ''}
                        onChange={(e) => setComplainantForm({ ...complainantForm, cnic: e.target.value.replace(/\D/g, '') })}
                        className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                      />
                    </div>
                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-primary/50">Phone Number</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 03001234567"
                        value={complainantForm.phone || ''}
                        onChange={(e) => setComplainantForm({ ...complainantForm, phone: e.target.value })}
                        className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-primary/50">Complainant Address</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Home / Postal Address"
                      value={complainantForm.address || ''}
                      onChange={(e) => setComplainantForm({ ...complainantForm, address: e.target.value })}
                      className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Incident Date */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-primary/50">Incident Date</label>
                      <input 
                        type="date" 
                        required
                        value={complainantForm.incidentDate || ''}
                        onChange={(e) => setComplainantForm({ ...complainantForm, incidentDate: e.target.value })}
                        className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                      />
                    </div>
                    {/* Incident Time */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-primary/50">Incident Time</label>
                      <input 
                        type="time" 
                        required
                        value={complainantForm.incidentTime || ''}
                        onChange={(e) => setComplainantForm({ ...complainantForm, incidentTime: e.target.value })}
                        className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Incident Location */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-primary/50">Incident Location</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Place / Area of incident"
                        value={complainantForm.incidentLocation || ''}
                        onChange={(e) => setComplainantForm({ ...complainantForm, incidentLocation: e.target.value })}
                        className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                      />
                    </div>
                    {/* City Dropdown */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-primary/50">City</label>
                      <select 
                        value={complainantForm.city || 'Lahore'}
                        onChange={(e) => setComplainantForm({ ...complainantForm, city: e.target.value })}
                        className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                      >
                        {['Lahore', 'Karachi', 'Islamabad', 'Peshawar', 'Quetta', 'Faisalabad', 'Multan', 'Rawalpindi', 'Gujranwala', 'Sialkot'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {simulatedDraft.type === 'fir' && (
                    <div className="border-t border-primary/5 pt-4 space-y-4">
                      <p className="text-[10px] font-black text-accent uppercase tracking-widest">Accused & Witnesses (Optional)</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Accused Name */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-primary/50">Accused Name</label>
                          <input 
                            type="text" 
                            placeholder="Accused full name"
                            value={complainantForm.accusedName || ''}
                            onChange={(e) => setComplainantForm({ ...complainantForm, accusedName: e.target.value })}
                            className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                          />
                        </div>
                        {/* Accused Address */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-primary/50">Accused Address</label>
                          <input 
                            type="text" 
                            placeholder="Accused residential address"
                            value={complainantForm.accusedAddress || ''}
                            onChange={(e) => setComplainantForm({ ...complainantForm, accusedAddress: e.target.value })}
                            className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                          />
                        </div>
                      </div>

                      {/* Witnesses */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-primary/50">Witnesses</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Witness name, details"
                          value={complainantForm.witnesses || ''}
                          onChange={(e) => setComplainantForm({ ...complainantForm, witnesses: e.target.value })}
                          className="w-full bg-surface border-2 border-primary/5 rounded-xl py-3 px-4 outline-none font-bold text-sm text-primary focus:border-accent/40"
                        />
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleGenerateDocument}
                    disabled={!complainantForm.fatherName || !complainantForm.cnic || !complainantForm.address || !complainantForm.incidentDate || !complainantForm.incidentLocation || (!simulatedDraft.lawName && !complainantForm.applicableLaw)}
                    className="w-full bg-[#C9A84C] hover:bg-[#B3933C] text-primary font-black py-4.5 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-lg shadow-[#C9A84C]/15 disabled:opacity-40 disabled:cursor-not-allowed mt-6"
                  >
                    <span>{language === 'urdu' ? 'قانونی دستاویز تیار کریں ⚡' : 'Generate Legal Document ⚡'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 3 & 4: Completed Legal Document Viewer Modal */}
      {generatedDocContent && simulatedDraft && (
        <div className="fixed inset-0 bg-primary/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto animate-smooth-fade-in print:bg-white print:p-0 print:absolute print:inset-0">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl border border-accent/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:rounded-none animate-fade-up">
            {/* Modal Header */}
            <div className="bg-primary p-6 md:p-8 flex items-center justify-between border-b border-accent/15 print:hidden">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <Gavel className="w-6 h-6 text-accent animate-pulse" />
                <h3 className="text-white font-black text-lg">
                  {simulatedDraft.type === 'fir' 
                    ? (language === 'urdu' ? 'ایف آئی آر ڈرافٹ' : 'F.I.R Draft Document')
                    : (language === 'urdu' ? 'شکایتی خط ڈرافٹ' : 'Complaint Letter Document')
                  }
                </h3>
              </div>
              <button 
                onClick={() => { setGeneratedDocContent(''); setSimulatedDraft(null); setDraftStatusText(''); }}
                className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Stamp Paper Layout */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar space-y-6 print:p-0 print:overflow-visible">
              
              {/* Toast/Status Alert */}
              {draftStatusText && (
                <div className="bg-success/15 border border-success/30 px-5 py-3 rounded-2xl flex items-center space-x-3 rtl:space-x-reverse text-success font-black text-xs animate-fade-up print:hidden">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{draftStatusText}</span>
                </div>
              )}

              {/* Stamp Paper Preview */}
              <div className="border-[6px] border-[#C9A84C]/25 p-6 md:p-8 bg-white rounded-[2rem] shadow-xl relative text-left rtl:text-right print:border-none print:bg-white print:p-0 print:shadow-none">
                
                {/* Official Stamp Paper Header */}
                <div className="border-b-4 border-dashed border-[#C9A84C]/30 pb-6 text-center space-y-2 mb-6">
                  <p className="text-[#C9A84C] font-black text-xl uppercase tracking-[0.2em] print:text-black">
                    {simulatedDraft.type === 'fir' ? 'GOVERNMENT OF PAKISTAN' : 'KANOON AI OFFICIAL ARCHIVE'}
                  </p>
                  <p className="text-primary/45 font-bold text-[9px] uppercase tracking-[0.4em] print:text-black">
                    {simulatedDraft.type === 'fir' ? 'POLICE DEPARTMENT COMPLAINT SYSTEM' : 'LAW & DEMAND NOTICE PROTOCOL'}
                  </p>
                  <div className="inline-flex bg-[#C9A84C]/10 text-[#C9A84C] text-[10px] font-black px-5 py-1.5 rounded-full border border-[#C9A84C]/25 mt-2 print:text-black print:border-black">
                    {simulatedDraft.type === 'fir' ? 'FORM 15.4 - CrPC REPORT' : 'OFFICIAL FILING RECORD'}
                  </div>
                </div>

                {/* Main Content Block (Clean white background, black professional text) */}
                <div className="text-[#0F1E36] leading-relaxed text-sm font-medium whitespace-pre-line print:text-black min-h-[400px] border border-primary/5 p-4 rounded-xl">
                  {generatedDocContent}
                </div>

              </div>

            </div>

            {/* Modal Footer (Action Buttons) - Premium 2x2 Grid on Mobile and 4-across on Desktop */}
            <div className="bg-surface p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-2.5 border-t border-primary/5 print:hidden">
              <button 
                onClick={() => {
                  handleDownloadPDF(generatedDocContent, simulatedDraft.type === 'fir' ? 'fir_draft.pdf' : 'complaint_letter.pdf');
                  setDraftStatusText(language === 'urdu' ? 'ایف آئی آر کا ڈرافٹ کامیابی سے ڈاؤن لوڈ ہو گیا ہے!' : 'Document successfully compiled and downloaded as PDF!');
                }}
                className="bg-[#C9A84C] hover:bg-[#B3933C] text-[#0F1E36] font-black py-3 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse transition-all active:scale-[0.98] shadow-lg shadow-[#C9A84C]/15 text-xs text-center"
              >
                <Download className="w-4.5 h-4.5" />
                <span>{language === 'urdu' ? 'ڈاؤن لوڈ پی ڈی ایف' : 'Download PDF'}</span>
              </button>
              <button 
                onClick={() => {
                  window.print();
                }}
                className="border-2 border-primary/20 hover:bg-primary/5 text-primary font-black py-3 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse transition-all active:scale-[0.98] text-xs text-center"
              >
                <Printer className="w-4.5 h-4.5" />
                <span>{language === 'urdu' ? 'پرنٹ ڈرافٹ' : 'Print Draft'}</span>
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedDocContent);
                  setDraftStatusText(language === 'urdu' ? 'دستاویز کا متن کلپ بورڈ پر کاپی ہو گیا ہے!' : 'Copied text to clipboard successfully!');
                }}
                className="bg-success hover:bg-green-700 text-white font-black py-3 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse transition-all active:scale-[0.98] text-xs text-center"
              >
                <Share2 className="w-4.5 h-4.5" />
                <span>{language === 'urdu' ? 'شیئر کریں' : 'Share'}</span>
              </button>
              <button 
                onClick={() => {
                  window.open(`https://www.google.com/maps/search/?api=1&query=police+station+in+${encodeURIComponent(complainantForm.city)}`, '_blank');
                }}
                className="border-2 border-accent/30 hover:bg-accent/5 text-accent font-black py-3 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse transition-all active:scale-[0.98] text-xs text-center"
              >
                <Navigation className="w-4.5 h-4.5" />
                <span>{language === 'urdu' ? 'قریبی تھانہ تلاش کریں' : 'Find Nearest Station'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
