const { useState, useEffect, useRef } = React;

const NAVS = ['Home','About','Works','Strengths','Achievements','FAQ'];

const WORKS = [
  { title: 'AI Chat Assistant', tags: ['React','OpenAI','TypeScript'], desc: 'OpenAI APIを活用したAIチャットアシスタントWebアプリ。会話履歴の保存機能付き。', accent: '#6C3CFF', dots: ['#FF5F57','#FEBC2E','#28C840'] },
  { title: 'Study Scheduler', tags: ['Next.js','Tailwind','AI'], desc: 'AIが最適なスケジュールを提案するスタジオ管理ツール。学習効率を最大化します。', accent: '#D6FF3B', dots: ['#FF5F57','#FEBC2E','#28C840'] },
  { title: 'Expense Tracker', tags: ['React','Node','Firebase'], desc: '旅行中の支出を記録・可視化するAD対応のスマートな家計簿アプリ。', accent: '#4ECDC4', dots: ['#FF5F57','#FEBC2E','#28C840'] },
  { title: 'Portfolio Generator', tags: ['Vue','Vite','Figma API'], desc: 'Figmaデザインからポートフォリオサイトを自動生成するCLIツール。', accent: '#FF6B9D', dots: ['#FF5F57','#FEBC2E','#28C840'] },
];

const STRENGTHS = [
  { icon: 'uploads/45_idea_bulb_icon.png', name: '課題解決力', desc: '多面的な視点で課題を整理し、技術とデザインを組み合わせて考える力を磨いています。' },
  { icon: 'uploads/47_programming_code_icon.png', name: '技術力', desc: 'AI・Web開発を中心に、最新技術を素早くキャッチアップし実装できる力があります。' },
  { icon: 'uploads/48_teamwork_icon.png', name: 'チームワーク', desc: 'サッカーで培った協調性とコミュニケーション力で、チームを前進させることができます。' },
  { icon: 'uploads/46_goal_growth_target_icon.png', name: '継続力', desc: '目標に向かって粘り強く取り組み、成果を出すことにこだわり続けることができます。' },
];

