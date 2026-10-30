import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './ImpactPage.module.css'

/* ------------------------------------------------------------------ */
/* Types & Data Model                                                  */
/* ------------------------------------------------------------------ */

interface ArchiveRecord {
  id: string
  title: string
  vertical: 'vertical-1' | 'vertical-2' | 'vertical-3' | 'vertical-4'
  institutionalTag: string
  scale: string
  theme: string
  keyPoints: string[]
  region: 'Maharashtra' | 'Madhya Pradesh' | 'Rajasthan'
  cluster: string
  format?: string
}

const ARCHIVE_RECORDS: ArchiveRecord[] = [
  /* ==============================================================
     VERTICAL 1: High-Stakes Public Symposia & Policy Forums
     ============================================================== */
  {
    id: 'symp-1',
    title: 'CIDCO Exhibition Centre, Navi Mumbai | International Plenary',
    vertical: 'vertical-1',
    institutionalTag: 'PLENARY SYMPOSIUM | CIVILIZATIONAL FEMINISM & STRATEGY',
    scale: '5,000+ Delegates, Scholars & Professionals',
    theme: 'Critical Analysis of Feminism: Decoupling Western Paradigms from Indigenous Civilizational Sovereignty',
    keyPoints: [
      'Comparative evaluation of colonial & Western feminist discourse versus Indian civilizational female sovereignty (Streetva-Sovereignty).',
      'Public safety systems and grassroots women leadership (Shared dais with Surekha Yadav, India\'s first female train driver, alongside prominent civic leaders).',
      'Strategic framework for de-escalation, legal awareness, and civilizational guardianship without ideological dependency.'
    ],
    region: 'Maharashtra',
    cluster: 'Vidarbha & Western Maharashtra',
    format: 'On-Ground Plenary Forum'
  },
  {
    id: 'symp-2',
    title: 'Lata Mangeshkar Auditorium, Mumbai | Youth Leadership Conclave',
    vertical: 'vertical-1',
    institutionalTag: 'ACADEMIC CONCLAVE | YOUTH RESILIENCE',
    scale: '1,000+ Attendees (Including 200+ IIT Bombay Students & Researchers)',
    theme: 'Consciousness, Rationality & Civilizational Responsibility in Contemporary Science & Technology',
    keyPoints: [
      'The critical role of internal character architecture and moral resolve amidst accelerating technological progress.',
      'Indian philosophy, Nyaya jurisprudence, and fostering intellectual sovereignty against digital cognitive fragmentation.',
      'Structured dialogue with engineering scholars on reconciling high-stakes technical research with Dharmic civilizational ethics.'
    ],
    region: 'Maharashtra',
    cluster: 'Vidarbha & Western Maharashtra',
    format: 'Academic Conclave'
  },
  {
    id: 'symp-3',
    title: 'National Youth Ignite Forum | Plenary Hall',
    vertical: 'vertical-1',
    institutionalTag: 'POLICY & LEGAL DISCOURSE | ETHICAL JURISPRUDENCE',
    scale: '1,000+ Attendees',
    theme: 'Intimate Partner Coercion, Consent Ethics & Structural Reforms in Marital Protection',
    keyPoints: [
      'Empirical examination of the critical gap between grassroots realities, intimate partner coercion, and statutory safety statutes.',
      'Harmonizing statutory legal awareness, psychological somatic anchoring, and traditional social dignity.',
      'Practical guidance for young women and families navigating multi-layered socio-legal crises.'
    ],
    region: 'Maharashtra',
    cluster: 'Vidarbha & Western Maharashtra',
    format: 'Policy & Legal Forum'
  },
  {
    id: 'symp-4',
    title: 'Ratlam State Education Dialogue (शिक्षा संवाद)',
    vertical: 'vertical-1',
    institutionalTag: 'EDUCATIONAL POLICY DIALOGUE',
    scale: '2,000+ Academicians, Educators & Scholars',
    theme: 'Rethinking Pedagogy: Contextualizing National Education Policy within Indigenous Epistemology',
    keyPoints: [
      'Emancipation from colonial mental servility in primary and higher education pedagogy.',
      'Integrating classical Indian knowledge systems (Bharatiya Gyan Parampara) into modern school curricula.',
      'Pedagogical frameworks for cultivating critical inquiry and intellectual fearlessness among students.'
    ],
    region: 'Madhya Pradesh',
    cluster: 'Malwa & Western Belt',
    format: 'State Pedagogical Summit'
  },
  {
    id: 'symp-5',
    title: 'Ajmer Philosophical Symposium',
    vertical: 'vertical-1',
    institutionalTag: 'PHILOSOPHICAL COLLOQUIUM',
    scale: '2,000+ Scholars & Youth',
    theme: 'Deconstructing Patriarchy & Sovereignty: The Equilibrium of \'Streetva\' and \'Paurush\' in Sanatan Thought',
    keyPoints: [
      'Deconstructing Western patriarchal critiques through the equilibrium of complementary spiritual energies.',
      'Reclaiming Paurush as protective responsibility, ethical courage, and self-restraint rather than aggressive domination.',
      'Grounding civilizational consciousness in Vedic primary textual analysis.'
    ],
    region: 'Rajasthan',
    cluster: 'Malwa & Western Belt',
    format: 'Philosophical Colloquium'
  },

  /* ==============================================================
     VERTICAL 2: Mission Mardini Frontline Camps (Tactical & Somatic)
     ============================================================== */
  {
    id: 'camp-1',
    title: 'Betul Welfare Residential Hostels (8-Hostel Cluster Deployment)',
    vertical: 'vertical-2',
    institutionalTag: 'VULNERABILITY INTERVENTION | MISSION MARDINI',
    scale: '1,000+ Marginalized & Rural Adolescent Girls',
    theme: 'Intensive 7-Day Residential Somatic Defense & Biomechanical Combat Bootcamps',
    keyPoints: [
      'Hostels covered: Netaji Subhash, Kamla Nehru, Manas Nagar, Govt Girls ITI, and KGBV clusters.',
      'Somatic Grounding: Overcoming neurological panic, regulating autonomic freeze responses, and asserting boundary voice projection.',
      'Empty-Hand Defense: High-impact biomechanical karate strikes, chin/throat releases, and close-quarter escapes.',
      'Lathi-Kaushal: Traditional Indian bamboo staff combat to maintain protective perimeter spacing.'
    ],
    region: 'Madhya Pradesh',
    cluster: 'Central MP / Satpura Basin',
    format: '7-Day Residential Immersion'
  },
  {
    id: 'camp-2',
    title: 'Vidarbha Tactical Resilience Circuit (Akola, Hivarkhed, Belkhed)',
    vertical: 'vertical-2',
    institutionalTag: 'REGIONAL RESILIENCE DEPLOYMENT',
    scale: '800+ Trained Cadets across 7 Distinct 7-Day Camps',
    theme: 'Grassroots Community Martial Conditioning & Street-Safety Defense',
    keyPoints: [
      'Executed in formal partnership with regional educational and philanthropic trusts across the Vidarbha agricultural corridor.',
      'Standardized 35+ hour tactical training per cadet in weaponless combat, situational danger reflexes, and evasive footwork.',
      'Measurable Outcome: Self-sustaining village safety cohorts led by trained senior female student coordinators.'
    ],
    region: 'Maharashtra',
    cluster: 'Vidarbha & Western Maharashtra',
    format: 'Multi-Camp Regional Circuit'
  },
  {
    id: 'camp-3',
    title: 'Higher Education Tactical Deployments (JH College & Govt Girls College)',
    vertical: 'vertical-2',
    institutionalTag: 'CAMPUS SAFETY INITIATIVE',
    scale: '250+ Under-Graduate & Post-Graduate Women',
    theme: 'Advanced Staff Defense (Lathi-Kaushal) & Perimeter Defense Workshop',
    keyPoints: [
      '3-Day advanced staff defense clinic covering dual-direction thrusts, angular deflections, and disarm counters.',
      'De-escalation tactics for public transport hubs, campus entry gates, and isolated study corridors.',
      'Legal rights literacy covering Indian statutory provisions on private defense (Sections 96-106 IPC / Bharatiya Nyaya Sanhita).'
    ],
    region: 'Madhya Pradesh',
    cluster: 'Central MP / Satpura Basin',
    format: 'Campus Tactical Clinic'
  },

  /* ==============================================================
     VERTICAL 3: Academic & Institutional Engagements
     ============================================================== */
  {
    id: 'acad-1',
    title: 'Pathrot Inter-School Mega Conclave | Maharashtra',
    vertical: 'vertical-3',
    institutionalTag: 'INTER-INSTITUTIONAL ASSEMBLY | YOUTH SOVEREIGNTY',
    scale: '2,000+ Students representing 20+ Regional Educational Institutions',
    theme: 'Rashtra Ke Karndhar: Youth Sovereignty, Digital Hygiene & National Consciousness',
    keyPoints: [
      'Mobilized student delegations from 20+ secondary and higher-secondary institutions in the district.',
      'Interactive modules on liberating young minds from algorithm-induced dopamine dependency and short-form media addiction.',
      'Character architecture: Inculcating fearless independent judgment, scientific temper, and civilizational pride.'
    ],
    region: 'Maharashtra',
    cluster: 'Vidarbha & Western Maharashtra',
    format: 'Regional Academic Conclave'
  },
  {
    id: 'acad-2',
    title: 'Sahadev Rao Bhopale Vidyalaya & St. Paul High School Deployments',
    vertical: 'vertical-3',
    institutionalTag: 'INSTITUTIONAL COGNITIVE ARCHITECTURE',
    scale: '700+ Students across Urban & Semi-Urban Classrooms',
    theme: 'Cognitive Architecture: The Mechanics of Focus, Deep Concentration & Emotional Self-Regulation',
    keyPoints: [
      'Classroom interventions providing adolescent students with neurological concentration drills and emotional grounding.',
      'Anti-bullying behavioral biomechanics: Confident somatic posture, voice projection, and peer de-escalation protocols.',
      'Educator debriefs on creating emotionally secure and intellectually challenging learning environments.'
    ],
    region: 'Maharashtra',
    cluster: 'Vidarbha & Western Maharashtra',
    format: 'Multi-School Series'
  },

  /* ==============================================================
     VERTICAL 4: Grassroots Community & Civilizational Assemblies
     ============================================================== */
  {
    id: 'comm-1',
    title: 'Cultural Guilds Assemblies on Family Systems & Consciousness',
    vertical: 'vertical-4',
    institutionalTag: 'COMMUNITY STABILIZATION & FAMILY DIALOGUES',
    scale: '1,200+ Citizens (Cross-Community Assemblies: Maratha, Gujarati, Kirad & Rajput Civic Forums)',
    theme: 'Preserving Family Cohesion, Intergenerational Respect & Historical Lineage of Indian Women Warriors',
    keyPoints: [
      'Reframed from raw caste-based assemblies into structured civic forums focusing on traditional family bonds under modern psychological strains.',
      'Mitigating generational fractures, promoting compassionate intergenerational dialogue, and addressing youth isolation.',
      'Historical and strategic discourse on legendary unheralded female rulers: Rani Chennamma, Punyashlok Ahilyabai Holkar, Maharani Tarabai.'
    ],
    region: 'Maharashtra',
    cluster: 'Vidarbha & Western Maharashtra',
    format: 'Civic Guilds Assembly'
  },
  {
    id: 'comm-2',
    title: 'Public Civic Assemblies on Civilizational Gender Philosophy',
    vertical: 'vertical-4',
    institutionalTag: 'CIVILIZATIONAL DISCOURSE & ETHICAL RESPONSIBILITY',
    scale: '10,000+ Cumulative Attendees across 10+ Distinct Municipal Gatherings',
    theme: 'The Equilibrium of Streetva and Paurush: Transforming Power into Ethical Responsibility',
    keyPoints: [
      'Reframed from generic public gatherings into deep philosophical dialogues on Dharma, duty, and mutual respect.',
      'Directly addressing social evils: Substance abuse, intimate coercion, emotional numbness, and manufactured community divides.',
      'Mobilizing community elder councils and youth federations for proactive neighborhood safeguarding.'
    ],
    region: 'Madhya Pradesh',
    cluster: 'Central MP / Satpura Basin',
    format: 'Civic Plenary Series'
  }
]

