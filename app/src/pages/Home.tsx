import { useEffect, useRef, useState } from 'react'

/* ---------- Конфигурация: убакытты жана даректи ушул жерден өзгөртсө болот ---------- */
const WEDDING_DATE = new Date(2026, 9, 16, 17, 0, 0) // 16.10.2026, 17:00
const TIME_TEXT = '17:00'
const RESTAURANT = '«АЙКОЛ»'
const RESTAURANT_SUB = 'рестораны'

const DRESS_COLORS = ['#E6D3B3', '#C79A8B', '#4A342A', '#8C5A3C', '#B4603F']

/* ---------- Scroll reveal hook ---------- */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const targets = el.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    targets.forEach((t) => obs.observe(t))
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ---------- Кичинекей декоративдик бөлгүч ---------- */
function Divider() {
  return (
    <div className="my-8 flex items-center justify-center gap-3">
      <div className="ornament-line w-16" />
      <svg width="46" height="14" viewBox="0 0 46 14" fill="none" aria-hidden>
        <path
          d="M23 1c3 3 3 9 0 12-3-3-3-9 0-12zM3 7c5-4 9-4 12 0-3 4-7 4-12 0zM43 7c-5-4-9-4-12 0 3 4 7 4 12 0z"
          stroke="#5a4034"
          strokeWidth="0.8"
          fill="none"
        />
      </svg>
      <div className="ornament-line w-16" />
    </div>
  )
}

