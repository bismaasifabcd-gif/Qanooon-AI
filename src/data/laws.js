// Comprehensive catalog of major Pakistani laws.
// Entries with a local `pdfUrl` (/books/...) open the full PDF we ship.
// Others link to an official/authoritative source via `sourceUrl` so users can
// still read the full text. Categories match the Law Library filters.

export const lawsData = [
  // ---------------------------------------------------------------- CRIMINAL
  {
    id: "ppc_1860",
    title: "Pakistan Penal Code, 1860",
    titleUrdu: "پاکستان تعزیرات 1860",
    category: "criminal",
    province: "federal",
    year: 1860,
    pdfUrl: "/books/administratord5622ea3f15bfa00b17d2cf7770a8434.pdf",
    description:
      "The primary criminal code of Pakistan, defining offences and their punishments. Originally drafted by Lord Macaulay, it covers crimes against persons, property, the state, and public order.",
    descriptionUrdu:
      "پاکستان کا بنیادی فوجداری مجموعہ جو جرائم اور ان کی سزاؤں کی وضاحت کرتا ہے۔ یہ افراد، جائیداد، ریاست اور امنِ عامہ کے خلاف جرائم کا احاطہ کرتا ہے۔",
    keySections: [
      "S. 302 — Punishment for Qatl-e-Amd (murder)",
      "S. 324 — Attempt to commit Qatl-e-Amd",
      "S. 379 — Punishment for theft",
      "S. 420 — Cheating and dishonestly inducing delivery of property",
      "S. 489-F — Dishonestly issuing a cheque",
    ],
  },
  {
    id: "crpc_1898",
    title: "Code of Criminal Procedure, 1898 (CrPC)",
    titleUrdu: "ضابطہ فوجداری 1898",
    category: "criminal",
    province: "federal",
    year: 1898,
    pdfUrl: "/books/administrator7db1e56f0f1d39a6e67573ec6b0944e2.pdf",
    description:
      "The procedural law governing investigation, arrest, bail, trial, and appeals in criminal cases in Pakistan.",
    descriptionUrdu:
      "فوجداری مقدمات میں تحقیقات، گرفتاری، ضمانت، ٹرائل اور اپیل کو منظم کرنے والا طریقہ کار کا قانون۔",
    keySections: [
      "S. 54 — Arrest without warrant",
      "S. 154 — Information in cognizable cases (FIR)",
      "S. 497 — Grant of bail",
      "S. 561-A — Inherent powers of the High Court",
    ],
  },
  {
    id: "peca_2016",
    title: "Prevention of Electronic Crimes Act, 2016 (PECA)",
    titleUrdu: "الیکٹرانک جرائم کی روک تھام کا ایکٹ 2016",
    category: "cyber",
    province: "federal",
    year: 2016,
    sourceUrl: "https://na.gov.pk/uploads/documents/1470910659_707.pdf",
    description:
      "Pakistan's principal cybercrime law. Covers unauthorized access, data interference, electronic fraud, cyber-stalking, harassment, and hate speech, enforced primarily by the FIA Cyber Crime Wing.",
    descriptionUrdu:
      "پاکستان کا بنیادی سائبر کرائم قانون جو غیر مجاز رسائی، ڈیٹا میں مداخلت، الیکٹرانک فراڈ، سائبر ہراسانی اور نفرت انگیز مواد کا احاطہ کرتا ہے۔",
    keySections: [
      "S. 20 — Offences against dignity of a person",
      "S. 21 — Offences against modesty (non-consensual images)",
      "S. 24 — Cyber stalking",
      "Helpline — FIA Cyber Crime: 1991",
    ],
  },
  {
    id: "control_narcotic_1997",
    title: "Control of Narcotic Substances Act, 1997",
    titleUrdu: "منشیات کنٹرول ایکٹ 1997",
    category: "criminal",
    province: "federal",
    year: 1997,
    sourceUrl: "https://www.pakp.gov.pk",
    description:
      "Regulates narcotics and psychotropic substances, prescribing penalties for possession, trafficking, and manufacture.",
    descriptionUrdu:
      "منشیات اور نفسیاتی مادوں کو منظم کرتا ہے اور ان کے قبضے، اسمگلنگ اور تیاری پر سزائیں مقرر کرتا ہے۔",
    keySections: [
      "S. 6 — Prohibition of possession",
      "S. 9 — Punishment (quantity-based)",
    ],
  },

  // ------------------------------------------------------------ CONSTITUTIONAL
  {
    id: "constitution_1973",
    title: "Constitution of Pakistan, 1973",
    titleUrdu: "آئین پاکستان 1973",
    category: "constitutional",
    province: "federal",
    year: 1973,
    pdfUrl: "/books/administrator9d8e2ecc414c6d3371ac41114b61a2c4.pdf",
    description:
      "The supreme law of Pakistan. Establishes the structure of the state, the trichotomy of powers, and the fundamental rights of citizens.",
    descriptionUrdu:
      "پاکستان کا اعلیٰ ترین قانون جو ریاست کے ڈھانچے، اختیارات کی تقسیم اور شہریوں کے بنیادی حقوق کا تعین کرتا ہے۔",
    keySections: [
      "Art. 8–28 — Fundamental Rights",
      "Art. 19 — Freedom of speech",
      "Art. 25 — Equality of citizens",
      "Art. 184(3) / 199 — Writ jurisdiction",
    ],
  },
  {
    id: "rules_business_1973",
    title: "Rules of Business, 1973",
    titleUrdu: "رولز آف بزنس 1973",
    category: "constitutional",
    province: "federal",
    year: 1973,
    pdfUrl: "/books/administratorcbfbe0b7ea25fbbcf8b10e53b794b6a5.pdf",
    description:
      "Defines the allocation and transaction of business within the Federal Government of Pakistan.",
    descriptionUrdu:
      "پاکستان کی وفاقی حکومت کے اندر کاموں کی تقسیم اور لین دین کے طریقہ کار کی وضاحت کرتے ہیں۔",
    keySections: ["Allocation of business among Divisions", "Inter-ministerial procedure"],
  },

  // ------------------------------------------------------------------- FAMILY
  {
    id: "mflo_1961",
    title: "Muslim Family Laws Ordinance, 1961",
    titleUrdu: "مسلم فیملی لاز آرڈیننس 1961",
    category: "family",
    province: "federal",
    year: 1961,
    sourceUrl: "https://punjabcode.punjab.gov.pk",
    description:
      "Governs marriage, divorce (talaq), polygamy, and inheritance among Muslims in Pakistan, including the requirement to register divorce with the Union Council.",
    descriptionUrdu:
      "پاکستان میں مسلمانوں کے نکاح، طلاق، تعددِ ازدواج اور وراثت کو منظم کرتا ہے، بشمول یونین کونسل میں طلاق کے اندراج کی شرط۔",
    keySections: [
      "S. 6 — Polygamy (permission of Arbitration Council)",
      "S. 7 — Talaq and 90-day reconciliation",
      "S. 9 — Maintenance",
    ],
  },
  {
    id: "dissolution_muslim_marriages_1939",
    title: "Dissolution of Muslim Marriages Act, 1939",
    titleUrdu: "تنسیخِ نکاح ایکٹ 1939",
    category: "family",
    province: "federal",
    year: 1939,
    sourceUrl: "https://punjabcode.punjab.gov.pk",
    description:
      "Provides the grounds on which a Muslim woman may obtain a decree for dissolution of marriage (Khula / judicial divorce).",
    descriptionUrdu:
      "وہ بنیادیں فراہم کرتا ہے جن پر ایک مسلمان عورت نکاح کی تنسیخ (خلع) کا حکم حاصل کر سکتی ہے۔",
    keySections: ["S. 2 — Grounds for a decree of dissolution"],
  },
  {
    id: "guardians_wards_1890",
    title: "Guardians and Wards Act, 1890",
    titleUrdu: "گارڈینز اینڈ وارڈز ایکٹ 1890",
    category: "family",
    province: "federal",
    year: 1890,
    sourceUrl: "https://punjabcode.punjab.gov.pk",
    description:
      "Governs guardianship and the custody (hizanat) of minors, with the welfare of the minor as the paramount consideration.",
    descriptionUrdu:
      "نابالغوں کی سرپرستی اور تحویل (حضانت) کو منظم کرتا ہے، جس میں بچے کی بہبود کو مقدم رکھا جاتا ہے۔",
    keySections: ["S. 7 — Appointment of guardian", "S. 17 — Welfare of the minor"],
  },
  {
    id: "west_pak_family_courts_1964",
    title: "Family Courts Act, 1964",
    titleUrdu: "فیملی کورٹس ایکٹ 1964",
    category: "family",
    province: "federal",
    year: 1964,
    sourceUrl: "https://punjabcode.punjab.gov.pk",
    description:
      "Establishes Family Courts and their exclusive jurisdiction over matters of dower, maintenance, custody, and dissolution of marriage.",
    descriptionUrdu:
      "فیملی کورٹس اور حق مہر، نان نفقہ، تحویل اور تنسیخِ نکاح پر ان کے خصوصی دائرہ اختیار کا قیام کرتا ہے۔",
    keySections: ["Schedule — Matters within Family Court jurisdiction"],
  },

  // ----------------------------------------------------------------- PROPERTY
  {
    id: "cpc_1908",
    title: "Code of Civil Procedure, 1908 (CPC)",
    titleUrdu: "ضابطہ دیوانی 1908",
    category: "property",
    province: "federal",
    year: 1908,
    pdfUrl: "/books/administrator6598dabbad120033d4d42d717dcf9755.pdf",
    description:
      "Regulates the procedure of civil courts for property, contract, and other civil disputes, including suits, appeals, and execution of decrees.",
    descriptionUrdu:
      "جائیداد، معاہدہ اور دیگر دیوانی تنازعات کے لیے سول عدالتوں کے طریقہ کار کو منظم کرتا ہے۔",
    keySections: [
      "O. VII R. 11 — Rejection of plaint",
      "O. XXXIX — Temporary injunctions",
      "S. 9 — Jurisdiction of civil courts",
    ],
  },
  {
    id: "transfer_property_1882",
    title: "Transfer of Property Act, 1882",
    titleUrdu: "منتقلیِ جائیداد ایکٹ 1882",
    category: "property",
    province: "federal",
    year: 1882,
    sourceUrl: "https://punjabcode.punjab.gov.pk",
    description:
      "Governs the transfer of immovable property between living persons — sale, mortgage, lease, gift, and exchange.",
    descriptionUrdu:
      "زندہ افراد کے درمیان غیر منقولہ جائیداد کی منتقلی — فروخت، رہن، لیز، ہبہ اور تبادلہ — کو منظم کرتا ہے۔",
    keySections: ["S. 54 — Sale", "S. 58 — Mortgage", "S. 105 — Lease"],
  },
  {
    id: "registration_1908",
    title: "Registration Act, 1908",
    titleUrdu: "رجسٹریشن ایکٹ 1908",
    category: "property",
    province: "federal",
    year: 1908,
    sourceUrl: "https://punjabcode.punjab.gov.pk",
    description:
      "Prescribes which documents (including property transfers) must be registered, and the procedure and effect of registration.",
    descriptionUrdu:
      "یہ طے کرتا ہے کہ کون سی دستاویزات (بشمول جائیداد کی منتقلی) کا اندراج لازمی ہے، اور رجسٹریشن کا طریقہ و اثر۔",
    keySections: ["S. 17 — Documents of which registration is compulsory"],
  },
  {
    id: "contract_1872",
    title: "Contract Act, 1872",
    titleUrdu: "قانونِ معاہدہ 1872",
    category: "property",
    province: "federal",
    year: 1872,
    sourceUrl: "https://punjabcode.punjab.gov.pk",
    description:
      "The foundational law of contracts in Pakistan — formation, consideration, performance, breach, and remedies.",
    descriptionUrdu:
      "پاکستان میں معاہدوں کا بنیادی قانون — معاہدے کی تشکیل، عوض، ادائیگی، خلاف ورزی اور ازالہ۔",
    keySections: ["S. 10 — What agreements are contracts", "S. 73 — Compensation for breach"],
  },

  // ------------------------------------------------------------------- LABOUR
  {
    id: "estacode_2021",
    title: "ESTACODE (Civil Establishment Code), 2021",
    titleUrdu: "ایسٹا کوڈ 2021",
    category: "labour",
    province: "federal",
    year: 2021,
    pdfUrl: "/books/administratora6091991da53c91eaba251f56d52508d.pdf",
    description:
      "The civil servants' manual of rules, regulations, and instructions governing civil service management in Pakistan.",
    descriptionUrdu:
      "سول سرونٹس کے لیے قواعد و ضوابط اور ہدایات پر مشتمل کتابچہ جو پاکستان میں سول سروس مینجمنٹ کو منظم کرتا ہے۔",
    keySections: ["Appointments, promotion & seniority", "Leave rules", "Discipline (E&D) rules"],
  },
  {
    id: "industrial_relations_2012",
    title: "Industrial Relations Act, 2012",
    titleUrdu: "صنعتی تعلقات ایکٹ 2012",
    category: "labour",
    province: "federal",
    year: 2012,
    sourceUrl: "https://na.gov.pk",
    description:
      "Governs the formation of trade unions, collective bargaining, and the resolution of industrial disputes.",
    descriptionUrdu:
      "ٹریڈ یونینز کے قیام، اجتماعی سودے بازی اور صنعتی تنازعات کے حل کو منظم کرتا ہے۔",
    keySections: ["Formation & registration of trade unions", "Collective Bargaining Agent (CBA)"],
  },
  {
    id: "payment_wages_1936",
    title: "Payment of Wages Act, 1936",
    titleUrdu: "ادائیگیِ اجرت ایکٹ 1936",
    category: "labour",
    province: "federal",
    year: 1936,
    sourceUrl: "https://punjabcode.punjab.gov.pk",
    description:
      "Regulates the timely payment of wages to workers and permissible deductions by employers.",
    descriptionUrdu:
      "کارکنوں کو بروقت اجرت کی ادائیگی اور آجروں کی جانب سے جائز کٹوتیوں کو منظم کرتا ہے۔",
    keySections: ["S. 5 — Time of payment of wages", "S. 7 — Deductions"],
  },
  {
    id: "factories_1934",
    title: "Factories Act, 1934",
    titleUrdu: "فیکٹریز ایکٹ 1934",
    category: "labour",
    province: "federal",
    year: 1934,
    sourceUrl: "https://punjabcode.punjab.gov.pk",
    description:
      "Sets standards for health, safety, working hours, and welfare of workers employed in factories.",
    descriptionUrdu:
      "فیکٹریوں میں کام کرنے والے مزدوروں کی صحت، حفاظت، اوقاتِ کار اور بہبود کے معیارات مقرر کرتا ہے۔",
    keySections: ["Working hours & overtime", "Safety provisions"],
  },
];

// Human-readable category labels used across the app.
export const LAW_CATEGORY_LABELS = {
  all: "All",
  criminal: "Criminal",
  constitutional: "Constitutional",
  family: "Family",
  property: "Property / Civil",
  cyber: "Cyber Crime",
  labour: "Labour",
};