export default function ImpactPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'vertical-1' | 'vertical-2' | 'vertical-3' | 'vertical-4'>('all')
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  useEffect(() => {
    document.title = 'Documented Impact & Archive | Shakti Sabha'
  }, [])

  const filteredRecords = useMemo(() => {
    return ARCHIVE_RECORDS.filter(rec => {
      const matchTab = activeTab === 'all' || rec.vertical === activeTab
      const matchRegion = regionFilter === 'all' || rec.region === regionFilter
      const q = searchQuery.toLowerCase().trim()
      const matchSearch = !q ||
        rec.title.toLowerCase().includes(q) ||
        rec.theme.toLowerCase().includes(q) ||
        rec.scale.toLowerCase().includes(q) ||
        rec.cluster.toLowerCase().includes(q)
      return matchTab && matchRegion && matchSearch
    })
  }, [activeTab, regionFilter, searchQuery])

  return (
    <div className={s.page}>
      {/* ── TOP HERO BANNER ───────────────────────────────────────── */}
      <section className={s.hero}>
        <div className={s.container}>
          <span className={s.heroEyebrow}>
            <GoogleIcon name="verified" size={15} />
            Institutional Audit &amp; Footprint
          </span>
          <h1 className={s.heroTitle}>
            Verified Impact &amp; <span className={s.heroTitleHighlight}>Archive Taxonomy</span>
          </h1>
          <p className={s.heroDesc}>
            A rigorous, multi-tiered framework documenting tactical somatic training, academic youth awakening,
            and civilizational policy discourse across central and western India.
          </p>
        </div>
      </section>

      <div className={s.container} style={{ marginTop: '3rem' }}>

        {/* ── VERIFIED IMPACT DOCUMENTATION NOTE ─────────────────────── */}
        <div className={s.verifiedBanner}>
          <GoogleIcon name="shield" size={24} style={{ color: '#C9A96E', flexShrink: 0, marginTop: 2 }} />
          <div>
            <p>
              <strong>Documentation Note:</strong> High-scale symposia and documented field camps are published with
              verified venues, institutional dates, and co-convening academic bodies. In accordance with statutory
              confidentiality and child protection mandates, somatic camps conducted in juvenile facilities, KGBVs,
              and social welfare hostels withhold the private identities of vulnerable minors.
            </p>
          </div>
        </div>

        {/* ── 1. HIGH-LEVEL IMPACT GRID (4 TOP CARDS) ────────────────── */}
        <div className={s.metricsGrid}>
          <div className={s.metricCard} style={{ '--card-accent': '#DC143C' } as React.CSSProperties}>
            <div className={s.metricVal}>2,800+</div>
            <div className={s.metricLabel}>Direct Somatic &amp; Tactical Cadets</div>
            <p className={s.metricDesc}>
              7–10 day residential and intensive self-defense, Lathi-Kaushal, and biomechanics bootcamps. Fully certified
              girls across welfare hostels, colleges, and rural community camps.
            </p>
          </div>

          <div className={s.metricCard} style={{ '--card-accent': '#3D5A45' } as React.CSSProperties}>
            <div className={s.metricVal}>25,000+</div>
            <div className={s.metricLabel}>Youth via Institutional Forums</div>
            <p className={s.metricDesc}>
              Direct in-person beneficiaries across schools, colleges, universities, and student hostels participating in
              character architecture, cognitive focus, and intellectual sovereignty sessions.
            </p>
          </div>

          <div className={s.metricCard} style={{ '--card-accent': '#C9A96E' } as React.CSSProperties}>
            <div className={s.metricVal}>50,000+</div>
            <div className={s.metricLabel}>Policy &amp; Discourse Attendees</div>
            <p className={s.metricDesc}>
              Citizens and scholars engaged across high-profile national plenaries (CIDCO, Lata Mangeshkar Auditorium,
              Ratlam State Education Dialogue, Arya Mahasammelan) and civic assemblies.
            </p>
          </div>

          <div className={s.metricCard} style={{ '--card-accent': '#4F46E5' } as React.CSSProperties}>
            <div className={s.metricVal}>50+ Cases</div>
            <div className={s.metricLabel}>Crisis Mediations &amp; Safeguarding</div>
            <p className={s.metricDesc}>
              Frontline safeguarding interventions: human trafficking interception, Child Welfare Committee (CWC) coordination,
              transit-point crisis extraction, and pre-FIR family reconciliations.
            </p>
          </div>
        </div>

        {/* ── 2. THE 3-DEPTH ENGAGEMENT FRAMEWORK ───────────────────── */}
        <section className={s.frameworkSection}>
          <div className={s.sectionHeader}>
            <span className={s.sectionEyebrow}>Engagement Depth Taxonomy</span>
            <h2 className={s.sectionTitle}>The 3-Depth Impact Framework</h2>
            <p className={s.sectionSubtitle}>
              To guarantee institutional clarity for international evaluators and CSR auditors, Shakti Sabha classifies
              all engagements across three distinct depths of intervention.
            </p>
          </div>

          <div className={s.depthGrid}>
            {/* Level 1 */}
            <div className={s.depthCard} style={{ '--depth-color': '#DC143C' } as React.CSSProperties}>
              <span className={s.depthLevel}>Level 1: Tactical Immersion</span>
              <h3 className={s.depthTitle}>Somatic &amp; Physical Transformation</h3>
              <div className={s.depthMetaRow}>
                <span className={s.depthMetaLabel}>Total Cadets:</span>
                <span className={s.depthMetaVal}>2,800+ Certified</span>
              </div>
              <div className={s.depthMetaRow}>
                <span className={s.depthMetaLabel}>Time Commitment:</span>
                <span className={s.depthMetaVal}>25 to 45 Hours / Cadet</span>
              </div>
              <ul className={s.depthList}>
                <li><strong>1,000+ KGBV &amp; Welfare Hostel Girls:</strong> 8-Hostel Betul residential cluster.</li>
                <li><strong>800+ Vidarbha Circuit Cadets:</strong> Akola, Hivarkhed, and Belkhed 7-day camps.</li>
                <li><strong>350+ Higher Education Students:</strong> JH College and Govt Women's ITI.</li>
                <li><strong>650+ Community Cohorts:</strong> Specialized village and civic guild workshops.</li>
              </ul>
            </div>

            {/* Level 2 */}
            <div className={s.depthCard} style={{ '--depth-color': '#3D5A45' } as React.CSSProperties}>
              <span className={s.depthLevel}>Level 2: Cognitive Dialogues</span>
              <h3 className={s.depthTitle}>Institutional Youth Awakening</h3>
              <div className={s.depthMetaRow}>
                <span className={s.depthMetaLabel}>Academic Beneficiaries:</span>
                <span className={s.depthMetaVal}>25,000+ Students</span>
              </div>
              <div className={s.depthMetaRow}>
                <span className={s.depthMetaLabel}>Format Duration:</span>
                <span className={s.depthMetaVal}>2 to 4 Hour Interactive Intensives</span>
              </div>
              <ul className={s.depthList}>
                <li><strong>80+ Secondary &amp; Higher Schools:</strong> Pathrot, Hivarkhed, Akola, and tribal corridors.</li>
                <li><strong>Collegiate &amp; Technical Scholars:</strong> Direct dialogues with IIT Bombay student delegations.</li>
                <li><strong>Core Curricula:</strong> Concentration mechanics, digital detoxification, and fearless critical thinking.</li>
                <li><strong>Statutory Literacy:</strong> Legal safety boundaries and anti-coercion protocols.</li>
              </ul>
            </div>

            {/* Level 3 */}
            <div className={s.depthCard} style={{ '--depth-color': '#C9A96E' } as React.CSSProperties}>
              <span className={s.depthLevel}>Level 3: Civilizational Discourse</span>
              <h3 className={s.depthTitle}>Public Plenary &amp; Civic Assemblies</h3>
              <div className={s.depthMetaRow}>
                <span className={s.depthMetaLabel}>Total Stakeholders:</span>
                <span className={s.depthMetaVal}>50,000+ Participants</span>
              </div>
              <div className={s.depthMetaRow}>
                <span className={s.depthMetaLabel}>Format Scale:</span>
                <span className={s.depthMetaVal}>1,000 to 5,000+ Keynote Stages</span>
              </div>
              <ul className={s.depthList}>
                <li><strong>CIDCO Exhibition Centre, Navi Mumbai:</strong> 5,000+ scholars on Indigenous Civilizational Sovereignty.</li>
                <li><strong>Ratlam State Education Dialogue:</strong> 2,000+ educators contextualizing NEP in Indian epistemology.</li>
                <li><strong>Ajmer Philosophical Colloquium:</strong> 2,000+ youth examining the Sanatan balance of Streetva and Paurush.</li>
                <li><strong>Civic Assemblies:</strong> Multi-thousand community dialogues on family cohesion.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── 3. GEOGRAPHIC REGIONAL CLUSTERS ───────────────────────── */}
        <div className={s.sectionHeader}>
          <span className={s.sectionEyebrow}>Regional Footprint Summary</span>
          <h2 className={s.sectionTitle}>Strategic Deployment Corridors</h2>
          <p className={s.sectionSubtitle}>
            Field deployments are structured into three geographic regional clusters to maximize logistical sustainability
            and post-training community support.
          </p>
        </div>

        <div className={s.clustersGrid}>
          {/* Cluster 1 */}
          <div className={s.clusterCard}>
            <span className={s.clusterBadge}>Cluster 01</span>
            <h3 className={s.clusterTitle}>Central MP &amp; Satpura Basin</h3>
            <div className={s.clusterRegion}>
              <GoogleIcon name="place" size={15} />
              Betul, Bhopal Highway Corridor, KGBV Hostels
            </div>
            <p className={s.clusterFocus}>
              <strong>Strategic Focus:</strong> Intensive 8-hostel residential Mission Mardini camps, transit highway crisis
              interceptions, and long-term socio-educational empowerment for tribal and rural adolescent girls.
            </p>
          </div>

          {/* Cluster 2 */}
          <div className={s.clusterCard}>
            <span className={s.clusterBadge}>Cluster 02</span>
            <h3 className={s.clusterTitle}>Vidarbha &amp; Western Maharashtra</h3>
            <div className={s.clusterRegion}>
              <GoogleIcon name="place" size={15} />
              Akola, Amravati, Hivarkhed, Navi Mumbai
            </div>
            <p className={s.clusterFocus}>
              <strong>Strategic Focus:</strong> Regional school conclaves (Pathrot 2,000+), civic guild partnerships,
              and high-level academic plenaries with IIT Bombay scholars and CIDCO international delegates.
            </p>
          </div>

          {/* Cluster 3 */}
          <div className={s.clusterCard}>
            <span className={s.clusterBadge}>Cluster 03</span>
            <h3 className={s.clusterTitle}>Malwa &amp; Western Belt</h3>
            <div className={s.clusterRegion}>
              <GoogleIcon name="place" size={15} />
              Ratlam, Ajmer Academic Circuit
            </div>
            <p className={s.clusterFocus}>
              <strong>Strategic Focus:</strong> State-level educational policy symposia (NEP 2020), decolonized pedagogy,
              and Vedic philosophical dialogues on civilizational gender balance.
            </p>
          </div>
        </div>

        {/* ── 4. ARCHIVE TAXONOMY (4 VERTICALS) ─────────────────────── */}
        <section className={s.taxonomySection}>
          <div className={s.sectionHeader}>
            <span className={s.sectionEyebrow}>Primary Event Taxonomy</span>
            <h2 className={s.sectionTitle}>Documented Deployments &amp; Archives</h2>
            <p className={s.sectionSubtitle}>
              Curated under four distinct intellectual verticals reflecting authentic verified venues and partners.
            </p>
          </div>

          {/* Tab Controls */}
          <div className={s.tabControls}>
            <button
              className={`${s.tabBtn} ${activeTab === 'all' ? s.tabBtnActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Records ({ARCHIVE_RECORDS.length})
            </button>
            <button
              className={`${s.tabBtn} ${activeTab === 'vertical-1' ? s.tabBtnActive : ''}`}
              onClick={() => setActiveTab('vertical-1')}
            >
              <GoogleIcon name="account_balance" size={16} />
              National Policy &amp; Symposia
            </button>
            <button
              className={`${s.tabBtn} ${activeTab === 'vertical-2' ? s.tabBtnActive : ''}`}
              onClick={() => setActiveTab('vertical-2')}
            >
              <GoogleIcon name="sports_kabaddi" size={16} />
              Tactical Combat Camps
            </button>
            <button
              className={`${s.tabBtn} ${activeTab === 'vertical-3' ? s.tabBtnActive : ''}`}
              onClick={() => setActiveTab('vertical-3')}
            >
              <GoogleIcon name="school" size={16} />
              Academic Deployments
            </button>
            <button
              className={`${s.tabBtn} ${activeTab === 'vertical-4' ? s.tabBtnActive : ''}`}
              onClick={() => setActiveTab('vertical-4')}
            >
              <GoogleIcon name="diversity_3" size={16} />
              Community &amp; Civic Guilds
            </button>
          </div>

          {/* Search & State Filter Bar */}
          <div className={s.filterBar}>
            <div className={s.searchBox}>
              <GoogleIcon name="search" size={18} className={s.searchIcon} />
              <input
                type="text"
                placeholder="Search venue, scale, theme, or topic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={s.searchInput}
              />
            </div>
            <select
              value={regionFilter}
              onChange={e => setRegionFilter(e.target.value)}
              className={s.regionSelect}
            >
              <option value="all">All States &amp; Regions</option>
              <option value="Maharashtra">Maharashtra (Vidarbha / Mumbai)</option>
              <option value="Madhya Pradesh">Madhya Pradesh (Betul / Malwa)</option>
              <option value="Rajasthan">Rajasthan (Ajmer Circuit)</option>
            </select>
          </div>

          {/* Records List */}
          <div className={s.cardsList}>
            {filteredRecords.map(rec => (
              <div key={rec.id} className={s.archiveCard}>
                <div className={s.cardTopRow}>
                  <span className={s.cardTag}>
                    <GoogleIcon name="verified_user" size={14} />
                    {rec.institutionalTag}
                  </span>
                  <span className={s.cardScale}>{rec.scale}</span>
                </div>
                <h3 className={s.cardTitle}>{rec.title}</h3>
                <p className={s.cardTheme}><strong>Theme:</strong> {rec.theme}</p>
                <ul className={s.cardBullets}>
                  {rec.keyPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
                <div className={s.cardFooterMeta}>
                  <span><strong>Region:</strong> {rec.region} ({rec.cluster})</span>
                  {rec.format && <span><strong>Format:</strong> {rec.format}</span>}
                  <span><strong>Verification:</strong> Institutional Dossier Confirmed</span>
                </div>
              </div>
            ))}

            {filteredRecords.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#6B7280' }}>
                <GoogleIcon name="search_off" size={44} style={{ display: 'block', margin: '0 auto 0.5rem', opacity: 0.4 }} />
                <p>No archive records found matching the active filters.</p>
              </div>
            )}
          </div>

          {/* Structured Table: Academic Deployments Summary */}
          {(activeTab === 'all' || activeTab === 'vertical-3') && (
            <div style={{ marginTop: '3.5rem' }}>
              <div className={s.sectionHeader}>
                <span className={s.sectionEyebrow}>Consolidated Synthesis</span>
                <h3 className={s.sectionTitle} style={{ fontSize: '1.4rem' }}>
                  Academic &amp; Institutional Deployments Summary
                </h3>
                <p className={s.sectionSubtitle}>
                  Institutional clusters representing schools, collegiate institutes, and welfare hostels.
                </p>
              </div>

              <div className={s.tableWrap}>
                <table className={s.academicTable}>
                  <thead>
                    <tr>
                      <th>Cluster / Institutional Category</th>
                      <th>Aggregate Reach</th>
                      <th>Core Modules Delivered</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Secondary &amp; Higher Secondary Schools</strong><br />
                        <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Moharidevi Khandelwal, Excellence School, Raja Bhoj, etc.</span>
                      </td>
                      <td><strong style={{ color: '#C9A96E' }}>3,500+ Students</strong></td>
                      <td>Cognitive Concentration, Character Architecture, Anti-Bullying Biomechanics, Voice Assertion</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Collegiate &amp; Professional Institutions</strong><br />
                        <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>JH College, Govt Women's ITI, Regional Degree Colleges</span>
                      </td>
                      <td><strong style={{ color: '#C9A96E' }}>1,800+ Students</strong></td>
                      <td>Legal Rights Literacy, Counter-Coercion Protocols, Advanced Staff &amp; Empty-Hand Combat</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Transit &amp; Residential Welfare Hostels</strong><br />
                        <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>KGBVs, Tribal Hostels, Social Welfare Facilities</span>
                      </td>
                      <td><strong style={{ color: '#C9A96E' }}>1,200+ Inmates</strong></td>
                      <td>Situational Threat Preparedness, Somatic Grounding, Peer-Safety Shielding Frameworks</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* ── METHODOLOGICAL & AUDIT INTEGRITY DISCLAIMER ───────────── */}
        <div className={s.disclaimerBox}>
          <div className={s.disclaimerTitle}>
            <GoogleIcon name="gavel" size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Methodological Note on Data Compilation &amp; Audit Integrity
          </div>
          <p className={s.disclaimerText}>
            "Shakti Sabha enforces a strict anti-inflation policy across its impact metrics. We intentionally separate
            long-format, immersive biomechanical defense cohorts (Level 1) from institutional academic seminars (Level 2)
            and large-scale public symposia (Level 3). To prevent double-counting across overlapping academic clusters,
            figures represent verified minimum participant baselines rather than speculative attendance."
          </p>
        </div>

      </div>
    </div>
  )
}
