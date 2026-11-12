"use client"

import { useEffect, useMemo, useRef, useState, type ComponentProps } from "react"
import Cal, { getCalApi } from "@calcom/embed-react"
import { CADLENLY_URL } from "@/app/constants"

const namespace = "n8n-process-review"
const bookingPath = new URL(CADLENLY_URL).pathname.slice(1)
const preferredTimes = ["09:00", "10:30", "13:00", "14:30"]
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
const longDate = (date: Date) => date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

type Preference = { day: Date; time: string; timeZone: string } | null

/** Cal confirms live availability; the source-design card only collects a preference. */
function BookingScheduler({ preference }: { preference: Preference }) {
  const [state, setState] = useState<"loading" | "ready" | "unavailable">("loading")
  const config = useMemo<NonNullable<ComponentProps<typeof Cal>["config"]>>(() => {
    const value: NonNullable<ComponentProps<typeof Cal>["config"]> = { theme: "light", layout: "month_view" }
    if (preference) {
      value.date = dateKey(preference.day)
      value.timeZone = preference.timeZone
    }
    return value
  }, [preference])

  useEffect(() => {
    let active = true
    let ready = false
    const onReady = () => { ready = true; if (active) setState("ready") }
    const onFailed = () => { if (active) setState("unavailable") }
    const onScriptError = (event: Event) => {
      if (event.target instanceof HTMLScriptElement && event.target.src.startsWith("https://app.cal.com/")) onFailed()
    }
    window.addEventListener("error", onScriptError, true)
    const timeout = window.setTimeout(() => { if (!ready) onFailed() }, 15000)
    const api = getCalApi({ namespace }).then(cal => {
      if (!active) return
      cal("ui", {
        theme: "light", layout: "month_view", hideEventTypeDetails: true,
        cssVarsPerTheme: { light: { "cal-brand": "#0a0a0a", "cal-brand-emphasis": "#ff7442" }, dark: { "cal-brand": "#fdfcf8", "cal-brand-emphasis": "#ff7442" } },
      })
      cal("on", { action: "linkReady", callback: onReady })
      cal("on", { action: "linkFailed", callback: onFailed })
      return cal
    }).catch(onFailed)
    return () => {
      active = false
      window.clearTimeout(timeout)
      window.removeEventListener("error", onScriptError, true)
      void api.then(cal => {
        if (cal) {
          cal("off", { action: "linkReady", callback: onReady })
          cal("off", { action: "linkFailed", callback: onFailed })
        }
      })
    }
  }, [])

  return <div className="booking-calendar" data-state={state}>
    <p className={`booking-status${state === "ready" ? " booking-status-ready" : ""}`} role="status" aria-live="polite">
      {state === "unavailable" ? <>The calendar couldn’t load here. <a href={CADLENLY_URL} target="_blank" rel="noopener noreferrer">Open the booking page</a>.</> : state === "loading" ? "Loading live availability…" : "Live booking calendar loaded."}
    </p>
    {state === "unavailable" && <div className="booking-fallback">
      <img src="/assets/icons/n8n-hero/calendar.svg" alt="" width="72" height="72" />
      <h4>Let’s find a time to talk.</h4>
      <p>Choose your date, timezone and available time on our booking page.</p>
      <a className="btn btn-p" href={CADLENLY_URL} target="_blank" rel="noopener noreferrer">Open booking calendar</a>
    </div>}
    <Cal namespace={namespace} calLink={bookingPath} calOrigin="https://app.cal.com" config={config} style={{ width: "100%", minHeight: 600, overflow: "auto", display: state === "unavailable" ? "none" : "block" }} />
  </div>
}

