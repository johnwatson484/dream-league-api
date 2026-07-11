export interface ParsedSourceText {
  name: string
  team: string
}

export function parseSourceText (sourceText: string): ParsedSourceText {
  if (!sourceText) {
    return { name: '', team: '' }
  }

  const separatorIndex = sourceText.lastIndexOf(' - ')
  if (separatorIndex === -1) {
    return { name: sourceText.trim(), team: '' }
  }

  return {
    name: sourceText.substring(0, separatorIndex).trim(),
    team: sourceText.substring(separatorIndex + 3).trim(),
  }
}
