const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const saveButton = document.getElementById("save");

const points = [];
const radius = 2;

function drawPoints() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#999";

  for (const point of points) {
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fill();
  }
}

async function loadPoints() {
  try {
    const response = await fetch("points.csv", { cache: "no-store" });
    if (!response.ok) return;

    const csv = await response.text();
    const lines = csv.split(/\r?\n/).filter((line) => line.trim() !== "");
    const firstLine = lines[0]?.trim().toLowerCase();
    const dataLines = firstLine === "x,y" ? lines.slice(1) : lines;

    for (const line of dataLines) {
      const [xText, yText] = line.split(",");
      const x = Number(xText?.trim());
      const y = Number(yText?.trim());

      if (
        Number.isFinite(x) &&
        Number.isFinite(y) &&
        x >= 0 && x <= canvas.width &&
        y >= 0 && y <= canvas.height
      ) {
        points.push({ x, y });
      }
    }

    drawPoints();
  } catch (error) {
    // The CSV may be absent, or the page may be opened from file://.
    // In either case, start with an empty point list.
  }
}

canvas.addEventListener("click", (event) => {
  const bounds = canvas.getBoundingClientRect();
  const x = (event.clientX - bounds.left) * (canvas.width / bounds.width);
  const y = (event.clientY - bounds.top) * (canvas.height / bounds.height);

  const clickedIndex = points.findIndex((point) => {
    const dx = point.x - x;
    const dy = point.y - y;
    return dx * dx + dy * dy <= radius * radius;
  });

  if (clickedIndex !== -1) {
    points.splice(clickedIndex, 1);
  } else {
    points.push({ x, y });
  }

  drawPoints();
});

saveButton.addEventListener("click", () => {
  const rows = ["x,y", ...points.map(({ x, y }) => `${x},${y}`)];
  const csv = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(csv);
  const temporaryLink = document.createElement("a");

  temporaryLink.href = url;
  temporaryLink.download = "points.csv";
  temporaryLink.click();

  URL.revokeObjectURL(url);
});

drawPoints();
loadPoints();
