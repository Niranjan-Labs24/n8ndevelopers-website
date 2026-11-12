import { discoveryHeaders, llmsIndex } from "./content"

export const revalidate = 3600

export function GET() {
  return new Response(llmsIndex(), { headers: discoveryHeaders })
}
