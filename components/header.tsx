"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

const industries = [
  ["healthcare", "Healthcare", "ehr"], ["ecommerce", "E-commerce", "cart"],
  ["finance", "Finance", "coins"], ["construction", "Construction", "hardhat"],
  ["real-estate", "Real Estate", "house"], ["legal", "Legal", "scale"], ["saas", "SaaS", "rocket"],
]
const links = [["/services", "Services"], ["https://www.n8ndevelopers.com/blogs", "Blogs"], ["/pricing", "Pricing"], ["/customer-stories", "Customer Stories"]]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdown = useRef<HTMLDivElement>(null)
  const dropdownButton = useRef<HTMLButtonElement>(null)
  const mobileButton = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  useEffect(() => { setMenuOpen(false); setDropdownOpen(false) }, [pathname])
  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (!dropdown.current?.contains(event.target as Node)) setDropdownOpen(false)
    }
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (dropdownOpen) { setDropdownOpen(false); dropdownButton.current?.focus() }
        else if (menuOpen) { setMenuOpen(false); mobileButton.current?.focus() }
      }
    }
    document.addEventListener("click", click)
    document.addEventListener("keydown", key)
    return () => { document.removeEventListener("click", click); document.removeEventListener("keydown", key) }
  }, [dropdownOpen, menuOpen])
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="annc" role="note"><div className="wrap"><span>n8nDevelopers is now part of <a className="annc-l" href="https://labs24.co" target="_blank" rel="noopener noreferrer">Labs 24</a> - Forward deployed engineering company</span><a href="/about">Learn more →</a></div></div>
    <nav className="nav" aria-label="Main navigation"><div className="wrap">
      <a className="logo" href="/" aria-label="n8n Developers home"><img src="/assets/logo/n8n-developers-logo.png" alt="n8nDevelopers" width="150" height="60" /></a>
      <div className="menu">
        <a href="/services" aria-current={pathname === "/services" ? "page" : undefined}>Services</a>
        <div className={`dd${dropdownOpen ? " open" : ""}`} ref={dropdown}>
          <button ref={dropdownButton} type="button" aria-expanded={dropdownOpen} aria-controls="industry-menu" onClick={() => setDropdownOpen(!dropdownOpen)}>Use Cases <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          <div className="panel" id="industry-menu">{industries.map(([slug, label, icon]) => <a key={slug} href={`/use-cases/${slug}`}><img className="ddi" src={`/assets/icons/n8n-hero/${icon}.svg`} alt="" />{label}</a>)}<a className="all" href="/use-cases">All use cases →</a></div>
        </div>
        {links.slice(1).map(([href, label]) => <a key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</a>)}
      </div>
      <div className="acts"><a className="btn btn-s btn-new" href="/partners#apply">Become a partner<span className="new-tag">New</span></a><a className="btn btn-p" href="/#book">Book a call</a></div>
      <button className="mobile-toggle" ref={mobileButton} type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <span aria-hidden="true">×</span> : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg>}</button>
    </div>
    {menuOpen && <div className="mobile-navigation" id="mobile-navigation" onClick={event => { if ((event.target as Element).closest("a")) setMenuOpen(false) }}>
      {links.map(([href,label]) => <a key={href} href={href}>{label}</a>)}
      <details><summary>Use cases</summary>{industries.map(([slug,label]) => <a key={slug} href={`/use-cases/${slug}`}>{label}</a>)}<a href="/use-cases">All use cases →</a></details>
      <a href="/forward-deployed-engineers">Forward deployed engineers</a><a href="/about">About us</a><a href="/contact">Contact</a><a href="/partners#apply">Become a partner ↗</a>
    </div>}
    </nav>
  </>
}
