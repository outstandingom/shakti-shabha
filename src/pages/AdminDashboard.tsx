import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, Article, GalleryCategory, GalleryPhoto, Course, CounsellingRequest } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import GoogleIcon from '../components/GoogleIcon/GoogleIcon'
import s from './AdminDashboard.module.css'

type Section = 'overview' | 'articles' | 'gallery' | 'courses' | 'counselling'

export default function AdminDashboard() {
  const { user, adminProfile, signOut, isAdmin, isLoading } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState<Section>('overview')

  useEffect(() => {
    if (!isLoading && !user) navigate('/login')
  }, [isLoading, user, navigate])

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0D0D0F', color: '#DC143C', fontFamily: 'Poppins,sans-serif' }}>
      Loading...
    </div>
  )
  if (!user) return null

  const navItems: { key: Section; icon: string; label: string }[] = [
    { key: 'overview',    icon: 'analytics', label: 'Overview' },
    { key: 'articles',   icon: 'article', label: 'Articles' },
    { key: 'gallery',    icon: 'photo_library', label: 'Gallery' },
    { key: 'courses',    icon: 'school', label: 'Courses' },
    { key: 'counselling',icon: 'forum', label: 'Counselling' },
  ]

  const sectionTitles: Record<Section, string> = {
    overview: 'Dashboard Overview',
    articles: 'Article Management',
    gallery: 'Gallery Management',
    courses: 'Course Management',
    counselling: 'Counselling Requests',
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
          {section === 'articles'   && <ArticlesSection />}
          {section === 'gallery'    && <GallerySection />}
          {section === 'courses'    && <CoursesSection />}
          {section === 'counselling'&& <CounsellingSection />}
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
    const ext = file.name.split('.').pop()
    const path = `articles/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('media').upload(path, file, { upsert: true })
    if (error) { setAlert({ type: 'error', msg: error.message }); setUploading(false); return }
    const { data } = supabase.storage.from('media').getPublicUrl(path)
    setForm(f => ({ ...f, cover_image_url: data.publicUrl }))
    setUploading(false)
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

  const uploadPhotos = async (files: FileList) => {
    if (!selectedCat) { setAlert({ type: 'error', msg: 'Please select a category first' }); return }
    setUploading(true)
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `gallery/${selectedCat}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage.from('media').upload(path, file, { upsert: true })
      if (upErr) continue
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      await supabase.from('gallery_photos').insert([{ url: data.publicUrl, caption: file.name, category_id: selectedCat }])
    }
    setUploading(false)
    setAlert({ type: 'success', msg: `${files.length} photo(s) uploaded!` })
    loadPhotos(selectedCat)
  }

  const deletePhoto = async (id: string) => {
    await supabase.from('gallery_photos').delete().eq('id', id)
    if (selectedCat) loadPhotos(selectedCat)
  }

  return (
    <>
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
        const existingIds = new Set(fetchedCourses.map(c => c.id))
        const uniqueLocal = localList.filter(c => !existingIds.has(c.id))
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
      const path = `courses/${Date.now()}.${file.name.split('.').pop()}`
      const { error } = await supabase.storage.from('media').upload(path, file, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('media').getPublicUrl(path)
        setForm(f => ({ ...f, cover_image_url: data.publicUrl }))
      } else {
        const reader = new FileReader()
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setForm(f => ({ ...f, cover_image_url: reader.result as string }))
          }
        }
        reader.readAsDataURL(file)
      }
    } catch (e) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setForm(f => ({ ...f, cover_image_url: reader.result as string }))
        }
      }
      reader.readAsDataURL(file)
    }
    setUploading(false)
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

    // 1. Try Supabase
    try {
      if (editing) {
        const { error } = await supabase.from('courses').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id)
        if (!error) saved = true
      } else {
        const { error } = await supabase.from('courses').insert([payload])
        if (!error) saved = true
      }
    } catch (err) {
      console.warn('Supabase save error:', err)
    }

    // 2. Always sync with localStorage
    try {
      const local = localStorage.getItem('shakti_custom_courses')
      let list: Course[] = local ? JSON.parse(local) : []
      if (editing) {
        list = list.map(item => item.id === editing.id ? { ...item, ...payload, updated_at: new Date().toISOString() } : item)
      } else {
        const newCourse: Course = {
          id: `course_${Date.now()}`,
          ...payload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        list = [newCourse, ...list]
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
    try {
      await supabase.from('courses').delete().eq('id', id)
    } catch (e) {
      console.warn(e)
    }
    try {
      const local = localStorage.getItem('shakti_custom_courses')
      if (local) {
        const list: Course[] = JSON.parse(local)
        const updated = list.filter(c => c.id !== id)
        localStorage.setItem('shakti_custom_courses', JSON.stringify(updated))
      }
    } catch (e) {
      console.warn(e)
    }
    load()
  }

  return (
    <>
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
                <label className={s.label}>Cover Image</label>
                {form.cover_image_url && <img src={form.cover_image_url} alt="" style={{ height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadCover(e.target.files[0])} />
                <button className={s.btnSecondary} onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? 'Uploading...' : <><GoogleIcon name="upload_file" size={16} style={{ marginRight: 6 }} /> Upload Cover Image</>}
                </button>
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
