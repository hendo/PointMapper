const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const saveButton = document.getElementById("save");
const radius = 2;

const points = (Array.isArray(window.pointsData) ? window.pointsData : [])
  .filter((point) =>
    point &&
    Number.isFinite(point.x) &&
    Number.isFinite(point.y) &&
    point.x >= 0 && point.x <= canvas.width &&
    point.y >= 0 && point.y <= canvas.height
  )
  .map(({ x, y }) => ({ x, y }));

function drawPoints() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#999";

  for (const point of points) {
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    context.fill();
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
  const fileContent = `window.pointsData = ${JSON.stringify(points, null, 2)};\n`;
  const file = new Blob([fileContent], { type: "text/javascript;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const temporaryLink = document.createElement("a");

  temporaryLink.href = url;
  temporaryLink.download = "points.js";
  temporaryLink.click();

  URL.revokeObjectURL(url);
});

drawPoints();
