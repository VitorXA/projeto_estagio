import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, useLocation, useNavigate as useRouterNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  Activity, ArrowRight, Bell, Bookmark, BriefcaseBusiness,
  CalendarDays, Check, CheckCheck, ChevronDown, ChevronRight, Clock3,
  FileCheck2, FileText, GraduationCap, Home, LogOut, Menu, MessageCircle,
  MoreHorizontal, Plus, Search, Settings, ShieldCheck, Sparkles, UserRound, Users,
  X, MapPin, SlidersHorizontal, ExternalLink, CheckCircle2, AlertCircle, Upload,
  Eye, LockKeyhole, CalendarClock, PanelTop, CircleUserRound,
} from 'lucide-react'
import type { Job, Application } from './data/mockData'
import { jobs, initialApplications } from './data/mockData'

type Page = 'overview' | 'work' | 'line' | 'applications' | 'profile' | 'internships' | 'documents' | 'network' | 'messages' | 'job-details'
type ModalState = { kind: 'job'; job: Job } | { kind: 'notice'; title: string; body: string } | null

const navigation: { label: string; page: Page; icon: typeof Home; group: string }[] = [
  { label: 'Home', page: 'overview', icon: Home, group: 'home' },
  { label: 'Work', page: 'work', icon: BriefcaseBusiness, group: 'work' },
  { label: 'Line', page: 'line', icon: Users, group: 'line' },
]

function Avatar({ initials = 'MA', size = 'normal' }: { initials?: string; size?: 'normal' | 'small' | 'large' }) {
  return <div className={`avatar avatar-${size}`} aria-label="Avatar do perfil">{initials}</div>
}

function StatusPill({ children, tone = 'gray' }: { children: ReactNode; tone?: string }) {
  return <span className={`status-pill tone-${tone}`}><span className="status-dot" />{children}</span>
}

