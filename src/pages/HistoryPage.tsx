import { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { X, ArrowRight, BookOpen } from 'lucide-react'
import s from './PageLayout.module.css'
import h from './HistoryPage.module.css'

gsap.registerPlugin(ScrollTrigger)

type Lang = 'en' | 'hi'

interface Milestone {
  id: string
  yearNumeric: number
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

const TIMELINE_DATA: Milestone[] = [
  {
    id: 'gargi',
    yearNumeric: -800,
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
    epochEn: 'Medieval Kakatiya Era (1262–1289 CE)',
    epochHi: 'मध्यकालीन काकतीय युग (१२६२–१२८९ ईस्वी)',
    nameEn: 'Rani Rudrama Devi',
    nameHi: 'रानी रुद्रमा देवी',
    yearsEn: '13th Century · Orugallu (Warangal)',
    yearsHi: '१३वीं शताब्दी · ओरुगल्लु (वारंगल)',
    quoteEn: 'The sovereignty of this soil is defended not by birthright alone, but by the sword in hand.',
    quoteHi: 'इस मातृभूमि की संप्रभुता केवल कुल से नहीं, अपितु रणक्षेत्र में खड्ग की धार से रक्षित होती है।',
    descEn: 'Monarch of the Kakatiya dynasty who commanded armies in male warrior attire, revolutionized concentric fort defenses, and protected Deccan trade routes.',
    descHi: 'काकतीय राजवंश की पराक्रमी शासिका जिन्होंने वीर वेश में सेना का नेतृत्व किया, अभेद्य दुर्ग निर्माण कराया और दक्कन की रक्षा की।',
    dossierEn: {
      context: 'Venetian traveler Marco Polo marveled at her enlightened administration, justice, and military valor upon visiting the Kakatiya kingdom.',
      tactics: 'Pioneered circular concentric stone fortifications and deep moat architecture at Warangal, resisting multiple Yadava and Chola invasions.',
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
      context: 'Known to colonial chroniclers as Abhaya Rani (The Fearless Queen). She allied with the Zamorin of Kozhikode to enforce naval blockades against Portuguese forts.',
      tactics: 'Nocturnal fire-arrow littoral raids that incinerated Portuguese galleons anchored off Mangalore harbor.',
      legacy: 'Celebrated as India’s first anti-colonial naval commander, predating 1857 by three centuries.',
      citation: 'Goa Historical Archives, Monçoes do Reino Series; Queen Abbakka Memorial Historical Trust Records.'
    },
    dossierHi: {
      context: 'पुर्तगाली दस्तावेजों में उन्हें "अभया रानी" की उपाधि दी गई थी। उन्होंने कालीकट के ज़ामोरिन के साथ मिलकर विदेशी सेना की घेराबंदी की।',
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
      context: 'Refused imperial tribute demands. When Asaf Khan invaded with massive artillery, she mounted her war elephant Sarman and led the vanguard personally.',
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
      context: 'After Chhatrapati Sambhaji Maharaj was executed, Rajaram was fleeing to Jinji. Chennamma provided royal protection despite imminent Mughal invasion threat.',
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
      context: 'After losing her newborn child due to lack of medical care, she resolved to become a physician, addressing public assemblies in Serampore to defend her mission.',
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
  const [activeEpochIndex, setActiveEpochIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  const sectionRef = useRef<HTMLDivElement>(null)
  const graphPathRef = useRef<SVGPathElement>(null)

  // Ascending curve points normalized to 0-100 coordinates
  // (x from 10 to 90, y ascends from bottom 88 up to top 15)
  const pathD = 'M 15 85 C 30 80, 45 70, 55 52 C 65 38, 75 24, 88 15'

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const totalH = rect.height - window.innerHeight
      if (totalH <= 0) return

      const currentScroll = -rect.top
      const progress = Math.max(0, Math.min(1, currentScroll / totalH))
      setScrollProgress(progress)

      const activeIdx = Math.min(
        TIMELINE_DATA.length - 1,
        Math.floor(progress * TIMELINE_DATA.length)
      )
      setActiveEpochIndex(activeIdx)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate current indicator position on SVG curve
  const currentCoord = useMemo(() => {
    const p = scrollProgress
    // Approximate curve position based on cubic bezier
    const x = 15 + p * 73
    const y = 85 - Math.pow(p, 0.85) * 70
    return { x, y }
  }, [scrollProgress])

  const scrollToMilestone = (id: string) => {
    const el = document.getElementById(`milestone-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const currentMilestone = TIMELINE_DATA[activeEpochIndex]

  return (
    <main className={h.page}>
      {/* ── Top Header Banner with Translator Switcher ── */}
      <div className={h.banner}>
        <div className={h.bannerInner}>
          <div className={h.bannerTopBar}>
            <Link to="/" className={s.back} style={{ margin: 0 }}>
              {lang === 'en' ? '← Back to Home' : '← मुख्य पृष्ठ पर लौटें'}
            </Link>

            {/* Language Translator Toggle — Strictly Unmixed */}
            <div className={h.langSwitcher}>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`${h.langBtn} ${lang === 'en' ? h.langBtnActive : ''}`}
                aria-label="Switch to English"
              >
                <span>🇬🇧</span> English
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`${h.langBtn} ${lang === 'hi' ? h.langBtnActive : ''}`}
                aria-label="हिन्दी में बदलें"
              >
                <span>🇮🇳</span> हिन्दी
              </button>
            </div>
          </div>

          <span className={h.bannerEyebrow}>
            {lang === 'en'
              ? 'Chronological Archival Trajectory · 800 BCE – 2026 CE'
              : 'कालक्रमानुसार ऐतिहासिक संप्रभुता · ८०० ईसा पूर्व – २०२६'}
          </span>

          <h1 className={h.bannerTitle}>
            {lang === 'en' ? 'The Ascending Arc of Itihaas' : 'इतिहास की वीरांगनाएँ एवं उत्कर्ष'}
          </h1>

          <p className={h.bannerDesc}>
            {lang === 'en'
              ? 'Witness the continuous, unbroken ascent of India’s sovereign warrior women. As you scroll, trace centuries of martial valor, philosophical brilliance, and sovereign dignity.'
              : 'देखिए भारतीय नारी के शौर्य, स्वाभिमान और बौद्धिक नेतृत्व की अनवरत यात्रा। जैसे-जैसे आप आगे बढ़ेंगे, कालचक्र का यह वक्र ऊपर उठता जाएगा।'}
          </p>
        </div>
      </div>

      {/* ── Wisdom Banner ─────────────────────────────── */}
      <div className={h.wisdomBox}>
        <div className={h.wisdomInner}>
          <div className={h.wisdomTag}>
            <span>✦</span> {lang === 'en' ? 'Shakti Sutra of the Day' : 'आज का शक्ति सूत्र'} <span>✦</span>
          </div>
          <blockquote className={h.wisdomQuote}>
            {lang === 'en'
              ? '“Woman is the primal foundation of creation; she is the sovereign power upon which the entire cosmos rests. To deem her weak is to deem one’s own civilizational foundation weak.”'
              : '“स्त्री ही सृष्टि का आधार है, वह शक्ति है जिस पर संपूर्ण संसार टिका है। उसे दुर्बल समझना अपनी ही नींव को दुर्बल समझना है।”'}
          </blockquote>
          <p className={h.wisdomSource}>
            {lang === 'en' ? '— Shakta Mahimna Stotra' : '— शाक्त महिम्न स्तोत्र'}
          </p>
        </div>
      </div>

      {/* ── Main Section with Sticky Ascending Graph ───── */}
      <section className={h.timelineSection} ref={sectionRef}>
        <div className={h.layoutGrid}>

          {/* Sticky Left Graph Panel */}
          <div className={h.stickySide}>
            <div className={h.sideHeader}>
              <span className={h.sideTitle}>
                {lang === 'en' ? 'Ascending Graph' : 'उत्कर्ष वक्र आलेख'}
              </span>
              <div className={h.sideLive}>
                <span className={h.liveDot} />
                <span>{lang === 'en' ? 'Live Track' : 'सक्रिय ट्रैकिंग'}</span>
              </div>
            </div>

            {/* Dynamic SVG Ascending Graph */}
            <div className={h.svgChartBox}>
              <svg viewBox="0 0 100 100" className={h.chartSvg}>
                <defs>
                  <linearGradient id="chartGlow" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#DC143C" stopOpacity="0.4" />
                    <stop offset="60%" stopColor="#DC143C" stopOpacity="1" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="1" />
                  </linearGradient>
                  <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Grid Lines */}
                <line x1="10" y1="20" x2="90" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="2" />
                <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.06)" strokeDasharray="2" />
                <line x1="10" y1="80" x2="90" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="2" />
                <line x1="10" y1="10" x2="10" y2="90" stroke="rgba(255,255,255,0.1)" />
                <line x1="10" y1="90" x2="90" y2="90" stroke="rgba(255,255,255,0.1)" />

                {/* Axis Labels */}
                <text x="12" y="16" fill="#9CA3AF" fontSize="3.8" fontFamily="sans-serif">
                  {lang === 'en' ? '▲ Sovereign Impact' : '▲ संप्रभुता प्रभाव'}
                </text>
                <text x="64" y="96" fill="#9CA3AF" fontSize="3.8" fontFamily="sans-serif">
                  {lang === 'en' ? 'Time (Centuries) ►' : 'कालक्रम (शताब्दी) ►'}
                </text>

                {/* Base Path Ghost */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Ascending Luminous Active Line */}
                <path
                  ref={graphPathRef}
                  d={pathD}
                  fill="none"
                  stroke="url(#chartGlow)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeDasharray="150"
                  strokeDashoffset={150 * (1 - scrollProgress)}
                />

                {/* Dynamic Travelling Node Point */}
                <circle
                  cx={currentCoord.x}
                  cy={currentCoord.y}
                  r="4.5"
                  fill="#FFFFFF"
                  stroke="#DC143C"
                  strokeWidth="2"
                  filter="url(#nodeGlow)"
                />
              </svg>
            </div>

            {/* Current Metrics Box */}
            <div className={h.metricsRow}>
              <div className={h.metricTile}>
                <div className={h.metricVal}>
                  {currentMilestone.yearNumeric < 0
                    ? `${Math.abs(currentMilestone.yearNumeric)} BCE`
                    : `${currentMilestone.yearNumeric} CE`}
                </div>
                <div className={h.metricLbl}>
                  {lang === 'en' ? 'Active Era' : 'वर्तमान काल'}
                </div>
              </div>
              <div className={h.metricTile}>
                <div className={h.metricVal} style={{ color: '#F59E0B' }}>
                  {Math.round(scrollProgress * 100)}%
                </div>
                <div className={h.metricLbl}>
                  {lang === 'en' ? 'Timeline Ascent' : 'उत्कर्ष प्रगति'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '0.85rem', fontSize: '0.78rem', color: '#E8C98A', fontWeight: 600 }}>
              {lang === 'en' ? currentMilestone.epochEn : currentMilestone.epochHi}
            </div>

            {/* Quick Epoch Navigation List */}
            <div className={h.epochNav}>
              {TIMELINE_DATA.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => scrollToMilestone(item.id)}
                  className={`${h.epochNavBtn} ${activeEpochIndex === idx ? h.epochNavBtnActive : ''}`}
                >
                  <span>{lang === 'en' ? item.nameEn : item.nameHi}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                    {item.yearNumeric < 0 ? `${Math.abs(item.yearNumeric)} BCE` : item.yearNumeric}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Timeline Stream */}
          <div className={h.timelineStream}>
            {TIMELINE_DATA.map((item) => (
              <div key={item.id} id={`milestone-${item.id}`} className={h.timelineCard}>
                <div className={h.cardImgWrap}>
                  <img src={item.image} alt={lang === 'en' ? item.nameEn : item.nameHi} loading="lazy" />
                  <div className={h.cardEraBadge}>
                    {lang === 'en' ? item.epochEn : item.epochHi}
                  </div>
                </div>

                <div className={h.cardBody}>
                  <div>
                    <div className={h.cardYear}>
                      {lang === 'en' ? item.yearsEn : item.yearsHi}
                    </div>
                    <h3 className={h.cardName}>
                      {lang === 'en' ? item.nameEn : item.nameHi}
                    </h3>
                    <p className={h.cardMotto}>
                      "{lang === 'en' ? item.quoteEn : item.quoteHi}"
                    </p>
                    <p className={h.cardDesc}>
                      {lang === 'en' ? item.descEn : item.descHi}
                    </p>
                  </div>

                  <div className={h.cardActions}>
                    <button
                      className={h.inspectBtn}
                      onClick={() => setActiveDossier(item)}
                    >
                      <BookOpen size={14} />
                      {lang === 'en' ? 'Inspect Historical Record' : 'ऐतिहासिक दस्तावेज देखें'}
                    </button>
                    <button
                      className={h.citationLink}
                      onClick={() => setActiveDossier(item)}
                    >
                      {lang === 'en' ? 'View Primary Citations →' : 'मूल पुरातात्विक संदर्भ →'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Archival Dossier Modal Lightbox ──────────── */}
      {activeDossier && (
        <div className={h.modalOverlay} onClick={() => setActiveDossier(null)}>
          <div className={h.modalContent} onClick={e => e.stopPropagation()}>
            <button
              className={h.modalClose}
              onClick={() => setActiveDossier(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div style={{ fontSize: '0.72rem', color: '#DC143C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.25rem' }}>
              {lang === 'en' ? 'Verified Archival Dossier' : 'प्रमाणित पुरातात्विक अभिलेख'}
            </div>

            <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.65rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
              {lang === 'en' ? activeDossier.nameEn : activeDossier.nameHi}
            </h2>

            <div style={{ fontSize: '0.82rem', color: '#C9A96E', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              {lang === 'en' ? activeDossier.yearsEn : activeDossier.yearsHi}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75 }}>
              <div>
                <strong style={{ color: '#E8C98A', display: 'block', marginBottom: '0.25rem' }}>
                  {lang === 'en' ? '1. Historical Context & Epoch:' : '१. ऐतिहासिक संदर्भ एवं कालखंड:'}
                </strong>
                <p>
                  {lang === 'en' ? activeDossier.dossierEn.context : activeDossier.dossierHi.context}
                </p>
              </div>

              <div>
                <strong style={{ color: '#E8C98A', display: 'block', marginBottom: '0.25rem' }}>
                  {lang === 'en' ? '2. Martial & Strategic Innovation:' : '२. सामरिक नवाचार एवं नेतृत्व:'}
                </strong>
                <p>
                  {lang === 'en' ? activeDossier.dossierEn.tactics : activeDossier.dossierHi.tactics}
                </p>
              </div>

              <div>
                <strong style={{ color: '#E8C98A', display: 'block', marginBottom: '0.25rem' }}>
                  {lang === 'en' ? '3. Civilizational Legacy:' : '३. सभ्यतागत धरोहर:'}
                </strong>
                <p>
                  {lang === 'en' ? activeDossier.dossierEn.legacy : activeDossier.dossierHi.legacy}
                </p>
              </div>

              <div style={{ background: 'rgba(220, 20, 60, 0.1)', border: '1px solid rgba(220, 20, 60, 0.3)', borderRadius: '10px', padding: '1rem', marginTop: '0.5rem' }}>
                <strong style={{ color: '#FFB3BA', fontSize: '0.8rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  {lang === 'en' ? 'Verified Epigraphical Citation:' : 'प्रमाणित पुरालेखीय संदर्भ:'}
                </strong>
                <span style={{ fontSize: '0.82rem', color: '#E5E7EB' }}>
                  {lang === 'en' ? activeDossier.dossierEn.citation : activeDossier.dossierHi.citation}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
