import './App.css'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

const BASE_URL = import.meta.env.BASE_URL ?? '/'
const resolvePublic = (path) => `${BASE_URL}${path}`

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker

function NewsPdfCard({ item, onOpen }) {
  const [numPages, setNumPages] = useState(null)

  return (
    <article className="newsCard">
      <button type="button" className="newsThumb" onClick={() => onOpen(item)} aria-label={`Open ${item.title} PDF`}>
        <div className="newsPager" aria-hidden="true">
          <span className="newsPagerPill">1</span>
          <span className="newsPagerOf">of</span>
          <span className="newsPagerPill">{numPages ?? '–'}</span>
        </div>

        <div className="newsThumbFrame" aria-hidden="true">
          <Document
            file={item.pdfUrl}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            onLoadError={(e) => console.error('PDF thumb load failed:', item.pdfUrl, e)}
            loading={null}
            error={<div className="pdfThumbError">PDF preview unavailable</div>}
            noData={null}
          >
            <Page pageNumber={1} width={310} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>
        </div>
      </button>

      <div className="newsMeta">
        <div className="newsTitle">{item.title}</div>
        <div className="newsBody">{item.desc}</div>
        <button type="button" className="newsBtn" onClick={() => onOpen(item)}>
          Read More
        </button>
      </div>
    </article>
  )
}

const SLIDES = [
  {
    id: 'hero-1',
    imageUrl: resolvePublic('images/HomePage_img1.jpg'),
    alt: 'EV dashboard background',
  },
  {
    id: 'hero-2',
    imageUrl: resolvePublic('images/hero-2.svg'),
    alt: 'EV charging background',
  },
  {
    id: 'hero-3',
    imageUrl: resolvePublic('images/hero-3.svg'),
    alt: 'EV infrastructure background',
  },
]

