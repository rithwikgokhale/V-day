import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import './App.css'
import { config } from './config'
import { buildCode } from './utils/codec'
import {
  clearStoredSelection,
  readStoredSelection,
  saveStoredSelection,
  type StoredSelection,
} from './utils/storage'

type Step = 1 | 2 | 3 | 4 | 5
type VerifyState = 'idle' | 'verifying' | 'verified'

const DODGE_DISTANCE = 80
const MOBILE_DODGE_ATTEMPTS = 5
const DESKTOP_DODGE_MS = 5000

function getLabelsForIds(ids: string[]): string[] {
  return ids.map((id) => config.images.find((image) => image.id === id)?.label ?? id)
}

function App() {
  const [step, setStep] = useState<Step>(1)
  const [verifyState, setVerifyState] = useState<VerifyState>('idle')
  const [toastMessage, setToastMessage] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [selectionTimestamp, setSelectionTimestamp] = useState<number>(Date.now())
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    window.matchMedia('(hover: none), (pointer: coarse)').matches,
  )

  const [noClicks, setNoClicks] = useState(0)
  const [mobileNoAttempts, setMobileNoAttempts] = useState(0)
  const [desktopDodgingActive, setDesktopDodgingActive] = useState(false)
  const [celebrate, setCelebrate] = useState(false)

  const dodgeContainerRef = useRef<HTMLDivElement | null>(null)
  const noButtonRef = useRef<HTMLButtonElement | null>(null)
  const [noButtonPos, setNoButtonPos] = useState({ x: 16, y: 102 })
  const [copiedCode, setCopiedCode] = useState(false)

  useEffect(() => {
    const stored = readStoredSelection()
    if (!stored) {
      return
    }
    setSelectedIds(stored.orderedPickIds)
    setSelectedLabels(stored.orderedPickLabels)
    setSelectionTimestamp(stored.timestamp)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none), (pointer: coarse)')
    const listener = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  useEffect(() => {
    if (step !== 4 || isMobile) {
      setDesktopDodgingActive(false)
      return
    }

    setDesktopDodgingActive(true)
    const timer = window.setTimeout(() => setDesktopDodgingActive(false), DESKTOP_DODGE_MS)
    return () => window.clearTimeout(timer)
  }, [isMobile, step])

  useEffect(() => {
    if (!toastMessage) {
      return
    }
    const timer = window.setTimeout(() => setToastMessage(''), 1500)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

  const orderedSelection: StoredSelection = useMemo(
    () => ({
      orderedPickIds: selectedIds,
      orderedPickLabels: selectedLabels,
      timestamp: selectionTimestamp,
    }),
    [selectedIds, selectedLabels, selectionTimestamp],
  )

  const code = useMemo(() => {
    return buildCode({
      v: 1,
      her: config.herName,
      picks: orderedSelection.orderedPickIds,
      labels: orderedSelection.orderedPickLabels,
      ts: orderedSelection.timestamp,
    })
  }, [orderedSelection])

  const yesScale = 1 + noClicks * 0.13
  const yesLabel = config.yesButtonTexts[Math.min(noClicks, config.yesButtonTexts.length - 1)]
  const noRetired = noClicks >= 3

  const mailtoHref = useMemo(() => {
    const bodyLines = [
      config.emailIntroLine,
      '',
      'Please hit send 🙂 (it’s for a surprise later)',
      '',
      `CODE: ${code}`,
    ]
    const body = encodeURIComponent(bodyLines.join('\n'))
    const subject = encodeURIComponent(config.emailSubject)
    return `mailto:${encodeURIComponent(config.myEmail)}?subject=${subject}&body=${body}`
  }, [code])

  function persist(ids: string[]): void {
    const labels = getLabelsForIds(ids)
    const timestamp = Date.now()
    setSelectedIds(ids)
    setSelectedLabels(labels)
    setSelectionTimestamp(timestamp)
    saveStoredSelection({
      orderedPickIds: ids,
      orderedPickLabels: labels,
      timestamp,
    })
  }

  function onToggleImage(id: string): void {
    if (selectedIds.includes(id)) {
      persist(selectedIds.filter((item) => item !== id))
      return
    }

    if (selectedIds.length >= config.requiredSelections) {
      setToastMessage('Only 3 picks 😄')
      return
    }

    persist([...selectedIds, id])
  }

  function onResetPicks(): void {
    setSelectedIds([])
    setSelectedLabels([])
    setSelectionTimestamp(Date.now())
    clearStoredSelection()
  }

  function moveNoButton(): void {
    const container = dodgeContainerRef.current
    const noButton = noButtonRef.current
    if (!container || !noButton) {
      return
    }

    const bounds = container.getBoundingClientRect()
    const maxX = Math.max(16, bounds.width - noButton.offsetWidth - 16)
    const maxY = Math.max(70, bounds.height - noButton.offsetHeight - 16)
    const x = Math.floor(Math.random() * maxX)
    const y = Math.floor(Math.random() * (maxY - 60) + 60)
    setNoButtonPos({ x, y })
  }

  function onDesktopMove(event: React.MouseEvent<HTMLDivElement>): void {
    if (!desktopDodgingActive || isMobile || noRetired) {
      return
    }

    const noButton = noButtonRef.current
    if (!noButton) {
      return
    }

    const rect = noButton.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY)
    if (distance <= DODGE_DISTANCE) {
      moveNoButton()
    }
  }

  function onNoClick(): void {
    const mobileDodgingActive = isMobile && mobileNoAttempts < MOBILE_DODGE_ATTEMPTS

    if (mobileDodgingActive) {
      setMobileNoAttempts((count) => count + 1)
      setToastMessage('Not so fast 😄')
      moveNoButton()
      return
    }

    if (!isMobile && desktopDodgingActive) {
      moveNoButton()
      return
    }

    setNoClicks((count) => Math.min(3, count + 1))
  }

  function onYesClick(): void {
    setCelebrate(true)
    window.setTimeout(() => {
      setCelebrate(false)
      setStep(5)
    }, 1000)
  }

  async function onCopyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(true)
      window.setTimeout(() => setCopiedCode(false), 1200)
    } catch {
      setToastMessage('Could not copy. You can still copy it manually.')
    }
  }

  function onRestart(): void {
    clearStoredSelection()
    setStep(1)
    setVerifyState('idle')
    setSelectedIds([])
    setSelectedLabels([])
    setSelectionTimestamp(Date.now())
    setToastMessage('')
    setNoClicks(0)
    setMobileNoAttempts(0)
    setDesktopDodgingActive(false)
    setCelebrate(false)
    setNoButtonPos({ x: 16, y: 102 })
  }

  function resetStep4State(): void {
    setNoClicks(0)
    setMobileNoAttempts(0)
    setDesktopDodgingActive(false)
    setCelebrate(false)
    setNoButtonPos({ x: 16, y: 102 })
  }

  return (
    <main
      className="app"
      style={
        {
          '--bg': config.theme.pageBackground,
          '--card-bg': config.theme.cardBackground,
          '--primary': config.theme.primary,
          '--primary-dark': config.theme.primaryDark,
          '--text': config.theme.text,
          '--muted': config.theme.muted,
          '--border': config.theme.border,
        } as CSSProperties
      }
    >
      <section className="card">
        <p className="step-indicator">Step {step} of 5</p>
        {step === 1 && (
          <>
            <h1>Before we begin...</h1>
            <p className="lead">A quick check to make sure this is really {config.herName}.</p>
            <div className="captcha-card" aria-live="polite">
              <button
                type="button"
                className="captcha-check"
                onClick={() => {
                  if (verifyState !== 'idle') {
                    return
                  }
                  setVerifyState('verifying')
                  const wait = 700 + Math.floor(Math.random() * 500)
                  window.setTimeout(() => setVerifyState('verified'), wait)
                }}
                disabled={verifyState !== 'idle'}
              >
                <span className={`box ${verifyState === 'verified' ? 'success' : ''}`} aria-hidden="true">
                  {verifyState === 'verifying' && <span className="spinner" />}
                  {verifyState === 'verified' && '✓'}
                </span>
                <span>
                  {verifyState === 'verifying' ? 'Verifying…' : "I'm not a robot"}
                </span>
              </button>
              <div className="captcha-mark">reCAPTCHA-ish</div>
            </div>
            <button
              type="button"
              className="button-primary"
              onClick={() => setStep(2)}
              disabled={verifyState !== 'verified'}
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h1>Select top 3 pics of us you like</h1>
            <p className="lead">{config.screen2Instruction}</p>
            <div className="grid" role="list">
              {config.images.map((image) => {
                const selectionNumber = selectedIds.indexOf(image.id) + 1
                return (
                  <button
                    key={image.id}
                    type="button"
                    role="listitem"
                    className={`image-tile ${selectionNumber ? 'selected' : ''}`}
                    onClick={() => onToggleImage(image.id)}
                    aria-pressed={selectionNumber > 0}
                  >
                    <img
                      src={`/us/${image.filename}`}
                      alt={image.alt}
                      onError={(event) => {
                        event.currentTarget.src = '/us/fallback.svg'
                      }}
                    />
                    <span className="image-label">{image.label}</span>
                    {selectionNumber > 0 && <span className="badge">{selectionNumber}</span>}
                  </button>
                )
              })}
            </div>
            <div className="actions-row">
              <button type="button" className="link-button" onClick={onResetPicks}>
                Reset picks
              </button>
              <button
                type="button"
                className="button-primary"
                onClick={() => setStep(3)}
                disabled={selectedIds.length !== config.requiredSelections}
              >
                Continue
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1>For you, {config.herName}</h1>
            <p className="message">
              {config.screen3Message.split('\n').map((line, index) => (
                <span key={`${index}-${line}`}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <button
              type="button"
              className="button-primary"
              onClick={() => {
                resetStep4State()
                setStep(4)
              }}
            >
              Next
            </button>
          </>
        )}

        {step === 4 && (
          <>
            <h1>Will you be my Valentine?</h1>
            <p className="lead">Think carefully. One option gets cuter every time.</p>
            <div
              className="dodge-area"
              ref={dodgeContainerRef}
              onMouseMove={onDesktopMove}
              onMouseEnter={() => {
                if (desktopDodgingActive && !isMobile) {
                  moveNoButton()
                }
              }}
            >
              <button
                type="button"
                className="button-primary yes-button"
                style={{ transform: `translate(-50%, 0) scale(${yesScale})` }}
                onClick={onYesClick}
              >
                {yesLabel}
              </button>

              {!noRetired && (
                <button
                  ref={noButtonRef}
                  type="button"
                  className="button-secondary no-button"
                  style={{ left: `${noButtonPos.x}px`, top: `${noButtonPos.y}px` }}
                  onClick={onNoClick}
                >
                  NO
                </button>
              )}
            </div>
            {noRetired && <p className="tiny-note">NO has retired.</p>}
            {!isMobile && desktopDodgingActive && <p className="tiny-note">NO is evasive for 5 seconds.</p>}
            {isMobile && mobileNoAttempts < MOBILE_DODGE_ATTEMPTS && (
              <p className="tiny-note">NO dodges first 5 taps on mobile.</p>
            )}
            {celebrate && (
              <div className="burst" aria-hidden="true">
                <span>💘</span>
                <span>✨</span>
                <span>🎉</span>
                <span>💖</span>
                <span>🌸</span>
              </div>
            )}
          </>
        )}

        {step === 5 && (
          <>
            <h1>{config.screen5Message}</h1>
            <p className="lead">Please hit send 🙂 (it’s for a surprise later)</p>
            <div className="final-actions">
              <a className="button-primary send-link" href={mailtoHref}>
                Send answer
              </a>
              <button type="button" className="button-secondary" onClick={onCopyCode}>
                {copiedCode ? 'Copied!' : 'Copy code'}
              </button>
              <button type="button" className="link-button" onClick={onRestart}>
                Restart
              </button>
            </div>
            <p className="code-line">CODE: {code}</p>
          </>
        )}
      </section>
      {toastMessage && (
        <div className="toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
      <p className="credit">Made with love by {config.myName}</p>
    </main>
  )
}

export default App
