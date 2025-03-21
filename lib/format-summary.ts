export function formatSummaryForCopy(summary: {
  title: string
  summary: string
  keyPoints: string[]
}): string {
  let formattedText = `# ${summary.title}\n\n`
  formattedText += `## Summary\n\n${summary.summary}\n\n`
  formattedText += `## Key Points\n\n`

  summary.keyPoints.forEach((point, index) => {
    formattedText += `${index + 1}. ${point}\n`
  })

  formattedText += `\n--- Generated by BiteCast ---`

  return formattedText
}

