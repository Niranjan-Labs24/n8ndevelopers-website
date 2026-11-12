"use client"

import { useEffect, useState } from "react"
import Cal, { getCalApi } from "@calcom/embed-react"
import { CADLENLY_URL } from "@/app/constants"

const namespace = "n8n-process-review"
const bookingPath = new URL(CADLENLY_URL).pathname.slice(1)
const config = { theme: "light", layout: "month_view" } as const

/** Official Cal.com embed: availability, timezone and confirmation come from the existing scheduler. */
export function BookingEmbed() {
  const [state, setState] = useState<"loading" | "ready" | "unavailable">("loading")

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

  return <div className="bk bk-embedded" id="bk">
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
      <a className="lnk" href={CADLENLY_URL} target="_blank" rel="noopener noreferrer">Open booking page</a>
    </div>
    <div className="booking-calendar" data-state={state} aria-label="Schedule your process review">
      <div className={`booking-status${state === "ready" ? " booking-status-ready" : ""}`} role="status" aria-live="polite">
        {state === "unavailable" ? <>The calendar couldn’t load here. <a href={CADLENLY_URL} target="_blank" rel="noopener noreferrer">Open the same booking page</a></> : state === "loading" ? "Loading live availability…" : "Live booking calendar loaded. Choose a date and time below."}
      </div>
      {state === "unavailable" && <div className="booking-fallback">
        <img src="/assets/icons/n8n-hero/calendar.svg" alt="" width="72" height="72" />
        <h4>Let’s find a time to talk.</h4>
        <p>Choose your date, timezone and available time on our booking page.</p>
        <a className="btn btn-p" href={CADLENLY_URL} target="_blank" rel="noopener noreferrer">Open booking calendar</a>
      </div>}
      <Cal namespace={namespace} calLink={bookingPath} calOrigin="https://app.cal.com" config={config} style={{ width: "100%", minHeight: 600, overflow: "auto", display: state === "unavailable" ? "none" : "block" }} />
      <noscript><p><a href={CADLENLY_URL}>Book your process review on Cal.com</a></p></noscript>
    </div>
  </div>
}
