export function getNoteName(index) {
  const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
  const octave = Math.floor(index / 12);
  const note = notes[index % 12];
  return note + "-" + octave;
}
