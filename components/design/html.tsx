import parse, { Element, attributesToProps } from "html-react-parser"
import type { ImgHTMLAttributes } from "react"
import { DesignImage } from "./image"
import { BookingEmbed } from "./booking-embed"

export function designHtml(html: string) {
  return parse(html, {
    replace(node) {
      if (node instanceof Element && node.attribs["data-booking-embed"] !== undefined) return <BookingEmbed />
      if (node instanceof Element && node.name === "img" && node.attribs.src?.startsWith("https://")) {
        return <DesignImage {...attributesToProps(node.attribs) as ImgHTMLAttributes<HTMLImageElement>} />
      }
    },
  })
}
