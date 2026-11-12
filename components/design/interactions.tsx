"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { usePathname } from "next/navigation"

/** Enhances the server-rendered design-system content without running its editor scripts. */
export function DesignInteractions({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const root = container.current
    if (!root) return
    const one = <T extends HTMLElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)
    const all = <T extends HTMLElement = HTMLElement>(selector: string) => Array.from(root.querySelectorAll<T>(selector))

    all(".qa").forEach((item, index) => {
      const button = item.querySelector("button")
      const answer = item.querySelector<HTMLElement>(".ans")
      if (!button || !answer) return
      if (!answer.id) answer.id = `faq-answer-${index}`
      button.setAttribute("aria-controls", answer.id)
      button.setAttribute("aria-expanded", String(item.classList.contains("open")))
      answer.hidden = !item.classList.contains("open")
    })

    all("#loop .ph").forEach((item) => {
      item.setAttribute("role", "button")
      item.tabIndex = 0
      item.setAttribute("aria-pressed", String(item.classList.contains("on")))
    })
    all("#seg button, #svf button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.classList.contains("on")))
    })

    const chooseLifecycle = (item: HTMLElement) => {
      all("#loop .ph").forEach((phase) => {
        phase.classList.toggle("on", phase === item)
        phase.setAttribute("aria-pressed", String(phase === item))
      })
    }

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const target = event.target
      const faqButton = target.closest<HTMLButtonElement>(".qa button")
      if (faqButton) {
        const item = faqButton.closest(".qa")!
        const open = item.classList.toggle("open")
        faqButton.setAttribute("aria-expanded", String(open))
        const answer = item.querySelector<HTMLElement>(".ans")
        if (answer) answer.hidden = !open
        return
      }
      const phase = target.closest<HTMLElement>("#loop .ph")
      if (phase) { chooseLifecycle(phase); return }

      const filter = target.closest<HTMLButtonElement>("#seg button, #svf button")
      if (filter) {
        const services = !!filter.closest("#svf")
        all(services ? "#svf button" : "#seg button").forEach((button) => {
          button.classList.toggle("on", button === filter)
          button.setAttribute("aria-pressed", String(button === filter))
        })
        if (services) {
          all("#svs .sv").forEach((card) => { card.hidden = filter.dataset.f !== "all" && card.dataset.c !== filter.dataset.f })
        } else {
          all("#board .col").forEach((column) => { column.classList.toggle("dim", filter.dataset.s !== "all" && column.dataset.s !== filter.dataset.s) })
        }
        return
      }

    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.target instanceof Element)) return
      const phase = event.target.closest<HTMLElement>("#loop .ph")
      if (phase && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault()
        chooseLifecycle(phase)
      }
    }

    const onSubmit = (event: SubmitEvent) => {
      if (!(event.target instanceof HTMLFormElement)) return
      const form = event.target
      if (!form.matches(".lead-form, #apForm")) return
      event.preventDefault()
      form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[required], textarea[required]").forEach((field) => {
        field.setCustomValidity(field.value.trim() ? "" : "Please complete this field.")
      })
      if (!form.reportValidity()) return
      const data = new FormData(form)
      const subject = form.id === "apForm" ? "Partner program enquiry" : `Process review: ${String(data.get("reason") || "Automation enquiry")}`
      const labels: Record<string, string> = { name: "Name", email: "Work email", agency: "Agency", type: "Agency type", model: "Preferred model", requests: "Client requests", reason: "Enquiry", details: "Process details" }
      const body = Array.from(data.entries()).filter(([, value]) => typeof value === "string").map(([name, value]) => `${labels[name] || name}: ${String(value).trim()}`).join("\n\n")
      const status = form.querySelector<HTMLElement>("[data-form-status], .form-status, [role='status']")
      if (status) {
        status.hidden = false
        status.textContent = "Your email draft is opening. Review it and send it from your email app. If it does not open, email sasha.ray@n8ndevelopers.com directly."
      }
      window.location.assign(`mailto:sasha.ray@n8ndevelopers.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    }

    const onInput = (event: Event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) event.target.setCustomValidity("")
    }

    root.addEventListener("click", onClick)
    root.addEventListener("keydown", onKeyDown)
    root.addEventListener("submit", onSubmit)
    root.addEventListener("input", onInput)

    const chips = all<HTMLAnchorElement>(".chipnav a[href^='#']")
    let observer: IntersectionObserver | undefined
    if (chips.length && "IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        const active = entries.find((entry) => entry.isIntersecting)
        if (!active) return
        chips.forEach((chip) => {
          const selected = chip.hash === `#${active.target.id}`
          chip.classList.toggle("on", selected)
          if (selected) chip.setAttribute("aria-current", "location")
          else chip.removeAttribute("aria-current")
        })
      }, { rootMargin: "-35% 0px -50% 0px" })
      chips.forEach((chip) => {
        const section = all("[id]").find((element) => element.id === decodeURIComponent(chip.hash.slice(1)))
        if (section) observer!.observe(section)
      })
    }

    return () => {
      root.removeEventListener("click", onClick)
      root.removeEventListener("keydown", onKeyDown)
      root.removeEventListener("submit", onSubmit)
      root.removeEventListener("input", onInput)
      observer?.disconnect()
    }
  }, [pathname])

  return <div ref={container}>{children}</div>
}

export default DesignInteractions
