const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const downloadLink = document.getElementById("download");

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

downloadLink.addEventListener("click", (event) => {
  event.preventDefault();

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
