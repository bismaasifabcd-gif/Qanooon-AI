import { db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";

const lawsData = [
  {
    id: "ppc_1860",
    title: "Pakistan Penal Code 1860",
    titleUrdu: "پاکستان تعزیرات 1860",
    category: "criminal",
    province: "federal",
    year: 1860,
    summary: "Main criminal law of Pakistan",
    summaryUrdu: "پاکستان کا مرکزی فوجداری قانون",
    sections: {
      "299": { title: "Culpable homicide", titleUrdu: "قتلِ خطا", text: "Definition of culpable homicide...", textUrdu: "قتل خطا کی تعریف..." },
      "300": { title: "Murder", titleUrdu: "قتلِ عمد", text: "Definition of murder...", textUrdu: "قتل عمد کی تعریف..." },
      "302": { title: "Punishment for Murder", titleUrdu: "قتل کی سزا", text: "Whoever commits murder shall be punished with death or imprisonment for life...", textUrdu: "جو کوئی قتل کرے اسے سزائے موت یا عمر قید کی سزا دی جائے گی..." },
      "320": { title: "Punishment for Qatl-i-khata by rash driving", titleUrdu: "تیز رفتاری سے قتل کی سزا", text: "Whoever commits qatl-i-khata by rash or negligent driving...", textUrdu: "جو کوئی تیز رفتاری یا غفلت سے ڈرائیونگ کرتے ہوئے قتل خطا کرے..." },
      "354": { title: "Assault on woman with intent to outrage her modesty", titleUrdu: "خاتون کی حیا سوزی کی کوشش", text: "Assault or use of criminal force to woman...", textUrdu: "کسی عورت پر حملہ یا مجرمانہ طاقت کا استعمال..." },
      "376": { title: "Punishment for Rape", titleUrdu: "زیادتی کی سزا", text: "Whoever commits rape shall be punished...", textUrdu: "جو کوئی زیادتی کرے اسے سزا دی جائے گی..." },
      "420": { title: "Cheating and dishonestly inducing delivery of property", titleUrdu: "دھوکہ دہی اور فراڈ", text: "Whoever cheats and thereby dishonestly induces...", textUrdu: "جو کوئی دھوکہ دہی کرے اور بددیانتی سے اکسائے..." },
      "489": { title: "Forgery of currency-notes", titleUrdu: "جعلی کرنسی نوٹ", text: "Forgery of currency-notes or bank-notes...", textUrdu: "کرنسی نوٹوں یا بینک نوٹوں کی جعلسازی..." }
    }
  },
  {
    id: "constitution_1973",
    title: "Constitution of Pakistan 1973",
    titleUrdu: "آئین پاکستان 1973",
    category: "constitutional",
    province: "federal",
    year: 1973,
    summary: "Supreme law of Pakistan",
    summaryUrdu: "پاکستان کا اعلیٰ ترین قانون",
    sections: {
      "9": { title: "Security of person", titleUrdu: "شخصی تحفظ", text: "No person shall be deprived of life or liberty...", textUrdu: "کسی بھی شخص کو زندگی یا آزادی سے محروم نہیں کیا جائے گا..." },
      "10": { title: "Safeguards as to arrest and detention", titleUrdu: "گرفتاری اور نظر بندی کے خلاف تحفظ", text: "Every person who is arrested shall be informed...", textUrdu: "ہر گرفتار شخص کو مطلع کیا جائے گا..." },
      "14": { title: "Inviolability of dignity of man", titleUrdu: "انسانی وقار کی حرمت", text: "The dignity of man and the privacy of home shall be inviolable...", textUrdu: "انسان کا وقار اور گھر کی پرائیویسی ناقابل تسخیر ہوگی..." },
      "25": { title: "Equality of citizens", titleUrdu: "شہریوں کی برابری", text: "All citizens are equal before law...", textUrdu: "تمام شہری قانون کی نظر میں برابر ہیں..." },
      "25A": { title: "Right to education", titleUrdu: "تعلیم کا حق", text: "The State shall provide free and compulsory education...", textUrdu: "ریاست مفت اور لازمی تعلیم فراہم کرے گی..." },
      "37": { title: "Promotion of social justice", titleUrdu: "سماجی انصاف کا فروغ", text: "Promotion of social justice and eradication of social evils...", textUrdu: "سماجی انصاف کا فروغ اور سماجی برائیوں کا خاتمہ..." },
      "38": { title: "Promotion of social and economic well-being", titleUrdu: "سماجی اور معاشی بہبود", text: "Promotion of social and economic well-being of the people...", textUrdu: "لوگوں کی سماجی اور معاشی بہبود کا فروغ..." }
    }
  },
  {
    id: "domestic_violence_2012",
    title: "Domestic Violence Act 2012",
    titleUrdu: "گھریلو تشدد ایکٹ 2012",
    category: "family",
    province: "federal",
    year: 2012,
    summary: "Protection against domestic violence",
    summaryUrdu: "گھریلو تشدد کے خلاف تحفظ",
    sections: {
      "2": { title: "Definitions", titleUrdu: "تعریفات", text: "Includes physical, emotional and sexual abuse...", textUrdu: "جسمانی، جذباتی اور جنسی استحصال شامل ہے..." },
      "4": { title: "Punishment", titleUrdu: "سزا", text: "Imprisonment and fines for perpetrators...", textUrdu: "مرتکب افراد کے لیے قید اور جرمانہ..." },
      "8": { title: "Protection Orders", titleUrdu: "تحفظ کے احکامات", text: "Court can issue orders to stay away...", textUrdu: "عدالت دور رہنے کے احکامات جاری کر سکتی ہے..." }
    }
  },
  {
    id: "family_laws_1961",
    title: "Family Laws Ordinance 1961",
    titleUrdu: "فیملی لاز آرڈیننس 1961",
    category: "family",
    province: "federal",
    year: 1961,
    summary: "Laws regarding marriage and divorce",
    summaryUrdu: "نکاح اور طلاق کے متعلق قوانین",
    sections: {
      "6": { title: "Polygamy", titleUrdu: "تعدد ازدواج", text: "Requirement of permission for second marriage...", textUrdu: "دوسری شادی کے لیے اجازت کی ضرورت..." },
      "7": { title: "Talaq", titleUrdu: "طلاق", text: "Procedure for divorce and notice...", textUrdu: "طلاق اور نوٹس کا طریقہ کار..." },
      "9": { title: "Maintenance", titleUrdu: "نان و نفقہ", text: "Husband's duty to provide for wife and children...", textUrdu: "بیوی اور بچوں کی کفالت شوہر کا فرض ہے..." }
    }
  },
  {
    id: "peca_2016",
    title: "PECA 2016 Cyber Crime Act",
    titleUrdu: "سائبر کرائم ایکٹ 2016",
    category: "cyber",
    province: "federal",
    year: 2016,
    summary: "Prevention of electronic crimes",
    summaryUrdu: "الیکٹرانک جرائم کی روک تھام",
    sections: {
      "10": { title: "Cyber terrorism", titleUrdu: "سائبر دہشت گردی", text: "Attacking critical infrastructure...", textUrdu: "حساس انفراسٹرکچر پر حملہ کرنا..." },
      "20": { title: "Offences against dignity", titleUrdu: "انسانی وقار کے خلاف جرائم", text: "Defamation via electronic means...", textUrdu: "الیکٹرانک ذرائع سے ہتک عزت..." },
      "21": { title: "Modesty of a natural person", titleUrdu: "انسانی حیا کے خلاف جرائم", text: "Distribution of explicit content without consent...", textUrdu: "بغیر اجازت نازیبا مواد کی تشہیر..." }
    }
  },
  {
    id: "child_marriage_1929",
    title: "Child Marriage Restraint Act",
    titleUrdu: "چائلڈ میرج ریسٹرینٹ ایکٹ",
    category: "family",
    province: "federal",
    year: 1929,
    summary: "Prevention of child marriages",
    summaryUrdu: "بچوں کی شادیوں کی روک تھام",
    sections: {
      "2": { title: "Definitions", titleUrdu: "تعریفات", text: "Age limits for marriage...", textUrdu: "شادی کے لیے عمر کی حد..." },
      "4": { title: "Punishment", titleUrdu: "سزا", text: "Punishment for performing child marriage...", textUrdu: "بچوں کی شادی کروانے پر سزا..." }
    }
  },
  {
    id: "harassment_2010",
    title: "Protection Against Harassment Act 2010",
    titleUrdu: "انسداد ہراسیت ایکٹ 2010",
    category: "labour",
    province: "federal",
    year: 2010,
    summary: "Protection of women at workplace",
    summaryUrdu: "کام کی جگہ پر خواتین کا تحفظ",
    sections: {
      "3": { title: "Inquiry Committee", titleUrdu: "انکوائری کمیٹی", text: "Formation of committees in organizations...", textUrdu: "اداروں میں کمیٹیوں کی تشکیل..." },
      "4": { title: "Penalties", titleUrdu: "سزائیں", text: "Minor and major penalties for harassment...", textUrdu: "ہراسانی پر چھوٹی اور بڑی سزائیں..." }
    }
  },
  {
    id: "industrial_relations_2012",
    title: "Labour Laws Industrial Relations 2012",
    titleUrdu: "صنعتی تعلقات ایکٹ 2012",
    category: "labour",
    province: "federal",
    year: 2012,
    summary: "Regulation of trade unions",
    summaryUrdu: "ٹریڈ یونینوں کی تنظیم",
    sections: {
      "17": { title: "Registration", titleUrdu: "رجسٹریشن", text: "Registration of trade unions...", textUrdu: "ٹریڈ یونینوں کی رجسٹریشن..." },
      "33": { title: "Redress of individual grievances", titleUrdu: "شکایات کا ازالہ", text: "Procedure for worker grievances...", textUrdu: "کارکنوں کی شکایات کا طریقہ کار..." }
    }
  },
  {
    id: "land_acquisition_1894",
    title: "Land Acquisition Act",
    titleUrdu: "لینڈ ایکوزیشن ایکٹ",
    category: "property",
    province: "federal",
    year: 1894,
    summary: "Acquisition of land for public purposes",
    summaryUrdu: "عوامی مقاصد کے لیے زمین کا حصول",
    sections: {
      "4": { title: "Preliminary investigation", titleUrdu: "ابتدائی تحقیقات", text: "Notification for acquisition...", textUrdu: "حصول کے لیے نوٹیفیکیشن..." },
      "23": { title: "Compensation", titleUrdu: "معاوضہ", text: "Determining market value...", textUrdu: "مارکیٹ ویلیو کا تعین..." }
    }
  },
  {
    id: "punjab_tenancy_1887",
    title: "Punjab Tenancy Act",
    titleUrdu: "پنجاب ٹیننسی ایکٹ",
    category: "property",
    province: "punjab",
    year: 1887,
    summary: "Rights of landlords and tenants in Punjab",
    summaryUrdu: "پنجاب میں مالکان اور مزارعین کے حقوق",
    sections: {
      "5": { title: "Right of occupancy", titleUrdu: "حق قبضہ", text: "Tenants having right of occupancy...", textUrdu: "قابض مزارعین کے حقوق..." },
      "24": { title: "Ejectment", titleUrdu: "بے دخلی", text: "Conditions for ejecting a tenant...", textUrdu: "مزارع کو بے دخل کرنے کی شرائط..." }
    }
  },
  {
    id: "sindh_children_1955",
    title: "Sindh Children Act",
    titleUrdu: "سندھ چلڈرن ایکٹ",
    category: "family",
    province: "sindh",
    year: 1955,
    summary: "Care and protection of children in Sindh",
    summaryUrdu: "سندھ میں بچوں کی دیکھ بھال اور تحفظ",
    sections: {
      "7": { title: "Juvenile Courts", titleUrdu: "جوونائل عدالتیں", text: "Special courts for children...", textUrdu: "بچوں کے لیے خصوصی عدالتیں..." },
      "9": { title: "Protection of children", titleUrdu: "بچوں کا تحفظ", text: "Rescuing children from danger...", textUrdu: "بچوں کو خطرے سے بچانا..." }
    }
  },
  {
    id: "kpk_child_protection_2010",
    title: "KPK Child Protection Act",
    titleUrdu: "خیبر پختونخوا چائلڈ پروٹیکشن ایکٹ",
    category: "family",
    province: "kpk",
    year: 2010,
    summary: "Welfare of children in KPK",
    summaryUrdu: "خیبر پختونخوا میں بچوں کی فلاح و بہبود",
    sections: {
      "3": { title: "Child Protection Commission", titleUrdu: "چائلڈ پروٹیکشن کمیشن", text: "Establishment of the commission...", textUrdu: "کمیشن کا قیام..." },
      "14": { title: "Institutional care", titleUrdu: "ادارہ جاتی دیکھ بھال", text: "Registration of child care institutions...", textUrdu: "بچوں کی دیکھ بھال کے اداروں کی رجسٹریشن..." }
    }
  }
];

export const seedLaws = async () => {
  console.log("Starting law seeding...");
  for (const law of lawsData) {
    try {
      const docRef = doc(db, "laws", law.id);
      await setDoc(docRef, law);
      console.log(`Seeded: ${law.title}`);
    } catch (err) {
      console.error(`Error seeding ${law.title}:`, err);
    }
  }
  return true;
};
