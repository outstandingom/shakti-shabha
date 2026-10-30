import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, Article, GalleryCategory, GalleryPhoto, Course, CounsellingRequest, Testimonial } from '../lib/supabase'
import { DEFAULT_TESTIMONIALS } from '../components/Testimonials/testimonialsData'
import { getFounderData, saveFounderData, FounderProfileData, DEFAULT_FOUNDER_DATA } from '../data/founderData'
import { useAuth } from '../lib/AuthContext'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './AdminDashboard.module.css'
import { compressImage } from '../lib/imageCompressor'


interface LoaderProps {
  title?: string
  status?: string
  percent?: number
  filename?: string
}

function ShaktiLoader({ title, status, percent, filename }: LoaderProps) {
  return (
    <div className={s.loader} data-lenis-prevent="true">
      <div className={s.loaderContent}>
        <div className={s.loaderInner}>
          <div className={s.loaderLineWrap}>
            <div className={s.loaderLine} />
          </div>
          <div className={s.loaderLineWrap}>
            <div className={s.loaderLine} />
          </div>
          <div className={s.loaderLineWrap}>
            <div className={s.loaderLine} />
          </div>
          <div className={s.loaderLineWrap}>
            <div className={s.loaderLine} />
          </div>
          <div className={s.loaderLineWrap}>
            <div className={s.loaderLine} />
          </div>
        </div>

        {title && <h3 className={s.loaderTitle}>{title}</h3>}
        {status && <div className={s.loaderStatus}>{status}</div>}

        {typeof percent === 'number' && (
          <div className={s.loaderProgressBar}>
            <div className={s.loaderProgressFill} style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
          </div>
        )}

        {filename && (
          <div className={s.loaderFilename}>
            <GoogleIcon name="photo_camera" size={14} style={{ color: '#DC143C' }} />
            <span>{filename}</span>
          </div>
        )}
      </div>
    </div>
  )
}

type Section = 'overview' | 'founder' | 'articles' | 'gallery' | 'courses' | 'testimonials' | 'counselling' | 'events'

