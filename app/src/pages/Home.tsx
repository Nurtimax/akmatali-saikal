import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

/* ---------- Конфигурация ---------- */
const WEDDING_DATE = new Date(2026, 9, 16, 17, 0, 0) // 16.10.2026, 17:00
const TIME_TEXT = '17:00'
const RESTAURANT = '«АЙКОЛ»'
const RESTAURANT_SUB = 'рестораны'

const DRESS_COLORS = ['#E6D3B3', '#C79A8B', '#4A342A', '#8C5A3C', '#B4603F']

const EASE = [0.22, 1, 0.36, 1] as const

/* ---------- Анимация варианттары ---------- */
const heroParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.35, delayChildren: 0.25 } },
}
const heroChild: Variants = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
}

/* ---------- Скроллда пайда болуучу блок ---------- */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- 3 секунд кыймыл болбосо — акырын авто-скролл ---------- */
function useAutoScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    let idleTimer: number | undefined
    let raf: number | null = null

    const atBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4

    const step = () => {
      if (!atBottom()) window.scrollBy({ top: 0.6, behavior: 'auto' })
      raf = requestAnimationFrame(step)
    }
    const start = () => {
      if (raf !== null || atBottom()) return
      raf = requestAnimationFrame(step)
    }
    const stop = () => {
      if (raf !== null) cancelAnimationFrame(raf)
      raf = null
    }
    const onActivity = () => {
      stop()
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(start, 3000)
    }

    const events: (keyof WindowEventMap)[] = ['wheel', 'touchmove', 'pointerdown', 'keydown']
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }))
    idleTimer = window.setTimeout(start, 3000)

    return () => {
      stop()
      window.clearTimeout(idleTimer)
      events.forEach((e) => window.removeEventListener(e, onActivity))
    }
  }, [enabled])
}

/* ---------- Декоративдик бөлгүч ---------- */
function Divider() {
  return (
    <div className="my-8 flex items-center justify-center gap-3">
      <motion.div
        className="ornament-line w-16 md:w-24"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ transformOrigin: 'right' }}
      />
      <svg width="46" height="14" viewBox="0 0 46 14" fill="none" aria-hidden>
        <path
          d="M23 1c3 3 3 9 0 12-3-3-3-9 0-12zM3 7c5-4 9-4 12 0-3 4-7 4-12 0zM43 7c-5-4-9-4-12 0 3 4 7 4 12 0z"
          stroke="#5a4034"
          strokeWidth="0.8"
          fill="none"
        />
      </svg>
      <motion.div
        className="ornament-line w-16 md:w-24"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ transformOrigin: 'left' }}
      />
    </div>
  )
}

