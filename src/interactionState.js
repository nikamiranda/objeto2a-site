export function getPageProgress(scrollY, viewportHeight, documentHeight) {
  const travel = Math.max(documentHeight - viewportHeight, 1);
  return Math.min(1, Math.max(0, scrollY / travel));
}

export function getActiveChapter(offsets, marker) {
  return offsets.reduce(
    (active, chapter) => (chapter.top <= marker ? chapter.id : active),
    offsets[0]?.id || "inicio",
  );
}
