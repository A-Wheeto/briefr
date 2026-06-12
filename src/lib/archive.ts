type ArchivableTask = {
  completedAt: string | null;
};

export function isArchived(task: ArchivableTask, archiveAfterDays: number | null | undefined): boolean {
  if (archiveAfterDays == null || !task.completedAt) return false;
  return Date.now() - new Date(task.completedAt).getTime() > archiveAfterDays * 86400000;
}
