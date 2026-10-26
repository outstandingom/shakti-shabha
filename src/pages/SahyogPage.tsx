import { useState } from 'react'
import { Link } from 'react-router-dom'
import s from './PageLayout.module.css'
import sh from './SahyogPage.module.css'

export default function SahyogPage() {
  const [partnerType, setPartnerType] = useState<'CORPORATE' | 'NGO' | 'STUDENT'>('CORPORATE')
  const [formSubmitted, setFormSubmitted] = useState(false)

  return (
    <main className={s.page}>
      {/* Hero Banner */}
      <div className={sh.hero}>
        <div className={sh.heroInner}>
          <Link to="/" className={sh.backLink}>← Back to Home</Link>
          <span className={sh.badge}>SRS Section 10 · Collaboration Ecosystem</span>
          <h1 className={sh.title}>Sahyog</h1>
          <p className={sh.hindiSubtitle}>सहयोग — Together We Rise</p>
          <p className={sh.desc}>
            Shakti Sabha stands with forward-thinking enterprises, grassroots NGOs, and committed student changemakers
            who believe in one foundational truth — that every woman deserves physical safety, mental dignity, and social opportunity.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={s.statsGrid}>
        <div className={s.statBox}>
          <div className={s.statCount} style={{ color: '#3D5A45' }}>45+</div>
          <div className={s.statLabel}>CSR & Corporate Allies</div>
        </div>
        <div className={s.statBox}>
          <div className={s.statCount} style={{ color: '#3D5A45' }}>30+</div>
          <div className={s.statLabel}>NGO Network Alliances</div>
        </div>
        <div className={s.statBox}>
          <div className={s.statCount} style={{ color: '#3D5A45' }}>500+</div>
          <div className={s.statLabel}>Active Student Volunteers</div>
        </div>
        <div className={s.statBox}>
          <div className={s.statCount} style={{ color: '#3D5A45' }}>12 Yrs</div>
          <div className={s.statLabel}>Audited On-Ground Impact</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={s.section}>

        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: '#3D5A45', fontWeight: 700, textTransform: 'uppercase' }}>
            Tri-Partite Collaboration
          </span>
          <h2 className={s.sectionTitle} style={{ marginTop: '0.35rem', display: 'inline-block' }}>
            Who We Partner With
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#6B7280', lineHeight: 1.7, marginTop: '0.5rem' }}>
            We design structured frameworks for corporations fulfilling CSR mandates, grassroots non-profits seeking specialized self-defense modules, and university students building community credits.
          </p>
        </div>

        {/* 3 Columns */}
        <div className={sh.columnsGrid}>
          
          {/* Corporate Column */}
          <div className={sh.pillarCol}>
            <div className={sh.colTopStrip} style={{ background: '#DC143C' }} />
            <div className={sh.colHeader}>
              <div className={sh.colIcon}>🏢</div>
              <div className={sh.colTarget}>For Enterprises & Agencies</div>
              <h3 className={sh.colTitle}>Corporates & CSR</h3>
            </div>
            <div className={sh.colBody}>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#DC143C' }} />
                <div><strong>Fund Village Camps:</strong> Directly sponsor 3-day, 5-day, or 7-day Aaryaveera self-defense camps for rural schools.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#DC143C' }} />
                <div><strong>Employee Volunteering:</strong> On-ground or digital pro-bono contribution tracks for corporate staff teams.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#DC143C' }} />
                <div><strong>CSR Compliance Reports:</strong> Rigorous third-party audited impact metrics, participant surveys, and video summaries.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#DC143C' }} />
                <div><strong>Corporate Women's Safety:</strong> Tailored executive situational awareness workshops for internal employees.</div>
              </div>
            </div>
            <div className={sh.colFooter}>
              <a href="#partner-form" onClick={() => setPartnerType('CORPORATE')} className={sh.actionBtn} style={{ background: '#DC143C', color: '#FFFFFF' }}>
                Start Corporate Partnership →
              </a>
            </div>
          </div>

          {/* NGO Column */}
          <div className={sh.pillarCol}>
            <div className={sh.colTopStrip} style={{ background: '#3D5A45' }} />
            <div className={sh.colHeader}>
              <div className={sh.colIcon}>🌱</div>
              <div className={sh.colTarget}>For Grassroots Organizations</div>
              <h3 className={sh.colTitle}>NGO Network</h3>
            </div>
            <div className={sh.colBody}>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#3D5A45' }} />
                <div><strong>Directory Listing:</strong> Verified inclusion in Shakti Sabha's regional intervention network.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#3D5A45' }} />
                <div><strong>Shared Resource Pool:</strong> Access training toolkits, legal documentation, and counselor databases.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#3D5A45' }} />
                <div><strong>Joint Event Delivery:</strong> Co-host district symposiums, medical camps, and self-reliance workshops.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#3D5A45' }} />
                <div><strong>Grant Consortiums:</strong> Collaborative funding applications for expansive multi-district social projects.</div>
              </div>
            </div>
            <div className={sh.colFooter}>
              <a href="#partner-form" onClick={() => setPartnerType('NGO')} className={sh.actionBtn} style={{ background: '#3D5A45', color: '#FFFFFF' }}>
                Join NGO Network →
              </a>
            </div>
          </div>

          {/* Student Column */}
          <div className={sh.pillarCol}>
            <div className={sh.colTopStrip} style={{ background: '#C9A96E' }} />
            <div className={sh.colHeader}>
              <div className={sh.colIcon}>🎓</div>
              <div className={sh.colTarget}>For College Youth & Scholars</div>
              <h3 className={sh.colTitle}>Students & Interns</h3>
            </div>
            <div className={sh.colBody}>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#C9A96E' }} />
                <div><strong>Curated Internships:</strong> 6-week or 3-month research, digital media, field documentation, or legal tracks.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#C9A96E' }} />
                <div><strong>Official Credits:</strong> Formal letter of recommendation and university-recognized social service hours.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#C9A96E' }} />
                <div><strong>Dharmic Mentorship:</strong> Direct guidance from senior social workers, advocates, and martial artists.</div>
              </div>
              <div className={sh.featureItem}>
                <div className={sh.featureDot} style={{ background: '#C9A96E' }} />
                <div><strong>Grassroots Field Experience:</strong> Live on-camp coordination, participant interviews, and report writing.</div>
              </div>
            </div>
            <div className={sh.colFooter}>
              <a href="#partner-form" onClick={() => setPartnerType('STUDENT')} className={sh.actionBtn} style={{ background: '#C9A96E', color: '#111827' }}>
                Apply for Internship →
              </a>
            </div>
          </div>

        </div>

        {/* How Sahyog Works */}
        <div className={sh.howItWorks}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#3D5A45', fontWeight: 700, textTransform: 'uppercase' }}>
              Simple Onboarding Flow
            </span>
            <h2 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', fontSize: '1.75rem', color: '#111827', marginTop: '0.35rem' }}>
              How the Ecosystem Works
            </h2>
          </div>

          <div className={sh.stepsGrid}>
            <div className={sh.stepBox}>
              <div className={sh.stepNum}>01</div>
              <h4 className={sh.stepTitle}>Submit Proposal or Profile</h4>
              <p className={sh.stepDesc}>Fill out the specialized interest form indicating whether you are a corporate sponsor, NGO peer, or student intern.</p>
            </div>
            <div className={sh.stepBox}>
              <div className={sh.stepNum}>02</div>
              <h4 className={sh.stepTitle}>Due Diligence & Alignment</h4>
              <p className={sh.stepDesc}>Our partnerships committee reviews credentials within 3 business days to align goals, dates, and geographic targets.</p>
            </div>
            <div className={sh.stepBox}>
              <div className={sh.stepNum}>03</div>
              <h4 className={sh.stepTitle}>Deployment & Impact Logging</h4>
              <p className={sh.stepDesc}>Execute the camp, research paper, or campaign with live tracking, participant feedback, and official certification.</p>
            </div>
          </div>
        </div>

        {/* Interactive Partnership Form */}
        <div id="partner-form" className={sh.formSection}>
          <div className={sh.formGrid}>
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: '#3D5A45', fontWeight: 700, textTransform: 'uppercase' }}>
                Connect Directly
              </span>
              <h2 className={sh.formInfoTitle}>
                Join Hands with Shakti Sabha
              </h2>
              <p className={sh.formInfoText}>
                Whether you wish to sponsor 10 village camps, collaborate on legal research, or spend your semester in the field — we welcome dedicated allies.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #E5E7EB', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                  <span>📧</span> <strong>partnerships@shaktisabha.org</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                  <span>📍</span> Vidarbha & Pune Operations Central
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#374151' }}>
                  <span>⚖</span> Audited NGO Registration · 80G Compliant Pipeline
                </div>
              </div>
            </div>

            <div>
              {formSubmitted ? (
                <div style={{ padding: '2.5rem', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                  <h3 style={{ fontFamily: 'var(--font-display, "Cinzel", serif)', color: '#065F46', marginBottom: '0.5rem' }}>Proposal Received!</h3>
                  <p style={{ fontSize: '0.9rem', color: '#047857' }}>
                    Thank you for stepping forward. Our partnership director will get in touch with you shortly.
                  </p>
                  <button onClick={() => setFormSubmitted(false)} style={{ marginTop: '1.5rem', padding: '0.5rem 1.5rem', background: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '9999px', fontSize: '0.8rem', cursor: 'pointer' }}>
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setFormSubmitted(true) }} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>I am reaching out as a:</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {(['CORPORATE', 'NGO', 'STUDENT'] as const).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setPartnerType(type)}
                          style={{
                            flex: 1,
                            padding: '0.6rem 0.5rem',
                            borderRadius: '8px',
                            border: `1px solid ${partnerType === type ? '#3D5A45' : '#D1D5DB'}`,
                            background: partnerType === type ? '#3D5A45' : '#F9FAFB',
                            color: partnerType === type ? '#FFFFFF' : '#4B5563',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          {type === 'CORPORATE' ? 'Corporate' : type === 'NGO' ? 'NGO' : 'Student'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Full Name / Representative</label>
                    <input required type="text" placeholder="e.g. Radhika Deshmukh" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Organization / College / Company Name</label>
                    <input required type="text" placeholder="e.g. Tata Trusts / St. Xavier's College" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Email Address</label>
                      <input required type="email" placeholder="contact@org.com" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Phone Number</label>
                      <input required type="tel" placeholder="+91 98765 43210" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>How can we collaborate?</label>
                    <textarea rows={3} placeholder="Tell us about your proposed project, sponsorship scope, or internship interests..." style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', resize: 'vertical' }}></textarea>
                  </div>

                  <button type="submit" style={{ padding: '0.85rem', background: '#3D5A45', color: '#FFFFFF', border: 'none', borderRadius: '9999px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', transition: 'background 0.2s' }}>
                    Send Sahyog Proposal →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