export function BookingEmbed() {
  const [today, setToday] = useState<Date | null>(null)
  const [month, setMonth] = useState<Date | null>(null)
  const [day, setDay] = useState<Date | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [timeZone, setTimeZone] = useState("")
  const [open, setOpen] = useState(false)
  const [preference, setPreference] = useState<Preference>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    setToday(now)
    setMonth(new Date(now.getFullYear(), now.getMonth(), 1))
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal()
    if (!open && dialog.current?.open) dialog.current.close()
  }, [open])

  const previousDisabled = !today || !month || month <= new Date(today.getFullYear(), today.getMonth(), 1)
  const changeMonth = (offset: number) => {
    if (!month) return
    setMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1))
    setDay(null)
    setTime(null)
  }
  const openScheduler = (usePreference: boolean) => {
    setPreference(usePreference && day && time ? { day, time, timeZone } : null)
    setOpen(true)
  }
  const days: (Date | null)[] = []
  if (month) {
    const offset = (month.getDay() + 6) % 7
    for (let i = 0; i < offset; i++) days.push(null)
    const length = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    for (let i = 1; i <= length; i++) days.push(new Date(month.getFullYear(), month.getMonth(), i))
  }

  return <>
    <div className="bk bk-original" id="bk">
      <div className="bk-info">
        <span className="eb">Talk to the team</span>
        <h3>Book a 30-minute process review</h3>
        <p>No sales script. An automation engineer walks the process with you, with a specialist on the call when the process needs one.</p>
        <div className="bk-meta"><span>30 min</span><span>Video call</span><span>n8n engineer</span></div>
        <ul className="bk-list">
          <li><img loading="lazy" src="/assets/icons/n8n-hero/trigger.svg" alt="" /><div><b>Show us the process</b><span>With the people who actually do the work.</span></div></li>
          <li><img loading="lazy" src="/assets/icons/n8n-hero/workflow.svg" alt="" /><div><b>We map the opportunity</b><span>Bottleneck, systems, risks, impact.</span></div></li>
          <li><img loading="lazy" src="/assets/icons/n8n-hero/agent.svg" alt="" /><div><b>See a working proof</b><span>For qualified use cases.</span></div></li>
        </ul>
      </div>
      <div className="bk-cal" aria-label="Choose a preferred date">
        <div className="cal-h"><b aria-live="polite">{month ? month.toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "Choose a date"}</b><div>
          <button type="button" aria-label="Previous month" disabled={previousDisabled} onClick={() => changeMonth(-1)}>‹</button>
          <button type="button" aria-label="Next month" disabled={!month} onClick={() => changeMonth(1)}>›</button>
        </div></div>
        <div className="days" aria-label="Preferred date calendar">
          {weekdays.map(label => <span className="dow" key={label}>{label}</span>)}
          {days.map((date, index) => {
            if (!date) return <span key={`empty-${index}`} />
            const enabled = !!today && date > today && date.getDay() !== 0 && date.getDay() !== 6
            const selected = !!day && dateKey(day) === dateKey(date)
            return <button key={dateKey(date)} type="button" className={`${enabled ? "av" : ""}${selected ? " sel" : ""}`} disabled={!enabled} aria-label={longDate(date)} aria-pressed={selected} onClick={() => { setDay(date); setTime(null) }}>{date.getDate()}</button>
          })}
        </div>
        <p className="booking-timezone">{timeZone ? `Times in ${timeZone.replace(/_/g, " ")}` : "Times in your local timezone"}</p>
      </div>
      <div className="bk-time">
        <span className="lbl">Preferred times</span>
        <div className="day" aria-live="polite">{day ? day.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) : "Pick a day"}</div>
        <div className="slots" aria-label="Choose a preferred time">{preferredTimes.map(value => <button key={value} type="button" disabled={!day} className={time === value ? "sel" : ""} aria-pressed={time === value} onClick={() => setTime(value)}>{value} <span>30 min</span></button>)}</div>
        <p className="booking-preference-note">Choose a preference. Confirm live availability in the next step.</p>
        <button className="btn btn-p" type="button" disabled={!day || !time} onClick={() => openScheduler(true)}>{time ? `Continue with ${time}` : "Pick a time"}</button>
        <button className="booking-other-time" type="button" onClick={() => openScheduler(false)}>See all available times</button>
        <noscript><a href={CADLENLY_URL}>Open booking calendar</a></noscript>
      </div>
    </div>
    <dialog ref={dialog} className="booking-dialog" aria-labelledby="booking-dialog-title" onClose={() => setOpen(false)} onCancel={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false) }}>
      <div className="booking-dialog-head"><div><span className="eb">Talk to the team</span><h2 id="booking-dialog-title">Confirm your process review</h2><p>{preference ? `Preferred: ${longDate(preference.day)} at ${preference.time}. Choose a live slot below.` : "Choose a live slot and complete your booking below."}</p></div><button type="button" className="booking-dialog-close" aria-label="Close booking calendar" onClick={() => setOpen(false)}>×</button></div>
      {open && <BookingScheduler preference={preference} />}
      <p className="booking-dialog-link"><a href={CADLENLY_URL} target="_blank" rel="noopener noreferrer">Open booking page in a new tab</a></p>
    </dialog>
  </>
}
