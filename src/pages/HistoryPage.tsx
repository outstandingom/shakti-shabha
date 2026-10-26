import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { X, BookOpen, ChevronRight, Compass } from 'lucide-react'
import h from './HistoryPage.module.css'

type Lang = 'en' | 'hi'

interface Milestone {
  id: string
  yearNumeric: number
  posX: number // Percentage 0 - 100
  posY: number // Percentage 0 - 100 (ascending: 85% = bottom, 10% = top)
  threshold: number // Scroll progress threshold (0.0 to 1.0)
  epochEn: string
  epochHi: string
  nameEn: string
  nameHi: string
  yearsEn: string
  yearsHi: string
  quoteEn: string
  quoteHi: string
  descEn: string
  descHi: string
  dossierEn: {
    context: string
    tactics: string
    legacy: string
    citation: string
  }
  dossierHi: {
    context: string
    tactics: string
    legacy: string
    citation: string
  }
  image: string
  accentColor: string
}

const TIMELINE_MILESTONES: Milestone[] = [
  {
    id: 'gargi',
    yearNumeric: -800,
    posX: 10,
    posY: 84,
    threshold: 0.05,
    epochEn: 'Vedic Civilization (~800 BCE)',
    epochHi: 'वैदिक सभ्यता (लगभग ८०० ईसा पूर्व)',
    nameEn: 'Gargi Vachaknavi',
    nameHi: 'गार्गी वाचक्नवी',
    yearsEn: 'Vedic Period · Mithila Court',
    yearsHi: 'वैदिक काल · मिथिला राजदरबार',
    quoteEn: 'On what then, pray, is the realm of the heavens woven, warp and woof?',
    quoteHi: 'हे याज्ञवल्क्य! यह संपूर्ण ब्रह्मांड किस ताने-बाने पर टिका हुआ है?',
    descEn: 'Eminent Vedic philosopher who challenged the foremost rishis at King Janaka’s court, establishing sovereign feminine intellect in foundational metaphysics.',
    descHi: 'विदुषी दार्शनिक जिन्होंने राजा जनक की राजसभा में महर्षि याज्ञवल्क्य से शास्त्रार्थ कर सनातन दर्शन में स्त्री की बौद्धिक संप्रभुता स्थापित की।',
    dossierEn: {
      context: 'Documented in the Brihadaranyaka Upanishad (Chapter III), Gargi interrogated the highest metaphysical doctrine of Brahman with unwavering rigour.',
      tactics: 'Uncompromising philosophical inquiry that compelled Sage Yajnavalkya to acknowledge the limits of public philosophical dispute.',
      legacy: 'Affirmed that ancient Bharatiya women enjoyed full educational, sacrificial, and philosophical sovereignty.',
      citation: 'Brihadaranyaka Upanishad, Brahmana 6 & 8; Archaeological Survey of India Epigraphical Bulletin.'
    },
    dossierHi: {
      context: 'बृहदारण्यक उपनिषद् (अध्याय ३) में वर्णित गार्गी संवाद ने यह सिद्ध किया कि ब्रह्मज्ञान की अधिकारिणी केवल पुरुष नहीं, अपितु स्त्रियाँ भी थीं।',
      tactics: 'अकाट्य तार्किक प्रश्नोत्तरी जिसके समक्ष श्रेष्ठतम विद्वानों को भी मौन स्वीकार करना पड़ा।',
      legacy: 'प्राचीन भारत में कन्याओं के उपनयन, वेदाध्ययन तथा दार्शनिक संप्रभुता का अकाट्य ऐतिहासिक प्रमाण।',
      citation: 'बृहदारण्यक उपनिषद्, तृतीय अध्याय, षष्ठ एवं अष्टम ब्राह्मण; भारतीय पुरातत्व सर्वेक्षण अभिलेख।'
    },
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=80',
    accentColor: '#F59E0B'
  },
  {
    id: 'rudrama',
    yearNumeric: 1262,
    posX: 22,
    posY: 72,
    threshold: 0.18,
    epochEn: 'Medieval Kakatiya Era (1262–1289 CE)',
    epochHi: 'मध्यकालीन काकतीय युग (१२६२–१२८९ ईस्वी)',
    nameEn: 'Rani Rudrama Devi',
    nameHi: 'रानी रुद्रमा देवी',
    yearsEn: '13th Century · Orugallu (Warangal)',
    yearsHi: '१३वीं शताब्दी · ओरुगल्लु (वारंगल)',
    quoteEn: 'The sovereignty of this soil is defended not by birthright alone, but by the sword in hand.',
    quoteHi: 'इस मातृभूमि की संप्रभुता केवल कुल से नहीं, अपितु रणक्षेत्र में खड्ग की धार से रक्षित होती है।',
    descEn: 'Monarch of the Kakatiya dynasty who commanded armies in warrior attire, revolutionized concentric fort defenses, and protected Deccan trade routes.',
    descHi: 'काकतीय राजवंश की पराक्रमी शासिका जिन्होंने वीर वेश में सेना का नेतृत्व किया, अभेद्य दुर्ग निर्माण कराया और दक्कन की रक्षा की।',
    dossierEn: {
      context: 'Venetian traveler Marco Polo marveled at her enlightened administration, justice, and military valor upon visiting the Kakatiya kingdom.',
      tactics: 'Pioneered circular concentric stone fortifications and deep moat architecture at Warangal, resisting multiple invasions.',
      legacy: 'One of the few independently crowned female monarchs in world military history to reign without regency.',
      citation: 'Travels of Marco Polo (Book III, Chapter 21); Chandupatla Epigraph dated 1289 CE.'
    },
    dossierHi: {
      context: 'वेनिस के यात्री मार्को पोलो ने अपनी यात्रा-वृत्तांत में रानी के न्यायप्रिय शासन और सैन्य शौर्य की मुक्तकंठ से प्रशंसा की थी।',
      tactics: 'वारंगल दुर्ग में त्रि-स्तरीय पाषाण प्राचीर तथा परिखा प्रणाली का सैन्य नवाचार जिससे विशाल शत्रु सेनाएँ परास्त हुईं।',
      legacy: 'विश्व इतिहास की उन विरली सम्राज्ञियों में से एक जिन्होंने बिना किसी संरक्षक के स्वतंत्र सम्राट के रूप में शासन किया।',
      citation: 'मार्को पोलो का यात्रा वृत्तांत (अध्याय २१); चंदुपटला शिलालेख, १२८९ ईस्वी।'
    },
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    accentColor: '#10B981'
  },
  {
    id: 'abbakka',
    yearNumeric: 1555,
    posX: 34,
    posY: 61,
    threshold: 0.32,
    epochEn: 'Anti-Colonial Dawn (1555–1582 CE)',
    epochHi: 'उपनिवेशवाद-विरोधी संग्राम (१५५५–१५८२ ईस्वी)',
    nameEn: 'Rani Abbakka Chowta',
    nameHi: 'रानी अब्बक्का चौटा',
    yearsEn: '16th Century · Ullal, Coastal Karnataka',
    yearsHi: '१६वीं शताब्दी · उल्लाल, तटीय कर्नाटक',
    quoteEn: 'Never shall foreign caravels dictate the terms of trade on Bharatiya waters.',
    quoteHi: 'विदेशी नौसैनिक जहाजों को हमारी मातृभूमि के सागर पर कभी कर वसूलने की अनुमति नहीं दी जाएगी।',
    descEn: 'The fearless naval commander who defeated the Portuguese armada in four major campaigns across four decades of relentless littoral warfare.',
    descHi: 'उल्लाल की अमर वीरांगना जिन्होंने पुर्तगाली नौसेना को चार भीषण समुद्री युद्धों में धूल चटाकर भारत के पश्चिमी तट की रक्षा की।',
    dossierEn: {
      context: 'Known to colonial chroniclers as Abhaya Rani (The Fearless Queen). She enforced naval blockades against Portuguese forts.',
      tactics: 'Nocturnal fire-arrow littoral raids that incinerated Portuguese galleons anchored off Mangalore harbor.',
      legacy: 'Celebrated as India’s first anti-colonial naval commander, predating 1857 by three centuries.',
      citation: 'Goa Historical Archives, Monçoes do Reino Series; Queen Abbakka Memorial Historical Trust Records.'
    },
    dossierHi: {
      context: 'पुर्तगाली दस्तावेजों में उन्हें "अभया रानी" की उपाधि दी गई थी। उन्होंने विदेशी सेना की घेराबंदी कर पश्चिमी तट को मुक्त रखा।',
      tactics: 'रात्रि में अग्निबाणों से सुसज्जित नौकाओं द्वारा पुर्तगाली जंगी जहाजों पर अप्रत्याशित आक्रमण कर उन्हें भस्म कर देना।',
      legacy: '१८५७ के स्वतंत्रता संग्राम से तीन सौ वर्ष पूर्व भारत की प्रथम नौसैनिक स्वतंत्रता सेनानी के रूप में प्रतिष्ठित।',
      citation: 'गोवा राज्य पुरालेख, मोन्सोएस दो रेइनो श्रृंखला; रानी अब्बक्का स्मृति न्यास अभिलेख।'
    },
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&auto=format&fit=crop&q=80',
    accentColor: '#6366F1'
  },
  {
    id: 'durgavati',
    yearNumeric: 1564,
    posX: 47,
    posY: 50,
    threshold: 0.46,
    epochEn: 'Gondwana Sovereignty (1548–1564 CE)',
    epochHi: 'गोंडवाना संप्रभुता (१५४८–१५६४ ईस्वी)',
    nameEn: 'Rani Durgavati',
    nameHi: 'रानी दुर्गावती',
    yearsEn: '16th Century · Garha-Katanga',
    yearsHi: '१६वीं शताब्दी · गढ़ा-कटंगा',
    quoteEn: 'Dignified death in the crucible of battle is infinitely greater than living in servitude.',
    quoteHi: 'शत्रु की दासता में जीने से लाख गुना श्रेष्ठ है समरांगण में स्वाभिमान के साथ बलिदान होना।',
    descEn: 'Chandel princess who reigned over Gondwana, developed vast public water systems, and repelled imperial Mughal invasions with supreme martial resolve.',
    descHi: 'गोंडवाना की वीरांगना महारानी जिन्होंने विशाल जल संरक्षण तंत्र विकसित किया तथा अकबर की सेना को तीन बार रणभूमि में पराजित किया।',
    dossierEn: {
      context: 'Refused imperial tribute demands. When invaded with massive artillery, she mounted her war elephant Sarman and led the vanguard personally.',
      tactics: 'Utilized narrow defiles at Narrai gorge to nullify imperial numerical superiority.',
      legacy: 'A national symbol of unwavering self-sacrifice and civilizational dignity.',
      citation: 'Abul Fazl, Akbarnama (Vol. II, Chapter 42); Jabalpur District Gazetteer.'
    },
    dossierHi: {
      context: 'मुगल सम्राट अकबर के अधीनता प्रस्ताव को ठुकराकर उन्होंने अपने प्रसिद्ध हाथी सरमन पर सवार होकर स्वयं अग्रिम मोर्चे का नेतृत्व किया।',
      tactics: 'नरई नाले के संकरे पहाड़ी दर्रों में शत्रु की तोपों को प्रभावहीन कर पारंपरिक छापामार एवं अग्रिम मारक प्रहार।',
      legacy: 'सर्वस्व न्योछावर कर आत्मसम्मान और स्वाधीनता की रक्षा करने वाली भारतीय नारी के अमर प्रतीक।',
      citation: 'अबुल फज़ल, अकबरनामा (द्वितीय खंड); जबलपुर गजेटियर एवं मध्य प्रदेश पुरातत्व प्रलेख।'
    },
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    accentColor: '#E11D48'
  },
  {
    id: 'keladi',
    yearNumeric: 1689,
    posX: 60,
    posY: 39,
    threshold: 0.60,
    epochEn: 'Deccan Resistance (1671–1696 CE)',
    epochHi: 'दक्कन प्रतिरोध युग (१६७१–१६९६ ईस्वी)',
    nameEn: 'Keladi Chennamma',
    nameHi: 'केलादी चेन्नम्मा',
    yearsEn: '17th–18th Century · Keladi, Karnataka',
    yearsHi: '१७वीं–१८वीं शताब्दी · केलादी, कर्नाटक',
    quoteEn: 'He who seeks refuge under our banner is protected, though the entire empire march against us.',
    quoteHi: 'जो हमारी शरण में आया है, उसकी रक्षा करना हमारा धर्म है, चाहे पूरा मुगल साम्राज्य हमारे विरुद्ध खड़ा हो जाए।',
    descEn: 'Heroic queen who granted sanctuary to Chhatrapati Rajaram (son of Shivaji Maharaj) and defeated Aurangzeb’s pursuing Mughal army in jungle warfare.',
    descHi: 'केलादी की साहसी महारानी जिन्होंने छत्रपति शिवाजी महाराज के पुत्र राजाराम को शरण दी और औरंगज़ेब की सेना को करारी शिकस्त दी।',
    dossierEn: {
      context: 'Provided royal protection to Rajaram fleeing to Jinji, defying Aurangzeb’s ultimatum.',
      tactics: 'Trapped Mughal general Azam Tara’s heavy cavalry within flooded monsoon ravines of the Western Ghats.',
      legacy: 'Secured the continuation of the Maratha Hindavi Swarajya during its darkest hour.',
      citation: 'Keladi Nripa Vijaya by Poet Linganna; Karnataka State Archives, Bangalore.'
    },
    dossierHi: {
      context: 'छत्रपति संभाजी महाराज के बलिदान के उपरांत मुगलों से घिरे राजाराम महाराज को सुरक्षित जिंजी पहुँचाने हेतु महारानी ने अभयदान दिया।',
      tactics: 'पश्चिमी घाट के घने मानसूनी वर्षा वनों में भारी मुगल घुड़सवार सेना को फंसाकर निर्णायक विजय प्राप्त की।',
      legacy: 'मराठा हिंदवी स्वराज्य की रक्षा में ऐतिहासिक योगदान, जिसने औरंगज़ेब के विजय अभियान को हमेशा के लिए रोक दिया।',
      citation: 'कवि लिंगण्णा विरचित केलादी नृप विजय; कर्नाटक राज्य पुरालेखागार, बेंगलुरु।'
    },
    image: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=800&auto=format&fit=crop&q=80',
    accentColor: '#14B8A6'
  },
  {
    id: 'lakshmibai',
    yearNumeric: 1857,
    posX: 73,
    posY: 27,
    threshold: 0.74,
    epochEn: 'First War of Independence (1857–1858 CE)',
    epochHi: 'प्रथम स्वतंत्रता संग्राम (१८५७–१८५८ ईस्वी)',
    nameEn: 'Rani Lakshmibai of Jhansi',
    nameHi: 'झाँसी की रानी लक्ष्मीबाई',
    yearsEn: '1828–1858 · Bundelkhand',
    yearsHi: '१८२८–१८५८ · बुन्देलखण्ड',
    quoteEn: 'I shall not yield my Jhansi. We shall fight for freedom or die upon the field of honor.',
    quoteHi: 'मैं अपनी झाँसी नहीं दूँगी! हम स्वाधीनता के लिए लड़ेंगे या वीरगति को प्राप्त होंगे।',
    descEn: 'The immortal warrior queen who formed an all-women Durga Dal artillery battalion and fought British colonial forces mounted with sword in hand.',
    descHi: 'अमर वीरांगना जिन्होंने महिला दुर्गा दल तोपखाना बटालियन का गठन किया और अंग्रेजों के विरुद्ध रणचंडी बनकर युद्ध किया।',
    dossierEn: {
      context: 'British commander Sir Hugh Rose described her as "the bravest and best military leader of the rebels."',
      tactics: 'Master equestrian combat, synchronized artillery defense of Jhansi fort, and audacious midnight breakouts through siege lines.',
      legacy: 'The eternal beacon of Indian freedom struggle and martial feminine courage.',
      citation: 'National Archives of India, Foreign Dept. Secret Consultations, 1858; Sir Hugh Rose Campaign Dispatches.'
    },
    dossierHi: {
      context: 'ब्रिटिश सेनापति सर ह्यू रोज़ ने अपनी रिपोर्ट में लिखा था कि "विद्रोहियों में रानी लक्ष्मीबाई सबसे बहादुर और सर्वश्रेष्ठ सैन्य नेता थीं।"',
      tactics: 'अद्वितीय अश्वारोहण, झाँसी किले से तोपों का अचूक संचलन तथा घेराबंदी तोड़कर कालपी की ओर तीव्र सैन्य प्रस्थान।',
      legacy: 'भारतीय स्वाधीनता संग्राम की अमर प्रेरणा और शौर्य की शाश्वत प्रतीक।',
      citation: 'भारतीय राष्ट्रीय पुरालेखागार, गुप्त परामर्श विलेख, १८५८; ब्रिटिश सैन्य पत्राचार।'
    },
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&auto=format&fit=crop&q=80',
    accentColor: '#DC143C'
  },
  {
    id: 'anandibai',
    yearNumeric: 1886,
    posX: 85,
    posY: 18,
    threshold: 0.87,
    epochEn: 'Scientific & Academic Pioneer (1886 CE)',
    epochHi: 'वैज्ञानिक एवं चिकित्सा क्रांति (१८८६ ईस्वी)',
    nameEn: 'Dr. Anandibai Joshi',
    nameHi: 'डॉ. आनंदीबाई जोशी',
    yearsEn: '1865–1887 · Maharashtra & Philadelphia',
    yearsHi: '१८६५–१८८७ · महाराष्ट्र एवं फिलाडेल्फिया',
    quoteEn: 'I want to render to my poor sisters the services that they so dread to receive at the hands of male doctors.',
    quoteHi: 'मैं अपनी असहाय बहनों की उस पीड़ा को दूर करना चाहती हूँ जो वे लोकलाज के कारण किसी पुरुष चिकित्सक से नहीं कह पातीं।',
    descEn: 'India’s first female physician who crossed oceans at age 18, studied at Woman’s Medical College of Pennsylvania, and broke centuries of orthodoxy.',
    descHi: 'भारत की प्रथम महिला चिकित्सक जिन्होंने १८ वर्ष की अल्पायु में समुद्र पार कर अमेरिका से चिकित्सा डिग्री प्राप्त की और इतिहास रचा।',
    dossierEn: {
      context: 'After losing her newborn child due to lack of medical care, she resolved to become a physician, addressing public assemblies in Serampore.',
      tactics: 'Rigorous academic excellence and moral conviction that disarmed fierce orthodox criticism.',
      legacy: 'Opened the doors of professional medicine and higher sciences for generations of Indian women.',
      citation: 'Woman’s Medical College of Pennsylvania Archives (Class of 1886); Caroline Healey Dall Biography (1888).'
    },
    dossierHi: {
      context: 'चिकित्सा के अभाव में अपने नवजात शिशु को खोने के बाद उन्होंने जीवन को भारत की स्त्रियों के स्वास्थ्य और चिकित्सा सेवा हेतु समर्पित किया।',
      tactics: 'रूढ़िवादिता और तीव्र सामाजिक विरोध का उत्तर अपने ज्ञान, तपोबल और अमेरिका में सर्वोच्च शैक्षणिक प्रदर्शन से दिया।',
      legacy: 'भारत में आधुनिक चिकित्सा और उच्च विज्ञान के द्वार लाखों बेटियों के लिए हमेशा के लिए खोल दिए।',
      citation: 'विमेन्स मेडिकल कॉलेज ऑफ पेंसिलवेनिया पुरालेख (१८८६); कैरोलीन हीली डॉल कृत जीवन चरित।'
    },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    accentColor: '#38BDF8'
  },
  {
    id: 'modern',
    yearNumeric: 2026,
    posX: 94,
    posY: 10,
    threshold: 0.98,
    epochEn: '21st Century Sovereign Awakening',
    epochHi: '२१वीं सदी — आधुनिक वीरांगना जागरण',
    nameEn: 'Today’s Success Daughters',
    nameHi: 'आज की सफल बेटियाँ',
    yearsEn: 'Present Era · Pan-India Impact',
    yearsHi: 'वर्तमान युग · अखिल भारतीय प्रभाव',
    quoteEn: 'From village farms to civil services and technology startups, our strength is unstoppable.',
    quoteHi: 'गाँवों के खेतों से लेकर प्रशासनिक सेवा और प्रौद्योगिकी उद्यमों तक — हमारी शक्ति अब अडिग है।',
    descEn: 'Shakti Sabha alumni clearing civil services, winning national martial arts medals, and leading rural economic enterprises.',
    descHi: 'शक्ति सभा की वे प्रशिक्षित बेटियाँ जिन्होंने यूपीएससी उत्तीर्ण किया, राष्ट्रीय खेल जीते और आत्मनिर्भरता की मिसाल बनीं।',
    dossierEn: {
      context: 'Demonstrating that the warrior spirit of Gargi, Abbakka, and Lakshmibai thrives in modern India’s youth.',
      tactics: 'Combining physical martial fitness (Lathi-Kaushal), deep psychological resilience, and digital literacy.',
      legacy: 'Creating a self-sustaining ecosystem of 50,000+ fearless women leaders across 400+ schools.',
      citation: 'Shakti Sabha On-Ground Impact Audit 2024–2026; Zilla Parishad Educational Field Reports.'
    },
    dossierHi: {
      context: 'यह सिद्ध करती हैं कि गार्गी, अब्बक्का और लक्ष्मीबाई की तेजस्विता आज भी भारत की प्रत्येक बेटी के रक्त में प्रवाहित है।',
      tactics: 'लाठी-कौशल आत्मरक्षा, मानसिक सुदृढ़ता तथा डिजिटल व प्रशासनिक नेतृत्व का अनुपम समन्वय।',
      legacy: '४०० से अधिक विद्यालयों में ५०,००० से अधिक बेटियों का एक सशक्त, स्वाभिमानी और सुरक्षित समाज।',
      citation: 'शक्ति सभा धरातलीय प्रभाव अंकेक्षण रिपोर्ट २०२४–२०२६; जिला परिषद शिक्षा प्रतिवेदन।'
    },
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    accentColor: '#E8C98A'
  }
]