function App() {
  const [active, setActive] = useState(0)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [demoVideoId, setDemoVideoId] = useState(null)
  const demosRef = useRef(null)
  const newsRef = useRef(null)
  const [openPdf, setOpenPdf] = useState(null)
  const [openPdfPage, setOpenPdfPage] = useState(1)
  const [openPdfPages, setOpenPdfPages] = useState(0)
  const [openPdfWidth, setOpenPdfWidth] = useState(920)

  const slide = useMemo(() => SLIDES[active] ?? SLIDES[0], [active])

  const goPrev = () => setActive((i) => (i - 1 + SLIDES.length) % SLIDES.length)
  const goNext = () => setActive((i) => (i + 1) % SLIDES.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'Escape') setServicesOpen(false)
      if (e.key === 'Escape') setOpenPdf(null)
      if (e.key === 'Escape') setDemoVideoId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length)
    }, 9000)
    return () => window.clearInterval(id)
  }, [])

  const DEMOS = useMemo(
    () => [
      {
        title: 'EV Buddy PowerShare',
        desc: 'EV Charging from One Car to Another: Beta service is available in NJ',
        youtubeId: '89oIQkmxe3w',
      },
      {
        title: 'RANGE ANXIETY IS DEAD',
        desc: 'EV Buddy PowerShare charging a Lucid EV using our portable V2V',
        youtubeId: 'z-snSx1SnOs',
      },
      {
        title: 'BrightDrop Van',
        desc: 'Commercial fleet charging made simple with BrightDrop',
        youtubeId: 'ysz5S6PUM-U',
      },
      {
        title: 'BMW EV',
        desc: 'Premium charging experience for BMW electric vehicles',
        youtubeId: 'ScMzIvxBSi4',
      },
    ],
    []
  )

  const scrollDemos = (direction) => {
    const el = demosRef.current
    if (!el) return
    const card = el.querySelector('.demoCard')
    const cardWidth = card ? card.getBoundingClientRect().width : 320
    const gap = 22
    const delta = (cardWidth + gap) * 2 * (direction === 'left' ? -1 : 1)
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  const CLUSTER_FEATURES = useMemo(
    () => [
      {
        title: 'Scalable Power',
        body: 'Dynamic Power Allocation ensures maximum efficiency and scalability for high-demand environments.',
      },
      {
        title: '32" Multimedia Touch Screen',
        body: 'Intuitive user interaction combined with targeted advertising opportunities to boost revenue.',
      },
      {
        title: 'Smart Cable Management',
        body: 'Future-proof organizational systems for a clean, safe, and efficient charging experience.',
      },
      {
        title: 'Safety & Certification',
        body: 'Built to the highest international standards, ensuring reliability and full regulatory compliance.',
      },
      {
        title: 'Streaming Revenue',
        body: 'Lower break-even point with integrated multimedia monetization and advertising systems.',
      },
    ],
    []
  )

  const PILOTS = useMemo(
    () => [
      { name: 'Northeast', note: 'Pilot Program Launching Soon' },
      { name: 'Bay Area', note: 'Pilot Program Launching Soon' },
      { name: 'Oregon markets', note: 'Pilot Program Launching Soon' },
    ],
    []
  )

  const MARKET_POINTS = useMemo(
    () => [
      'First Portable V2V Charger',
      'Patent-Pending Technology',
      '3x Scalable Revenue Streams',
      'Pilot Program Ready',
      'Strategic Infrastructure Play',
      'Disruptive CaaS Model',
    ],
    []
  )

  const MARKET_STATS = useMemo(
    () => [
      { value: '$65B', label: 'EV Charging Market' },
      { value: '23%', label: 'YoY EV Growth' },
      { value: '$5B', label: 'Roadside Market' },
      { value: '287M+', label: 'EVs by 2030' },
    ],
    []
  )

  const NEWS = useMemo(
    () => [
      {
        title: 'EV Buddy: NJ CSIT-Approved Exclusive EV-to-EV Charger',
        desc: "EV Buddy is NJ CSIT's sole approved EV-to-EV charger, recognized for its innovation.",
        pdfUrl: `${import.meta.env.BASE_URL}PressAndNews/itserve-award-CjSkpRC2.pdf`,
      },
      {
        title: 'EV Buddy Opens Waitlist for Mobile V2V DC Fast-Charging Service',
        desc: "Drivers & hosts earn delivering on-site V2V DC fast charging. Join EV Buddy's waitlist.",
        pdfUrl: `${import.meta.env.BASE_URL}PressAndNews/evbuddy-waitlist-CZRXKxEg.pdf`,
      },
      {
        title: 'EV Buddy x EcoG: Next-Gen V2V Charging Partnership',
        desc: 'EV Buddy and EcoG announce a strategic agreement for next-gen V2V fast DC portable chargers.',
        pdfUrl: `${import.meta.env.BASE_URL}PressAndNews/evbuddy-ecog-DmLFxWcc.pdf`,
      },
      {
        title: "PlugIn Voices Support for EVBuddy's EVChargeShare",
        desc: 'Exciting news for EV Buddy! PlugIn has expressed strong support for our patent-pending portable V2V DC fast charging.',
        pdfUrl: `${import.meta.env.BASE_URL}PressAndNews/Einpressware-q4ojpea_.pdf`,
      },
    ],
    []
  )

  const openPdfViewer = (item) => {
    setOpenPdf(item)
    setOpenPdfPage(1)
    setOpenPdfPages(0)
  }

  useEffect(() => {
    if (!openPdf) return
    const onResize = () => setOpenPdfWidth(Math.min(980, Math.max(320, window.innerWidth - 80)))
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [openPdf])

  const scrollNews = (direction) => {
    const el = newsRef.current
    if (!el) return
    const card = el.querySelector('.newsCard')
    const cardWidth = card ? card.getBoundingClientRect().width : 340
    const gap = 22
    const delta = (cardWidth + gap) * (direction === 'left' ? -1 : 1)
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbarInner">
          <div className="brand">
            <img className="brandLogo" src={resolvePublic('images/Evbuddy_logo.png')} alt="EV Buddy" />
          </div>

          <nav className="nav" aria-label="Primary">
            <a className="navItem navActive" href="#home">
              Home
            </a>

            <div
              className={servicesOpen ? 'navDropdown navDropdownOpen' : 'navDropdown'}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="navItem navButton"
                aria-haspopup="menu"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((o) => !o)}
              >
                Services <span className="caret" aria-hidden="true" />
              </button>
              <div className="dropdownMenu" role="menu">
                <a className="dropdownItem" role="menuitem" href="#services">
                  Mobile Charging
                </a>
                <a className="dropdownItem" role="menuitem" href="#services">
                  Home Installation
                </a>
                <a className="dropdownItem" role="menuitem" href="#services">
                  Fleet Solutions
                </a>
              </div>
            </div>

            <a className="navItem" href="#investment">
              Investment
            </a>
            <a className="navItem" href="#news">
              Latest News
            </a>
            <a className="navItem" href="#rent">
              Rent Charger
            </a>
          </nav>

          <div className="topRight">
            <a className="signIn" href="#signin">
              New User? / Sign in
            </a>
            <button type="button" className="themeBtn" aria-label="Toggle theme">
              <span className="sun" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main id="home" className="hero" aria-label="Hero">
        <div className="heroBg" aria-hidden="true">
          <img className="heroImg" src={slide.imageUrl} alt={slide.alt} />
          <div className="heroOverlay" />
        </div>

        <button type="button" className="arrow arrowLeft" onClick={goPrev} aria-label="Previous slide">
          <span className="arrowIcon" aria-hidden="true" />
        </button>
        <button type="button" className="arrow arrowRight" onClick={goNext} aria-label="Next slide">
          <span className="arrowIcon" aria-hidden="true" />
        </button>

        <div className="heroContent">
          <h1 className="heroTitle">
            Powering the Future of EV
            <br />
            Charging Infrastructure
          </h1>

          <p className="heroSub">
            EV Buddy is revolutionizing how EVs stay on the move. Our mission is to eliminate range anxiety and build a
            scalable, mobile charging ecosystem for the next generation of mobility.
          </p>

          <div className="heroCtas">
            <a className="cta ctaPrimary" href="#investment">
              Invest in EV Buddy
            </a>
            <a className="cta ctaSecondary" href="#rent">
              Rent a Charger
            </a>
          </div>

          <div className="dots" role="tablist" aria-label="Slides">
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                className={idx === active ? 'dot dotActive' : 'dot'}
                aria-label={`Go to slide ${idx + 1}`}
                aria-selected={idx === active}
                onClick={() => setActive(idx)}
              />
            ))}
          </div>
        </div>
      </main>

      <section className="help" aria-label="How can we help?">
        <div className="helpInner">
          <h2 className="helpTitle">How can we help?</h2>

          <div className="helpGrid">
            <div className="helpCard helpProblem">
              <div className="helpIconWrap" aria-hidden="true">
                <div className="helpIconDot" />
              </div>
              <div className="helpHeading">The Problem</div>
              <div className="helpBody">
                Stranded EV drivers face towing costs averaging $200+ and hours of stress. Current infrastructure gaps
                leave drivers vulnerable.
              </div>
            </div>

            <div className="helpCard helpSolution">
              <div className="helpIconWrap" aria-hidden="true">
                <svg className="helpIconBolt" viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path d="M13 2L3 14h7l-1 8 12-14h-7l-1-6z" fill="currentColor" />
                </svg>
              </div>
              <div className="helpHeading">Our Solution</div>
              <div className="helpBody">
                EV Buddy's patent-pending V2V rapid charger lets any EV share range instantly. No tow truck needed, just
                power on demand.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="works" aria-label="How EVChargeShare Works">
        <div className="worksInner">
          <h2 className="worksTitle">How EVChargeShare Works</h2>
          <p className="worksSub">Simple steps to get you back on the road.</p>

          <div className="worksFlow" role="list" aria-label="EVChargeShare steps">
            <div className="worksStep" role="listitem">
              <div className="worksIcon worksIconPurple" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="worksSvg" role="img" aria-hidden="true">
                  <rect x="8" y="3" width="8" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="18" r="1" fill="currentColor" />
                </svg>
              </div>
              <div className="worksStepTitle">Connect Donor</div>
              <div className="worksStepBody">Donor EV plugs securely into EV Buddy charger securely.</div>
            </div>

            <div className="worksStep" role="listitem">
              <div className="worksIcon worksIconTeal" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="worksSvg" role="img" aria-hidden="true">
                  <path
                    d="M7 7h7a4 4 0 0 1 0 8H9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 4l-3 3 3 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 20l3-3-3-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="worksStepTitle">Power Transfer</div>
              <div className="worksStepBody">Donor EV plugs start charging EV Buddy charging port.</div>
            </div>

            <div className="worksStep" role="listitem">
              <div className="worksIcon worksIconTeal" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="worksSvg" role="img" aria-hidden="true">
                  <path d="M13 2L3 14h7l-1 8 12-14h-7l-1-6z" fill="currentColor" />
                </svg>
              </div>
              <div className="worksStepTitle">Vehicle Ready</div>
              <div className="worksStepBody">Energy flows at ≈ 1 mile gain speed - mile minute rate.</div>
            </div>

            <div className="worksStep" role="listitem">
              <div className="worksIcon worksIconPurple" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="worksSvg" role="img" aria-hidden="true">
                  <path
                    d="M7 7h10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 17h10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 7l-2 2 2 2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 17l2-2-2-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="worksStepTitle">Vehicle Ready</div>
              <div className="worksStepBody">Recipient EV battery gains sufficient needed.</div>
            </div>

            <div className="worksStep" role="listitem">
              <div className="worksIcon worksIconTeal" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="worksSvg" role="img" aria-hidden="true">
                  <rect x="6" y="7" width="12" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M18 10h2v4h-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 12h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="worksStepTitle">Back on Road</div>
              <div className="worksStepBody">Unplug and drive away - no tow truck needed!</div>
            </div>
          </div>
        </div>
      </section>

      <section className="v2v" aria-label="V2V: The Portable Rapid Charger">
        <div className="v2vInner">
          <h2 className="v2vTitle">
            V2V: The Portable Rapid
            <br />
            Charger
          </h2>
          <p className="v2vSub">
            Our innovative V-to-V Smart Jumper Cable technology is designed to eliminate EV charging anxiety, providing
            a faster, easier, and more cost-efficient solution to build the much-needed EV charging infrastructure.
          </p>

          <div className="v2vGrid" role="list" aria-label="EV Buddy services">
            <div className="v2vCard" role="listitem">
              <div className="v2vIconTile" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="v2vIcon" role="img" aria-hidden="true">
                  <path d="M13 2L3 14h7l-1 8 12-14h-7l-1-6z" fill="currentColor" />
                </svg>
              </div>
              <div className="v2vCardTitle">EVChargeShare (V2V)</div>
              <div className="v2vCardBody">
                Our patent-pending portable V2V fast DC charging system allows for Charger-as-a-Service (CaaS). Get a
                mile of range every minute.
              </div>
            </div>

            <div className="v2vCard" role="listitem">
              <div className="v2vIconTile" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="v2vIcon" role="img" aria-hidden="true">
                  <path d="M5 7h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M5 12h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M5 17h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path
                    d="M17 10l2 2-2 2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="v2vCardTitle">Installation Services</div>
              <div className="v2vCardBody">
                Future-ready charging hubs with dynamic power allocation, 32-inch multimedia touch screens, and smart
                cable management.
              </div>
            </div>

            <div className="v2vCard" role="listitem">
              <div className="v2vIconTile" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="v2vIcon" role="img" aria-hidden="true">
                  <path d="M12 3l9 8h-3v10H6V11H3l9-8z" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="v2vCardTitle">EV Buddy Network</div>
              <div className="v2vCardBody">
                A comprehensive app to find chargers, manage charging sessions, and handle payments seamlessly.
              </div>
            </div>

            <div className="v2vCard" role="listitem">
              <div className="v2vIconTile" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="v2vIcon" role="img" aria-hidden="true">
                  <path
                    d="M12 3v18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 7c0-2 2-3 5-3s5 1 5 3-2 3-5 3-5 1-5 3 2 3 5 3 5-1 5-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="v2vCardTitle">Investment Opportunities</div>
              <div className="v2vCardBody">
                Join the $84B EV market. We are crowdfunding to expand our network and technology.
              </div>
            </div>

            <div className="v2vCard" role="listitem">
              <div className="v2vIconTile" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="v2vIcon" role="img" aria-hidden="true">
                  <path
                    d="M3 16h11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 16l2-6h4l1 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="7" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="18" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className="v2vCardTitle">Rent a Charger</div>
              <div className="v2vCardBody">
                Turn your charger into income or find a charger instantly. Join our peer-to-peer charging network.
              </div>
            </div>

            <div className="v2vCard" role="listitem">
              <div className="v2vIconTile" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="v2vIcon" role="img" aria-hidden="true">
                  <rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 9h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M7 13h7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="v2vCardTitle">Latest News</div>
              <div className="v2vCardBody">
                Stay updated with the latest developments in the EV world and EV Buddy's expansion.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="demo" aria-label="See EV Buddy in Action">
        <div className="demoInner">
          <h2 className="demoTitle">See EV Buddy in Action</h2>
          <p className="demoSub">
            Watch real-time, V2V DC fast charging in action and see how easy it is to get back on the road in minutes.
          </p>

          <div className="demoCarousel" aria-label="Demo videos">
            <button type="button" className="demoArrow demoArrowLeft" onClick={() => scrollDemos('left')} aria-label="Scroll left">
              <span className="demoArrowIcon" aria-hidden="true" />
            </button>

            <div className="demoTrack" ref={demosRef}>
              {DEMOS.map((item) => (
                <article key={item.title} className="demoCard">
                  <button
                    type="button"
                    className="demoThumb"
                    onClick={() => setDemoVideoId(item.youtubeId)}
                    aria-label={`Play ${item.title} video`}
                  >
                    <img
                      className="demoImg"
                      src={`https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`}
                      alt={item.title}
                      loading="lazy"
                    />
                    <span className="demoPlay" aria-hidden="true" />
                  </button>

                  <div className="demoMeta">
                    <div className="demoCardTitle">{item.title}</div>
                    <div className="demoCardBody">{item.desc}</div>
                  </div>
                </article>
              ))}
            </div>

            <button type="button" className="demoArrow demoArrowRight" onClick={() => scrollDemos('right')} aria-label="Scroll right">
              <span className="demoArrowIcon" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section id="cluster" className="cluster" aria-label="EVBuddy Cluster">
        <div className="clusterInner">
          <h2 className="clusterTitle">EVBuddy Cluster</h2>
          <p className="clusterSub">
            The EV Buddy Cluster is a dynamic, future-ready charging hub built for scale, performance, and
            profitability. Designed for high-demand environments, this advanced, scalable solution transforms EV
            charging into a profitable business opportunity.
          </p>

          <div className="clusterGrid" aria-label="EVBuddy Cluster details">
            <div className="clusterLeft">
              <div className="clusterKicker">Advanced Features</div>
              <div className="clusterCards" role="list" aria-label="Advanced features">
                {CLUSTER_FEATURES.map((f) => (
                  <div key={f.title} className="clusterCard" role="listitem">
                    <div className="clusterCardTitle">{f.title}</div>
                    <div className="clusterCardBody">{f.body}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="clusterRight" aria-label="EVBuddy Cluster image">
              <div className="clusterImageCard">
                <img
                  className="clusterImage"
                  src={resolvePublic('images/Ev_buddy_cluster.png')}
                  alt="EV Buddy Cluster"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pilots" aria-label="Pilots Program Planned to Launch">
        <div className="pilotsInner">
          <h2 className="pilotsTitle">
            Pilots Program Planned to
            <br />
            Launch
          </h2>
          <p className="pilotsSub">
            Full-Coverage EV Charging Across North America. We are expanding rapidly to serve you better.
          </p>

          <div className="pilotsGrid" role="list" aria-label="Pilot markets">
            {PILOTS.map((p) => (
              <div key={p.name} className="pilotsCard" role="listitem">
                <div className="pilotsIcon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="pilotsSvg" role="img" aria-hidden="true">
                    <path
                      d="M4 6.5c0-.8.7-1.4 1.5-1.4H11c.6 0 1.1.2 1.5.6.4-.4.9-.6 1.5-.6h5.5c.8 0 1.5.6 1.5 1.4v12c0 .7-.7 1.3-1.5 1.3H14c-.6 0-1.1.2-1.5.6-.4-.4-.9-.6-1.5-.6H5.5C4.7 20.4 4 19.8 4 19.1v-12.6z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path d="M12 6.1v14" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M7.2 10.2c1.2-1 2.3-1.1 3.3-.4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14.2 9.6c1.3-.9 2.5-.9 3.6 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M15.2 14.3l1.2 1.2 2.2-2.2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="pilotsName">{p.name}</div>
                <div className="pilotsNote">{p.note}</div>
              </div>
            ))}
          </div>

          <p className="pilotsFooter">
            We are strategically launching in key markets with high EV density to maximize impact and efficiency.
          </p>
        </div>
      </section>

      <section id="investment" className="market" aria-label="Massive Market Infrastructure Opportunity">
        <div className="marketInner">
          <div className="marketGrid">
            <div className="marketLeft">
              <h2 className="marketTitle">
                Massive Market
                <br />
                Infrastructure
                <br />
                Opportunity
              </h2>
              <p className="marketSub">
                The EV revolution is creating a massive infrastructure gap. EV Buddy is positioned to disrupt the
                market with a hyper-scalable, mobile-first charging network. Invest in the bridge to future mobility.
              </p>

              <div className="marketPoints" role="list" aria-label="Market highlights">
                {MARKET_POINTS.map((p) => (
                  <div key={p} className="marketPoint" role="listitem">
                    <span className="marketPointDot" aria-hidden="true" />
                    <span className="marketPointText">{p}</span>
                  </div>
                ))}
              </div>

              <div className="marketCtaRow">
                <a className="marketCta" href="#investment">
                  Invest in EVBUDDY <span className="marketCtaArrow" aria-hidden="true" />
                </a>
              </div>
              <div className="marketFoot">Join 100+ early visionaries. Phase 1 reservation closing soon.</div>
            </div>

            <div className="marketRight" aria-label="Market stats">
              <div className="marketStats" role="list" aria-label="Key market statistics">
                {MARKET_STATS.map((s) => (
                  <div key={s.label} className="marketStat" role="listitem">
                    <div className="marketStatValue">{s.value}</div>
                    <div className="marketStatLabel">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="news" className="news" aria-label="Latest News & Press">
        <div className="newsInner">
          <h2 className="newsHeader">Latest News &amp; Press</h2>
          <p className="newsSub">Stay updated with EV Buddy's latest innovations and partnerships.</p>

          <div className="newsCarousel" aria-label="News carousel">
            <div className="newsTrack" ref={newsRef}>
              {NEWS.map((item) => (
                <NewsPdfCard key={item.pdfUrl} item={item} onOpen={openPdfViewer} />
              ))}
            </div>

            <div className="newsNav" aria-label="News navigation">
              <button type="button" className="newsNavBtn" onClick={() => scrollNews('left')} aria-label="Previous">
                <span className="newsNavIcon" aria-hidden="true" />
              </button>
              <button type="button" className="newsNavBtn" onClick={() => scrollNews('right')} aria-label="Next">
                <span className="newsNavIcon newsNavIconRight" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="preorder" aria-label="Pre-order and newsletter">
        <div className="preorderInner">
          <div className="preorderCard preorderForm">
            <div className="preorderHeader">
              <h2>Pre-Order Form</h2>
              <p>Tell us a bit about you and your EV. We'll follow up shortly.</p>
            </div>
            <div className="preorderGrid">
              <label>
                Full Name *
                <input type="text" name="fullName" placeholder="Enter your name" />
              </label>
              <label>
                Email Address *
                <input type="email" name="email" placeholder="Enter your email" />
              </label>
              <label>
                Phone Number *
                <input type="tel" name="phone" placeholder="(123) 456-7890" />
              </label>
              <label className="accountType">
                Account Type *
                <div className="accountButtons">
                  <button type="button" className="accountBtn active">Personal</button>
                  <button type="button" className="accountBtn">Company</button>
                </div>
              </label>
              <label>
                Street Address *
                <input type="text" name="address" placeholder="" />
              </label>
              <label>
                City *
                <input type="text" name="city" placeholder="" />
              </label>
              <label>
                State *
                <input type="text" name="state" placeholder="Select State" />
              </label>
              <label>
                ZIP Code *
                <input type="text" name="zip" placeholder="" />
              </label>
              <label>
                EV Type *
                <input type="text" name="evType" placeholder="Rivian, Ford, etc." />
              </label>
              <label>
                Comment (Optional)
                <input type="text" name="comment" placeholder="Enter your message" />
              </label>
            </div>
            <button type="button" className="preorderSubmit">
              Submit Pre-Order
            </button>
          </div>

          <div className="preorderCard preorderSubscribe">
            <div>
              <h3>Subscribe to receive future updates from EVBUDDY</h3>
              <p>You will receive important updates, promotions, and many more cool stuffs from us once you subscribe.</p>
            </div>
            <label>
              Name
              <input type="text" name="subName" placeholder="Enter your name" />
            </label>
            <label>
              Email
              <input type="email" name="subEmail" placeholder="Enter your email" />
            </label>
            <button type="button" className="subscribeBtn">
              Subscribe
            </button>
            <p className="subscribeNote">No spam guaranteed, so please don't send any spam mail.</p>
          </div>
        </div>
      </section>

      {demoVideoId ? (
        <div className="demoModalBackdrop" role="dialog" aria-modal="true" aria-label="Video player">
          <button type="button" className="demoModalClose" onClick={() => setDemoVideoId(null)} aria-label="Close video" />
          <div className="demoModal">
            <iframe
              className="demoIframe"
              src={`https://www.youtube-nocookie.com/embed/${demoVideoId}?autoplay=1&rel=0`}
              title="EV Buddy demo video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}

      {openPdf ? (
        <div className="pdfModalBackdrop" role="dialog" aria-modal="true" aria-label="PDF viewer">
          <button type="button" className="pdfModalClose" onClick={() => setOpenPdf(null)} aria-label="Close PDF" />
          <div className="pdfModal">
            <div className="pdfTop">
              <div className="pdfTopTitle">{openPdf.title}</div>
              <div className="pdfTopActions">
                <button
                  type="button"
                  className="pdfNavBtn"
                  onClick={() => setOpenPdfPage((p) => Math.max(1, p - 1))}
                  disabled={openPdfPage <= 1}
                >
                  Prev
                </button>
                <div className="pdfTopPage">
                  {openPdfPage} / {openPdfPages || '–'}
                </div>
                <button
                  type="button"
                  className="pdfNavBtn"
                  onClick={() => setOpenPdfPage((p) => Math.min(openPdfPages || p + 1, p + 1))}
                  disabled={openPdfPages ? openPdfPage >= openPdfPages : false}
                >
                  Next
                </button>
                <a className="pdfOpenNew" href={openPdf.pdfUrl} target="_blank" rel="noreferrer">
                  Open
                </a>
              </div>
            </div>

            <div className="pdfBody">
              <Document
                file={openPdf.pdfUrl}
                onLoadSuccess={({ numPages }) => setOpenPdfPages(numPages)}
                onLoadError={(e) => console.error('PDF load failed:', openPdf.pdfUrl, e)}
                loading={<div className="pdfLoading">Loading PDF…</div>}
                error={<div className="pdfLoading">Failed to load PDF. Try the “Open” button.</div>}
              >
                <Page
                  pageNumber={openPdfPage}
                  width={openPdfWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
