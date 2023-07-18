export function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  let luminance = 0;

  do {
    color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    // Calculate luminance of the color
    const rgb = parseInt(color.substring(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    luminance = (r * 299 + g * 587 + b * 114) / 1000;
  } while (luminance < 128); // Adjust this threshold as needed

  return color;
}