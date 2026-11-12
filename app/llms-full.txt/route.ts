import { discoveryHeaders, llmsFull } from "../llms.txt/content"

export const revalidate = 3600

export function GET() {
  return new Response(llmsFull(), { headers: discoveryHeaders })
}