/* ---------- Календарь: 2026-жыл, Октябрь ---------- */
function OctoberCalendar() {
  const weekDays = ['Дш', 'Шш', 'Шр', 'Бш', 'Жм', 'Иш', 'Жк']
  // 2026-жылдын 1-октябры — бешшемби (дүйшөмбүдөн санаганда индекси = 3)
  const leadingBlanks = 3
  const daysInMonth = 31
  const cells: (number | null)[] = [
    ...Array<null>(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div>
      <div className="mb-4 grid grid-cols-7 text-center text-xs tracking-widest text-[#8a7565] md:text-sm">
        {weekDays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center text-lg md:gap-y-3 md:text-xl">
        {cells.map((day, i) =>
          day === null ? (
            <div key={`b${i}`} />
          ) : day === 16 ? (
            <div key={day} className="relative flex items-center justify-center">
              <motion.span
                className="absolute text-[#b4603f]"
                animate={{ scale: [1, 1.14, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                aria-hidden
              >
                <svg width="46" height="42" viewBox="0 0 24 22" fill="currentColor">
                  <path d="M12 21S1 14.5 1 8.3C1 4.4 4 1.5 7.6 1.5c2 0 3.7 1 4.4 2.6.7-1.6 2.4-2.6 4.4-2.6C20 1.5 23 4.4 23 8.3 23 14.5 12 21 12 21z" />
                </svg>
              </motion.span>
              <span className="relative z-10 font-semibold text-white">{day}</span>
            </div>
          ) : (
            <div key={day} className="text-[#4a3a30]">
              {day}
            </div>
          )
        )}
      </div>
    </div>
  )
}

/* ---------- Тойго чейин санак ---------- */
function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now())
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return t
}

function Countdown() {
  const t = useCountdown(WEDDING_DATE)
  const items = [
    { v: t.days, label: 'күн' },
    { v: t.hours, label: 'саат' },
    { v: t.minutes, label: 'мүнөт' },
    { v: t.seconds, label: 'секунда' },
  ]
  return (
    <motion.div
      className="mx-auto grid max-w-lg grid-cols-4 gap-3 md:gap-5"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
    >
      {items.map((it) => (
        <motion.div
          key={it.label}
          variants={heroChild}
          className="card-soft rounded-2xl px-2 py-4 text-center md:py-6"
        >
          <div className="font-serif-elegant text-3xl font-semibold text-[#4a342a] md:text-4xl">
            {String(it.v).padStart(2, '0')}
          </div>
          <div className="mt-1 text-xs uppercase tracking-widest text-[#8a7565]">{it.label}</div>
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ---------- Башкы баракча ---------- */
export default function Home() {
  const [opened, setOpened] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useAutoScroll(opened)

  const openInvitation = () => {
    setOpened(true)
    const a = audioRef.current
    if (a) {
      a.volume = 0.55
      a.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    }
  }

  const toggleMusic = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
    } else {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => {})
    }
  }

  return (
    <div className="min-h-screen bg-[#ece5db]">
      <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden bg-[#f6f3ee] shadow-2xl md:max-w-2xl lg:max-w-3xl">
        <audio ref={audioRef} src="./music/Alex%20Warren%20-%20Ordinary.mp3" loop preload="auto" />

        {/* Кириш перdesи */}
        <AnimatePresence>
          {!opened && (
            <motion.div
              className="silk-bg fixed inset-0 z-50 flex flex-col items-center justify-center px-8 text-center"
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <div className="silk-overlay absolute inset-0" />
              <motion.div
                className="relative"
                variants={heroParent}
                initial="hidden"
                animate="show"
              >
                <motion.p
                  variants={heroChild}
                  className="mb-6 text-xs uppercase tracking-[0.35em] text-[#8a7565] md:text-sm"
                >
                  Той чакыруу
                </motion.p>
                <motion.h1
                  variants={heroChild}
                  className="font-script text-6xl leading-tight text-[#3a2f28] md:text-8xl"
                >
                  Акматали
                  <span className="my-1 block text-4xl text-[#b4603f] md:text-6xl">&</span>
                  Сайкал
                </motion.h1>
                <motion.p
                  variants={heroChild}
                  className="mt-6 text-xl tracking-[0.3em] text-[#5a4034] md:text-2xl"
                >
                  16 | 10 | 2026
                </motion.p>
                <motion.button
                  variants={heroChild}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={openInvitation}
                  className="mt-12 rounded-full border border-[#5a4034] bg-white/70 px-10 py-3 text-sm uppercase tracking-[0.25em] text-[#4a342a] transition-colors hover:bg-white"
                >
                  Чакырууну ачуу
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Музыка баскычы */}
        <motion.button
          onClick={toggleMusic}
          aria-label="Музыка"
          whileTap={{ scale: 0.88 }}
          className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a189] bg-white/85 shadow-lg backdrop-blur"
        >
          <svg
            className={playing ? 'spin-slow' : ''}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5a4034"
            strokeWidth="1.6"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </motion.button>

        {/* 1 — Баштык бөлүк */}
        <section className="silk-bg relative flex min-h-screen flex-col items-center justify-center px-8 text-center">
          <div className="silk-overlay absolute inset-0" />
          <motion.div
            className="relative"
            variants={heroParent}
            initial="hidden"
            animate={opened ? 'show' : 'hidden'}
          >
            <motion.h1
              variants={heroChild}
              className="font-script text-7xl leading-tight text-[#3a2f28] md:text-9xl"
            >
              Акматали
            </motion.h1>
            <motion.div
              variants={heroChild}
              className="font-script my-2 text-5xl text-[#b4603f] md:text-7xl"
            >
              &
            </motion.div>
            <motion.h1
              variants={heroChild}
              className="font-script text-7xl leading-tight text-[#3a2f28] md:text-9xl"
            >
              Сайкал
            </motion.h1>
            <motion.p
              variants={heroChild}
              className="mt-10 text-2xl tracking-[0.35em] text-[#5a4034] md:text-3xl"
            >
              16 | 10 | 2026
            </motion.p>
          </motion.div>
          <motion.div
            className="absolute bottom-8 text-[#8a7565]"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          >
            <svg width="20" height="30" viewBox="0 0 20 30" fill="none" stroke="currentColor">
              <rect x="1" y="1" width="18" height="28" rx="9" strokeWidth="1.2" />
              <circle cx="10" cy="9" r="2" fill="currentColor" />
            </svg>
          </motion.div>
        </section>

        {/* 2 — Чакыруу тексти */}
        <section className="px-8 py-20 text-center md:py-28">
          <Reveal>
            <div className="font-script text-4xl text-[#5a4034] md:text-5xl">
              Акматали <span className="text-[#b4603f]">&</span> Сайкал
            </div>
            <h2 className="font-script mt-10 text-5xl text-[#3a2f28] md:text-6xl">
              Урматтуу коноктор!
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-lg font-medium uppercase leading-relaxed tracking-wider text-[#4a3a30] md:text-xl">
              Сиздерди сүйүнүү жана толкундануу менен, көптөн күткөн, жашообуздагы эң баалуу,
              бактылуу күнүбүздү тең бөлүшүп, орток болууга чакырабыз!
            </p>
          </Reveal>
          <Divider />
        </section>

        {/* 3 — Календарь жана дарек */}
        <section className="px-6 pb-20 md:px-10 md:pb-28">
          <Reveal className="card-soft mx-auto max-w-xl rounded-3xl px-6 py-10 md:px-10">
            <h3 className="font-script mb-6 text-center text-5xl text-[#5a4034] md:text-6xl">
              Октябрь
            </h3>
            <OctoberCalendar />
            <div className="mt-10 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-semibold tracking-widest text-[#4a342a] md:text-3xl">
                  16.10.2026
                </div>
                <div className="ornament-line mx-auto mt-2 w-24" />
              </div>
              <span className="text-[#b4603f]">
                <svg width="14" height="13" viewBox="0 0 24 22" fill="currentColor">
                  <path d="M12 21S1 14.5 1 8.3C1 4.4 4 1.5 7.6 1.5c2 0 3.7 1 4.4 2.6.7-1.6 2.4-2.6 4.4-2.6C20 1.5 23 4.4 23 8.3 23 14.5 12 21 12 21z" />
                </svg>
              </span>
              <div className="text-center">
                <div className="text-2xl font-semibold tracking-widest text-[#4a342a] md:text-3xl">
                  {TIME_TEXT}
                </div>
                <div className="ornament-line mx-auto mt-2 w-24" />
              </div>
            </div>
            <div className="mt-10 text-center">
              <div className="font-script text-4xl text-[#5a4034] md:text-5xl">Дареги:</div>
              <div className="mt-4 text-3xl font-bold tracking-wide text-[#3a2f28] md:text-4xl">
                {RESTAURANT}
              </div>
              <div className="mt-1 text-sm uppercase tracking-[0.3em] text-[#8a7565]">
                {RESTAURANT_SUB}
              </div>
            </div>
          </Reveal>
        </section>

        {/* 4 — Дресс-код */}
        <section className="px-6 pb-20 md:px-10 md:pb-28">
          <Reveal className="card-soft rounded-3xl px-6 py-10 md:px-10">
            <h3 className="text-center font-serif-elegant text-3xl font-semibold uppercase tracking-[0.2em] text-[#3a2f28] md:text-4xl">
              Дресс-код:
            </h3>
            <motion.div
              className="mt-8 flex items-center justify-center gap-4 md:gap-6"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            >
              {DRESS_COLORS.map((c) => (
                <motion.span
                  key={c}
                  variants={{
                    hidden: { opacity: 0, scale: 0 },
                    show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } },
                  }}
                  whileHover={{ scale: 1.18 }}
                  className="h-10 w-10 shadow-inner md:h-12 md:w-12"
                  style={{
                    backgroundColor: c,
                    borderRadius: '46% 54% 52% 48% / 56% 48% 52% 44%',
                    boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.15)',
                  }}
                />
              ))}
            </motion.div>
            <Divider />
            <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-2xl md:grid-cols-4 md:gap-3">
              {['decor-1', 'decor-2', 'decor-3', 'decor-4'].map((n, i) => (
                <motion.img
                  key={n}
                  src={`./images/${n}.png`}
                  alt="Той декору"
                  loading="lazy"
                  className="aspect-square w-full rounded-lg object-cover md:aspect-[3/4]"
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
                  whileHover={{ scale: 1.04 }}
                />
              ))}
            </div>
            <Divider />
          </Reveal>
        </section>

        {/* 5 — Санак */}
        <section className="px-6 pb-20 text-center md:px-10 md:pb-28">
          <Reveal>
            <h3 className="font-script mb-8 text-5xl text-[#5a4034] md:text-6xl">Тойго чейин:</h3>
            <Countdown />
          </Reveal>
        </section>

        {/* 6 — Жыйынтык */}
        <section className="silk-bg relative px-8 py-24 text-center md:py-32">
          <div className="silk-overlay absolute inset-0" />
          <Reveal className="relative">
            <p className="text-lg font-medium uppercase leading-relaxed tracking-widest text-[#4a3a30] md:text-xl">
              Сиздерди урматтоо менен,
              <br />
              той ээлери:
            </p>
            <div className="font-script mt-8 text-6xl leading-tight text-[#3a2f28] md:text-8xl">
              Акматали
              <span className="my-1 block text-4xl text-[#b4603f] md:text-6xl">&</span>
              Сайкал
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  )
}
