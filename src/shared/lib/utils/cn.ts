type ClassValue = string | undefined | false | null

export function cn(...classes: ClassValue[]) {
  const filtered = classes.filter(Boolean).join(" ").trim().split(/\s+/)

  const seen = new Map<string, string>()

  for (const cls of filtered) {
    const prefix = cls.split("-")[0]
    seen.set(prefix, cls)
  }

  return Array.from(seen.values()).join(" ")
}
