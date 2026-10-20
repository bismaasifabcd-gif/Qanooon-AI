/**
 * Local Law Database — Offline fallback answers
 * When all API keys are exhausted, app uses these pre-stored answers.
 * App never stops working.
 */

const localLaws = {
  // ━━━━ DOMESTIC VIOLENCE ━━━━
  domestic_violence: {
    keywords: ['husband beats', 'wife beating', 'domestic violence', 'shohar marta',
      'ghar se nikala', 'mara pita', 'ghaerlu tashadud', 'beating wife',
      'husband hit', 'husband beat', 'violence at home', 'shohar ne mara',
      'meri pitai', 'ghar mein maar', 'domestic', 'tashadud'],
    law: 'Domestic Violence (Prevention and Protection) Act 2012',
    section: 'Section 4 — Acts of Violence',
    severity: 'HIGH',
    answer_en: `⚖️ Law: Domestic Violence Act 2012 — Section 4

📋 Explanation:
Under this law, any physical, emotional, or psychological abuse by a husband or family member is a criminal offense. You have the right to immediate legal protection.

✅ Action Steps:
1. Go to the nearest police station and file an FIR
2. Apply to the Family Court for a Protection Order
3. Contact Women Protection Authority: 1043 (free helpline)
4. You can request a shelter home (Dar-ul-Aman) for safety
5. Collect evidence: photos of injuries, witness names

⚠️ Punishment for abuser:
Up to 1 year imprisonment + Rs. 200,000 fine
Repeat offense: up to 2 years imprisonment`,
    answer_ur: `⚖️ قانون: گھریلو تشدد ایکٹ 2012 — دفعہ 4

📋 وضاحت:
اس قانون کے تحت شوہر یا گھر کے کسی فرد کی طرف سے جسمانی، جذباتی یا نفسیاتی تشدد جرم ہے۔ آپ کو فوری قانونی تحفظ کا حق حاصل ہے۔

✅ اقدامات:
1. قریبی تھانے میں ایف آئی آر درج کرائیں
2. فیملی کورٹ سے پروٹیکشن آرڈر لیں
3. خواتین تحفظ ہیلپ لائن پر کال کریں: 1043
4. دار الامان (شیلٹر ہوم) میں پناہ لے سکتی ہیں
5. ثبوت اکٹھے کریں: چوٹوں کی تصاویر، گواہوں کے نام

⚠️ سزا:
ایک سال قید + دو لاکھ روپے جرمانہ`
  },

  // ━━━━ HARASSMENT ━━━━
  harassment: {
    keywords: ['harassment', 'harass', 'workplace harassment', 'sexual harassment',
      'boss harassing', 'tangi', 'pareshan karna', 'chhedna',
      'office mein harassment', 'job harassment', 'colleague harassment',
      'manager harassing', 'inappropriate behavior', 'uncomfortable at work'],
    law: 'Protection Against Harassment of Women at Workplace Act 2010',
    section: 'Section 3 — Prohibition of Harassment',
    severity: 'HIGH',
    answer_en: `⚖️ Law: Harassment at Workplace Act 2010 — Section 3

📋 Explanation:
Any unwanted sexual advance, request for sexual favors, or other verbal/physical conduct of a sexual nature at workplace is illegal in Pakistan.

✅ Action Steps:
1. File written complaint with your organization's Inquiry Committee (every org must have one by law)
2. If no committee exists: file complaint with Federal Ombudsman: mohtasib.gov.pk
3. Keep written record of all incidents with dates
4. Collect evidence: messages, emails, witness names
5. You can also file FIR under PPC Section 509

⚠️ Punishment:
Fine up to Rs. 500,000
Dismissal from service
Up to 3 years imprisonment (severe cases)`,
    answer_ur: `⚖️ قانون: کام کی جگہ ہراسانی ایکٹ 2010 — دفعہ 3

📋 وضاحت:
کام کی جگہ کسی بھی قسم کی جنسی یا ذہنی ہراسانی قانوناً جرم ہے۔

✅ اقدامات:
1. ادارے کی انکوائری کمیٹی میں تحریری شکایت کریں
2. وفاقی محتسب کو شکایت کریں: mohtasib.gov.pk
3. تمام واقعات تاریخ سمیت لکھ کر رکھیں
4. ثبوت محفوظ کریں: پیغامات، ای میلز، گواہ
5. قریبی تھانے میں ایف آئی آر بھی درج کروا سکتے ہیں

⚠️ سزا:
پانچ لاکھ روپے جرمانہ یا ملازمت سے برخاستگی`
  },

  // ━━━━ CYBER CRIME ━━━━
  cyber_crime: {
    keywords: ['cyber', 'online harassment', 'fake account', 'blackmail online',
      'leaked photos', 'social media harassment', 'peca', 'internet crime',
      'hacking', 'online threats', 'whatsapp threats', 'facebook harassment',
      'morphed photos', 'online blackmail', 'cyber stalking',
      'tasveer', 'photos leak', 'video leak', 'facebook', 'instagram'],
    law: 'Prevention of Electronic Crimes Act (PECA) 2016',
    section: 'Section 20 — Offenses Against Dignity',
    severity: 'HIGH',
    answer_en: `⚖️ Law: PECA 2016 — Section 20 & 21

📋 Explanation:
Sharing someone's private images, blackmail, online harassment, creating fake accounts, and cyberstalking are all serious crimes under Pakistan's cyber law.

✅ Action Steps:
1. Report to FIA Cyber Crime Wing:
   Website: fia.gov.pk/cybercrime
   Helpline: 9911
2. Take screenshots of all evidence immediately
3. Do NOT delete any messages or posts — evidence
4. File FIR at nearest police station
5. Block the harasser on all platforms
6. Report fake account to platform directly

⚠️ Punishment:
Up to 3 years imprisonment + Rs. 1,000,000 fine
Leaked intimate images: up to 5 years`,
    answer_ur: `⚖️ قانون: پیکا 2016 — دفعہ 20 اور 21

📋 وضاحت:
کسی کی نجی تصاویر شیئر کرنا، بلیک میل کرنا، آن لائن ہراسانی، جعلی اکاؤنٹ بنانا پاکستان کے سائبر قانون کے تحت سنگین جرائم ہیں۔

✅ اقدامات:
1. ایف آئی اے سائبر کرائم کو رپورٹ کریں
   ویب سائٹ: fia.gov.pk/cybercrime
   ہیلپ لائن: 9911
2. فوری طور پر تمام ثبوت کے اسکرین شاٹ لیں
3. کوئی پیغام یا پوسٹ ڈیلیٹ نہ کریں — ثبوت ہیں
4. قریبی تھانے میں ایف آئی آر درج کرائیں

⚠️ سزا:
تین سال قید + دس لاکھ روپے جرمانہ`
  },

  // ━━━━ WRONGFUL TERMINATION ━━━━
  wrongful_termination: {
    keywords: ['fired from job', 'job se nikala', 'wrongful termination',
      'illegally fired', 'no notice job', 'bina reason fired',
      'naukri se nikala', 'job chali gayi', 'employer ne nikala',
      'layoff', 'retrenchment', 'dismissed from job', 'terminated without cause',
      'salary nahi di', 'tankhwa nahi mili', 'wages'],
    law: 'Industrial Relations Act 2012',
    section: 'Section 33 — Protection Against Victimization',
    severity: 'MEDIUM',
    answer_en: `⚖️ Law: Industrial Relations Act 2012 — Section 33

📋 Explanation:
An employer cannot terminate an employee without proper notice or valid reason. You are entitled to compensation, notice period, and gratuity under Pakistani labour law.

✅ Action Steps:
1. Request termination letter in writing from employer
2. File complaint with Labour Court in your district
3. Contact Labour Department: mohr.gov.pk
4. Claim your dues:
   - 1 month salary per year of service (gratuity)
   - Notice period salary (usually 1-3 months)
5. File within 3 months of termination

⚠️ Employer's liability:
Back pay + compensation + reinstatement possible
Fine up to Rs. 50,000`,
    answer_ur: `⚖️ قانون: صنعتی تعلقات ایکٹ 2012 — دفعہ 33

📋 وضاحت:
آجر بغیر مناسب نوٹس یا وجہ کے ملازم کو نہیں نکال سکتا۔ آپ معاوضے اور نوٹس پیریڈ کے حقدار ہیں۔

✅ اقدامات:
1. آجر سے تحریری برخاستگی خط مانگیں
2. ضلع کی لیبر کورٹ میں شکایت درج کریں
3. لیبر ڈیپارٹمنٹ سے رابطہ کریں
4. اپنا واجب الادا مانگیں:
   - ہر سال کی خدمت پر ایک ماہ کی تنخواہ
   - نوٹس پیریڈ کی تنخواہ

⚠️ سزا:
معاوضہ + دوبارہ بحالی ممکن`
  },

  // ━━━━ PROPERTY DISPUTE ━━━━
  property_dispute: {
    keywords: ['property dispute', 'land dispute', 'zameen ka jhagra',
      'ghar se nikalo', 'illegal eviction', 'landlord problem',
      'makaan malik', 'rent dispute', 'inheritance property', 'wirasat',
      'illegal possession', 'qabza', 'property grabbed', 'land grabbed',
      'zameen', 'plot', 'ghar', 'kiraya', 'rent'],
    law: 'Land Acquisition Act & Punjab Tenancy Act',
    section: 'Tenancy Act Section 24 — Protection of Tenants',
    severity: 'MEDIUM',
    answer_en: `⚖️ Law: Tenancy Act + Land Acquisition Act

📋 Explanation:
A landlord cannot evict you without proper legal notice and court order. Property grabbing (qabza) is a criminal offense.

✅ Action Steps:
1. For illegal eviction: File application in Rent Controller Court
2. For property grabbing: File FIR under PPC Section 441 (criminal trespass)
3. For inheritance disputes: File case in Civil Court for partition
4. Collect all documents: Title deed, rent agreement, CNIC, witnesses
5. Contact Revenue Department (Patwari) for land record verification

⚠️ Punishment for illegal eviction:
Court can order reinstatement + compensation`,
    answer_ur: `⚖️ قانون: کرایہ داری ایکٹ + زمین کا قانون

📋 وضاحت:
مالک مکان عدالتی حکم کے بغیر آپ کو نہیں نکال سکتا۔ ناجائز قبضہ فوجداری جرم ہے۔

✅ اقدامات:
1. ناجائز بے دخلی: رینٹ کنٹرولر کورٹ میں درخواست
2. ناجائز قبضہ: تھانے میں ایف آئی آر
3. وراثت کا جھگڑا: سول کورٹ میں تقسیم کا مقدمہ
4. تمام دستاویزات اکٹھے کریں
5. پٹواری سے زمین کا ریکارڈ تصدیق کروائیں`
  },

  // ━━━━ DIVORCE / KHULA ━━━━
  divorce: {
    keywords: ['divorce', 'khula', 'talaq', 'separation',
      'husband not giving divorce', 'khula lena', 'court divorce',
      'family court', 'nikah', 'husband refuses divorce',
      'talaq nahi dy raha', 'marriage problems', 'nikah khatam',
      'shadi', 'iddat'],
    law: 'Muslim Family Laws Ordinance 1961',
    section: 'Section 7 — Talaq / Section 8 — Khula',
    severity: 'MEDIUM',
    answer_en: `⚖️ Law: Muslim Family Laws Ordinance 1961

📋 Explanation:
A woman has the right to seek Khula (court-granted divorce) if husband refuses to give Talaq. The Family Court can grant divorce.

✅ Action Steps:
1. File Khula petition in Family Court
2. You need: Nikah Nama, CNIC, marriage proof documents
3. Process takes 3-6 months typically
4. You may need to return mehr amount
5. Children custody decided by court based on best interest of child

For Husband giving Talaq:
1. Must send written notice to Union Council
2. 90-day reconciliation period
3. Divorce effective after 90 days

⚠️ Note:
Verbal talaq alone is NOT legally complete.
Written notice to Union Council is mandatory.`,
    answer_ur: `⚖️ قانون: مسلم فیملی لاز آرڈیننس 1961

📋 وضاحت:
اگر شوہر طلاق نہیں دیتا تو عورت فیملی کورٹ سے خلع لے سکتی ہے۔

✅ اقدامات:
1. فیملی کورٹ میں خلع کی درخواست دائر کریں
2. ضروری دستاویزات: نکاح نامہ، شناختی کارڈ
3. عمل میں 3 سے 6 ماہ لگ سکتے ہیں
4. مہر واپس کرنی پڑ سکتی ہے
5. بچوں کی حضانت عدالت طے کرے گی

⚠️ نوٹ:
زبانی طلاق قانوناً مکمل نہیں۔
یونین کونسل کو تحریری اطلاع لازمی ہے۔`
  },

  // ━━━━ CHILD ABUSE ━━━━
  child_abuse: {
    keywords: ['child abuse', 'child harassment', 'bachay ko mara',
      'child beating', 'minor abuse', 'child rights',
      'bachay ki peetai', 'school abuse', 'child labor',
      'bachon se kaam', 'child marriage', 'kam umar shadi',
      'bacha', 'bachay', 'minor'],
    law: 'Zainab Alert Act 2020 + Child Marriage Restraint Act',
    section: 'Zainab Alert Section 4 — Abduction/Abuse of Child',
    severity: 'HIGH',
    answer_en: `⚖️ Law: Zainab Alert Act 2020 + Child Protection Laws

📋 Explanation:
Any abuse, harassment, or exploitation of a child is a serious criminal offense in Pakistan with strict punishments.

✅ Action Steps:
1. Call Child Protection Helpline: 1121 (free, 24/7)
2. File FIR at nearest police station immediately
3. Take child to hospital for medical examination
4. Contact SPARC Pakistan: sparc.org.pk
5. For child marriage: report to Union Council or NADRA — it can be stopped legally

⚠️ Punishment:
Child abuse: up to 14 years imprisonment
Child marriage (for adults involved): up to 1 month imprisonment + fine`,
    answer_ur: `⚖️ قانون: زینب الرٹ ایکٹ 2020

📋 وضاحت:
بچوں کے ساتھ کسی بھی قسم کی زیادتی پاکستان میں سنگین جرم ہے۔

✅ اقدامات:
1. چائلڈ پروٹیکشن ہیلپ لائن: 1121 (مفت، 24 گھنٹے)
2. فوری طور پر قریبی تھانے میں ایف آئی آر
3. بچے کو طبی معائنے کے لیے ہسپتال لے جائیں
4. اسپارک پاکستان سے رابطہ کریں

⚠️ سزا:
14 سال تک قید`
  },

  // ━━━━ THEFT / ROBBERY ━━━━
  theft: {
    keywords: ['theft', 'robbery', 'chori', 'loot', 'dacoity',
      'stolen', 'robbed', 'snatch', 'mobile chori', 'phone stolen',
      'wallet stolen', 'car stolen', 'bike chori', 'ghar mein chori',
      'burglary', 'daketi'],
    law: 'Pakistan Penal Code (PPC)',
    section: 'Section 379 — Theft / Section 392 — Robbery',
    severity: 'HIGH',
    answer_en: `⚖️ Law: PPC Section 379 (Theft) / Section 392 (Robbery)

📋 Explanation:
Theft is taking someone's property without consent. Robbery is theft with force or threat. Both are serious criminal offenses.

✅ Action Steps:
1. File FIR at nearest police station immediately
2. Note down details: time, place, description of stolen items
3. If mobile stolen: block IMEI through PTA (pta.gov.pk)
4. Get CCTV footage from nearby shops/buildings
5. Note any witness details

⚠️ Punishment:
Theft (PPC 379): up to 3 years imprisonment + fine
Robbery (PPC 392): up to 10 years imprisonment
Dacoity (PPC 395): up to 25 years imprisonment`,
    answer_ur: `⚖️ قانون: تعزیرات پاکستان دفعہ 379 (چوری) / 392 (ڈکیتی)

📋 وضاحت:
کسی کا مال بغیر اجازت لینا چوری ہے۔ زبردستی یا دھمکی سے لینا ڈکیتی ہے۔

✅ اقدامات:
1. فوری طور پر قریبی تھانے میں ایف آئی آر درج کرائیں
2. تفصیلات نوٹ کریں: وقت، جگہ، چوری شدہ اشیاء
3. موبائل چوری ہو تو PTA سے IMEI بلاک کروائیں
4. قریبی دکانوں سے CCTV فوٹیج حاصل کریں
5. گواہوں کی تفصیلات نوٹ کریں

⚠️ سزا:
چوری: 3 سال قید + جرمانہ
ڈکیتی: 10 سال قید
مسلح ڈکیتی: 25 سال قید`
  },

  // ━━━━ FRAUD / CHEQUE BOUNCE ━━━━
  fraud: {
    keywords: ['fraud', 'cheque bounce', 'scam', 'dhoka',
      'money fraud', 'investment fraud', 'ponzi', 'fake scheme',
      'cheque dishonor', 'check bounce', 'paisa loot',
      'online fraud', 'banking fraud', 'forgery'],
    law: 'Negotiable Instruments Act + PPC Section 489-F',
    section: 'PPC 489-F — Dishonestly Issuing Cheque',
    severity: 'MEDIUM',
    answer_en: `⚖️ Law: PPC Section 489-F (Cheque Bounce) / Section 420 (Fraud)

📋 Explanation:
Issuing a cheque that bounces is a criminal offense. Fraud and cheating are punishable under PPC.

✅ Action Steps:
1. For cheque bounce: Send legal notice within 30 days
2. File complaint in Banking Court
3. For fraud: File FIR under PPC Section 420
4. Collect all evidence: receipts, messages, bank statements
5. For online fraud: Report to FIA Cyber Crime

⚠️ Punishment:
Cheque bounce (489-F): up to 3 years imprisonment
Fraud (420): up to 7 years imprisonment + fine`,
    answer_ur: `⚖️ قانون: تعزیرات پاکستان دفعہ 489-F (چیک باؤنس) / 420 (فراڈ)

📋 وضاحت:
بے ایمانی سے چیک جاری کرنا جرم ہے۔ دھوکہ دہی قابل سزا جرم ہے۔

✅ اقدامات:
1. چیک باؤنس: 30 دن کے اندر قانونی نوٹس بھیجیں
2. بینکنگ کورٹ میں شکایت درج کریں
3. فراڈ: تھانے میں ایف آئی آر درج کرائیں
4. تمام ثبوت اکٹھے کریں: رسیدیں، پیغامات، بینک سٹیٹمنٹ
5. آن لائن فراڈ: ایف آئی اے سائبر کرائم کو رپورٹ کریں

⚠️ سزا:
چیک باؤنس: 3 سال قید
فراڈ: 7 سال قید + جرمانہ`
  },

  // ━━━━ FIR NOT REGISTERED ━━━━
  fir_not_registered: {
    keywords: ['police not registering fir', 'fir nahi likh rahe',
      'police refuse', 'thana nahi sun raha', 'police complaint',
      'fir darj', 'police help nahi kar rahi', 'police corruption',
      'fir reject', 'police station problem'],
    law: 'Criminal Procedure Code (CrPC)',
    section: 'Section 154 — Information in Cognizable Cases',
    severity: 'HIGH',
    answer_en: `⚖️ Law: CrPC Section 154 — FIR Registration

📋 Explanation:
Police is LEGALLY BOUND to register your FIR. Refusing to register an FIR is itself a criminal offense by the police officer.

✅ Action Steps:
1. Send written application to SHO via registered post
2. If SHO refuses: complain to SP/DPO of your district
3. File application in Sessions Court under Section 22-A
4. Contact IGP complaint cell of your province
5. File complaint on Pakistan Citizen Portal: citizenportal.gov.pk
6. Punjab Police complaint: 8787 (SMS)

⚠️ Note:
Police officer refusing FIR can face:
Departmental action + criminal proceedings`,
    answer_ur: `⚖️ قانون: ضابطہ فوجداری دفعہ 154 — ایف آئی آر

📋 وضاحت:
پولیس قانوناً آپ کی ایف آئی آر درج کرنے کی پابند ہے۔ انکار کرنا خود جرم ہے۔

✅ اقدامات:
1. ایس ایچ او کو رجسٹرڈ ڈاک سے تحریری درخواست بھیجیں
2. انکار پر: ایس پی / ڈی پی او کو شکایت کریں
3. سیشن کورٹ میں 22-A کے تحت درخواست دیں
4. آئی جی پی شکایت سیل سے رابطہ کریں
5. پاکستان سٹیزن پورٹل: citizenportal.gov.pk

⚠️ نوٹ:
ایف آئی آر نہ لکھنے والے افسر کے خلاف محکمانہ کارروائی ہو سکتی ہے`
  },

  // ━━━━ BAIL ━━━━
  bail: {
    keywords: ['bail', 'zamanat', 'arrested', 'jail',
      'giraftar', 'police custody', 'remand',
      'how to get bail', 'bail application',
      'pre arrest bail', 'post arrest bail'],
    law: 'Criminal Procedure Code (CrPC)',
    section: 'Section 496 — Bail in Non-Bailable Offenses',
    severity: 'HIGH',
    answer_en: `⚖️ Law: CrPC Section 496, 497, 498 — Bail

📋 Explanation:
Bail is a legal right. In bailable offenses, police MUST grant bail. In non-bailable offenses, court decides.

✅ Action Steps:
1. For bailable offense: Demand bail at police station (your right)
2. For non-bailable: File bail application in Sessions Court
3. Pre-arrest bail: File in Sessions Court or High Court
4. Hire a criminal lawyer immediately
5. Arrange surety (guarantor with property)

⚠️ Types of Bail:
- Bailable offense: Police must grant bail
- Non-bailable: Court discretion
- Pre-arrest bail: Before arrest (protective)
- Post-arrest bail: After arrest`,
    answer_ur: `⚖️ قانون: ضابطہ فوجداری — ضمانت

📋 وضاحت:
ضمانت قانونی حق ہے۔ قابل ضمانت جرائم میں پولیس ضمانت دینے کی پابند ہے۔

✅ اقدامات:
1. قابل ضمانت جرم: تھانے میں ضمانت مانگیں (آپ کا حق)
2. ناقابل ضمانت: سیشن کورٹ میں ضمانت کی درخواست
3. قبل از گرفتاری ضمانت: سیشن یا ہائی کورٹ
4. فوری طور پر فوجداری وکیل کریں
5. ضامن (جائیداد والا) تیار رکھیں

⚠️ اقسام:
- قابل ضمانت: پولیس دینے کی پابند
- ناقابل ضمانت: عدالت فیصلہ کرے
- قبل از گرفتاری: گرفتاری سے پہلے`
  },
};

export default localLaws;