export default function AdminDashboard() {
  const { user, adminProfile, signOut, isAdmin, isLoading } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState<Section>('overview')

  useEffect(() => {
    if (!isLoading && !user) navigate('/login')
  }, [isLoading, user, navigate])

  if (isLoading) return (
    <ShaktiLoader
      title="Initializing Shakti Sabha CMS"
      status="Verifying administrative access & credentials..."
    />
  )
  if (!user) return null

  const navItems: { key: Section; icon: string; label: string }[] = [
    { key: 'overview',    icon: 'analytics', label: 'Overview' },
    { key: 'founder',     icon: 'person', label: 'Founder & Info' },
    { key: 'articles',   icon: 'article', label: 'Articles' },
    { key: 'gallery',    icon: 'photo_library', label: 'Gallery' },
    { key: 'courses',    icon: 'school', label: 'Courses' },
    { key: 'testimonials', icon: 'format_quote', label: 'Testimonials' },
    { key: 'counselling',icon: 'forum', label: 'Counselling' },
    { key: 'events',       icon: 'event', label: 'Events & Calendar' },
  ]

  const sectionTitles: Record<Section, string> = {
    overview: 'Dashboard Overview',
    founder: 'Founder Dossier & Core Philosophy CMS',
    articles: 'Article Management',
    gallery: 'Gallery Management',
    courses: 'Course Management',
    testimonials: 'Testimonial Management',
    counselling: 'Counselling Requests',
    events: 'Events & Calendar Management',
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className={s.shell}>
      {/* ── Sidebar ── */}
      <aside className={s.sidebar}>
        <Link to="/" className={s.sidebarLogo}>
          <div className={s.logoIcon}>
            <GoogleIcon name="shield" size={24} style={{ color: '#DC143C' }} />
          </div>
          <div>
            <span className={s.logoText}>Shakti Sabha</span>
            <span className={s.logoSub}>Admin CMS</span>
          </div>
        </Link>

        <div className={s.navSection}>
          <div className={s.navLabel}>Content</div>
          {navItems.map(item => (
            <button
              key={item.key}
              className={`${s.navItem} ${section === item.key ? s.navItemActive : ''}`}
              onClick={() => setSection(item.key)}
            >
              <span className={s.navIcon}>
                <GoogleIcon name={item.icon} size={18} />
              </span>
              {item.label}
            </button>
          ))}
        </div>

        <div className={s.navSection}>
          <div className={s.navLabel}>Website</div>
          <a className={s.navItem} href="/" target="_blank" rel="noopener noreferrer">
            <span className={s.navIcon}>
              <GoogleIcon name="language" size={18} />
            </span>
            View Website
          </a>
        </div>

        <div className={s.sidebarBottom}>
          <div className={s.userCard}>
            <div className={s.userAvatar}>
              {(adminProfile?.full_name || user.email || 'A')[0].toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <span className={s.userName}>{adminProfile?.full_name || user.email}</span>
              <span className={s.userRole}>{adminProfile?.role || 'editor'}</span>
            </div>
          </div>
          <button className={s.logoutBtn} onClick={handleLogout}>
            <GoogleIcon name="logout" size={16} style={{ marginRight: 6 }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={s.main}>
        <div className={s.topBar}>
          <span className={s.topBarTitle}>{sectionTitles[section]}</span>
          <span className={s.topBarBadge}>{adminProfile?.role || 'Editor'}</span>
        </div>

        <div className={s.content}>
          {section === 'overview'    && <OverviewSection />}
          {section === 'founder'     && <FounderSection />}
          {section === 'articles'   && <ArticlesSection />}
          {section === 'gallery'    && <GallerySection />}
          {section === 'courses'    && <CoursesSection />}
          {section === 'testimonials' && <TestimonialsSection />}
          {section === 'counselling'&& <CounsellingSection />}
          {section === 'events'    && <EventsSection />}
        </div>
      </main>
    </div>
  )
}

/* ============================================================
   OVERVIEW SECTION
   ============================================================ */
function OverviewSection() {
  const [counts, setCounts] = useState({ articles: 0, photos: 0, courses: 0, counselling: 0 })

  useEffect(() => {
    const load = async () => {
      const [a, p, c, r] = await Promise.all([
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('gallery_photos').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('counselling_requests').select('id', { count: 'exact', head: true }),
      ])
      setCounts({
        articles: a.count ?? 0,
        photos: p.count ?? 0,
        courses: c.count ?? 0,
        counselling: r.count ?? 0,
      })
    }
    load()
  }, [])

  return (
    <>
      <div className={s.statsGrid}>
        <div className={s.statCard}>
          <div className={s.statValue}>{counts.articles}</div>
          <div className={s.statLabel}>Total Articles</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statValue}>{counts.photos}</div>
          <div className={s.statLabel}>Gallery Photos</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statValue}>{counts.courses}</div>
          <div className={s.statLabel}>Courses Published</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statValue}>{counts.counselling}</div>
          <div className={s.statLabel}>Counselling Requests</div>
        </div>
      </div>

      <div className={s.sectionHeader}>
        <span className={s.sectionTitle}>Quick Start Guide</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {[
          { icon: 'article', title: 'Write an Article', desc: 'Create bilingual content in Hindi & English with photos.', section: 'articles' },
          { icon: 'photo_library', title: 'Upload Photos', desc: 'Add gallery images organized by category.', section: 'gallery' },
          { icon: 'school', title: 'Create a Course', desc: 'Publish courses with pricing, syllabus & cover images.', section: 'courses' },
          { icon: 'forum', title: 'View Counselling Requests', desc: 'Review and respond to user counselling submissions.', section: 'counselling' },
        ].map(item => (
          <div key={item.title} style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.25rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <GoogleIcon name={item.icon} size={28} style={{ color: '#DC143C' }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#F3F4F6', marginBottom: '0.35rem' }}>{item.title}</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ============================================================
   ARTICLES SECTION
   ============================================================ */
function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Article | null>(null)
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)

  const defaultForm = {
    title_en: '', title_hi: '', content_en: '', content_hi: '',
    excerpt_en: '', excerpt_hi: '', cover_image_url: '', category: 'general',
    tags: '', author_name: '', published: false
  }
  const [form, setForm] = useState(defaultForm)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
    setArticles(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(defaultForm); setShowModal(true) }
  const openEdit = (a: Article) => {
    setEditing(a)
    setForm({
      title_en: a.title_en, title_hi: a.title_hi,
      content_en: a.content_en, content_hi: a.content_hi,
      excerpt_en: a.excerpt_en, excerpt_hi: a.excerpt_hi,
      cover_image_url: a.cover_image_url, category: a.category,
      tags: (a.tags || []).join(', '), author_name: a.author_name, published: a.published,
    })
    setShowModal(true)
  }

  const uploadImage = async (file: File) => {
    setUploading(true)
    try {
      const comp = await compressImage(file, { maxWidth: 1200, maxHeight: 800, quality: 0.8 })
      setForm(f => ({ ...f, cover_image_url: comp.dataUrl }))

      const ext = comp.file.name.split('.').pop()
      const path = `articles/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('media').upload(path, comp.file, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('media').getPublicUrl(path)
        if (data?.publicUrl) {
          setForm(f => ({ ...f, cover_image_url: data.publicUrl }))
        }
      }
    } catch (err: any) {
      console.warn('Article image compression/upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
    }
    let error
    if (editing) {
      ;({ error } = await supabase.from('articles').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id))
    } else {
      ;({ error } = await supabase.from('articles').insert([payload]))
    }
    if (error) { setAlert({ type: 'error', msg: error.message }) }
    else { setAlert({ type: 'success', msg: editing ? 'Article updated!' : 'Article created!' }); setShowModal(false); load() }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this article?')) return
    await supabase.from('articles').delete().eq('id', id)
    load()
  }

  const togglePublish = async (a: Article) => {
    await supabase.from('articles').update({ published: !a.published }).eq('id', a.id)
    load()
  }

  return (
    <>
      {uploading && (
        <ShaktiLoader
          title="Uploading Article Image"
          status="Optimizing and uploading media to storage..."
        />
      )}
      {alert && <div className={`${s.alert} ${alert.type === 'error' ? s.alertError : s.alertSuccess}`}>{alert.msg}</div>}
      <div className={s.sectionHeader}>
        <span className={s.sectionTitle}>All Articles ({articles.length})</span>
        <button className={s.btnPrimary} onClick={openNew}>+ New Article</button>
      </div>

      <div className={s.tableWrap}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
        ) : articles.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}>
              <GoogleIcon name="article" size={44} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
            <div className={s.emptyText}>No articles yet</div>
            <div className={s.emptyHint}>Click "New Article" to get started</div>
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr><th>Title (EN)</th><th>Title (HI)</th><th>Category</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id}>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title_en || '—'}</td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title_hi || '—'}</td>
                  <td><span className={`${s.badge} ${s.badgeGray}`}>{a.category}</span></td>
                  <td>
                    <span className={`${s.badge} ${a.published ? s.badgeGreen : s.badgeGray}`}>
                      {a.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(a.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button className={s.btnEdit} onClick={() => openEdit(a)}>Edit</button>
                      <button className={s.btnSecondary} style={{ fontSize: '0.75rem', padding: '0.35rem 0.7rem' }} onClick={() => togglePublish(a)}>
                        {a.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button className={s.btnDanger} onClick={() => del(a.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Article Modal */}
      {showModal && (
        <div className={s.overlay} data-lenis-prevent="true" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className={s.modal} data-lenis-prevent="true">
            <h2 className={s.modalTitle}>{editing ? 'Edit Article' : 'New Article'}</h2>
            <button className={s.modalClose} onClick={() => setShowModal(false)}><GoogleIcon name="close" size={18} /></button>

            <div className={s.tabs}>
              <LangTab />
            </div>

            <ArticleForm form={form} setForm={setForm} fileRef={fileRef} uploadImage={uploadImage} uploading={uploading} />

            <div className={s.modalActions}>
              <button className={s.btnSecondary} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={s.btnPrimary} onClick={save}><GoogleIcon name="save" size={16} /> Save Article</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function LangTab() {
  return null // tabs handled inside ArticleForm
}

function ArticleForm({ form, setForm, fileRef, uploadImage, uploading }: {
  form: any; setForm: any;
  fileRef: any;
  uploadImage: (f: File) => void;
  uploading: boolean;
}) {
  const [lang, setLang] = useState<'en' | 'hi'>('en')

  return (
    <>
      <div className={s.tabs}>
        <button className={`${s.tab} ${lang === 'en' ? s.tabActive : ''}`} onClick={() => setLang('en')}><GoogleIcon name="language" size={16} /> English</button>
        <button className={`${s.tab} ${lang === 'hi' ? s.tabActive : ''}`} onClick={() => setLang('hi')}><GoogleIcon name="translate" size={16} /> Hindi</button>
      </div>

      <div className={s.formGrid}>
        {lang === 'en' ? (
          <>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Title (English)</label>
              <input className={s.input} value={form.title_en} onChange={e => setForm((f: any) => ({ ...f, title_en: e.target.value }))} placeholder="Article title in English" />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Excerpt / Summary (English)</label>
              <textarea className={s.textarea} style={{ minHeight: 80 }} value={form.excerpt_en} onChange={e => setForm((f: any) => ({ ...f, excerpt_en: e.target.value }))} placeholder="Short description for article cards" />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Full Content (English)</label>
              <textarea className={s.textarea} value={form.content_en} onChange={e => setForm((f: any) => ({ ...f, content_en: e.target.value }))} placeholder="Full article content in English..." />
            </div>
          </>
        ) : (
          <>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>शीर्षक (Hindi Title)</label>
              <input className={s.input} value={form.title_hi} onChange={e => setForm((f: any) => ({ ...f, title_hi: e.target.value }))} placeholder="हिंदी में शीर्षक" style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>संक्षेप (Hindi Excerpt)</label>
              <textarea className={s.textarea} style={{ minHeight: 80, fontFamily: 'Noto Sans Devanagari, sans-serif' }} value={form.excerpt_hi} onChange={e => setForm((f: any) => ({ ...f, excerpt_hi: e.target.value }))} placeholder="संक्षिप्त विवरण..." />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>पूर्ण सामग्री (Hindi Content)</label>
              <textarea className={s.textarea} value={form.content_hi} onChange={e => setForm((f: any) => ({ ...f, content_hi: e.target.value }))} placeholder="हिंदी में पूर्ण लेख..." style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }} />
            </div>
          </>
        )}

        <div className={s.field}>
          <label className={s.label}>Category</label>
          <select className={s.select} value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))}>
            <option value="general">General</option>
            <option value="self-defense">Self Defense</option>
            <option value="empowerment">Empowerment</option>
            <option value="legal">Legal Rights</option>
            <option value="health">Health & Wellness</option>
            <option value="success-stories">Success Stories</option>
            <option value="research">Research</option>
          </select>
        </div>

        <div className={s.field}>
          <label className={s.label}>Author Name</label>
          <input className={s.input} value={form.author_name} onChange={e => setForm((f: any) => ({ ...f, author_name: e.target.value }))} placeholder="Author's name" />
        </div>

        <div className={`${s.field} ${s.formFull}`}>
          <label className={s.label}>Tags (comma separated)</label>
          <input className={s.input} value={form.tags} onChange={e => setForm((f: any) => ({ ...f, tags: e.target.value }))} placeholder="women, empowerment, self-defense" />
        </div>

        <div className={`${s.field} ${s.formFull}`}>
          <label className={s.label}>Cover Image</label>
          {form.cover_image_url && (
            <img src={form.cover_image_url} alt="Cover" style={{ height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => e.target.files?.[0] && uploadImage(e.target.files[0])}
          />
          <button className={s.btnSecondary} onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? 'Uploading...' : <><GoogleIcon name="upload_file" size={16} style={{ marginRight: 6 }} /> Upload Cover Image</>}
          </button>
        </div>

        <div className={s.field}>
          <label className={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.published} onChange={e => setForm((f: any) => ({ ...f, published: e.target.checked }))} />
            Publish immediately
          </label>
        </div>
      </div>
    </>
  )
}

/* ============================================================
   GALLERY SECTION
   ============================================================ */
function GallerySection() {
  const [categories, setCategories] = useState<GalleryCategory[]>([])
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [showCatModal, setShowCatModal] = useState(false)
  const [catForm, setCatForm] = useState({ name: '', description: '' })
  const [uploading, setUploading] = useState(false)
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const loadCats = async () => {
    const { data } = await supabase.from('gallery_categories').select('*').order('created_at', { ascending: false })
    setCategories(data || [])
  }

  const loadPhotos = async (catId: string) => {
    const { data } = await supabase.from('gallery_photos').select('*').eq('category_id', catId).order('created_at', { ascending: false })
    setPhotos(data || [])
  }

  useEffect(() => { loadCats() }, [])
  useEffect(() => { if (selectedCat) loadPhotos(selectedCat) }, [selectedCat])

  const createCategory = async () => {
    if (!catForm.name.trim()) return
    const { error } = await supabase.from('gallery_categories').insert([catForm])
    if (error) { setAlert({ type: 'error', msg: error.message }); return }
    setAlert({ type: 'success', msg: 'Category created!' })
    setShowCatModal(false)
    setCatForm({ name: '', description: '' })
    loadCats()
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category and all its photos?')) return
    await supabase.from('gallery_photos').delete().eq('category_id', id)
    await supabase.from('gallery_categories').delete().eq('id', id)
    if (selectedCat === id) setSelectedCat(null)
    loadCats()
  }

  const [uploadProgress, setUploadProgress] = useState<{
    active: boolean
    current: number
    total: number
    percent: number
    currentFile: string
  }>({ active: false, current: 0, total: 0, percent: 0, currentFile: '' })

  const uploadPhotos = async (files: FileList) => {
    if (!selectedCat) {
      setAlert({ type: 'error', msg: 'Please select a gallery category first' })
      return
    }
    const fileList = Array.from(files)
    if (fileList.length === 0) return

    setUploading(true)
    setUploadProgress({
      active: true,
      current: 0,
      total: fileList.length,
      percent: 0,
      currentFile: fileList[0].name
    })

    let uploadedCount = 0
    const newItems: any[] = []
    const BATCH_SIZE = 3

    // Process in concurrent pools of 3 to speed up network throughput by ~3x
    for (let i = 0; i < fileList.length; i += BATCH_SIZE) {
      const batch = fileList.slice(i, i + BATCH_SIZE)

      await Promise.all(
        batch.map(async (file, batchIdx) => {
          const index = i + batchIdx
          let photoUrl = ''
          let uploadFile = file

          // 1. Client-side Canvas Compression (reduces 3-10MB mobile photos to ~80KB webp)
          try {
            const comp = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.8 })
            uploadFile = comp.file
            photoUrl = comp.dataUrl // instant compressed preview fallback
          } catch (compErr) {
            console.warn('Compression fallback:', compErr)
          }

          // 2. Try Supabase Storage upload
          try {
            const ext = uploadFile.name.split('.').pop()
            const path = `gallery/${selectedCat}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
            const { error: upErr } = await supabase.storage.from('media').upload(path, uploadFile, { upsert: true })
            if (!upErr) {
              const { data } = supabase.storage.from('media').getPublicUrl(path)
              if (data?.publicUrl) {
                photoUrl = data.publicUrl
              }
            }
          } catch (err) {
            console.warn('Supabase storage upload error:', err)
          }

          if (photoUrl) {
            try {
              await supabase.from('gallery_photos').insert([{
                url: photoUrl,
                caption: file.name,
                category_id: selectedCat
              }])
            } catch (dbErr) {
              console.warn('DB insert error:', dbErr)
            }

            const item = {
              id: `photo_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 6)}`,
              url: photoUrl,
              caption: file.name,
              category_id: selectedCat,
              created_at: new Date().toISOString()
            }
            newItems.push(item)
            uploadedCount++
          }

          const currentDone = Math.min(uploadedCount, fileList.length)
          setUploadProgress({
            active: true,
            current: currentDone,
            total: fileList.length,
            percent: Math.round((currentDone / fileList.length) * 100),
            currentFile: file.name
          })
        })
      )
    }

    // Single atomic write to localStorage instead of K repeated disk operations (O(1) I/O)
    if (newItems.length > 0) {
      try {
        const localKey = `shakti_gallery_photos_${selectedCat}`
        const existing = JSON.parse(localStorage.getItem(localKey) || '[]')
        localStorage.setItem(localKey, JSON.stringify([...newItems, ...existing]))
      } catch (localErr) {
        console.warn('LocalStorage bulk write error:', localErr)
      }
    }

    setUploadProgress({ active: false, current: fileList.length, total: fileList.length, percent: 100, currentFile: '' })
    setUploading(false)
    setAlert({ type: 'success', msg: `Successfully uploaded ${uploadedCount} photo(s)!` })
    loadPhotos(selectedCat)
  }

  const deletePhoto = async (id: string) => {
    await supabase.from('gallery_photos').delete().eq('id', id)
    if (selectedCat) loadPhotos(selectedCat)
  }

  return (
    <>
      {uploadProgress.active && (
        <ShaktiLoader
          title="Uploading Gallery Photos"
          status={`Uploaded ${uploadProgress.current} of ${uploadProgress.total} photos (${uploadProgress.percent}%)`}
          percent={uploadProgress.percent}
          filename={uploadProgress.currentFile}
        />
      )}
      {alert && <div className={`${s.alert} ${alert.type === 'error' ? s.alertError : s.alertSuccess}`}>{alert.msg}</div>}

      <div className={s.sectionHeader}>
        <span className={s.sectionTitle}>Categories</span>
        <button className={s.btnPrimary} onClick={() => setShowCatModal(true)}>+ New Category</button>
      </div>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              className={`${s.btnSecondary} ${selectedCat === cat.id ? s.navItemActive : ''}`}
              style={{ borderRadius: '9999px' }}
              onClick={() => setSelectedCat(cat.id)}
            >
              <GoogleIcon name="folder" size={16} /> {cat.name}
            </button>
            <button className={s.btnDanger} style={{ borderRadius: '9999px', padding: '0.4rem 0.6rem' }} onClick={() => deleteCategory(cat.id)}>✕</button>
          </div>
        ))}
        {categories.length === 0 && (
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>No categories yet. Create one first.</span>
        )}
      </div>

      {/* Upload zone */}
      {selectedCat && (
        <>
          <div
            className={s.uploadZone}
            style={{ marginBottom: '1.5rem' }}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={e => e.target.files && uploadPhotos(e.target.files)}
            />
            <div className={s.uploadIcon}><GoogleIcon name="add_a_photo" size={28} /></div>
            <div className={s.uploadText}>{uploading ? 'Uploading photos...' : 'Click to upload photos'}</div>
            <div className={s.uploadHint}>JPG, PNG, WEBP — multiple files supported</div>
          </div>

          <div className={s.sectionHeader}>
            <span className={s.sectionTitle}>
              Photos in "{categories.find(c => c.id === selectedCat)?.name}" ({photos.length})
            </span>
          </div>

          <div className={s.photoGrid}>
            {photos.map(p => (
              <div key={p.id} className={s.photoCard}>
                <img src={p.url} alt={p.caption} loading="lazy" />
                <div className={s.photoOverlay}>
                  <button className={s.btnDanger} style={{ borderRadius: '50%', width: 36, height: 36, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => deletePhoto(p.id)}>✕</button>
                </div>
              </div>
            ))}
            {photos.length === 0 && (
              <div style={{ gridColumn: '1/-1' }} className={s.empty}>
                <div className={s.emptyIcon}>
                  <GoogleIcon name="photo_library" size={44} style={{ color: 'rgba(255,255,255,0.2)' }} />
                </div>
                <div className={s.emptyText}>No photos in this category</div>
                <div className={s.emptyHint}>Upload photos using the zone above</div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Category Modal */}
      {showCatModal && (
        <div className={s.overlay} data-lenis-prevent="true" onClick={e => e.target === e.currentTarget && setShowCatModal(false)}>
          <div className={s.modal} data-lenis-prevent="true" style={{ maxWidth: 480 }}>
            <h2 className={s.modalTitle}>New Gallery Category</h2>
            <button className={s.modalClose} onClick={() => setShowCatModal(false)}><GoogleIcon name="close" size={18} /></button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={s.field}>
                <label className={s.label}>Category Name</label>
                <input className={s.input} value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Aaryaveera Camp 2024" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Description (optional)</label>
                <textarea className={s.textarea} style={{ minHeight: 80 }} value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." />
              </div>
            </div>
            <div className={s.modalActions}>
              <button className={s.btnSecondary} onClick={() => setShowCatModal(false)}>Cancel</button>
              <button className={s.btnPrimary} onClick={createCategory}>Create Category</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ============================================================
   COURSES SECTION
   ============================================================ */
function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const defaultForm = {
    title: '', description: '', price: 0, duration: '', level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    cover_image_url: '', instructor: '', published: false,
    syllabus: [{ week: 'Week 1', topic: '' }]
  }
  const [form, setForm] = useState(defaultForm)

  const load = async () => {
    setLoading(true)
    let fetchedCourses: Course[] = []
    try {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
      if (!error && data) fetchedCourses = data
    } catch (err) {
      console.warn('Supabase fetch courses error:', err)
    }

    try {
      const local = localStorage.getItem('shakti_custom_courses')
      if (local) {
        const localList: Course[] = JSON.parse(local)
        // O(N) map-based deduplication across remote and local records
        const courseMap = new Map<string, Course>()
        for (const c of fetchedCourses) {
          courseMap.set(c.id, c)
          courseMap.set(`title:${c.title.trim().toLowerCase()}`, c)
        }

        const uniqueLocal: Course[] = []
        for (const c of localList) {
          const titleKey = `title:${c.title.trim().toLowerCase()}`
          if (!courseMap.has(c.id) && !courseMap.has(titleKey)) {
            courseMap.set(c.id, c)
            courseMap.set(titleKey, c)
            uniqueLocal.push(c)
          }
        }
        fetchedCourses = [...uniqueLocal, ...fetchedCourses]
      }
    } catch (e) {
      console.warn('LocalStorage read error:', e)
    }

    setCourses(fetchedCourses)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setForm(defaultForm); setShowModal(true) }
  const openEdit = (c: Course) => {
    setEditing(c)
    setForm({
      title: c.title, description: c.description, price: c.price,
      duration: c.duration, level: c.level, cover_image_url: c.cover_image_url,
      instructor: c.instructor, published: c.published,
      syllabus: c.syllabus?.length ? c.syllabus : [{ week: 'Week 1', topic: '' }]
    })
    setShowModal(true)
  }

  const uploadCover = async (file: File) => {
    setUploading(true)
    try {
      // 1. Compress image down to max 900x900 (quality 0.8) for instant preview & low memory storage (< 70KB)
      const comp = await compressImage(file, { maxWidth: 900, maxHeight: 900, quality: 0.8 })
      setForm(f => ({ ...f, cover_image_url: comp.dataUrl }))

      // 2. Upload compressed file to Supabase storage in background if configured
      const ext = comp.file.name.split('.').pop()
      const path = `courses/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('media').upload(path, comp.file, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('media').getPublicUrl(path)
        if (data?.publicUrl) {
          setForm(f => ({ ...f, cover_image_url: data.publicUrl }))
        }
      }
    } catch (e) {
      console.warn('Supabase storage upload error, maintaining compressed local preview:', e)
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    if (!form.title.trim()) {
      setAlert({ type: 'error', msg: 'Please enter a course title.' })
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      duration: form.duration.trim() || '4 Weeks',
      level: form.level,
      instructor: form.instructor.trim() || 'Shakti Sabha Faculty',
      cover_image_url: form.cover_image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      published: Boolean(form.published),
      syllabus: form.syllabus.filter(s => s.topic.trim()),
    }

    let saved = false
    let savedId = editing ? editing.id : ''

    // 1. Try Supabase
    try {
      if (editing) {
        const { error } = await supabase.from('courses').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id)
        if (!error) saved = true
      } else {
        const { data, error } = await supabase.from('courses').insert([payload]).select().single()
        if (!error && data) {
          saved = true
          savedId = data.id
        }
      }
    } catch (err) {
      console.warn('Supabase save error:', err)
    }

    // 2. Deduplicated LocalStorage Sync (prevents creating duplicate courses)
    try {
      const local = localStorage.getItem('shakti_custom_courses')
      let list: Course[] = local ? JSON.parse(local) : []

      const courseId = savedId || (editing ? editing.id : `course_${Date.now()}`)
      const courseObj: Course = {
        id: courseId,
        ...payload,
        created_at: editing?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Check if course already exists by ID or by title
      const targetTitle = payload.title.toLowerCase()
      const existingIdx = list.findIndex(c => c.id === courseId || c.title.trim().toLowerCase() === targetTitle)

      if (existingIdx >= 0) {
        list[existingIdx] = courseObj
      } else {
        list = [courseObj, ...list]
      }

      localStorage.setItem('shakti_custom_courses', JSON.stringify(list))
      saved = true
    } catch (localErr) {
      console.warn('LocalStorage save error:', localErr)
    }

    if (saved) {
      setAlert({ type: 'success', msg: editing ? 'Course updated successfully!' : 'Course created successfully!' })
      setShowModal(false)
      load()
    } else {
      setAlert({ type: 'error', msg: 'Could not save course. Please check inputs and try again.' })
    }
  }

  const del = async (id: string) => {
    if (!confirm('Delete this course?')) return
    const target = courses.find(c => c.id === id)
    try {
      await supabase.from('courses').delete().eq('id', id)
    } catch (e) {
      console.warn(e)
    }
    try {
      const local = localStorage.getItem('shakti_custom_courses')
      if (local) {
        const list: Course[] = JSON.parse(local)
        const updated = list.filter(c => c.id !== id && (!target || c.title.trim().toLowerCase() !== target.title.trim().toLowerCase()))
        localStorage.setItem('shakti_custom_courses', JSON.stringify(updated))
      }
    } catch (e) {
      console.warn(e)
    }
    load()
  }

  return (
    <>
      {uploading && (
        <ShaktiLoader
          title="Uploading Course Cover"
          status="Processing cover image..."
        />
      )}
      {alert && <div className={`${s.alert} ${alert.type === 'error' ? s.alertError : s.alertSuccess}`}>{alert.msg}</div>}
      <div className={s.sectionHeader}>
        <span className={s.sectionTitle}>All Courses ({courses.length})</span>
        <button className={s.btnPrimary} onClick={openNew}>+ New Course</button>
      </div>

      <div className={s.tableWrap}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
        ) : courses.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}>
              <GoogleIcon name="school" size={44} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
            <div className={s.emptyText}>No courses yet</div>
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr><th>Course</th><th>Price</th><th>Level</th><th>Duration</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>₹{c.price.toLocaleString()}</td>
                  <td><span className={`${s.badge} ${s.badgeGray}`}>{c.level}</span></td>
                  <td style={{ fontSize: '0.82rem' }}>{c.duration}</td>
                  <td><span className={`${s.badge} ${c.published ? s.badgeGreen : s.badgeGray}`}>{c.published ? 'Published' : 'Draft'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className={s.btnEdit} onClick={() => openEdit(c)}>Edit</button>
                      <button className={s.btnDanger} onClick={() => del(c.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className={s.overlay} data-lenis-prevent="true" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className={s.modal} data-lenis-prevent="true">
            <h2 className={s.modalTitle}>{editing ? 'Edit Course' : 'New Course'}</h2>
            <button className={s.modalClose} onClick={() => setShowModal(false)}><GoogleIcon name="close" size={18} /></button>

            <div className={s.formGrid}>
              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Course Title</label>
                <input className={s.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Aaryaveera Warrior Certification" />
              </div>
              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Description</label>
                <textarea className={s.textarea} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What will students learn?" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Price (₹)</label>
                <input className={s.input} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} placeholder="4999" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Duration</label>
                <input className={s.input} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="6 Weeks, 12 Hours" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Level</label>
                <select className={s.select} value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value as any }))}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className={s.field}>
                <label className={s.label}>Instructor</label>
                <input className={s.input} value={form.instructor} onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} placeholder="Instructor name" />
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Course Cover Image</label>
                {form.cover_image_url ? (
                  <div style={{ position: 'relative', width: 'fit-content', marginBottom: '0.85rem' }}>
                    <img
                      src={form.cover_image_url}
                      alt="Cover Preview"
                      style={{ height: 130, maxWidth: '100%', objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)' }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, cover_image_url: '' }))}
                      className={s.btnDanger}
                      style={{ position: 'absolute', top: 6, right: 6, borderRadius: '50%', width: 26, height: 26, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
                    No cover image selected. Choose an image file or paste a URL below.
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => e.target.files?.[0] && uploadCover(e.target.files[0])}
                  />
                  <button
                    type="button"
                    className={s.btnSecondary}
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : <><GoogleIcon name="upload_file" size={16} style={{ marginRight: 6 }} /> Choose Image File</>}
                  </button>
                  <input
                    className={s.input}
                    style={{ flex: 1, minWidth: 220 }}
                    value={form.cover_image_url}
                    onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))}
                    placeholder="Or paste direct image URL (https://...)"
                  />
                </div>
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Syllabus</label>
                {form.syllabus.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input className={s.input} style={{ width: 120, flexShrink: 0 }} value={item.week} onChange={e => setForm(f => ({ ...f, syllabus: f.syllabus.map((s, j) => j === i ? { ...s, week: e.target.value } : s) }))} placeholder="Week 1" />
                    <input className={s.input} value={item.topic} onChange={e => setForm(f => ({ ...f, syllabus: f.syllabus.map((s, j) => j === i ? { ...s, topic: e.target.value } : s) }))} placeholder="Topic / Module title" />
                    {form.syllabus.length > 1 && (
                      <button className={s.btnDanger} style={{ flexShrink: 0, padding: '0 0.65rem' }} onClick={() => setForm(f => ({ ...f, syllabus: f.syllabus.filter((_, j) => j !== i) }))}>✕</button>
                    )}
                  </div>
                ))}
                <button className={s.btnSecondary} style={{ width: 'fit-content' }} onClick={() => setForm(f => ({ ...f, syllabus: [...f.syllabus, { week: `Week ${f.syllabus.length + 1}`, topic: '' }] }))}>
                  + Add Week
                </button>
              </div>

              <div className={s.field}>
                <label className={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
                  Publish immediately
                </label>
              </div>
            </div>

            <div className={s.modalActions}>
              <button className={s.btnSecondary} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={s.btnPrimary} onClick={save}><GoogleIcon name="save" size={16} /> Save Course</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ============================================================
   COUNSELLING SECTION
   ============================================================ */
function CounsellingSection() {
  const [requests, setRequests] = useState<CounsellingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [viewItem, setViewItem] = useState<CounsellingRequest | null>(null)

  const load = async () => {
    setLoading(true)
    let query = supabase.from('counselling_requests').select('*').order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setRequests(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('counselling_requests').update({ status }).eq('id', id)
    load()
    if (viewItem?.id === id) setViewItem(prev => prev ? { ...prev, status: status as any } : null)
  }

  const statusColor: Record<string, string> = {
    pending: s.badgeYellow, reviewed: s.badgeGray,
    contacted: s.badgeGreen, resolved: s.badgeGreen
  }

  return (
    <>
      <div className={s.sectionHeader}>
        <span className={s.sectionTitle}>Counselling Requests ({requests.length})</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'pending', 'reviewed', 'contacted', 'resolved'].map(f => (
            <button key={f} className={`${s.tab} ${filter === f ? s.tabActive : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={s.tableWrap}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
        ) : requests.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}>
              <GoogleIcon name="forum" size={44} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
            <div className={s.emptyText}>No requests found</div>
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr><th>Name</th><th>City</th><th>Concern</th><th>Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{r.email}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{r.city || '—'}</td>
                  <td><span className={`${s.badge} ${s.badgeGray}`}>{r.concern}</span></td>
                  <td style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(r.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    <select
                      className={s.statusSelect}
                      value={r.status}
                      onChange={e => updateStatus(r.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td>
                    <button className={s.btnEdit} onClick={() => setViewItem(r)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {viewItem && (
        <div className={s.overlay} data-lenis-prevent="true" onClick={e => e.target === e.currentTarget && setViewItem(null)}>
          <div className={s.modal} data-lenis-prevent="true" style={{ maxWidth: 560 }}>
            <h2 className={s.modalTitle}>Counselling Request</h2>
            <button className={s.modalClose} onClick={() => setViewItem(null)}><GoogleIcon name="close" size={18} /></button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                ['Name', viewItem.name],
                ['Email', viewItem.email],
                ['Phone', viewItem.phone],
                ['City', viewItem.city],
                ['Concern', viewItem.concern],
              ].map(([key, val]) => (
                <div key={key} style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ width: 80, flexShrink: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 2 }}>{key}</span>
                  <span style={{ color: '#F3F4F6', fontSize: '0.92rem' }}>{val || '—'}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ width: 80, flexShrink: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 2 }}>Message</span>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '0.85rem', color: '#F3F4F6', fontSize: '0.9rem', lineHeight: 1.65, flex: 1 }}>
                  {viewItem.message || 'No message provided.'}
                </div>
              </div>
            </div>
            <div className={s.modalActions}>
              <button className={s.btnSecondary} onClick={() => setViewItem(null)}>Close</button>
              <a href={`mailto:${viewItem.email}?subject=Re: Your Counselling Request at Shakti Sabha`} className={s.btnPrimary} style={{ textDecoration: 'none' }}>
                <GoogleIcon name="mail" size={16} /> Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ============================================================
   TESTIMONIALS SECTION
   ============================================================ */
function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const defaultForm = {
    name: '',
    role: '',
    location: '',
    quote: '',
    image_url: '',
    rating: 5,
    published: true,
  }
  const [form, setForm] = useState(defaultForm)

  const load = async () => {
    setLoading(true)
    let list: Testimonial[] = []

    // 1. Fetch from Supabase
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data && data.length > 0) list = data
    } catch (err) {
      console.warn('Supabase fetch testimonials error:', err)
    }

    // 2. Fetch from LocalStorage and merge
    try {
      const local = localStorage.getItem('shakti_testimonials')
      if (local) {
        const localList: Testimonial[] = JSON.parse(local)
        const idMap = new Map<string, Testimonial>()
        for (const t of list) idMap.set(t.id, t)
        for (const t of localList) {
          if (!idMap.has(t.id)) {
            idMap.set(t.id, t)
            list.push(t)
          }
        }
      } else {
        localStorage.setItem('shakti_testimonials', JSON.stringify(DEFAULT_TESTIMONIALS))
        const idMap = new Map<string, Testimonial>()
        for (const t of list) idMap.set(t.id, t)
        for (const t of DEFAULT_TESTIMONIALS) {
          if (!idMap.has(t.id)) {
            idMap.set(t.id, t)
            list.push(t)
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e)
    }

    setTestimonials(list)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing(null)
    setForm(defaultForm)
    setShowModal(true)
  }

  const openEdit = (t: Testimonial) => {
    setEditing(t)
    setForm({
      name: t.name,
      role: t.role,
      location: t.location || '',
      quote: t.quote,
      image_url: t.image_url || '',
      rating: t.rating || 5,
      published: t.published !== false,
    })
    setShowModal(true)
  }

  const uploadPhoto = async (file: File) => {
    setUploading(true)
    try {
      // Compress person's image down to 500x500 (quality 0.8) for fast loading & light footprint (~30KB)
      const comp = await compressImage(file, { maxWidth: 500, maxHeight: 500, quality: 0.8 })
      setForm(f => ({ ...f, image_url: comp.dataUrl }))

      const ext = comp.file.name.split('.').pop()
      const path = `testimonials/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('media').upload(path, comp.file, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('media').getPublicUrl(path)
        if (data?.publicUrl) {
          setForm(f => ({ ...f, image_url: data.publicUrl }))
        }
      }
    } catch (e) {
      console.warn('Testimonial image upload error:', e)
    } finally {
      setUploading(false)
    }
  }

  const save = async () => {
    if (!form.name.trim()) {
      setAlert({ type: 'error', msg: "Please enter the person's name." })
      return
    }
    if (!form.quote.trim()) {
      setAlert({ type: 'error', msg: 'Please enter the testimonial text.' })
      return
    }

    const payload = {
      name: form.name.trim(),
      role: form.role.trim() || 'Community Member',
      location: form.location.trim() || 'Maharashtra',
      quote: form.quote.trim(),
      image_url: form.image_url || '',
      rating: Number(form.rating) || 5,
      published: Boolean(form.published),
    }

    let saved = false
    let savedId = editing ? editing.id : ''

    // 1. Try Supabase
    try {
      if (editing) {
        const { error } = await supabase.from('testimonials').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id)
        if (!error) saved = true
      } else {
        const { data, error } = await supabase.from('testimonials').insert([payload]).select().single()
        if (!error && data) {
          saved = true
          savedId = data.id
        }
      }
    } catch (err) {
      console.warn('Supabase testimonial save error:', err)
    }

    // 2. LocalStorage Sync
    try {
      const local = localStorage.getItem('shakti_testimonials')
      let list: Testimonial[] = local ? JSON.parse(local) : []
      const id = savedId || (editing ? editing.id : `testim_${Date.now()}`)
      const item: Testimonial = {
        id,
        ...payload,
        created_at: editing?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const idx = list.findIndex(t => t.id === id)
      if (idx >= 0) {
        list[idx] = item
      } else {
        list = [item, ...list]
      }
      localStorage.setItem('shakti_testimonials', JSON.stringify(list))
      window.dispatchEvent(new Event('storage'))
      saved = true
    } catch (localErr) {
      console.warn('LocalStorage save error:', localErr)
    }

    if (saved) {
      setAlert({ type: 'success', msg: editing ? 'Testimonial updated!' : 'Testimonial added!' })
      setShowModal(false)
      load()
    } else {
      setAlert({ type: 'error', msg: 'Failed to save testimonial.' })
    }
  }

  const del = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      await supabase.from('testimonials').delete().eq('id', id)
    } catch (err) {
      console.warn('Supabase delete error:', err)
    }

    try {
      const local = localStorage.getItem('shakti_testimonials')
      if (local) {
        const list: Testimonial[] = JSON.parse(local)
        const filtered = list.filter(t => t.id !== id)
        localStorage.setItem('shakti_testimonials', JSON.stringify(filtered))
        window.dispatchEvent(new Event('storage'))
      }
    } catch (localErr) {
      console.warn('LocalStorage delete error:', localErr)
    }

    setAlert({ type: 'success', msg: 'Testimonial deleted.' })
    load()
  }

  return (
    <>
      {uploading && (
        <ShaktiLoader
          title="Processing Photo"
          status="Optimizing and uploading testimonial photo..."
        />
      )}
      {alert && <div className={`${s.alert} ${alert.type === 'error' ? s.alertError : s.alertSuccess}`}>{alert.msg}</div>}

      <div className={s.sectionHeader}>
        <span className={s.sectionTitle}>Community Testimonials ({testimonials.length})</span>
        <button className={s.btnPrimary} onClick={openNew}>+ New Testimonial</button>
      </div>

      <div className={s.tableWrap}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
        ) : testimonials.length === 0 ? (
          <div className={s.empty}>
            <div className={s.emptyIcon}>
              <GoogleIcon name="format_quote" size={44} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
            <div className={s.emptyText}>No testimonials yet</div>
          </div>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>Person</th>
                <th>Role / Context</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', background: '#333', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {t.image_url ? (
                          <img src={t.image_url} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#DC143C' }}>{t.name.charAt(0)}</span>
                        )}
                      </div>
                      <span style={{ fontWeight: 600, color: '#F9FAFB' }}>{t.name}</span>
                    </div>
                  </td>
                  <td>{t.role}</td>
                  <td>{t.location || '—'}</td>
                  <td><span style={{ color: '#F59E0B' }}>{'★'.repeat(t.rating || 5)}</span></td>
                  <td><span className={`${s.badge} ${t.published ? s.badgeGreen : s.badgeGray}`}>{t.published ? 'Published' : 'Draft'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className={s.btnEdit} onClick={() => openEdit(t)}>Edit</button>
                      <button className={s.btnDanger} onClick={() => del(t.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className={s.overlay} data-lenis-prevent="true" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className={s.modal} data-lenis-prevent="true">
            <h2 className={s.modalTitle}>{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
            <button className={s.modalClose} onClick={() => setShowModal(false)}><GoogleIcon name="close" size={18} /></button>

            <div className={s.formGrid}>
              <div className={s.field}>
                <label className={s.label}>Person's Name *</label>
                <input className={s.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Pooja Deshmukh" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Role / Designation</label>
                <input className={s.input} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Lathi-Kaushal Graduate, Survivor & Mentor" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Location / City</label>
                <input className={s.input} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Pune, Maharashtra" />
              </div>
              <div className={s.field}>
                <label className={s.label}>Rating (1 - 5 Stars)</label>
                <select className={s.select} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}>
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★☆</option>
                  <option value={3}>3 Stars ★★★☆☆</option>
                  <option value={2}>2 Stars ★★☆☆☆</option>
                  <option value={1}>1 Star ★☆☆☆☆</option>
                </select>
              </div>

              {/* Photo Upload with Instant Preview */}
              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Person's Photo</label>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
                  />
                  <button
                    type="button"
                    className={s.btnSecondary}
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Compressing...' : <><GoogleIcon name="upload_file" size={16} style={{ marginRight: 6 }} /> Choose Photo</>}
                  </button>
                  <input
                    className={s.input}
                    style={{ flex: 1, minWidth: 220 }}
                    value={form.image_url}
                    onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                    placeholder="Or enter Image URL directly"
                  />
                </div>

                {/* Live Preview */}
                {form.image_url && (
                  <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '2px solid #DC143C' }}>
                      <img src={form.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontSize: '0.82rem', color: '#10B981' }}>✓ Photo ready &amp; compressed</span>
                  </div>
                )}
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Testimonial Quote / Story *</label>
                <textarea
                  className={s.textarea}
                  style={{ minHeight: 110 }}
                  value={form.quote}
                  onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
                  placeholder="What did this person say about their journey with Shakti Sabha?"
                />
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#F3F4F6' }}>
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                    style={{ accentColor: '#DC143C', width: 16, height: 16 }}
                  />
                  Publish this testimonial to the website immediately
                </label>
              </div>
            </div>

            <div className={s.modalActions}>
              <button className={s.btnSecondary} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={s.btnPrimary} onClick={save}><GoogleIcon name="save" size={16} /> Save Testimonial</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ============================================================
   FOUNDER & CIVILIZATIONAL DOSSIER SECTION
   ============================================================ */
function FounderSection() {
  const [data, setData] = useState<FounderProfileData>(getFounderData())
  const [alert, setAlert] = useState<{ type: 'error' | 'success'; msg: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUploadPhoto = async (file: File) => {
    setUploading(true)
    try {
      const comp = await compressImage(file, { maxWidth: 900, maxHeight: 1100, quality: 0.85 })
      setData(d => ({ ...d, heroImage: comp.dataUrl }))

      const ext = comp.file.name.split('.').pop()
      const path = `founder/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('media').upload(path, comp.file, { upsert: true })
      if (!error) {
        const { data: pubData } = supabase.storage.from('media').getPublicUrl(path)
        if (pubData?.publicUrl) {
          setData(d => ({ ...d, heroImage: pubData.publicUrl }))
        }
      }
    } catch (e) {
      console.warn('Founder image upload error:', e)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = () => {
    saveFounderData(data)
    setAlert({ type: 'success', msg: 'Founder Dossier & Civilizational Information successfully updated and broadcast to all pages!' })
    setTimeout(() => setAlert(null), 4000)
  }

  const handleReset = () => {
    if (confirm('Reset to standard civilizational information?')) {
      setData(DEFAULT_FOUNDER_DATA)
      saveFounderData(DEFAULT_FOUNDER_DATA)
      setAlert({ type: 'success', msg: 'Reset to default institutional dossier.' })
    }
  }

  return (
    <>
      {uploading && (
        <ShaktiLoader
          title="Updating Founder Photo"
          status="Optimizing and uploading portrait..."
        />
      )}
      {alert && <div className={`${s.alert} ${alert.type === 'error' ? s.alertError : s.alertSuccess}`}>{alert.msg}</div>}

      <div className={s.sectionHeader}>
        <div>
          <span className={s.sectionTitle}>Founder &amp; Director Information Desk</span>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
            Updates apply instantly to the Home Profile, About Page, Mission Mardini, Shakti Bhava, and Shakti Varta.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className={s.btnSecondary} onClick={handleReset}>Reset Defaults</button>
          <button className={s.btnPrimary} onClick={handleSave}><GoogleIcon name="save" size={16} /> Save Changes</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Basic Identity & Hero Card */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.75rem' }}>
          <h3 style={{ color: '#F9FAFB', fontSize: '1.15rem', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GoogleIcon name="badge" size={20} style={{ color: '#DC143C' }} />
            Primary Identity &amp; Titles
          </h3>

          <div className={s.formGrid}>
            <div className={s.field}>
              <label className={s.label}>Full Name</label>
              <input className={s.input} value={data.name} onChange={e => setData(d => ({ ...d, name: e.target.value }))} />
            </div>
            <div className={s.field}>
              <label className={s.label}>Official Title</label>
              <input className={s.input} value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Specialist Sub-Title &amp; Accreditations</label>
              <input className={s.input} value={data.subTitle} onChange={e => setData(d => ({ ...d, subTitle: e.target.value }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Hero Quote (Foundational Conviction)</label>
              <textarea className={s.textarea} style={{ minHeight: 70 }} value={data.heroQuote} onChange={e => setData(d => ({ ...d, heroQuote: e.target.value }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Concise Biography (Home Page Bio)</label>
              <textarea className={s.textarea} style={{ minHeight: 90 }} value={data.bio} onChange={e => setData(d => ({ ...d, bio: e.target.value }))} />
            </div>

            {/* Photo Upload */}
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Founder Portrait</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => e.target.files?.[0] && handleUploadPhoto(e.target.files[0])}
                />
                <button
                  type="button"
                  className={s.btnSecondary}
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  <GoogleIcon name="upload_file" size={16} style={{ marginRight: 6 }} /> Choose New Photo
                </button>
                <input
                  className={s.input}
                  style={{ flex: 1, minWidth: 260 }}
                  value={data.heroImage}
                  onChange={e => setData(d => ({ ...d, heroImage: e.target.value }))}
                  placeholder="Or enter image URL"
                />
              </div>
              {data.heroImage && (
                <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 64, height: 75, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <img src={data.heroImage} alt="Portrait preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#10B981' }}>✓ Portrait active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* The Genesis & Kshatra-Dharma */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.75rem' }}>
          <h3 style={{ color: '#F9FAFB', fontSize: '1.15rem', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GoogleIcon name="history_edu" size={20} style={{ color: '#DC143C' }} />
            The Genesis &amp; Civilizational Sovereignty
          </h3>

          <div className={s.formGrid}>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Genesis Section Headline</label>
              <input className={s.input} value={data.genesisLead} onChange={e => setData(d => ({ ...d, genesisLead: e.target.value }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Genesis Paragraph 1 (Grassroots Beginnings)</label>
              <textarea className={s.textarea} style={{ minHeight: 80 }} value={data.genesisP1} onChange={e => setData(d => ({ ...d, genesisP1: e.target.value }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Genesis Paragraph 2 (Beyond Vulnerability to Agency)</label>
              <textarea className={s.textarea} style={{ minHeight: 90 }} value={data.genesisP2} onChange={e => setData(d => ({ ...d, genesisP2: e.target.value }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Genesis Paragraph 3 (Establishing Shakti Sabha)</label>
              <textarea className={s.textarea} style={{ minHeight: 80 }} value={data.genesisP3} onChange={e => setData(d => ({ ...d, genesisP3: e.target.value }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>The Kshatra-Dharma Vision Text</label>
              <textarea className={s.textarea} style={{ minHeight: 100 }} value={data.kshatraDharmaText} onChange={e => setData(d => ({ ...d, kshatraDharmaText: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Frontline Interventions & Statutory Disclaimer */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.75rem' }}>
          <h3 style={{ color: '#F9FAFB', fontSize: '1.15rem', margin: '0 0 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GoogleIcon name="gavel" size={20} style={{ color: '#DC143C' }} />
            Statutory Safeguarding &amp; Confidentiality Compliance
          </h3>

          <div className={s.formGrid}>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Child Protection &amp; Transit Interception Footprint</label>
              <textarea className={s.textarea} style={{ minHeight: 80 }} value={data.interventions.childProtectionText} onChange={e => setData(d => ({ ...d, interventions: { ...d.interventions, childProtectionText: e.target.value } }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Counter-Grooming &amp; Pre-FIR Mediation Footprint</label>
              <textarea className={s.textarea} style={{ minHeight: 80 }} value={data.interventions.counterGroomingText} onChange={e => setData(d => ({ ...d, interventions: { ...d.interventions, counterGroomingText: e.target.value } }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Somatic Grounding &amp; Non-Verbal Support Methodology</label>
              <textarea className={s.textarea} style={{ minHeight: 80 }} value={data.interventions.somaticSupportText} onChange={e => setData(d => ({ ...d, interventions: { ...d.interventions, somaticSupportText: e.target.value } }))} />
            </div>
            <div className={`${s.field} ${s.formFull}`}>
              <label className={s.label}>Institutional Note on Statutory Compliance &amp; Legal Confidentiality</label>
              <textarea className={s.textarea} style={{ minHeight: 90 }} value={data.interventions.confidentialityNotice} onChange={e => setData(d => ({ ...d, interventions: { ...d.interventions, confidentialityNotice: e.target.value } }))} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button className={s.btnPrimary} onClick={handleSave} style={{ padding: '0.75rem 2rem' }}>
            <GoogleIcon name="save" size={18} /> Save &amp; Publish Changes
          </button>
        </div>
      </div>
    </>
  )
}


/* ============================================================
   EVENTS SECTION
   ============================================================ */
interface AdminEvent {
  id: string
  title: string
  stream: 'mardini' | 'shakti-bhava' | 'shakti-varta' | 'general'
  format: 'on-ground' | 'digital'
  date: string
  end_date?: string
  location?: string
  meeting_link?: string
  pricing?: string
  is_free: boolean
  capacity?: number
  registered_count: number
  status: 'upcoming' | 'completed' | 'cancelled'
  description?: string
  curriculum_pdf_url?: string
  theme_category?: string
  region?: string
  participant_count?: number
  published: boolean
  attribution?: string
  created_at: string
}

const EMPTY_EVENT: Omit<AdminEvent, 'id' | 'created_at'> = {
  title: '',
  stream: 'general',
  format: 'on-ground',
  date: '',
  is_free: true,
  registered_count: 0,
  status: 'upcoming',
  published: true,
}

function loadAdminEvents(): AdminEvent[] {
  try {
    const raw = localStorage.getItem('shakti_events')
    if (raw) return JSON.parse(raw) as AdminEvent[]
  } catch { /**/ }
  return []
}

function saveAdminEvents(evs: AdminEvent[]) {
  localStorage.setItem('shakti_events', JSON.stringify(evs))
  window.dispatchEvent(new Event('storage'))
}

function downloadCSV(evs: AdminEvent[]) {
  const headers = ['ID', 'Title', 'Stream', 'Format', 'Date', 'Location', 'Status', 'Capacity', 'Registered', 'Participants', 'Attribution', 'Published']
  const rows = evs.map(e => [
    e.id, e.title, e.stream, e.format, e.date, e.location || '', e.status,
    e.capacity || '', e.registered_count, e.participant_count || '', e.attribution || '', e.published ? 'Yes' : 'No',
  ])
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'shakti_events.csv'; a.click()
  URL.revokeObjectURL(url)
}

function EventsSection() {
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<AdminEvent | null>(null)
  const [form, setForm] = useState<Omit<AdminEvent, 'id' | 'created_at'>>(EMPTY_EVENT)
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setEvents(loadAdminEvents())
    const onStorage = () => setEvents(loadAdminEvents())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...EMPTY_EVENT })
    setShowModal(true)
  }

  const openEdit = (ev: AdminEvent) => {
    setEditing(ev)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, ...rest } = ev
    setForm(rest)
    setShowModal(true)
  }

  const handleSave = () => {
    setSaving(true)
    const all = loadAdminEvents()
    if (editing) {
      const updated = all.map(e => e.id === editing.id ? { ...editing, ...form } : e)
      saveAdminEvents(updated)
      setEvents(updated)
    } else {
      const newEv: AdminEvent = { ...form, id: `ev-${Date.now()}`, created_at: new Date().toISOString() }
      const updated = [newEv, ...all]
      saveAdminEvents(updated)
      setEvents(updated)
    }
    setSaving(false)
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this event?')) return
    const updated = events.filter(e => e.id !== id)
    saveAdminEvents(updated)
    setEvents(updated)
  }

  const handleTogglePublish = (id: string) => {
    const updated = events.map(e => e.id === id ? { ...e, published: !e.published } : e)
    saveAdminEvents(updated)
    setEvents(updated)
  }

  const handleAutoArchive = () => {
    const today = new Date().toDateString()
    const updated = events.map(e =>
      e.status === 'upcoming' && new Date(e.date) < new Date(today) ? { ...e, status: 'completed' as const } : e
    )
    saveAdminEvents(updated)
    setEvents(updated)
  }

  const filtered = events.filter(e => filterStatus === 'all' || e.status === filterStatus)

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['all', 'upcoming', 'completed', 'cancelled'] as const).map(st => (
            <button key={st} onClick={() => setFilterStatus(st)}
              style={{ padding: '0.35rem 0.85rem', borderRadius: 20, border: '1px solid',
                borderColor: filterStatus === st ? '#C9A96E' : 'rgba(255,255,255,0.1)',
                background: filterStatus === st ? 'rgba(201,169,110,0.12)' : 'transparent',
                color: filterStatus === st ? '#C9A96E' : '#666', fontSize: '0.8rem', cursor: 'pointer' }}>
              {st.charAt(0).toUpperCase() + st.slice(1)} ({st === 'all' ? events.length : events.filter(e => e.status === st).length})
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={s.btnSecondary} onClick={handleAutoArchive} style={{ fontSize: '0.82rem' }}>
            <GoogleIcon name="auto_fix_high" size={16} /> Auto-Archive Past
          </button>
          <button className={s.btnSecondary} onClick={() => downloadCSV(events)} style={{ fontSize: '0.82rem' }}>
            <GoogleIcon name="download" size={16} /> Export CSV
          </button>
          <button className={s.btnPrimary} onClick={openCreate}>
            <GoogleIcon name="add" size={18} /> New Event
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#555' }}>
          <GoogleIcon name="event" size={48} style={{ display: 'block', margin: '0 auto 1rem', color: 'rgba(201,169,110,0.2)' }} />
          <p>No events found. Create your first event or backfill historical records.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(ev => (
            <div key={ev.id} style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ padding: '0.15rem 0.55rem', borderRadius: 12, fontSize: '0.7rem', background: ev.status === 'upcoming' ? 'rgba(61,90,69,0.4)' : ev.status === 'completed' ? 'rgba(201,169,110,0.2)' : 'rgba(220,20,60,0.2)', color: ev.status === 'upcoming' ? '#3D8B5A' : ev.status === 'completed' ? '#C9A96E' : '#DC143C' }}>
                    {ev.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#555' }}>{ev.stream} · {ev.format}</span>
                  {!ev.published && <span style={{ padding: '0.15rem 0.5rem', borderRadius: 12, fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', color: '#555' }}>Hidden</span>}
                </div>
                <p style={{ margin: '0 0 0.3rem', fontFamily: 'Cinzel, Georgia, serif', fontSize: '0.95rem', color: '#f5ead6' }}>{ev.title}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
                  {ev.date}{ev.end_date ? ` → ${ev.end_date}` : ''} · {ev.location || 'Location TBA'}
                  {ev.participant_count ? ` · ~${ev.participant_count.toLocaleString()}+ participants` : ''}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleTogglePublish(ev.id)} title={ev.published ? 'Hide' : 'Publish'}
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.4rem 0.6rem', cursor: 'pointer', color: ev.published ? '#3D8B5A' : '#555' }}>
                  <GoogleIcon name={ev.published ? 'visibility' : 'visibility_off'} size={16} />
                </button>
                <button onClick={() => openEdit(ev)} title="Edit"
                  style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '0.4rem 0.6rem', cursor: 'pointer', color: '#C9A96E' }}>
                  <GoogleIcon name="edit" size={16} />
                </button>
                <button onClick={() => handleDelete(ev.id)} title="Delete"
                  style={{ background: 'transparent', border: '1px solid rgba(220,20,60,0.2)', borderRadius: 8, padding: '0.4rem 0.6rem', cursor: 'pointer', color: '#DC143C' }}>
                  <GoogleIcon name="delete" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} data-lenis-prevent="true">
          <div style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }} data-lenis-prevent="true">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontFamily: 'Cinzel, Georgia, serif', color: '#f5ead6' }}>
                {editing ? 'Edit Event' : 'Create Event'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>

            <div className={s.formGrid}>
              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Event Title *</label>
                <input className={s.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Full event name" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Stream</label>
                <select className={s.input} value={form.stream} onChange={e => setForm(f => ({ ...f, stream: e.target.value as AdminEvent['stream'] }))}>
                  <option value="mardini">Mission Mardini</option>
                  <option value="shakti-bhava">Shakti Bhava</option>
                  <option value="shakti-varta">Shakti Varta</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Format</label>
                <select className={s.input} value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value as AdminEvent['format'] }))}>
                  <option value="on-ground">On-Ground</option>
                  <option value="digital">Digital</option>
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Start Date *</label>
                <input className={s.input} type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>

              <div className={s.field}>
                <label className={s.label}>End Date (optional)</label>
                <input className={s.input} type="date" value={form.end_date || ''} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
              </div>

              <div className={s.field}>
                <label className={s.label}>Status</label>
                <select className={s.input} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as AdminEvent['status'] }))}>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Theme Category</label>
                <select className={s.input} value={form.theme_category || ''} onChange={e => setForm(f => ({ ...f, theme_category: e.target.value }))}>
                  <option value="">None</option>
                  <option value="national-symposia">National Symposia & Policy Forums</option>
                  <option value="tactical-camps">Tactical & Somatic Camps / Mission Mardini</option>
                  <option value="academic-deployments">Academic & Institutional Deployments</option>
                  <option value="community-assemblies">Community Stabilisation & Civil Assemblies</option>
                </select>
              </div>

              <div className={s.field}>
                <label className={s.label}>Attribution Role</label>
                <select className={s.input} value={form.attribution || ''} onChange={e => setForm(f => ({ ...f, attribution: e.target.value }))}>
                  <option value="">Select role</option>
                  <option value="Organised by Shakti Sabha">Organised by Shakti Sabha</option>
                  <option value="Independent">Independent</option>
                  <option value="Collaborative">Collaborative</option>
                  <option value="Keynote Speaker">Keynote Speaker</option>
                  <option value="Guest Speaker">Guest Speaker</option>
                  <option value="Trainer">Trainer</option>
                  <option value="Panelist">Panelist</option>
                  <option value="Participant">Participant</option>
                  <option value="Collaborator">Collaborator</option>
                  <option value="Under another organisation">Under another organisation</option>
                </select>
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Location</label>
                <input className={s.input} value={form.location || ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City, State / Online" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Region</label>
                <input className={s.input} value={form.region || ''} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} placeholder="e.g. Maharashtra" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Approx. Participant Count</label>
                <input className={s.input} type="number" value={form.participant_count || ''} onChange={e => setForm(f => ({ ...f, participant_count: parseInt(e.target.value) || undefined }))} placeholder="e.g. 500" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Capacity (seats)</label>
                <input className={s.input} type="number" value={form.capacity || ''} onChange={e => setForm(f => ({ ...f, capacity: parseInt(e.target.value) || undefined }))} />
              </div>

              <div className={s.field}>
                <label className={s.label}>Registered Count</label>
                <input className={s.input} type="number" value={form.registered_count} onChange={e => setForm(f => ({ ...f, registered_count: parseInt(e.target.value) || 0 }))} />
              </div>

              <div className={s.field}>
                <label className={s.label}>Pricing</label>
                <input className={s.input} value={form.pricing || ''} onChange={e => setForm(f => ({ ...f, pricing: e.target.value }))} placeholder="e.g. ₹2,500 or Free" />
              </div>

              <div className={s.field}>
                <label className={s.label}>Is Free?</label>
                <select className={s.input} value={form.is_free ? 'yes' : 'no'} onChange={e => setForm(f => ({ ...f, is_free: e.target.value === 'yes' }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Meeting Link (if digital)</label>
                <input className={s.input} value={form.meeting_link || ''} onChange={e => setForm(f => ({ ...f, meeting_link: e.target.value }))} placeholder="https://..." />
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Curriculum PDF URL</label>
                <input className={s.input} value={form.curriculum_pdf_url || ''} onChange={e => setForm(f => ({ ...f, curriculum_pdf_url: e.target.value }))} placeholder="https://..." />
              </div>

              <div className={`${s.field} ${s.formFull}`}>
                <label className={s.label}>Description</label>
                <textarea className={s.textarea} style={{ minHeight: 80 }} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short event description..." />
              </div>

              <div className={s.field}>
                <label className={s.label}>Published (visible on site)</label>
                <select className={s.input} value={form.published ? 'yes' : 'no'} onChange={e => setForm(f => ({ ...f, published: e.target.value === 'yes' }))}>
                  <option value="yes">Yes</option>
                  <option value="no">No (draft)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className={s.btnSecondary} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={s.btnPrimary} onClick={handleSave} disabled={saving || !form.title || !form.date}>
                <GoogleIcon name="save" size={18} />
                {saving ? 'Saving…' : (editing ? 'Save Changes' : 'Create Event')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
