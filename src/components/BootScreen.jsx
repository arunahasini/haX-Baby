import React, { useState, useEffect } from 'react'
import './BootScreen.css'

const BOOT_STEPS = [
  { text: 'PIP.EXE', delay: 0, type: 'title' },
  { text: 'Midnight Nursery OS v1.0', delay: 600, type: 'subtitle' },
  { text: '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%', delay: 1200, type: 'progress' },
  { text: 'Loading dream modules...', delay: 1800, type: 'log' },
  { text: 'Calibrating lullaby engine...', delay: 2200, type: 'log' },
  { text: 'Charging nightlights...', delay: 2600, type: 'log' },
  { text: 'Sprinkling stardust...', delay: 3000, type: 'log' },
  { text: 'Preparing your dreams...', delay: 3400, type: 'status' },
  { text: 'Welcome, little dreamer! ✨', delay: 4000, type: 'welcome' },
]

// Pre-generate stable positions so they don't jump on every state update
const BOOT_STARS = Array.from({ length: 40 }, (_, i) => ({
  left:  `${(i * 31 + 7)  % 100}%`,
  top:   `${(i * 47 + 13) % 100}%`,
  delay: `${(i * 0.19)    % 3}s`,
  size:  2 + (i % 3),
}))

export default function BootScreen({ onComplete }) {
  const [visibleSteps, setVisibleSteps] = useState([])
  const [done, setDone] = useState(false)
  const [skipped, setSkipped] = useState(false)

  useEffect(() => {
    const timers = BOOT_STEPS.map((step, i) =>
      setTimeout(() => {
        setVisibleSteps(prev => [...prev, i])
      }, step.delay)
    )
    // Auto-complete after last step + brief pause
    const autoTimer = setTimeout(() => {
      setDone(true)
    }, 4800)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(autoTimer)
    }
  }, [])

  useEffect(() => {
    if (done || skipped) {
      const t = setTimeout(onComplete, skipped ? 0 : 500)
      return () => clearTimeout(t)
    }
  }, [done, skipped, onComplete])

  const handleSkip = () => setSkipped(true)

  if (skipped) return null

  return (
    <div className={`boot-screen ${done ? 'boot-fade-out' : ''}`} role="status" aria-live="polite">
      {/* Stars background */}
      <div className="boot-stars" aria-hidden="true">
        {BOOT_STARS.map((s, i) => (
          <div
            key={i}
            className="boot-star"
            style={{
              left: s.left,
              top: s.top,
              animationDelay: s.delay,
              width: `${s.size}px`,
              height: `${s.size}px`,
            }}
          />
        ))}
      </div>

      {/* Pip Character */}
      <div className="boot-pip" aria-hidden="true">
        <PipFace size={100} glowing />
      </div>

      {/* Terminal window */}
      <div className="boot-terminal" role="log">
        <div className="boot-terminal-header">
          <span className="terminal-dot" style={{ background: '#ff6b6b' }} />
          <span className="terminal-dot" style={{ background: '#ffd93d' }} />
          <span className="terminal-dot" style={{ background: '#6bcb77' }} />
          <span className="terminal-title">pip_boot.exe</span>
        </div>
        <div className="boot-terminal-body">
          {BOOT_STEPS.map((step, i) => (
            visibleSteps.includes(i) && (
              <div
                key={i}
                className={`boot-line boot-line-${step.type}`}
                style={{ animationDelay: '0ms' }}
              >
                {step.type === 'log' && <span className="boot-prompt">{'>'} </span>}
                {step.text}
                {i === visibleSteps[visibleSteps.length - 1] && step.type !== 'welcome' && (
                  <span className="boot-cursor">▌</span>
                )}
              </div>
            )
          ))}
        </div>
      </div>

      <button className="boot-skip" onClick={handleSkip} aria-label="Skip boot screen">
        Skip →
      </button>
    </div>
  )
}

// Inline Pip SVG for boot screen
export function PipFace({ size = 80, glowing = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pip the Skull Baby"
      role="img"
    >
      {/* Glow effect */}
      {glowing && (
        <defs>
          <filter id="pipGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffcc88" stopOpacity="1" />
            <stop offset="100%" stopColor="#e8943a" stopOpacity="0.6" />
          </radialGradient>
        </defs>
      )}
      {/* Nightcap */}
      <path d="M28 38 Q30 8 50 5 Q70 8 72 38" fill="#a34063" />
      <path d="M28 38 Q50 30 72 38" fill="#c4607e" />
      {/* Stars on cap */}
      <text x="42" y="22" fontSize="8" fill="#ffd700" textAnchor="middle">★</text>
      <text x="55" y="30" fontSize="6" fill="#ffb3c6" textAnchor="middle">✦</text>
      {/* Pink bow */}
      <ellipse cx="70" cy="12" rx="6" ry="4" fill="#f4a7b9" transform="rotate(-20 70 12)" />
      <ellipse cx="76" cy="14" rx="6" ry="4" fill="#f4a7b9" transform="rotate(20 76 14)" />
      <circle cx="73" cy="13" r="2.5" fill="#e87da0" />
      {/* Skull head */}
      <ellipse cx="50" cy="56" rx="26" ry="24" fill="#fff8f1" />
      <ellipse cx="50" cy="72" rx="14" ry="10" fill="#fff8f1" />
      {/* Eye sockets */}
      <ellipse cx="38" cy="52" rx="9" ry="9" fill="#3a2820" />
      <ellipse cx="62" cy="52" rx="9" ry="9" fill="#3a2820" />
      {/* Amber eyes */}
      <ellipse cx="38" cy="52" rx="6" ry="6" fill={glowing ? "url(#eyeGlow)" : "#e8943a"} />
      <ellipse cx="62" cy="52" rx="6" ry="6" fill={glowing ? "url(#eyeGlow)" : "#e8943a"} />
      {/* Eye shine */}
      <circle cx="40" cy="50" r="1.5" fill="white" opacity="0.9" />
      <circle cx="64" cy="50" r="1.5" fill="white" opacity="0.9" />
      {/* Cheek blush */}
      <ellipse cx="28" cy="62" rx="5" ry="3" fill="#f4a7b9" opacity="0.5" />
      <ellipse cx="72" cy="62" rx="5" ry="3" fill="#f4a7b9" opacity="0.5" />
      {/* Tiny crooked smile */}
      <path d="M43 70 Q50 76 57 70" stroke="#a34063" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Tooth bumps */}
      <rect x="46" y="72" width="5" height="3" rx="1" fill="#e8ddd0" opacity="0.6" />
      <rect x="51" y="72" width="5" height="3" rx="1" fill="#e8ddd0" opacity="0.6" />
      {/* Nose */}
      <path d="M46 62 Q50 65 54 62" stroke="#c4a090" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}
