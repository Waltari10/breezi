export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatPattern = (pattern: {
  inhale: number;
  holdIn?: number;
  exhale: number;
  holdOut?: number;
}): string => {
  const parts = [];
  if (pattern.inhale) parts.push(`${pattern.inhale}s in`);
  if (pattern.holdIn) parts.push(`${pattern.holdIn}s hold`);
  if (pattern.exhale) parts.push(`${pattern.exhale}s out`);
  if (pattern.holdOut) parts.push(`${pattern.holdOut}s hold`);
  return parts.join(", ");
}; 