/* ---------- Календарь: 2026-жыл, Октябрь (16-күн белгиленген) ---------- */
function OctoberCalendar() {
  const weekDays = ['Дш', 'Шш', 'Шр', 'Бш', 'Жм', 'Иш', 'Жк']
  // 2026-жылдын 1-октябры — бешшемби (Бш). Дүйшөмбүдөн башталган тартипте индекси = 3
  const leadingBlanks = 3
  const daysInMonth = 31
  const cells: (number | null)[] = [
    ...Array<null>(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div>
      <div className="mb-4 grid grid-cols-7 text-center text-xs tracking-widest text-[#8a7565]">
        {weekDays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center text-lg">
        {cells.map((day, i) =>
          day === null ? (
            <div key={`b${i}`} />
          ) : day === 16 ? (
            <div key={day} className="relative flex items-center justify-center">
              <span className="heart-pulse absolute text-[#b4603f]" aria-hidden>
                <svg width="44" height="40" viewBox="0 0 24 22" fill="currentColor">
                  <path d="M12 21S1 14.5 1 8.3C1 4.4 4 1.5 7.6 1.5c2 0 3.7 1 4.4 2.6.7-1.6 2.4-2.6 4.4-2.6C20 1.5 23 4.4 23 8.3 23 14.5 12 21 12 21z" />
                </svg>
              </span>
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
    <div className="grid grid-cols-4 gap-3">
      {items.map((it) => (
        <div key={it.label} className="card-soft rounded-2xl px-2 py-4 text-center">
          <div className="font-serif-elegant text-3xl font-semibold text-[#4a342a]">
            {String(it.v).padStart(2, '0')}
          </div>
          <div className="mt-1 text-xs uppercase tracking-widest text-[#8a7565]">{it.label}</div>
        </div>
      ))}
    </div>
  )
}

/* ---------- Башкы баракча ---------- */
export default function Home() {
  const [opened, setOpened] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const pageRef = useReveal<HTMLDivElement>()

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
      a.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <div ref={pageRef} className="relative mx-auto min-h-screen max-w-md overflow-hidden shadow-2xl">
      <audio ref={audioRef} src="./music/Alex%20Warren%20-%20Ordinary.mp3" loop preload="auto" />

      {/* Кириш перdesi — конвертти ачуу */}
      <div
        className={`silk-bg fixed inset-0 z-50 mx-auto flex max-w-md flex-col items-center justify-center px-8 text-center ${
          opened ? 'overlay-hidden' : ''
        }`}
      >
        <div className="silk-overlay absolute inset-0" />
        <div className="relative">
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#8a7565]">Той чакыруу</p>
          <h1 className="font-script text-6xl leading-tight text-[#3a2f28]">
            Акматали
            <span className="my-1 block text-4xl text-[#b4603f]">&</span>
            Сайкал
          </h1>
          <p className="mt-6 text-xl tracking-[0.3em] text-[#5a4034]">16 | 10 | 2026</p>
          <button
            onClick={openInvitation}
            className="mt-12 rounded-full border border-[#5a4034] bg-white/70 px-10 py-3 text-sm uppercase tracking-[0.25em] text-[#4a342a] transition hover:bg-white"
          >
            Чакырууну ачуу
          </button>
        </div>
      </div>

      {/* Музыка баскычы */}
      <button
        onClick={toggleMusic}
        aria-label="Музыка"
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
      </button>

      {/* 1 — Баштык бөлүк */}
      <section className="silk-bg relative flex min-h-screen flex-col items-center justify-center px-8 text-center">
        <div className="silk-overlay absolute inset-0" />
        <div className="relative">
          <h1 className="font-script fade-up text-7xl leading-tight text-[#3a2f28]">
            Акматали
          </h1>
          <div className="font-script fade-up fade-up-delay-1 my-2 text-5xl text-[#b4603f]">&</div>
          <h1 className="font-script fade-up fade-up-delay-2 text-7xl leading-tight text-[#3a2f28]">
            Сайкал
          </h1>
          <p className="fade-up fade-up-delay-3 mt-10 text-2xl tracking-[0.35em] text-[#5a4034]">
            16 | 10 | 2026
          </p>
        </div>
        <div className="absolute bottom-8 text-[#8a7565]">
          <svg width="20" height="30" viewBox="0 0 20 30" fill="none" stroke="currentColor">
            <rect x="1" y="1" width="18" height="28" rx="9" strokeWidth="1.2" />
            <circle cx="10" cy="9" r="2" fill="currentColor" />
          </svg>
        </div>
      </section>

      {/* 2 — Чакыруу тексти */}
      <section className="px-8 py-20 text-center">
        <div className="reveal">
          <div className="font-script text-4xl text-[#5a4034]">
            Акматали <span className="text-[#b4603f]">&</span> Сайкал
          </div>
          <h2 className="font-script mt-10 text-5xl text-[#3a2f28]">Урматтуу коноктор!</h2>
          <p className="mt-8 text-lg font-medium uppercase leading-relaxed tracking-wider text-[#4a3a30]">
            Сиздерди сүйүнүү жана толкундануу менен, көптөн күткөн, жашообуздагы эң баалуу,
            бактылуу күнүбүздү тең бөлүшүп, орток болууга чакырабыз!
          </p>
        </div>
        <Divider />
      </section>

      {/* 3 — Календарь жана дарек */}
      <section className="px-6 pb-20">
        <div className="reveal card-soft rounded-3xl px-6 py-10">
          <h3 className="font-script mb-6 text-center text-5xl text-[#5a4034]">Октябрь</h3>
          <OctoberCalendar />
          <div className="mt-10 flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-semibold tracking-widest text-[#4a342a]">16.10.2026</div>
              <div className="mx-auto mt-2 ornament-line w-24" />
            </div>
            <span className="text-[#b4603f]">
              <svg width="14" height="13" viewBox="0 0 24 22" fill="currentColor">
                <path d="M12 21S1 14.5 1 8.3C1 4.4 4 1.5 7.6 1.5c2 0 3.7 1 4.4 2.6.7-1.6 2.4-2.6 4.4-2.6C20 1.5 23 4.4 23 8.3 23 14.5 12 21 12 21z" />
              </svg>
            </span>
            <div className="text-center">
              <div className="text-2xl font-semibold tracking-widest text-[#4a342a]">{TIME_TEXT}</div>
              <div className="mx-auto mt-2 ornament-line w-24" />
            </div>
          </div>
          <div className="mt-10 text-center">
            <div className="font-script text-4xl text-[#5a4034]">Дареги:</div>
            <div className="mt-4 text-3xl font-bold tracking-wide text-[#3a2f28]">{RESTAURANT}</div>
            <div className="mt-1 text-sm uppercase tracking-[0.3em] text-[#8a7565]">
              {RESTAURANT_SUB}
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Дресс-код */}
      <section className="px-6 pb-20">
        <div className="reveal card-soft rounded-3xl px-6 py-10">
          <h3 className="text-center font-serif-elegant text-3xl font-semibold uppercase tracking-[0.2em] text-[#3a2f28]">
            Дресс-код:
          </h3>
          <div className="mt-8 flex items-center justify-center gap-4">
            {DRESS_COLORS.map((c) => (
              <span
                key={c}
                className="h-10 w-10 rounded-full shadow-inner"
                style={{
                  backgroundColor: c,
                  borderRadius: '46% 54% 52% 48% / 56% 48% 52% 44%',
                  boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.15)',
                }}
              />
            ))}
          </div>
          <Divider />
          <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-2xl">
            {['decor-1', 'decor-2', 'decor-3', 'decor-4'].map((n) => (
              <img
                key={n}
                src={`./images/${n}.png`}
                alt="Той декору"
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
            ))}
          </div>
          <Divider />
        </div>
      </section>

      {/* 5 — Санак */}
      <section className="px-6 pb-20 text-center">
        <div className="reveal">
          <h3 className="font-script mb-8 text-5xl text-[#5a4034]">Тойго чейин:</h3>
          <Countdown />
        </div>
      </section>

      {/* 6 — Жыйынтык */}
      <section className="silk-bg relative px-8 py-24 text-center">
        <div className="silk-overlay absolute inset-0" />
        <div className="reveal relative">
          <p className="text-lg font-medium uppercase leading-relaxed tracking-widest text-[#4a3a30]">
            Сиздерди урматтоо менен,
            <br />
            той ээлери:
          </p>
          <div className="font-script mt-8 text-6xl leading-tight text-[#3a2f28]">
            Акматали
            <span className="my-1 block text-4xl text-[#b4603f]">&</span>
            Сайкал
          </div>
        </div>
      </section>
    </div>
  )
}
