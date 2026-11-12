"use client"

import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react"

/** Keep source photography when reachable, with a local branded fallback for offline review. */
export function DesignImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false)
  const image = useRef<HTMLImageElement>(null)
  useEffect(() => {
    // A server-rendered image can fail before React attaches onError.
    if (image.current?.complete && image.current.naturalWidth === 0) setFailed(true)
  }, [props.src])
  useEffect(() => {
    const caption = image.current?.closest("figure")?.querySelector("figcaption")
    if (caption) caption.hidden = failed
  }, [failed])
  const logo = props.alt?.endsWith("logo")
  if (failed && logo) return <span className="client-wordmark">{props.alt?.replace(/ logo$/, "")}</span>
  return <img ref={image} {...props} src={failed ? "/assets/backgrounds/photo-fallback.svg" : props.src} alt={failed ? "Automation workflow illustration" : props.alt} onError={() => setFailed(true)} onLoad={event => {
    if (failed) {
      const credit = event.currentTarget.closest("figure")?.querySelector("figcaption")
      if (credit) credit.hidden = true
    }
  }} />
}