function App() {
  const routerNavigate = useRouterNavigate()
  const location = useLocation()
  const [page, setPage] = useState<Page>('overview')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [modal, setModal] = useState<ModalState>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [applicationRows, setApplicationRows] = useState<Application[]>(initialApplications)
  const [savedJobs, setSavedJobs] = useState<number[]>([3])
  const [feedQuery, setFeedQuery] = useState('')
  const [applicationFilter, setApplicationFilter] = useState('Todas')
  const [workTab, setWorkTab] = useState<'applications' | 'internships' | 'documents'>('applications')
  const [lineTab, setLineTab] = useState<'network' | 'messages'>('network')
  const [profileName, setProfileName] = useState('Mariana Alves')
  const [profileBio, setProfileBio] = useState('Estudante de tecnologia interessada em desenvolvimento web, produtos digitais e soluções que geram impacto.')
  const [profileSaved, setProfileSaved] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const filteredApplications = useMemo(() => applicationRows.filter((item) => applicationFilter === 'Todas' || item.status === applicationFilter), [applicationRows, applicationFilter])
  const pageTitle = page === 'profile' ? 'Meu perfil' : page === 'job-details' ? 'Detalhes da vaga' : (navigation.find((item) => item.page === page)?.label ?? (['applications', 'internships', 'documents'].includes(page) ? 'Work' : 'Home'))
  const activeApplicationCount = applicationRows.filter((item) => item.status !== 'Vaga cancelada').length

  useEffect(() => {
    const path = location.pathname.replace(/\/$/, '') || '/'
    if (path === '/') setPage('overview')
    else if (path === '/work') { setPage('work'); setWorkTab('applications') }
    else if (path.startsWith('/work/')) { setPage('work'); setWorkTab(path.split('/')[2] as 'applications' | 'internships' | 'documents') }
    else if (path === '/line') { setPage('line'); setLineTab('network') }
    else if (path.startsWith('/line/')) { setPage('line'); setLineTab(path.split('/')[2] as 'network' | 'messages') }
    else if (path === '/profile') setPage('profile')
    else if (path.startsWith('/jobs/')) { const id = Number(path.split('/')[2]); const found = jobs.find((job) => job.id === id); if (found) { setSelectedJob(found); setPage('job-details') } else { setPage('overview'); routerNavigate('/', { replace: true }) } }
    else { setPage('overview'); routerNavigate('/', { replace: true }) }
  }, [location.pathname, routerNavigate])

  function navigate(nextPage: Page) {
    const paths: Record<Page, string> = { overview: '/', 'job-details': selectedJob ? `/jobs/${selectedJob.id}` : '/', work: '/work/applications', applications: '/work/applications', internships: '/work/internships', documents: '/work/documents', line: '/line/network', network: '/line/network', messages: '/line/messages', profile: '/profile' }
    if (nextPage === 'applications' || nextPage === 'internships' || nextPage === 'documents') setWorkTab(nextPage)
    if (nextPage === 'network' || nextPage === 'messages') setLineTab(nextPage)
    routerNavigate(paths[nextPage])
    setPage(nextPage === 'applications' || nextPage === 'internships' || nextPage === 'documents' ? 'work' : nextPage === 'network' || nextPage === 'messages' ? 'line' : nextPage)
    setMobileNavOpen(false)
    setShowNotifications(false)
    setShowUserMenu(false)
    setSearchValue('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openJob(job: Job) { setSelectedJob(job); setModal(null); routerNavigate(`/jobs/${job.id}`); setPage('job-details'); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  function applyToJob(job: Job) {
    const alreadyApplied = applicationRows.some((application) => application.jobId === job.id && application.status !== 'Vaga cancelada')
    if (alreadyApplied) {
      setModal({ kind: 'notice', title: 'Você já se candidatou', body: 'Esta candidatura já está no seu painel. Consulte “Minhas candidaturas” para acompanhar o andamento.' })
      return
    }
    const next: Application = {
      id: Date.now(), jobId: job.id, title: job.title, company: job.company,
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
      status: 'Enviada', statusTone: 'gray', nextStep: 'Sua candidatura foi registrada no protótipo. O próximo estado dependeria do backend e da ação da empresa.',
    }
    setApplicationRows((current) => [next, ...current])
    setModal({ kind: 'notice', title: 'Candidatura registrada no protótipo', body: 'A candidatura foi adicionada a “Minhas candidaturas” usando dados locais do navegador. Nenhuma empresa real foi notificada e nenhum dado foi enviado a um servidor.' })
  }

  function toggleSaved(jobId: number) {
    setSavedJobs((current) => current.includes(jobId) ? current.filter((id) => id !== jobId) : [...current, jobId])
  }

  return (
    <div className="app-shell">
      {mobileNavOpen && <button className="mobile-scrim" aria-label="Fechar menu" onClick={() => setMobileNavOpen(false)} />}
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <button className="brand-lockup" onClick={() => navigate('overview')} aria-label="IFCE Carreiras, página inicial">
          <span className="brand-emblem"><GraduationCap size={24} strokeWidth={2.2} /></span>
          <span className="brand-copy"><strong>IFCE <span>Carreiras</span></strong></span>
        </button>

        <div className="workspace-chip"><span className="workspace-mark">IF</span><span><strong>Área do estudante</strong><small>Campus Fortaleza</small></span><ChevronDown size={15} /></div>

        <nav className="side-nav" aria-label="Navegação principal">
          <span className="nav-eyebrow">HOME</span>
          {navigation.filter((item) => item.group === 'home').map((item) => {
            const Icon = item.icon
            return <button key={item.page} className={`nav-item ${page === item.page ? 'nav-active' : ''}`} onClick={() => navigate(item.page)}><Icon size={18} /><span>{item.label}</span></button>
          })}
          <span className="nav-eyebrow nav-gap">WORK</span>
          {navigation.filter((item) => item.group === 'work').map((item) => {
            const Icon = item.icon
            return <button key={item.page} className={`nav-item ${page === item.page || ['applications', 'internships', 'documents'].includes(page) ? 'nav-active' : ''}`} onClick={() => navigate(item.page)}><Icon size={18} /><span>{item.label}</span><span className="nav-count">{activeApplicationCount}</span></button>
          })}
          <span className="nav-eyebrow nav-gap">LINE</span>
          {navigation.filter((item) => item.group === 'line').map((item) => {
            const Icon = item.icon
            return <button key={item.page} className={`nav-item ${page === item.page || ['network', 'messages'].includes(page) ? 'nav-active' : ''}`} onClick={() => navigate(item.page)}><Icon size={18} /><span>{item.label}</span></button>
          })}
        </nav>

        <div className="sidebar-spacer" />
        <button className="nav-item sidebar-settings" onClick={() => setModal({ kind: 'notice', title: 'Configurações', body: 'Preferências, privacidade e configurações da conta ainda serão conectadas ao backend. Esta demonstração não persiste dados fora da sessão.' })}><Settings size={18} /><span>Configurações</span></button>
        <div className="sidebar-profile">
          <Avatar size="small" />
          <span className="sidebar-profile-copy"><strong>{profileName}</strong><small>Estudante</small></span>
          <button aria-label="Abrir menu do usuário" className="icon-button quiet" onClick={() => setShowUserMenu(!showUserMenu)}><MoreHorizontal size={19} /></button>
          {showUserMenu && <div className="floating-menu user-menu"><button onClick={() => navigate('profile')}><UserRound size={15} /> Meu perfil</button><button onClick={() => setModal({ kind: 'notice', title: 'Sair da conta', body: 'A autenticação ainda não está conectada. Nenhuma sessão real será encerrada neste protótipo.' })}><LogOut size={15} /> Sair</button></div>}
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu-trigger" aria-label="Abrir menu de navegação" onClick={() => setMobileNavOpen(true)}><Menu size={21} /></button>
            <div className="breadcrumb"><span>Início</span><ChevronRight size={14} /><strong>{pageTitle}</strong></div>
          </div>
          <div className="topbar-actions">
            <div className={`global-search ${mobileSearchOpen ? 'global-search-open' : ''}`}>
              <Search size={17} />
              <input aria-label="Buscar no IFCE Carreiras" placeholder="Buscar oportunidades, pessoas..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { setFeedQuery(searchValue); navigate('overview') } }} />
              <kbd>⌘ K</kbd>
              {searchValue && <div className="search-suggestion"><p>Buscar por “{searchValue}”</p><button onClick={() => { setFeedQuery(searchValue); navigate('overview') }}>Ver oportunidades <ArrowRight size={14} /></button></div>}
            </div>
            <button className="icon-button mobile-search-trigger" aria-label="Abrir busca" onClick={() => setMobileSearchOpen(!mobileSearchOpen)}><Search size={19} /></button>
            <div className="notification-wrap">
              <button className={`icon-button notification-button ${showNotifications ? 'is-open' : ''}`} aria-label="Notificações" onClick={() => setShowNotifications(!showNotifications)}><Bell size={19} /><span className="notification-indicator" /></button>
              {showNotifications && <div className="notification-popover"><div className="popover-heading"><strong>Notificações</strong><button onClick={() => setShowNotifications(false)} aria-label="Fechar notificações"><X size={16} /></button></div><div className="notification-item"><span className="notification-icon bg-blue"><CalendarClock size={17} /></span><span><strong>Entrevista agendada</strong><small>Orbit Mobile · confira os detalhes da convocação.</small><em>Há 1 dia</em></span></div><div className="notification-item"><span className="notification-icon bg-green"><FileCheck2 size={17} /></span><span><strong>Perfil quase completo</strong><small>Adicione projetos para mostrar seu trabalho.</small><em>Há 3 dias</em></span></div><button className="popover-footer" onClick={() => navigate('applications')}>Ver minhas atividades <ArrowRight size={14} /></button></div>}
            </div>
            <button className="topbar-avatar" aria-label="Abrir meu perfil" onClick={() => navigate('profile')}><Avatar size="small" /></button>
          </div>
        </header>

        <div className="page-content">
          <div className="prototype-note"><span><Activity size={14} /></span><p><strong>Ambiente de demonstração</strong><span>Dados fictícios · ações não enviam informações a serviços reais.</span></p><button onClick={() => setModal({ kind: 'notice', title: 'Sobre esta demonstração', body: 'Este é um front-end inicial com navegação e interações locais. Autenticação, persistência, autorização final, notificações reais e integrações ainda exigem backend, testes e validação institucional.' })}>Saiba mais <ArrowRight size={13} /></button></div>
          {page === 'overview' && <Overview onOpenJob={openJob} onSave={toggleSaved} savedJobs={savedJobs} applications={applicationRows} feedQuery={feedQuery} setFeedQuery={setFeedQuery} />}
          {page === 'work' && <section className="work-hub"><div className="work-hub-tabs filter-tabs" role="tablist" aria-label="Seções de Work"><button role="tab" aria-selected={workTab === 'applications'} className={workTab === 'applications' ? 'filter-tab-active' : ''} onClick={() => navigate('applications')}>Minhas candidaturas <span>{activeApplicationCount}</span></button><button role="tab" aria-selected={workTab === 'internships'} className={workTab === 'internships' ? 'filter-tab-active' : ''} onClick={() => navigate('internships')}>Meus estágios</button><button role="tab" aria-selected={workTab === 'documents'} className={workTab === 'documents' ? 'filter-tab-active' : ''} onClick={() => navigate('documents')}>Documentos</button></div>{workTab === 'applications' && <ApplicationsPage applications={filteredApplications} filter={applicationFilter} setFilter={setApplicationFilter} onOpportunities={() => navigate('overview')} onOpenJob={(id) => { const job = jobs.find((item) => item.id === id); if (job) openJob(job) }} />}{workTab === 'internships' && <InternshipsPage />}{workTab === 'documents' && <DocumentsPage />}</section>}
          {page === 'job-details' && selectedJob && <JobDetailsPage job={selectedJob} saved={savedJobs.includes(selectedJob.id)} alreadyApplied={applicationRows.some((app) => app.jobId === selectedJob.id && app.status !== 'Vaga cancelada')} onBack={() => navigate('overview')} onSave={() => toggleSaved(selectedJob.id)} onApply={() => applyToJob(selectedJob)} onApplications={() => navigate('applications')} />}
          {page === 'profile' && <ProfilePage name={profileName} setName={(value) => { setProfileName(value); setProfileSaved(false) }} bio={profileBio} setBio={(value) => { setProfileBio(value); setProfileSaved(false) }} saved={profileSaved} onSave={() => setProfileSaved(true)} />}
          {page === 'line' && <section className="line-hub"><div className="work-hub-tabs filter-tabs" role="tablist" aria-label="Seções de Line"><button role="tab" aria-selected={lineTab === 'network'} className={lineTab === 'network' ? 'filter-tab-active' : ''} onClick={() => navigate('network')}><Users size={14} /> Rede acadêmica</button><button role="tab" aria-selected={lineTab === 'messages'} className={lineTab === 'messages' ? 'filter-tab-active' : ''} onClick={() => navigate('messages')}><MessageCircle size={14} /> Mensagens</button></div>{lineTab === 'network' ? <NetworkPage onOpportunities={() => navigate('overview')} /> : <MessagesPage />}</section>}
          <footer className="page-footer"><span>© 2026 IFCE Carreiras</span><span><ShieldCheck size={13} /> Sua jornada, com privacidade e transparência.</span><span className="footer-version">Prototype v0.1</span></footer>
        </div>
      </main>

      <nav className="mobile-bottom-nav" aria-label="Navegação móvel">
        <button className={page === 'overview' ? 'mobile-nav-active' : ''} onClick={() => navigate('overview')} aria-current={page === 'overview' ? 'page' : undefined}><Home size={20} /><span>Home</span></button>
        <button className={page === 'work' || ['applications', 'internships', 'documents'].includes(page) ? 'mobile-nav-active' : ''} onClick={() => navigate('work')} aria-label="Abrir seção Work"><BriefcaseBusiness size={20} /><span>Work</span></button>
        <button className={page === 'line' || ['network', 'messages'].includes(page) ? 'mobile-nav-active' : ''} onClick={() => navigate('line')} aria-label="Abrir seção Line"><Users size={20} /><span>Line</span></button>
      </nav>

      {modal && <Modal state={modal} onClose={() => setModal(null)} onApply={applyToJob} applications={applicationRows} onNavigate={navigate} />}
    </div>
  )
}

function Overview({ onOpenJob, onSave, savedJobs, applications, feedQuery, setFeedQuery }: { onOpenJob: (job: Job) => void; onSave: (id: number) => void; savedJobs: number[]; applications: Application[]; feedQuery: string; setFeedQuery: (value: string) => void }) {
  const [feedArea, setFeedArea] = useState('Todas as áreas')

  const feedJobs = useMemo(() => {
    const query = feedQuery.trim().toLocaleLowerCase('pt-BR')
    return [...jobs]
      .filter((job) => feedArea === 'Todas as áreas' || job.area === feedArea)
      .filter((job) => !query || `${job.title} ${job.company} ${job.area} ${job.tags.join(' ')}`.toLocaleLowerCase('pt-BR').includes(query))
      .sort((a, b) => b.fit - a.fit)
  }, [feedQuery, feedArea])

  return <section className="student-feed">
    <div className="feed-controls">
      <label className="feed-search"><Search size={18} /><input value={feedQuery} onChange={(event) => setFeedQuery(event.target.value)} placeholder="Cargo, empresa ou competência" aria-label="Buscar no feed de vagas" />{feedQuery && <button onClick={() => setFeedQuery('')} aria-label="Limpar busca"><X size={15} /></button>}</label>
      <label className="feed-area-select"><SlidersHorizontal size={16} /><select value={feedArea} onChange={(event) => setFeedArea(event.target.value)} aria-label="Filtrar vagas por área"><option>Todas as áreas</option><option>Tecnologia</option><option>Dados</option><option>Design</option><option>Segurança</option><option>Projetos</option></select><ChevronDown size={15} /></label>
    </div>

    <div className="feed-list">
      {feedJobs.length ? feedJobs.map((job) => {
        const alreadyApplied = applications.some((application) => application.jobId === job.id && application.status !== 'Vaga cancelada')
        return <article className="feed-job-card" key={job.id}>
          <div className="feed-card-header">
            <div className={`company-monogram company-monogram-large ${job.logoClass}`}>{job.logo}</div>
            <div className="feed-company"><strong>{job.company}</strong><span><MapPin size={13} /> {job.location}</span><small>{job.publishedAt ? `Publicada em ${new Date(`${job.publishedAt}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')}` : 'Data de publicação não informada'}</small></div>
            <button className={`icon-button save-button ${savedJobs.includes(job.id) ? 'saved' : ''}`} aria-label={savedJobs.includes(job.id) ? `Remover ${job.title} das vagas salvas` : `Salvar ${job.title}`} onClick={() => onSave(job.id)}><Bookmark size={19} fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'} /></button>
          </div>
          <div className="feed-card-title-row"><h2>{job.title}</h2>{feedMode === 'recommended' && <span className="feed-match"><Sparkles size={12} /> Afinidade {job.fit}%</span>}</div>
          <div className="feed-job-meta"><span><BriefcaseBusiness size={14} /> {job.type}</span><span><PanelTop size={14} /> {job.modality}</span><span><MapPin size={14} /> {job.location}</span></div>
          <p className="feed-description">{job.description}</p>
          <div className="feed-tags">{job.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="feed-card-footer"><div className="feed-pay"><strong>{job.stipend}</strong><span>Remuneração informada no anúncio</span><small><Clock3 size={13} /> {job.deadline}</small></div><div className="feed-card-actions"><button className="button button-outline" onClick={() => onOpenJob(job)}>Ver detalhes</button><button className="button button-primary" disabled={alreadyApplied} onClick={() => onOpenJob(job)}>{alreadyApplied ? <><Check size={15} /> Candidatura enviada</> : <>Ver oportunidade <ArrowRight size={14} /></>}</button></div></div>
          {alreadyApplied && <div className="feed-applied-note"><CheckCircle2 size={14} /> Você já tem uma candidatura para esta vaga.</div>}
        </article>
      }) : <div className="empty-state"><span><Search size={24} /></span><h3>Nenhuma vaga encontrada</h3><p>Altere o termo de busca ou selecione outra área.</p><button className="button button-outline" onClick={() => { setFeedQuery(''); setFeedArea('Todas as áreas') }}>Limpar filtros</button></div>}
    </div>
    <div className="feed-disclaimer"><ShieldCheck size={17} /><p><strong>Dados demonstrativos.</strong> A afinidade é apenas informativa e não representa avaliação definitiva. As datas e vagas deste protótipo não são publicações reais.</p></div>
  </section>
}

function ApplicationsPage({ applications, filter, setFilter, onOpportunities, onOpenJob }: { applications: Application[]; filter: string; setFilter: (value: string) => void; onOpportunities: () => void; onOpenJob: (id: number) => void }) {
  const filters = ['Todas', 'Enviada', 'Em análise', 'Em seleção', 'Entrevista agendada', 'Vaga cancelada']
  return <section className="subpage"><div className="subpage-heading subpage-heading-actions"><span></span><button className="button button-primary" onClick={onOpportunities}><Plus size={16} /> Ver oportunidades</button></div><div className="application-summary-strip"><div><span className="summary-strip-icon"><FileCheck2 size={19} /></span><span><strong>{applications.length}</strong><small>Candidaturas no painel</small></span></div><div><span className="summary-strip-icon summary-purple"><Activity size={19} /></span><span><strong>{applications.filter((a) => ['Em análise', 'Em seleção', 'Entrevista agendada'].includes(a.status)).length}</strong><small>Em andamento</small></span></div><div><span className="summary-strip-icon summary-orange"><CalendarDays size={19} /></span><span><strong>{applications.filter((a) => a.status === 'Entrevista agendada').length}</strong><small>Etapas divulgadas</small></span></div><div className="summary-strip-note"><LockKeyhole size={16} /><span>Seu histórico de candidaturas é privado.</span></div></div>
    <div className="filters-scroll"><div className="filter-tabs" role="tablist" aria-label="Filtrar candidaturas">{filters.map((item) => <button role="tab" aria-selected={filter === item} className={filter === item ? 'filter-tab-active' : ''} key={item} onClick={() => setFilter(item)}>{item}{item === 'Todas' && <span>{applications.length}</span>}</button>)}</div></div>
    <div className="application-list">{applications.length ? applications.map((app) => <article className="application-card" key={app.id}><div className={`company-monogram company-monogram-large ${app.jobId === 2 ? 'logo-blue' : app.jobId === 5 ? 'logo-orange' : app.jobId === 3 ? 'logo-pink' : 'logo-lime'}`}>{app.company.charAt(0)}</div><div className="application-main"><div className="application-title-line"><h2>{app.title}</h2><StatusPill tone={app.statusTone}>{app.status}</StatusPill></div><div className="application-company">{app.company}<span>·</span> Candidatura enviada em {app.date}</div><p>{app.nextStep}</p><div className="timeline-preview"><span className="timeline-check"><Check size={12} /></span><div><strong>Candidatura registrada</strong><small>Dados adicionados ao painel demonstrativo</small></div><span className="timeline-current-line" /><span className="timeline-pending"><Clock3 size={13} /></span><div className="timeline-pending-copy"><strong>Próxima atualização</strong><small>Depende das ações da empresa</small></div></div></div><div className="application-actions"><button className="button button-outline button-small" onClick={() => onOpenJob(app.jobId)}>Ver vaga <ArrowRight size={13} /></button><span><ShieldCheck size={13} /> Visível apenas para você neste protótipo</span></div></article>) : <div className="empty-state"><span><FileCheck2 size={24} /></span><h3>Nenhuma candidatura nesta categoria</h3><p>Experimente outro filtro ou descubra novas oportunidades.</p><button className="button button-primary" onClick={onOpportunities}>Ver oportunidades <ArrowRight size={14} /></button></div>}</div>
    <div className="neutral-note"><AlertCircle size={17} /><p><strong>Um lembrete importante:</strong> os estados são informativos. Ausência de resposta, requisitos não identificados ou cancelamento de vaga não equivalem automaticamente a uma reprovação.</p></div>
  </section>
}

function JobDetailsPage({ job, saved, alreadyApplied, onBack, onSave, onApply, onApplications }: { job: Job; saved: boolean; alreadyApplied: boolean; onBack: () => void; onSave: () => void; onApply: () => void; onApplications: () => void }) {
  return <section className="job-details-page">
    <button className="text-link job-back-link" onClick={onBack}><ArrowRight size={14} className="back-arrow" /> Voltar às oportunidades</button>
    <article className="job-details-card">
      <header className="job-details-header">
        <div className={`company-monogram company-monogram-large ${job.logoClass}`}>{job.logo}</div>
        <div className="job-details-company"><strong>{job.company}</strong><span><MapPin size={14} /> {job.location}</span><small>Publicada em {new Date(`${job.publishedAt}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</small></div>
        <button className={`icon-button save-button ${saved ? 'saved' : ''}`} aria-label={saved ? 'Remover vaga salva' : 'Salvar vaga'} onClick={onSave}><Bookmark size={19} fill={saved ? 'currentColor' : 'none'} /></button>
      </header>
      <div className="job-details-title"><div><span className="section-kicker">{job.type.toUpperCase()} · {job.area.toUpperCase()}</span><h1>{job.title}</h1></div>{alreadyApplied && <StatusPill tone="green">Candidatura enviada</StatusPill>}</div>
      <div className="job-details-meta"><span><BriefcaseBusiness size={15}/>{job.type}</span><span><PanelTop size={15}/>{job.modality}</span><span><MapPin size={15}/>{job.location}</span><span><Clock3 size={15}/>{job.deadline}</span></div>
      <div className="job-details-body">
        <div className="job-details-main">
          <section className="details-section"><h2>Sobre a oportunidade</h2><p>{job.description}</p></section>
          <section className="details-section"><h2>Atividades</h2><p>Participar das atividades da equipe, colaborar na execução de tarefas relacionadas à área e documentar aprendizados e entregas com acompanhamento da supervisão.</p></section>
          <section className="details-section"><h2>Requisitos e competências</h2><p>Conhecimentos ou interesse nas tecnologias e temas relacionados à oportunidade. Os itens abaixo foram mencionados no anúncio:</p><div className="job-card-tags">{job.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></section>
          <section className="details-section"><h2>Informações da oportunidade</h2><dl className="job-facts"><div><dt>Área</dt><dd>{job.area}</dd></div><div><dt>Modalidade</dt><dd>{job.modality}</dd></div><div><dt>Local</dt><dd>{job.location}</dd></div><div><dt>Prazo de inscrição</dt><dd>{job.deadline}</dd></div></dl></section>
        </div>
        <aside className="job-details-aside"><div className="job-aside-panel"><span>Bolsa / remuneração</span><strong>{job.stipend}</strong><small>Conforme informações publicadas no anúncio.</small><button className="button button-primary" disabled={alreadyApplied} onClick={onApply}>{alreadyApplied ? <><Check size={15}/> Candidatura enviada</> : <>Candidatar-se <ArrowRight size={14}/></>}</button><button className="button button-outline" onClick={onSave}><Bookmark size={14}/>{saved ? 'Vaga salva' : 'Salvar vaga'}</button>{alreadyApplied && <button className="text-link" onClick={onApplications}>Acompanhar candidatura <ArrowRight size={14}/></button>}</div><div className="job-details-disclaimer"><ShieldCheck size={16}/><p>Ambiente de demonstração. A candidatura usa dados locais e não envia informações à empresa.</p></div></aside>
      </div>
    </article>
  </section>
}

function ProfilePage({ name, setName, bio, setBio, saved, onSave }: { name: string; setName: (value: string) => void; bio: string; setBio: (value: string) => void; saved: boolean; onSave: () => void }) {
  const [publicProfile, setPublicProfile] = useState(true)
  const [showContact, setShowContact] = useState(false)
  const [editing, setEditing] = useState(true)
  return <section className="subpage"><div className="subpage-heading"><div><div className="eyebrow-line"><span className="eyebrow-dot" /> SUA IDENTIDADE PROFISSIONAL</div><h1>Meu perfil<span className="heading-period">.</span></h1></div><button className="button button-primary" onClick={() => { onSave(); setEditing(false) }}><CheckCheck size={16} /> Salvar alterações</button></div><div className="profile-layout"><div className="profile-main-column"><div className="profile-cover"><div className="cover-art cover-art-a"/><div className="cover-art cover-art-b"/><div className="profile-identity"><Avatar size="large" /><div><span className="profile-role">ESTUDANTE IFCE</span><h2>{name || 'Seu nome'}</h2><p><GraduationCap size={14} /> Tecnologia em Análise e Desenvolvimento de Sistemas</p><p><MapPin size={14} /> Campus Fortaleza · Ceará</p></div></div><span className="profile-completion-badge"><Sparkles size={13} /> Perfil 72% completo</span></div>
    <div className="panel profile-form-panel"><div className="panel-heading"><div><span className="section-kicker">SOBRE VOCÊ</span><h2>Apresente sua trajetória</h2><p>Compartilhe o contexto que ajuda outras pessoas a conhecer você.</p></div><button className="text-link" onClick={() => setEditing(!editing)}>{editing ? 'Pré-visualizar' : 'Editar perfil'} <ArrowRight size={14} /></button></div>{editing ? <div className="form-stack"><label className="form-field"><span>Nome de exibição</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome completo" /></label><label className="form-field"><span>Sobre mim <small>· até 500 caracteres</small></span><textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} maxLength={500} placeholder="Conte um pouco sobre sua trajetória, seus interesses e o que deseja aprender..."/><small className="field-counter">{bio.length}/500</small></label><div className="form-field"><span>Competências</span><div className="skills-edit"><span>HTML</span><span>CSS</span><span>JavaScript</span><button onClick={() => alert('A edição de competências será ligada ao modelo de dados no próximo incremento.')}><Plus size={13} /> Adicionar</button></div></div><div className="form-field"><span>Interesses profissionais</span><div className="skills-edit interest-skills"><span>Desenvolvimento web</span><span>Design de produto</span><span>Trabalho em equipe</span></div></div></div> : <div className="profile-preview"><h3>{name || 'Seu nome'}</h3><p>{bio || 'Adicione uma apresentação para contar sua história.'}</p><div className="skills-edit"><span>HTML</span><span>CSS</span><span>JavaScript</span></div></div>}{saved && <div className="inline-success"><CheckCircle2 size={16} /> Alterações salvas somente nesta demonstração.</div>}</div>
    <div className="panel profile-form-panel"><div className="panel-heading"><div><span className="section-kicker">PROJETOS E EXPERIÊNCIAS</span><h2>Portfólio</h2><p>Mostre projetos acadêmicos, pessoais ou de extensão.</p></div><button className="button button-outline button-small" onClick={() => alert('Cadastro de projetos será implementado na próxima fatia vertical.')}><Plus size={14} /> Adicionar projeto</button></div><div className="portfolio-placeholder"><div className="portfolio-placeholder-icon"><Code2Fallback /></div><div><strong>Seu próximo projeto pode aparecer aqui.</strong><p>Inclua objetivo, sua contribuição, tecnologias utilizadas e o que aprendeu.</p></div><span className="soft-count">Em breve</span></div></div></div>
    <aside className="profile-side-column"><div className="panel visibility-panel"><div className="panel-heading"><div><span className="section-kicker">CONTROLE DE PRIVACIDADE</span><h2>Visibilidade</h2></div><Eye size={17} className="muted-icon" /></div><p>Você decide quais categorias do perfil podem ser vistas por outras pessoas.</p><div className="visibility-toggle-row"><span className="visibility-icon"><CircleUserRound size={17} /></span><span><strong>Perfil básico</strong><small>Nome, curso e biografia</small></span><button className={`toggle-switch ${publicProfile ? 'toggle-on' : ''}`} role="switch" aria-checked={publicProfile} aria-label="Perfil básico público" onClick={() => setPublicProfile(!publicProfile)}><span /></button></div><div className="visibility-toggle-row"><span className="visibility-icon"><FileText size={17} /></span><span><strong>Informações de contato</strong><small>E-mail e telefone</small></span><button className={`toggle-switch ${showContact ? 'toggle-on' : ''}`} role="switch" aria-checked={showContact} aria-label="Contato visível" onClick={() => setShowContact(!showContact)}><span /></button></div><div className="privacy-footnote"><LockKeyhole size={14} /><span>Documentos e dados de estágio permanecem restritos por padrão, mesmo com perfil público.</span></div></div><div className="panel completion-panel"><div className="completion-heading"><span className="completion-icon"><Sparkles size={17} /></span><div><strong>Perfil em construção</strong><small>72% concluído</small></div></div><div className="progress-track large"><span style={{ width: '72%' }} /></div><div className="completion-list"><div><CheckCircle2 size={15} /><span>Informações básicas</span><strong>Concluído</strong></div><div><CheckCircle2 size={15} /><span>Competências</span><strong>Concluído</strong></div><div><Clock3 size={15} /><span>Portfólio de projetos</span><strong>Falta fazer</strong></div><div><Clock3 size={15} /><span>Experiências</span><strong>Falta fazer</strong></div></div><button className="text-link" onClick={() => { setEditing(true); document.querySelector('.profile-form-panel')?.scrollIntoView({ behavior: 'smooth' }) }}>Continuar completando <ArrowRight size={14} /></button></div><div className="profile-tip profile-tip-small"><Sparkles size={17} /><p>Certificados anexados e competências autodeclaradas não significam que uma competência foi verificada.</p></div></aside></div></section>
}

function Code2Fallback() { return <Code2Icon /> }
function Code2Icon() { return <Activity size={22} /> }

function InternshipsPage() {
  return <section className="subpage"><div className="info-banner"><ShieldCheck size={18} /><p>As regras oficiais, os documentos obrigatórios e as condições de início precisam ser confirmados institucionalmente. Esta tela não representa autorização real para início de estágio.</p></div></section>
}

function DocumentsPage() {
  const [selectedTab, setSelectedTab] = useState('Todos')
  const docs = [
    { id: 1, title: 'Currículo profissional', detail: 'PDF · Perfil pessoal', status: 'Rascunho', tone: 'gray', date: 'Ainda não enviado' },
    { id: 2, title: 'Comprovante de matrícula', detail: 'Documento institucional', status: 'Pendente', tone: 'amber', date: 'Aguardando envio' },
    { id: 3, title: 'Certificado de curso introdutório', detail: 'Evidência de competência', status: 'Autodeclarado', tone: 'blue', date: 'Adicionado ao perfil' },
  ]
  const [uploaded, setUploaded] = useState<number[]>([])
  const renderedDocs = docs.filter((doc) => selectedTab === 'Todos' || doc.status === selectedTab || (selectedTab === 'Pendente' && uploaded.includes(doc.id)))
  return <section className="subpage"><div className="subpage-heading subpage-heading-actions"><span></span><button className="button button-primary" onClick={() => document.getElementById('doc-upload')?.click()}><Upload size={16} /> Adicionar documento</button><input id="doc-upload" type="file" accept=".pdf,.png,.jpg,.jpeg" hidden onChange={(e) => { if (e.target.files?.length) alert(`Arquivo “${e.target.files[0].name}” selecionado. O upload real será habilitado após a integração com storage privado.`) }} /></div><div className="document-callout"><span><LockKeyhole size={20} /></span><div><strong>Seus documentos são privados por padrão.</strong><p>Um arquivo anexado não é uma assinatura eletrônica válida nem comprova isoladamente o domínio de uma competência.</p></div></div><div className="documents-toolbar"><div className="filter-tabs">{['Todos', 'Pendente', 'Autodeclarado', 'Rascunho'].map((tab) => <button className={selectedTab === tab ? 'filter-tab-active' : ''} key={tab} onClick={() => setSelectedTab(tab)}>{tab}</button>)}</div><span>{renderedDocs.length} itens</span></div><div className="document-list">{renderedDocs.map((doc) => <article className="document-row" key={doc.id}><span className={`document-file-icon doc-icon-${doc.id}`}><FileText size={21} /></span><div className="document-row-copy"><strong>{doc.title}</strong><span>{doc.detail}</span><small>{uploaded.includes(doc.id) ? 'Arquivo selecionado nesta sessão' : doc.date}</small></div><StatusPill tone={doc.tone}>{uploaded.includes(doc.id) ? 'Selecionado' : doc.status}</StatusPill><button className="button button-outline button-small" onClick={() => doc.id === 1 ? alert('A pré-visualização será ligada à geração de PDF no próximo incremento.') : setUploaded((current) => current.includes(doc.id) ? current : [...current, doc.id])}>{doc.id === 1 ? 'Pré-visualizar' : uploaded.includes(doc.id) ? 'Selecionado' : 'Preparar envio'} <ArrowRight size={13} /></button></article>)}</div><div className="neutral-note"><AlertCircle size={17} /><p>Validação, armazenamento privado, controle de acesso e trilha de auditoria precisam ser implementados no backend antes de utilizar documentos reais.</p></div></section>
}

function NetworkPage({ onOpportunities }: { onOpportunities: () => void }) {
  const [following, setFollowing] = useState<string[]>(['NuvemLab'])
  const people = [{ name: 'Rafael Costa', role: 'Desenvolvedor Front-end Jr.', initials: 'RC', color: 'avatar-blue', tag: 'Tecnologia' }, { name: 'Ana Beatriz Lima', role: 'Product Designer', initials: 'AB', color: 'avatar-pink', tag: 'Design' }, { name: 'Caio Mendes', role: 'Estudante de Sistemas', initials: 'CM', color: 'avatar-lime', tag: 'Comunidade' }]
  const companies = [{ name: 'NuvemLab', area: 'Tecnologia · Fortaleza', initial: 'N', className: 'logo-lime' }, { name: 'DataCeará', area: 'Dados · Ceará', initial: 'D', className: 'logo-blue' }, { name: 'Maré Studio', area: 'Design · Brasil', initial: 'M', className: 'logo-pink' }]
  return <section className="subpage"><div className="network-hero"><div><span className="section-kicker">CONECTE-SE COM SEU FUTURO</span><h2>Boas conexões abrem caminhos.</h2><p>Conheça quem está criando, aprendendo e transformando ideias em projetos.</p><button className="button button-primary" onClick={onOpportunities}>Ver oportunidades <ArrowRight size={14} /></button></div><div className="network-hero-avatars"><span className="network-avatar av1">RC</span><span className="network-avatar av2">AB</span><span className="network-avatar av3">CM</span><span className="network-plus">+</span></div></div><div className="network-section-heading"><div><span className="section-kicker">PESSOAS PARA CONHECER</span><h2>Talentos da comunidade</h2></div><button className="text-link" onClick={() => alert('A busca de pessoas será conectada ao backend com filtros de visibilidade e autorização.')}>Ver comunidade <ArrowRight size={14} /></button></div><div className="people-grid">{people.map((person) => <article className="panel person-card" key={person.name}><div className={`person-avatar ${person.color}`}>{person.initials}</div><span className="person-tag">{person.tag}</span><h3>{person.name}</h3><p>{person.role}</p><button className="button button-outline button-small" onClick={() => alert(`Perfil demonstrativo de ${person.name}. A visualização real respeitará as permissões de perfil.`)}>Ver perfil <ArrowRight size={13} /></button></article>)}</div><div className="network-section-heading"><div><span className="section-kicker">ORGANIZAÇÕES EM DESTAQUE</span><h2>Empresas para acompanhar</h2></div></div><div className="company-follow-list">{companies.map((company) => <div className="company-follow-row" key={company.name}><div className={`company-monogram ${company.className}`}>{company.initial}</div><div><strong>{company.name}</strong><span>{company.area}</span></div><button className={`button ${following.includes(company.name) ? 'button-following' : 'button-outline'} button-small`} onClick={() => setFollowing((prev) => prev.includes(company.name) ? prev.filter((n) => n !== company.name) : [...prev, company.name])}>{following.includes(company.name) ? <><Check size={13} /> Seguindo</> : <><Plus size={13} /> Seguir</>}</button></div>)}</div><div className="info-banner"><Eye size={18} /><p>Resultados de busca e perfis devem respeitar configurações de privacidade, campus, relacionamento e autorização verificada no backend.</p></div></section>
}

function MessagesPage() {
  const [selected, setSelected] = useState('Equipe de orientação')
  const [draft, setDraft] = useState('')
  const [sent, setSent] = useState<string[]>([])
  const conversations = [{ name: 'Equipe de orientação', detail: 'Comunicação institucional', initials: 'EO', color: 'logo-green', time: 'Hoje', preview: 'Bem-vinda ao seu espaço de acompanhamento.' }, { name: 'NuvemLab', detail: 'Contato de recrutamento', initials: 'N', color: 'logo-lime', time: 'Ontem', preview: 'Acompanhe as atualizações da oportunidade.' }, { name: 'Comunidade IFCE', detail: 'Rede acadêmica', initials: 'IF', color: 'logo-blue', time: '18 out', preview: 'Novas atividades e projetos da comunidade.' }]
  const active = conversations.find((conversation) => conversation.name === selected)!
  return <section className="subpage"><div className="messages-panel panel"><aside className="conversation-list"><div className="conversation-list-title"><strong>Conversas</strong><button className="icon-button quiet" aria-label="Nova mensagem" onClick={() => alert('O envio de mensagens exige autenticação, controle de abuso e regras de autorização no backend.')}><Plus size={17} /></button></div>{conversations.map((conversation) => <button className={`conversation-item ${selected === conversation.name ? 'conversation-active' : ''}`} key={conversation.name} onClick={() => setSelected(conversation.name)}><span className={`conversation-avatar ${conversation.color}`}>{conversation.initials}</span><span className="conversation-item-copy"><strong>{conversation.name}</strong><small>{conversation.preview}</small></span><span className="conversation-time">{conversation.time}</span></button>)}</aside><div className="conversation-thread"><div className="thread-heading"><span className={`conversation-avatar ${active.color}`}>{active.initials}</span><span><strong>{active.name}</strong><small><ShieldCheck size={12} /> {active.detail}</small></span><button className="icon-button quiet" aria-label="Mais opções" onClick={() => alert('Opções de bloqueio, denúncia e preferências serão habilitadas quando as mensagens reais forem implementadas.')}><MoreHorizontal size={19} /></button></div><div className="thread-body"><div className="day-divider"><span>HOJE</span></div><div className="message-system"><ShieldCheck size={16} /><span>Esta é uma conversa demonstrativa. Mensagens reais ainda não são enviadas.</span></div><div className="message-bubble received"><p>Bem-vinda ao IFCE Carreiras! Este espaço foi pensado para manter sua jornada organizada e facilitar a comunicação relacionada a oportunidades e estágio.</p><small>09:42</small></div>{sent.map((message, index) => <div className="message-bubble sent" key={`${message}-${index}`}><p>{message}</p><small>Agora · <CheckCheck size={12} /></small></div>)}</div><form className="message-composer" onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { setSent((current) => [...current, draft.trim()]); setDraft('') } }}><input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Escreva uma mensagem local..." aria-label="Escrever mensagem" /><button className="button button-primary" type="submit" disabled={!draft.trim()}>Enviar <ArrowRight size={14} /></button></form><p className="composer-disclaimer">As mensagens ficam somente no estado desta página e não são enviadas a outras pessoas.</p></div></div></section>
}

function Modal({ state, onClose, onApply, applications, onNavigate }: { state: NonNullable<ModalState>; onClose: () => void; onApply: (job: Job) => void; applications: Application[]; onNavigate: (page: Page) => void }) {
  if (state.kind === 'notice') return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}><section className="modal-card notice-modal" role="dialog" aria-modal="true" aria-labelledby="notice-title"><button className="modal-close icon-button" aria-label="Fechar" onClick={onClose}><X size={19} /></button><span className="modal-feature-icon"><CheckCircle2 size={23} /></span><h2 id="notice-title">{state.title}</h2><p>{state.body}</p><button className="button button-primary modal-full-button" onClick={onClose}>Entendi <Check size={15} /></button></section></div>
  const { job } = state
  const alreadyApplied = applications.some((app) => app.jobId === job.id && app.status !== 'Vaga cancelada')
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}><section className="modal-card job-modal" role="dialog" aria-modal="true" aria-labelledby="job-modal-title"><button className="modal-close icon-button" aria-label="Fechar detalhes da vaga" onClick={onClose}><X size={19} /></button><div className="job-modal-company"><div className={`company-monogram company-monogram-large ${job.logoClass}`}>{job.logo}</div><div><strong>{job.company}</strong><span><MapPin size={13} /> {job.location}</span></div><button className="icon-button quiet" aria-label="Abrir empresa" onClick={() => alert('O perfil empresarial será exibido após implementação das regras de acesso.') }><ExternalLink size={16} /></button></div><span className="section-kicker">OPORTUNIDADE DE ESTÁGIO</span><h2 id="job-modal-title">{job.title}</h2><div className="job-card-pills"><span><BriefcaseBusiness size={13} /> {job.type}</span><span><PanelTop size={13} /> {job.modality}</span><span><Clock3 size={13} /> {job.deadline}</span></div><div className="modal-salary"><span>Bolsa informada</span><strong>{job.stipend}</strong></div><div className="modal-section"><h3>Sobre a oportunidade</h3><p>{job.description}</p></div><div className="modal-section"><h3>Competências mencionadas</h3><div className="job-card-tags">{job.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><div className="compatibility-note"><Sparkles size={16} /><p><strong>Informação demonstrativa: afinidade de {job.fit}%.</strong> Esse indicador não é uma avaliação definitiva e não deve rejeitar candidatos automaticamente. Ausência de informação não comprova ausência de competência.</p></div><div className="modal-actions"><button className="button button-outline" onClick={() => { onClose(); onNavigate('applications') }}>Ver candidaturas</button><button className="button button-primary" disabled={alreadyApplied} onClick={() => { onApply(job); onClose() }}>{alreadyApplied ? <><Check size={15} /> Já candidatado</> : <>Candidatar-se <ArrowRight size={14} /></>}</button></div><p className="modal-footnote"><ShieldCheck size={12} /> Demonstração local. Não notifica a empresa nem transmite dados pessoais.</p></section></div>
}

function AppWithRouter() { return <BrowserRouter><App /></BrowserRouter> }

export default AppWithRouter
