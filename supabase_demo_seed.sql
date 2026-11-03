-- ============================================================
-- SHAKTI SABHA: PRODUCTION DATABASE DEMO DATA SEED SCRIPT
-- Execute this in Supabase SQL Editor to populate all dynamic data.
-- ============================================================

-- 1. SEED COURSES
DELETE FROM public.courses WHERE title IN ('Self-Defense Foundations & Situational Readiness', 'Character Building & Mental Fortitude for Young Women', 'Vedic Parenting & Dharmic Nurturance for Tomorrow', 'Strategic Leadership for the Modern Bharatiya Warrior', 'Dharma, Paurush & Civilizational Discourse', 'Traditional Lathi-Kaushal & Staff Combat Video Guide');

INSERT INTO public.courses (
  title, description, price, original_price, discount_percent, discount_tag, duration, level, cover_image_url, instructor, published, syllabus
) VALUES (
  'Self-Defense Foundations & Situational Readiness',
  'Core biomechanics of human vulnerabilities, escaping holds, improvised weapon defense, and rapid emergency voice command protocols. Learn active perimeter management, recognizing pre-violence indicators, and executing explosive counter-strikes.',
  1800,
  2500,
  28,
  'Save ₹700 · Flagship Offer',
  '4 Weeks',
  'beginner',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
  'Mission Mardini Faculty',
  true,
  '[{"week": "Week 1", "topic": "Cognitive Radar & Threat Identification: Color-code awareness and micro-expression red flags."}, {"week": "Week 2", "topic": "Bio-mechanical Escapes: Wrist grabs, bear hugs, chokeholds, and pinned-to-wall extractions."}, {"week": "Week 3", "topic": "Empty-Hand High-Impact Strikes: Palm-heel, hammer-fist, elbows, and knee drives."}, {"week": "Week 4", "topic": "Improvised Environmental Weapons: Everyday carry items, rapid exit pathways, and post-incident stabilization."}]'::jsonb
);
INSERT INTO public.courses (
  title, description, price, original_price, discount_percent, discount_tag, duration, level, cover_image_url, instructor, published, syllabus
) VALUES (
  'Character Building & Mental Fortitude for Young Women',
  'Unapologetic boundary setting, overcoming public anxiety, vocal projection, resilience training, and cultivating unshakeable self-worth grounded in Vedic models of feminine courage.',
  2200,
  3000,
  27,
  'Save ₹800 · Limited Time',
  '6 Weeks',
  'intermediate',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
  'Harshita Mankar',
  true,
  '[{"week": "Week 1", "topic": "De-conditioning People-Pleasing & Autonomic Freeze Responses."}, {"week": "Week 2", "topic": "Voice Projection & Command Presence in High-Pressure Environments."}, {"week": "Week 3", "topic": "Psychological Resilience: Reframing Adversity through Kshatra-Dharma."}, {"week": "Week 4", "topic": "Boundary Architecture: Emotional, Physical, and Professional."}, {"week": "Week 5", "topic": "Overcoming Social Anxiety & Public Speaking Mastery."}, {"week": "Week 6", "topic": "The Sovereign Warrior Mindset: Long-term Integrity & Community Leadership."}]'::jsonb
);
INSERT INTO public.courses (
  title, description, price, original_price, discount_percent, discount_tag, duration, level, cover_image_url, instructor, published, syllabus
) VALUES (
  'Vedic Parenting & Dharmic Nurturance for Tomorrow',
  'How classical Indian wisdom, sanskaras, and emotional anchoring build confident children resilient against toxic digital addiction and predatory influences.',
  1500,
  2000,
  25,
  'Save ₹500',
  '3 Weeks',
  'beginner',
  'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&auto=format&fit=crop&q=80',
  'Shakti Sabha Academy',
  true,
  '[{"week": "Week 1", "topic": "Foundations of Dharmic Parenting: Sanskaras in the Digital Age."}, {"week": "Week 2", "topic": "Emotional Regulation & Building Lifelong Trust with Teenagers."}, {"week": "Week 3", "topic": "Countering Algorithm Addiction & Instilling Cultural Pride."}]'::jsonb
);
INSERT INTO public.courses (
  title, description, price, original_price, discount_percent, discount_tag, duration, level, cover_image_url, instructor, published, syllabus
) VALUES (
  'Strategic Leadership for the Modern Bharatiya Warrior',
  'Community organizing, legal literacy under Bharatiya Nyaya Sanhita, crisis mediation, and grassroots campaign management for impactful institutional change.',
  3000,
  4500,
  33,
  'Save ₹1,500 · Special Grant',
  '8 Weeks',
  'advanced',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
  'Executive Board',
  true,
  '[{"week": "Week 1", "topic": "Civilizational Strategy & Historical Case Studies of Rani Chennamma."}, {"week": "Week 2", "topic": "Institutional Dynamics & Public Speaking Frameworks."}, {"week": "Week 3", "topic": "Legal Shield: Statutory Protections under BNS, IPC, and POSH Act."}, {"week": "Week 4", "topic": "Crisis Communication & Media De-escalation."}]'::jsonb
);
INSERT INTO public.courses (
  title, description, price, original_price, discount_percent, discount_tag, duration, level, cover_image_url, instructor, published, syllabus
) VALUES (
  'Dharma, Paurush & Civilizational Discourse',
  'Master the art of rigorous intellectual debate, analyzing Western feminist narratives vs civilizational Bharatiya thought with verified sources.',
  1800,
  2600,
  31,
  'Save ₹800',
  '5 Weeks',
  'intermediate',
  'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600&auto=format&fit=crop&q=80',
  'Shakti Varta Research Group',
  true,
  '[{"week": "Week 1", "topic": "Epistemic Frameworks of Indian Philosophy: Pramanas and Nyaya."}, {"week": "Week 2", "topic": "De-colonizing Indian Historiography: Correcting the Distortion."}, {"week": "Week 3", "topic": "Understanding Paurush: True Masculinity as Dharma-Rakshak."}]'::jsonb
);
INSERT INTO public.courses (
  title, description, price, original_price, discount_percent, discount_tag, duration, level, cover_image_url, instructor, published, syllabus
) VALUES (
  'Traditional Lathi-Kaushal & Staff Combat Video Guide',
  'Step-by-step master angles, footwork, dual-strike blocks, and rhythmic flow drills from experienced Maharashtra lathi masters.',
  2000,
  2800,
  29,
  'Save ₹800',
  '6 Weeks',
  'beginner',
  'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&auto=format&fit=crop&q=80',
  'Mission Mardini Tactical Wing',
  true,
  '[{"week": "Week 1", "topic": "Stance, Footwork (Chaal), and Grip Dynamics."}, {"week": "Week 2", "topic": "The 12 Fundamental Target Strikes of Mardani Khel."}, {"week": "Week 3", "topic": "Parries, Circular Blocks, and Momentum Trapping."}]'::jsonb
);