export default function HistoryPage() {
  const [lang, setLang] = useState<Lang>('en')
  const [activeDossier, setActiveDossier] = useState<Milestone | null>(null)
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('gargi')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [tracerPos, setTracerPos] = useState<{ x: number; y: number }>({ x: 80, y: 520 })

  const trackRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  // Ascending curve coordinates (viewBox 0 0 1000 600)
  // Starts at lower-left (80, 520) and smoothly ascends to upper-right (940, 60)
  const pathD = 'M 80 520 C 220 480, 360 410, 500 320 C 640 230, 780 140, 940 60'
  const fillAreaD = 'M 80 520 C 220 480, 360 410, 500 320 C 640 230, 780 140, 940 60 L 940 560 L 80 560 Z'

  // Update scroll progress & ascending graph apex tracker
  useEffect(() => {
    const handleScroll = () => {
      const track = trackRef.current
      if (!track) return

      const rect = track.getBoundingClientRect()
      const scrollableDistance = rect.height - window.innerHeight
      if (scrollableDistance <= 0) return

      const currentScroll = -rect.top
      const progress = Math.max(0, Math.min(1, currentScroll / scrollableDistance))
      setScrollProgress(progress)

      // Calculate exact (x, y) coordinates of the ascending apex point
      const pathEl = pathRef.current
      if (pathEl) {
        try {
          const totalLen = pathEl.getTotalLength()
          const currentLen = totalLen * Math.max(0.01, progress)
          const pt = pathEl.getPointAtLength(currentLen)
          setTracerPos({ x: pt.x, y: pt.y })
        } catch {
          // Fallback if SVG not yet rendered
        }
      }

      // Determine the currently active milestone
      let currentActive = TIMELINE_MILESTONES[0]
      for (const m of TIMELINE_MILESTONES) {
        if (progress >= m.threshold - 0.08) {
          currentActive = m
        }
      }
      setActiveMilestoneId(currentActive.id)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Jump to a specific epoch along the pinned scroll track
  const jumpToEpoch = useCallback((milestone: Milestone) => {
    const track = trackRef.current
    if (!track) return

    const trackTop = window.scrollY + track.getBoundingClientRect().top
    const scrollableDistance = track.getBoundingClientRect().height - window.innerHeight
    const targetScrollY = trackTop + scrollableDistance * milestone.threshold

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    })
    setActiveMilestoneId(milestone.id)
  }, [])

  const currentMilestone = useMemo(() => {
    return TIMELINE_MILESTONES.find(m => m.id === activeMilestoneId) || TIMELINE_MILESTONES[0]
  }, [activeMilestoneId])

  return (
    <div className={h.pinnedTrack} ref={trackRef}>
      {/* ── THE PINNED / FIXED VIEWPORT (SCREEN REMAINS STILL WHILE SCROLLING) ── */}
      <div className={h.viewportPinned}>
        {/* Background Radial Ambiance */}
        <div className={h.bgGlowAura} />
        <div className={h.bgGlowGold} />

        {/* ── Top Header Navigation Bar ───────────────────────────────── */}
        <header className={h.topNav}>
          <div className={h.navLeft}>
            <Link to="/" className={h.backHomeLink}>
              <span>←</span>
              <span>{lang === 'en' ? 'Back to Home' : 'मुख्य पृष्ठ पर लौटें'}</span>
            </Link>
            <span className={h.brandPill}>
              {lang === 'en' ? 'Civilizational Itihaas' : 'सभ्यतागत इतिहास'}
            </span>
          </div>

          <div className={h.navCenter}>
            <h1 className={h.pageHeaderTitle}>
              <span>{lang === 'en' ? 'The Ascending Arc of ' : 'भारतीय नारी का '}</span>
              <span className={h.pageHeaderHighlight}>
                {lang === 'en' ? 'Shakti' : 'ऐतिहासिक उत्कर्ष'}
              </span>
            </h1>
            <div className={h.scrollGuideHint}>
              <Compass size={13} />
              <span>
                {lang === 'en'
                  ? 'Scroll to ascend graph · Images float up & down'
                  : 'स्क्रॉल करें: ग्राफ ऊपर चढ़ेगा व चित्र गतिशील होंगे'}
              </span>
            </div>
          </div>

          {/* Strict Bilingual Translator: Zero Hinglish Mixing */}
          <div className={h.langSwitcher}>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`${h.langBtn} ${lang === 'en' ? h.langBtnActive : ''}`}
              aria-label="Switch to Pure English"
            >
              <span>🇬🇧</span> English
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`${h.langBtn} ${lang === 'hi' ? h.langBtnActive : ''}`}
              aria-label="शुद्ध हिन्दी में बदलें"
            >
              <span>🇮🇳</span> हिन्दी
            </button>
          </div>
        </header>

        {/* ── Central Main Ascending Graph Arena ─────────────────────── */}
        <main className={h.graphArena}>
          <div className={h.graphStage}>
            {/* Vector Ascending Graph Canvas */}
            <svg
              viewBox="0 0 1000 600"
              className={h.svgChart}
              preserveAspectRatio="none"
            >
              <defs>
                {/* Ascending Fire Gradient */}
                <linearGradient id="curveGradientAscent" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#DC143C" stopOpacity="0.5" />
                  <stop offset="45%" stopColor="#DC143C" stopOpacity="0.95" />
                  <stop offset="80%" stopColor="#F59E0B" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                </linearGradient>

                {/* Shimmer Fill Under Curve */}
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(220, 20, 60, 0.25)" />
                  <stop offset="70%" stopColor="rgba(201, 169, 110, 0.08)" />
                  <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                </linearGradient>

                {/* Luminous Glow Filter */}
                <filter id="flameGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Coordinate Grid Lines */}
              <line x1="70" y1="120" x2="950" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="5" />
              <line x1="70" y1="230" x2="950" y2="230" stroke="rgba(255,255,255,0.06)" strokeDasharray="5" />
              <line x1="70" y1="340" x2="950" y2="340" stroke="rgba(255,255,255,0.06)" strokeDasharray="5" />
              <line x1="70" y1="450" x2="950" y2="450" stroke="rgba(255,255,255,0.06)" strokeDasharray="5" />

              {/* Vertical Time Markers */}
              <line x1="100" y1="80" x2="100" y2="540" stroke="rgba(255,255,255,0.04)" />
              <line x1="340" y1="80" x2="340" y2="540" stroke="rgba(255,255,255,0.04)" />
              <line x1="600" y1="80" x2="600" y2="540" stroke="rgba(255,255,255,0.04)" />
              <line x1="850" y1="80" x2="850" y2="540" stroke="rgba(255,255,255,0.04)" />

              {/* Axis Headings */}
              <text x="80" y="60" fill="#E8C98A" fontSize="13" fontFamily="Cinzel, serif" fontWeight="700">
                {lang === 'en' ? '▲ Sovereign Impact & Awakening' : '▲ संप्रभुता एवं नेतृत्व प्रभाव'}
              </text>
              <text x="760" y="580" fill="rgba(255,255,255,0.5)" fontSize="12" fontFamily="Outfit, sans-serif">
                {lang === 'en' ? 'Timeline (Centuries) ►' : 'कालक्रम (शताब्दी) ►'}
              </text>

              {/* Ghost Silhouette Path */}
              <path
                d={pathD}
                fill="none"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Active Rising Fill Under Ascending Curve */}
              <path
                d={fillAreaD}
                fill="url(#areaGradient)"
                opacity={Math.min(1, scrollProgress * 1.4)}
              />

              {/* THE ASCENDING LINE GRAPH (Grows upward with scroll) */}
              <path
                ref={pathRef}
                d={pathD}
                fill="none"
                stroke="url(#curveGradientAscent)"
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#flameGlow)"
                strokeDasharray="1400"
                strokeDashoffset={Math.max(0, 1400 * (1 - scrollProgress))}
              />

              {/* Real-time Ascending Apex Tracer Flame Orb */}
              <circle
                cx={tracerPos.x}
                cy={tracerPos.y}
                r="9"
                fill="#FFFFFF"
                filter="url(#flameGlow)"
              />
              <circle
                cx={tracerPos.x}
                cy={tracerPos.y}
                r="16"
                fill="none"
                stroke="#DC143C"
                strokeWidth="2.5"
                opacity="0.8"
              />
            </svg>

            {/* ── FLOATING MILESTONE IMAGES ALONG THE ASCENDING TRAJECTORY ── */}
            {TIMELINE_MILESTONES.map((item, idx) => {
              const isActive = activeMilestoneId === item.id
              const isReached = scrollProgress >= item.threshold - 0.08

              // Dynamic scroll-driven vertical bobbing wave:
              // As the user scrolls, images oscillate smoothly UP and DOWN!
              const floatWave = Math.sin(scrollProgress * Math.PI * 6 + idx * 1.6) * 22

              return (
                <div
                  key={item.id}
                  className={`${h.imageCardNode} ${
                    isActive ? h.imageCardNodeActive : isReached ? '' : h.imageCardNodeDim
                  }`}
                  style={{
                    left: `${item.posX}%`,
                    top: `${item.posY}%`,
                    transform: `translate(-50%, -50%) translateY(${floatWave}px)`
                  }}
                  onClick={() => {
                    setActiveMilestoneId(item.id)
                    setActiveDossier(item)
                  }}
                  title={
                    lang === 'en'
                      ? `Click to inspect dossier: ${item.nameEn}`
                      : `${item.nameHi} का ऐतिहासिक अभिलेख देखने के लिए क्लिक करें`
                  }
                >
                  <div
                    className={`${h.avatarWrap} ${isActive ? h.avatarWrapActive : ''}`}
                    style={{
                      borderColor: isActive ? '#DC143C' : item.accentColor
                    }}
                  >
                    <img
                      src={item.image}
                      alt={lang === 'en' ? item.nameEn : item.nameHi}
                      loading="lazy"
                    />
                  </div>

                  <div className={h.cardLabelPill}>
                    <span className={h.cardYearText}>
                      {item.yearNumeric < 0
                        ? `${Math.abs(item.yearNumeric)} BCE`
                        : `${item.yearNumeric} CE`}
                    </span>
                    <span>{lang === 'en' ? item.nameEn : item.nameHi}</span>
                  </div>

                  {isActive && (
                    <div className={h.clickToInspectPill}>
                      {lang === 'en' ? 'Click to inspect archive 🔍' : 'अभिलेख देखें 🔍'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </main>

        {/* ── BOTTOM DOCK HUD & SPOTLIGHT BAR ───────────────────────── */}
        <footer className={h.bottomHUD}>
          {/* Quick Epoch Jump Pills Row */}
          <div className={h.epochJumpsRow}>
            {TIMELINE_MILESTONES.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`${h.epochJumpBtn} ${activeMilestoneId === m.id ? h.epochJumpBtnActive : ''}`}
                onClick={() => jumpToEpoch(m)}
                title={lang === 'en' ? m.nameEn : m.nameHi}
              >
                <span>{m.yearNumeric < 0 ? `${Math.abs(m.yearNumeric)} BCE` : `${m.yearNumeric}`}</span>
                <span>·</span>
                <span>{lang === 'en' ? m.nameEn.split(' ')[0] : m.nameHi.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Active Milestone Spotlight Strip */}
          <div className={h.spotlightBar}>
            <div className={h.spotlightIdentity}>
              <div
                className={h.spotlightSmallThumb}
                onClick={() => setActiveDossier(currentMilestone)}
              >
                <img
                  src={currentMilestone.image}
                  alt={lang === 'en' ? currentMilestone.nameEn : currentMilestone.nameHi}
                />
              </div>

              <div className={h.spotlightDetails}>
                <span className={h.spotlightEpochTag}>
                  {lang === 'en' ? currentMilestone.epochEn : currentMilestone.epochHi}
                </span>
                <span className={h.spotlightNameText}>
                  {lang === 'en' ? currentMilestone.nameEn : currentMilestone.nameHi}
                </span>
                <span className={h.spotlightQuoteText}>
                  "{lang === 'en' ? currentMilestone.quoteEn : currentMilestone.quoteHi}"
                </span>
              </div>
            </div>

            <div className={h.spotlightActions}>
              <div className={h.ascentMetric}>
                <span>{lang === 'en' ? 'Ascent Progress' : 'उत्कर्ष प्रगति'}</span>
                <span className={h.ascentMetricValue}>
                  {Math.round(scrollProgress * 100)}%
                </span>
              </div>

              <button
                type="button"
                className={h.openDossierBtn}
                onClick={() => setActiveDossier(currentMilestone)}
              >
                <BookOpen size={15} />
                <span>
                  {lang === 'en'
                    ? 'Inspect Archival Dossier'
                    : 'प्रामाणिक अभिलेख देखें'}
                </span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* ── LIGHTBOX MODAL FOR FULL HISTORICAL ARCHIVAL DOSSIER ─────── */}
      {activeDossier && (
        <div
          className={h.modalBackdrop}
          onClick={() => setActiveDossier(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className={h.modalSheet} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={h.modalCloseBtn}
              onClick={() => setActiveDossier(null)}
              aria-label={lang === 'en' ? 'Close dossier' : 'अभिलेख बंद करें'}
            >
              <X size={18} />
            </button>

            <div className={h.modalHeroBanner}>
              <img
                src={activeDossier.image}
                alt={lang === 'en' ? activeDossier.nameEn : activeDossier.nameHi}
              />
            </div>

            <div className={h.modalBadgeRow}>
              {lang === 'en' ? 'Verified Archival Dossier' : 'प्रमाणित पुरातात्विक अभिलेख'}
            </div>

            <h2 className={h.modalPersonTitle}>
              {lang === 'en' ? activeDossier.nameEn : activeDossier.nameHi}
            </h2>

            <div className={h.modalEraYears}>
              {lang === 'en' ? activeDossier.yearsEn : activeDossier.yearsHi}
            </div>

            <div className={h.modalQuoteCallout}>
              "{lang === 'en' ? activeDossier.quoteEn : activeDossier.quoteHi}"
            </div>

            <div className={h.modalBodyStack}>
              <div>
                <span className={h.modalSectionHeading}>
                  {lang === 'en' ? '1. Historical Context & Epoch:' : '१. ऐतिहासिक संदर्भ एवं कालखंड:'}
                </span>
                <p>
                  {lang === 'en'
                    ? activeDossier.dossierEn.context
                    : activeDossier.dossierHi.context}
                </p>
              </div>

              <div>
                <span className={h.modalSectionHeading}>
                  {lang === 'en'
                    ? '2. Martial & Strategic Innovation:'
                    : '२. सामरिक नवाचार एवं नेतृत्व:'}
                </span>
                <p>
                  {lang === 'en'
                    ? activeDossier.dossierEn.tactics
                    : activeDossier.dossierHi.tactics}
                </p>
              </div>

              <div>
                <span className={h.modalSectionHeading}>
                  {lang === 'en'
                    ? '3. Civilizational Legacy & Sovereign Precedent:'
                    : '३. सभ्यतागत धरोहर एवं संप्रभुता:'}
                </span>
                <p>
                  {lang === 'en'
                    ? activeDossier.dossierEn.legacy
                    : activeDossier.dossierHi.legacy}
                </p>
              </div>

              <div className={h.modalCitationBox}>
                <span className={h.modalCitationLabel}>
                  {lang === 'en'
                    ? 'Verified Epigraphical Citation:'
                    : 'प्रमाणित पुरालेखीय संदर्भ:'}
                </span>
                <span className={h.modalCitationText}>
                  {lang === 'en'
                    ? activeDossier.dossierEn.citation
                    : activeDossier.dossierHi.citation}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
