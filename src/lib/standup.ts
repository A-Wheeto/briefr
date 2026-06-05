type Task = {
  id: string
  title: string
  status: string
  completedAt: string | null
}

export function getStandupTasks(tasks: Task[]) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)

  const completedYesterday = tasks.filter(t => {
    if (!t.completedAt) return false
    const d = new Date(t.completedAt)
    return d >= yesterdayStart && d < todayStart
  })

  const inProgressToday = tasks.filter(t =>
    t.status === "IN_PROGRESS" || t.status === "REVIEW"
  )

  return { completedYesterday, inProgressToday }
}

export function formatStandupText(
  completedYesterday: Task[],
  inProgressToday: Task[]
) {
  const date = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  const lines = [`📋 Briefr — ${date}`, ""]

  lines.push("Yesterday I completed:")
  if (completedYesterday.length > 0) {
    completedYesterday.forEach(t => lines.push(`• ${t.title}`))
  } else {
    lines.push("• Nothing completed yesterday")
  }

  lines.push("")
  lines.push("Today I'm working on:")
  if (inProgressToday.length > 0) {
    inProgressToday.forEach(t => lines.push(`• ${t.title}`))
  } else {
    lines.push("• Nothing in progress")
  }

  return lines.join("\n")
}