-- 2. SEED ARTICLES
DELETE FROM public.articles WHERE title_en IN ('10 Subtle Signs of Depression in Women', 'Gargi Vachaknavi — The Sovereign Vedic Intellectual', 'Rani Abbakka Chowta — The Undefeated Anti-Colonial Queen', 'Traditional Lathi-Kaushal & Physical Sovereignty for Women', 'Essential Legal Armor for Every Indian Woman');

INSERT INTO public.articles (
  title_en, title_hi, content_en, content_hi, excerpt_en, excerpt_hi, cover_image_url, category, tags, author_name, published
) VALUES (
  '10 Subtle Signs of Depression in Women',
  'महिलाओं में Depression के 10 सूक्ष्म लक्षण — पहचान और समाधान',
  'Clinical depression in women often manifests differently than in men. Rather than acute sadness, it frequently appears as chronic fatigue, excessive self-blame, sleep disturbances, somatic body pain, and emotional numbness.

Key Diagnostic Indicators:
1. Unrelenting physical fatigue and morning exhaustion despite adequate sleep.
2. Inability to experience joy in previously loved family traditions.
3. Excessive guilt and internalizing interpersonal conflict.
4. Psychosomatic symptoms: unexplained migraines, digestive issues, and tension.

Early clinical intervention, peer anchoring, and trauma-informed cognitive restructuring ensure a 94% recovery rate. Shakti Sabha provides discreet, confidential female psychological counseling.',
  'महिलाओं में डिप्रेशन अक्सर पुरुषों की तुलना में भिन्न रूप से प्रकट होता है। यह तीव्र उदासी के स्थान पर निरंतर थकान, अत्यधिक आत्म-दोष, अनिद्रा, शारीरिक दर्द और भावनात्मक सुन्नता के रूप में सामने आता है।

प्रमुख नैदानिक संकेतक:
1. पर्याप्त नींद के बाद भी लगातार शारीरिक थकान और सुबह की सुस्ती।
2. पारिवारिक या व्यक्तिगत रुचियों में आनंद की पूर्ण अनुपस्थिति।
3. बिना कारण अपराधबोध और दूसरों की समस्याओं का दोष स्वयं पर लेना।
4. सिरदर्द, मांसपेशियों में खिंचाव और पाचन तंत्र में विकार।

प्रारंभिक चिकित्सकीय परामर्श, परिवार का भावनात्मक संबल और पेशेवर थेरेपी से ९४% मामलों में पूर्ण सुधार संभव है। शक्ति सभा पूरी गोपनीयता के साथ महिला मनोवैज्ञानिक परामर्श उपलब्ध कराती है।',
  'Clinical insights on identifying veiled symptoms of emotional distress, breaking internalized guilt, and seeking early confidential intervention.',
  'जब दर्द बाहर नहीं दिखता पर अंदर से तोड़ता है — महिलाओं में अवसाद के मौन लक्षणों को पहचानें और सम्मानपूर्वक संबल पाएं।',
  'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80',
  'Clinical Psychology',
  ARRAY['Mental Health', 'Counseling', 'Self Care', 'Psychology']::text[],
  'Dr. Suniti Sharma (Lead Psychologist)',
  true
);
INSERT INTO public.articles (
  title_en, title_hi, content_en, content_hi, excerpt_en, excerpt_hi, cover_image_url, category, tags, author_name, published
) VALUES (
  'Gargi Vachaknavi — The Sovereign Vedic Intellectual',
  'गार्गी वाचक्नवी — शास्त्रार्थ की महारथी जिन्होंने याज्ञवल्क्य को चुनौती दी',
  'In the court of King Janaka of Videha, the profoundest philosophical debate of the Upanishadic era occurred. While hundreds of male scholars withdrew, Gargi Vachaknavi stood unflinchingly to question Rishi Yajnavalkya on the ontological fabric of existence.

Philosophical Legacy:
1. Proof that ancient Bharatiya civilization recognized absolute intellectual parity between women and men.
2. Gargi''s questions form the crown jewel of the Brihadaranyaka Upanishad.
3. The ideal of the Brahmavadini — women dedicated to rigorous metaphysical truth and civilizational leadership.',
  'विदेह के राजा जनक की राजसभा में उपनिषद काल का सबसे प्रखर दार्शनिक शास्त्रार्थ हुआ। जहां सैकड़ों विद्वान मौन हो गए, वहां ब्रह्मवादिनी गार्गी वाचक्नवी ने महर्षि याज्ञवल्क्य से सृष्टि के मूल आधार पर निर्भीक प्रश्न पूछे।

वैचारिक विरासत:
1. यह ऐतिहासिक प्रमाण है कि प्राचीन सनातन संस्कृति में महिलाओं को शास्त्रार्थ और बौद्धिक नेतृत्व का सर्वोच्च अधिकार था।
2. गार्गी के प्रश्न वृहदारण्यक उपनिषद के मूल आध्यात्मिक स्तंभ हैं।
3. ब्रह्मवादिनी परंपरा — आत्मज्ञान और राष्ट्र-चिंतन को समर्पित नारी शक्ति का अमर आदर्श।',
  'How ancient India celebrated female philosophical supremacy and rigorous debate at the highest councils of state.',
  'वैदिक काल की प्रखर ब्रह्मवादिनी जिन्होंने मिथिला नरेश जनक की संसद में सर्वोच्च दार्शनिक सत्य पर शास्त्रार्थ किया।',
  'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80',
  'Upanishadic Wisdom',
  ARRAY['History', 'Philosophy', 'Civilization', 'Vedas']::text[],
  'Shakti Sabha History Council',
  true
);
INSERT INTO public.articles (
  title_en, title_hi, content_en, content_hi, excerpt_en, excerpt_hi, cover_image_url, category, tags, author_name, published
) VALUES (
  'Rani Abbakka Chowta — The Undefeated Anti-Colonial Queen',
  'रानी अब्बक्का चौटा — पहली Anti-Colonial महारानी जिसने पुर्तगालियों को खदेड़ा',
  'Centuries before the 1857 uprising, Rani Abbakka I of Ullal (Coastal Karnataka) defended Bharat against Portuguese naval fleets for over four decades.

Strategic Masterstrokes:
1. Commanded integrated regiments across diverse religious and caste lines.
2. Pioneered nocturnal sea combat and fire-arrow flotillas.
3. Refused tribute to foreign colonizers, choosing martyrdom with weapon in hand.

Her life exemplifies Kshatra-Dharma and female statecraft.',
  '१८५७ के स्वतंत्रता संग्राम से ३०० वर्ष पूर्व, उल्लाल (कर्नाटक) की महारानी रानी अब्बक्का चौटा ने चार दशकों तक पुर्तगाली नौसैनिक आक्रमणों को परास्त कर अपनी मातृभूमि की रक्षा की।

सामरिक युद्धकौशल:
1. सभी वर्गों और धर्मों के योद्धाओं को संगठित कर अजेय सेना का गठन।
2. अग्नि-बाणों और रात्रि नौसैनिक छापों की अद्वितीय रणनीति।
3. विदेशी आक्रमणकारियों को कर देने से स्पष्ट इनकार और अंतिम श्वास तक रणभूमि में संघर्ष।

रानी अब्बक्का का जीवन भारतीय क्षात्र-धर्म और वीरांगना नेतृत्व का जीवंत प्रतीक है।',
  '40 years of tactical naval resistance against Portuguese invaders by the warrior queen of Ullal.',
  'उल्लाल की अपराजेय वीरांगना जिसने १६वीं सदी में पुर्तगाली समुद्री बेड़े को छह बार धूल चटाई।',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
  'Warrior Queens',
  ARRAY['History', 'Warriors', 'National Pride', 'Courage']::text[],
  'Harshita Mankar (Founder)',
  true
);
INSERT INTO public.articles (
  title_en, title_hi, content_en, content_hi, excerpt_en, excerpt_hi, cover_image_url, category, tags, author_name, published
) VALUES (
  'Traditional Lathi-Kaushal & Physical Sovereignty for Women',
  'लट्ठ और तलवार — जब आत्मरक्षा जीवन-साधना बनी',
  'Mission Mardini revives traditional Bharatiya staff combat (Lathi-Kaushal) across hundreds of schools and rural centers.

Biomechanical & Psychological Benefits:
1. Dynamic balance and peripheral vision enhancement.
2. Deconditioning autonomic freeze responses during harassment.
3. Cultivating physical confidence and fearless presence in public spaces.',
  'पारंपरिक लाठी और तलवारबाजी केवल शारीरिक व्यायाम नहीं है, बल्कि मस्तिष्क में भय के केंद्र को शांत करने और त्वरित निर्णय-क्षमता विकसित करने का प्राचीन विज्ञान है।

शारीरिक व मानसिक लाभ:
1. परिधीय दृष्टि और शारीरिक संतुलन में असाधारण सुधार।
2. संकट के समय शरीर के ''फ्रीज'' होने की प्रवृत्ति का उन्मूलन।
3. सार्वजनिक स्थलों पर बिना संकोच और भय के स्वाभिमानपूर्वक विचरण की सामर्थ्य।',
  'How tactical staff combat de-conditions fear and builds unshakeable bodily sovereignty.',
  'भय-मुक्ति और शारीरिक स्वाभिमान — पारंपरिक मार्शल आर्ट्स से बालिकाओं में अजेय आत्मविश्वास का संचार।',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
  'Mardini Combat',
  ARRAY['Self Defense', 'Mardini', 'Fitness', 'Discipline']::text[],
  'Mission Mardini Tactical Wing',
  true
);
INSERT INTO public.articles (
  title_en, title_hi, content_en, content_hi, excerpt_en, excerpt_hi, cover_image_url, category, tags, author_name, published
) VALUES (
  'Essential Legal Armor for Every Indian Woman',
  'कानूनी अधिकार जो हर भारतीय महिला को कंठस्थ होने चाहिए',
  'A practical guide to the Bharatiya Nyaya Sanhita (BNS), POSH Act, and constitutional shields for Indian women.

Critical Legal Rights:
1. Zero FIR: Any police station must register an FIR irrespective of jurisdiction.
2. Arrest Protocols: Women cannot be arrested after sunset or before sunrise without a female magistrate order.
3. Equal Coparcenary: Equal ancestral property rights from birth under the Hindu Succession Act.
4. Protection from Domestic Coercion (PWDVA 2005): Right to reside in shared household and interim maintenance.',
  'Zero FIR, घरेलू हिंसा संरक्षण अधिनियम, कार्यस्थल पर सुरक्षा (POSH), और पैतृक संपत्ति में समान अधिकार — कानूनी सुरक्षा की सरल और व्यावहारिक मार्गदर्शिका।

प्रमुख कानूनी सुरक्षा कवच:
1. Zero FIR: किसी भी थाने में अपराध की सूचना दर्ज कराई जा सकती है, भले ही अधिकार क्षेत्र कोई भी हो।
2. गिरफ्तारी के नियम: सूर्यास्त के बाद और सूर्योदय से पहले महिला पुलिस अधिकारी के बिना गिरफ्तारी नहीं हो सकती।
3. समान उत्तराधिकार: बेटियों का पैतृक संपत्ति में जन्मसिद्ध बराबर अधिकार।
4. घरेलू हिंसा अधिनियम २००५: साझा गृहस्थी में रहने का अधिकार और त्वरित विधिक सहायता।',
  'Zero FIR, BNS provisions, POSH workplace safeguards, and ancestral inheritance rights explained.',
  'संवैधानिक सुरक्षा और व्यावहारिक कवच — कानून का ज्ञान भय को समाप्त कर स्वाभिमान से जीने का मार्ग प्रशस्त करता है।',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
  'Legal Armor',
  ARRAY['Law', 'Rights', 'BNS', 'Safety']::text[],
  'Adv. Meenakshi & Legal Team',
  true
);

-- 3. SEED GALLERY CATEGORIES
INSERT INTO public.gallery_categories (name, description, cover_url)
VALUES
  ('Mission Mardini Camps', 'Ground combat and lathi self-defense training across schools.', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'),
  ('Aaryaveera Leadership', 'Youth character building and civilizational seminars.', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80'),
  ('Community & Sahyog', 'On-ground rural assistance and counseling outreach.', 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80')
ON CONFLICT (name) DO NOTHING;
