const PALETTES = [
  ["#E8A020", "#C4641D"],
  ["#7A9E4F", "#4C6B2F"],
  ["#4F86A8", "#2E5A78"],
  ["#B0653E", "#7E3D22"],
  ["#8A6FA8", "#5C4478"],
  ["#4FA88F", "#2E7862"],
];

export default function Avatar({ handle, size = 42 }) {
  let hash = 0;
  for (let i = 0; i < handle.length; i++) hash = (hash * 31 + handle.charCodeAt(i)) >>> 0;
  const [a, b] = PALETTES[hash % PALETTES.length];
  const initial = handle[0].toUpperCase();
  return (
    <div
      className="avatar"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: `linear-gradient(135deg, ${a}, ${b})`,
      }}
    >
      {initial}
    </div>
  );
}