const FAQS = [
  { q: 'Q. インターンの受け入れは可能ですか？', a: 'はい、積極的に取り組んでいただいています。まずはご連絡をいただければご相談させていただきます。' },
  { q: 'Q. 得意な技術分野は何ですか？', a: 'React/TypeScript、Next.js、Python（AI）、Firebase を中心に開発しています。UI設計からバックエンドまでフルスタックに対応できます。' },
  { q: 'Q. チームでの開発経験はありますか？', a: 'はい、複数のチーム開発プロジェクトに携わった経験があります。GitHubを用いたコラボレーション、Figmaでのデザイン共有なども行っています。' },
  { q: 'Q. 副業の相談について詳しく教えてください。', a: 'Web制作、アプリ開発、AIツール開発など幅広くお受けしています。まずはメールまたはSNSでお気軽にご相談ください。' },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.r');
    const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); }), { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function Nav({ active }) {
  const dark = ['about','strengths','faq','contact'].includes(active);
  const [menuOpen, setMenuOpen] = useState(false);
  const go = id => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' }); setMenuOpen(false); };

  return (
    <>
      <nav className={`nav${dark ? ' dark' : ''}`}>
        <div className="nav-i">
          <div className="nav-logo">R K.</div>
          <div className="nav-links">
            {NAVS.map(n => (
              <span key={n} className={`nav-link${active === n.toLowerCase() ? ' on' : ''}`} onClick={() => go(n.toLowerCase())}>{n}</span>
            ))}
          </div>
          <div className="nav-right">
            <button className="nav-btn" onClick={() => go('contact')}>Contact →</button>
            <div className={`ham${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)}>
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </nav>
      <div className={`nav-drawer${dark ? ' dark' : ''}${menuOpen ? ' open' : ''}`}>
        {NAVS.map(n => (
          <span key={n} className="nav-link" onClick={() => go(n.toLowerCase())}>{n}</span>
        ))}
        <button className="nav-btn" onClick={() => go('contact')}>Contact →</button>
      </div>
    </>
  );
}

function Hero() {
  return (
    <section id="home" className="hero" data-screen-label="Hero">
      <div className="hero-i">
        <div>
          <p className="hero-eyebrow r">Hello, I'm</p>
          <h1 className="hero-title r d1">Engineering<br /><span className="accent">The Future.</span></h1>
          <p className="hero-sub r d2">テクノロジーで、日常の「あったらいいな」をカタチにする。</p>
          <p className="hero-desc r d2">電気通信大学で工学を学ぶ4年生。AIテクノロジーを活用して、人の役に立つプロダクトを生み出すことに情熱を注いでいます。</p>
          <div className="hero-btns r d3">
            <button className="btn-p" onClick={() => document.getElementById('about').scrollIntoView({block:'start'})}>About Me →</button>
            <button className="btn-s" onClick={() => document.getElementById('works').scrollIntoView({block:'start'})}>View Works →</button>
          </div>
        </div>
        <div className="hero-right">
          <img className="hero-dec1" src="uploads/08_dot_grid_black.png" alt="" />
          <img className="hero-dec2" src="uploads/07_lime_hexagon_outline.png" alt="" />
          <img className="hero-dec3" src="uploads/19_large_sparkle_star.png" alt="" />
          <img className="hero-dec4" src="uploads/18_small_sparkle_star.png" alt="" />
          <div className="hero-img-wrap">
            <div className="hero-cutout">
              <img src="uploads/03_about_image_blob_mask.png" alt="RK" />
            </div>

          </div>
        </div>
      </div>
      <div className="scroll-ind">
        <div className="scroll-line"></div>
        <span className="scroll-txt">SCROLL</span>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="sec sec-dark" data-screen-label="About">
      <div className="w">
        <div className="about-grid">
          <div>
            <p className="sec-num r">01</p>
            <h2 className="sec-title r">About<span className="dot">.</span></h2>
            <p className="sec-sub r">自己紹介</p>
            <p className="about-body r">電気通信大学に通う4年生。<br />小学校から高校までサッカーに取り組み、チームで上を目指すことを学びました。<br /><br />現在はAIやWebを活用したプロダクト開発を中心に、人の役に立つ「あったらいいな」を創造することを目指して取り組んでいます。</p>
            <img className="about-photo r" src="uploads/03_about_image_blob_mask.png" alt="RK" />
            <a className="about-link-txt r" href="#contact">More Details ↗</a>
          </div>
          <div>
            <div className="r">
              {[['Name','R.K.'],['University','電気通信大学'],['Faculty','情報理工学部'],['Grade','4年生'],['Hometown','東京都'],['Hobby','AI開発 / サッカー / カフェ巡り']].map(([k,v]) => (
                <div key={k} className="about-row"><span className="about-key">{k}</span><span className="about-val">{v}</span></div>
              ))}
            </div>
            <div style={{marginTop:48,opacity:0.25}}>
              <img src="uploads/10_geometric_wireframe_hexagon.png" alt="" style={{width:160}} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Works() {
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const [cardW, setCardW] = useState(360);

  useEffect(() => {
    const update = () => {
      if (outerRef.current) {
        const card = outerRef.current.querySelector('.work-card');
        const track = outerRef.current.querySelector('.works-track');
        const gap = track ? parseFloat(window.getComputedStyle(track).gap) || 0 : 20;
        if (card) setCardW(card.offsetWidth + gap);
        else setCardW(340 + 20);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const applyWorksOffset = value => {
    const loopWidth = cardW * WORKS.length;
    if (loopWidth <= 0 || !trackRef.current) return;
    offsetRef.current = ((value % loopWidth) + loopWidth) % loopWidth;
    trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame;
    let last = null;
    const speed = 22;
    const loopWidth = cardW * WORKS.length;

    const animate = time => {
      if (last === null) last = time;
      const delta = time - last;
      last = time;

      if (loopWidth > 0 && !draggingRef.current) {
        offsetRef.current = (offsetRef.current + speed * delta / 1000) % loopWidth;
        track.style.transform = `translateX(-${offsetRef.current}px)`;
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [cardW]);

  const moveWorks = direction => {
    applyWorksOffset(offsetRef.current + direction * cardW);
  };

  const startWorksDrag = e => {
    draggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
  };

  const dragWorks = e => {
    if (!draggingRef.current) return;
    const delta = e.clientX - dragStartXRef.current;
    applyWorksOffset(dragStartOffsetRef.current - delta);
  };

  const endWorksDrag = e => {
    draggingRef.current = false;
    if (e.currentTarget.releasePointerCapture) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <section id="works" className="sec sec-white" data-screen-label="Works">
      <div className="w">
        <div className="works-top">
          <div>
            <p className="sec-num r">02</p>
            <h2 className="sec-title r" style={{color:'var(--black)'}}>Works<span className="dot">.</span></h2>
            <p className="sec-sub r">制作実績</p>
            <p className="works-body-txt r">個人開発を中心に、AIやWeb技術を活かしたプロダクトを制作しています。ユーザー視点を大切に、シンプルで価値あるプロダクトを目指しています。</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:12}}>
            <button className="btn-s" onClick={() => document.getElementById('contact').scrollIntoView({block:'start'})}>View All →</button>
            <div className="works-nav">
              <button className="wn-btn" onClick={() => moveWorks(-1)}>
                <svg viewBox="0 0 12 12"><path d="M7.5 9.5L4 6l3.5-3.5"/></svg>
              </button>
              <button className="wn-btn" onClick={() => moveWorks(1)}>
                <svg viewBox="0 0 12 12"><path d="M4.5 2.5L8 6l-3.5 3.5"/></svg>
              </button>
            </div>
          </div>
        </div>
        <div
          className="works-outer"
          ref={outerRef}
          onPointerDown={startWorksDrag}
          onPointerMove={dragWorks}
          onPointerUp={endWorksDrag}
          onPointerCancel={endWorksDrag}
          onPointerLeave={endWorksDrag}
        >
          <div className="works-track" ref={trackRef} style={{transform:'translateX(0)',transition:'none'}}>
            {[...WORKS, ...WORKS].map((w,i) => (
              <div key={i} className="work-card r" style={{transitionDelay:`${i*0.07}s`}}>
                <div className="work-thumb" style={{background:'#111118'}}>
                  <div className="work-thumb-inner">
                    <div className="work-thumb-bar">
                      {w.dots.map((d,j) => <div key={j} className="work-thumb-dot" style={{background:d}}></div>)}
                    </div>
                    <div className="work-thumb-content">
                      <div style={{textAlign:'center'}}>
                        <div style={{width:48,height:48,borderRadius:10,background:w.accent,margin:'0 auto 10px',opacity:0.85}}></div>
                        <div style={{fontFamily:'monospace',fontSize:10,color:'rgba(255,255,255,0.3)',letterSpacing:'0.05em'}}>{w.title}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="work-body">
                  <div className="work-tags">{w.tags.map(t => <span key={t} className="work-tag">{t}</span>)}</div>
                  <div className="work-title">{w.title}</div>
                  <div className="work-desc">{w.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Strengths() {
  return (
    <section id="strengths" className="sec sec-dark" data-screen-label="Strengths">
      <div className="w">
        <div className="str-row">
          <div>
            <p className="sec-num r">03</p>
            <h2 className="sec-title r">Strengths<span className="dot">.</span></h2>
            <p className="sec-sub r">強み</p>
            <p className="str-intro r">専門知識と技術開発力、そしてチームでのコミュニケーション力を活かして、困難なプロジェクトを前進させます。</p>
          </div>
          <div className="str-grid">
            {STRENGTHS.map((s,i) => (
              <div key={i} className="str-card r" style={{transitionDelay:`${i*0.08}s`}}>
                <img className="str-icon" src={s.icon} alt={s.name} style={{filter:'invert(1) brightness(1.5)'}} />
                <div className="str-name">{s.name}</div>
                <div className="str-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Achievements() {
  const stats = [
    { icon: 'uploads/47_programming_code_icon.png', label: 'プログラミングコンテスト\n入賞', value: 3, unit: '回' },
    { icon: 'uploads/50_development_laptop_icon.png', label: '個人プロジェクト\n開発数', value: 7, unit: '+' },
    { icon: 'uploads/48_teamwork_icon.png', label: '保有資格', value: 5, unit: '個' },
    { icon: 'uploads/44_soccer_icon.png', label: 'サッカー歴', value: 12, unit: '年' },
  ];
  return (
    <section id="achievements" className="sec sec-white" data-screen-label="Achievements">
      <div className="w">
        <div className="ach-top">
          <div>
            <p className="sec-num r">04</p>
            <h2 className="sec-title r" style={{color:'var(--black)'}}>Achievements<span className="dot">.</span></h2>
            <p className="sec-sub r">実績</p>
          </div>
          <p className="ach-body-txt r">大学でのコンテスト受賞、複数のプロダクト開発、これまでに積み上げてきた実績と経験の一部をご紹介します。</p>
        </div>
        <div className="ach-grid">
          {stats.map((s,i) => (
            <div key={i} className="ach-card r" style={{transitionDelay:`${i*0.1}s`}}>
              <img className="ach-icon" src={s.icon} alt="" />
              <div className="ach-label">{s.label}</div>
              <div className="ach-val">{s.value}<span className="ach-unit">{s.unit}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="sec sec-dark" data-screen-label="FAQ">
      <div className="w">
        <div className="faq-row">
          <div>
            <p className="sec-num r">05</p>
            <h2 className="sec-title r">FAQ<span className="dot">.</span></h2>
            <p className="sec-sub r">よくある質問</p>
            <p className="faq-intro-txt r">お問い合わせの前に、よくいただくご質問をまとめました。解決しない場合はお気軽にご連絡ください。</p>
            <img className="faq-glow r" src="uploads/06_purple_lime_blur_glow.png" alt="" />
          </div>
          <div className="r">
            {FAQS.map((f,i) => (
              <div key={i} className={`faq-item${open===i?' open':''}`}>
                <div className="faq-q" onClick={() => setOpen(open===i?null:i)}>
                  <span className="faq-qt">{f.q}</span>
                  <span className="faq-tog">+</span>
                </div>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({name:'',email:'',msg:''});
  const [sent, setSent] = useState(false);
  const submit = e => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.msg}`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=rk.dev1004@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    setSent(true);
    setTimeout(()=>setSent(false),3000);
    setForm({name:'',email:'',msg:''});
  };
  return (
    <section id="contact" className="contact-sec" data-screen-label="Contact">
      <div className="w">
        <div className="contact-grid">
          <div>
            <div className="contact-tagline-wrap">
              <div className="contact-tagline">Let's<br />Create<br />The Future<br />Together.</div>
            </div>
            <div className="contact-info">
              <a className="contact-email-row" href="mailto:rk.dev1004@gmail.com">
                <img className="contact-email-icon" src="uploads/51_email_icon.png" alt="" />
                <span className="contact-email-txt">rk.dev1004@gmail.com</span>
              </a>
              <a className="contact-email-row" href="#" target="_blank">
                <img className="contact-email-icon" src="uploads/53_github_icon.png" alt="" />
                <span className="contact-email-txt">github.com/rk-dev</span>
              </a>
              <div className="contact-sns-label">SNS</div>
              <div className="contact-sns">
                <a className="sns-btn" href="#" title="GitHub">
                  <svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                </a>
                <a className="sns-btn" href="#" title="X">
                  <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a className="sns-btn" href="#" title="Instagram">
                  <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a className="sns-btn" href="#" title="LinkedIn">
                  <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className="contact-form-title">お問い合わせ</div>
            <div className="contact-form-sub">お仕事の依頼・インターンのご相談など、お気軽にご連絡ください。</div>
            <form className="c-form" onSubmit={submit}>
              <input className="c-input" placeholder="お名前" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
              <input className="c-input" type="email" placeholder="メールアドレス" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
              <textarea className="c-input" rows={5} placeholder="メッセージ" value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} required></textarea>
              <button type="submit" className="c-submit">{sent ? '送信しました ✓' : 'Send Message →'}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [active, setActive] = useState('home');
  useReveal();
  useEffect(() => {
    const ids = [...NAVS.map(s=>s.toLowerCase()),'contact'];
    const obs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.3 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return (
    <>
      <Nav active={active} />
      <div className="site-lines" aria-hidden="true"></div>
      <Hero />
      <About />
      <Works />
      <Strengths />
      <Achievements />
      <FAQ />
      <Contact />
      <footer className="footer">
        <div className="footer-i">
          <span className="footer-logo">R K.</span>
          <span className="footer-txt">© 2026 RK. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
