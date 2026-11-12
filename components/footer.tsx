import parse from "html-react-parser"
import footer from "@/content/site-footer.json"
export function Footer() { return <>{parse(footer.html)}</> }
