document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  if (status) {
    const span = document.createElement("span");
    span.className = "status-text status-loaded";
    span.textContent = `(loaded at ${new Date().toLocaleTimeString()})`;
    status.appendChild(span);
  }

  const ctx = document.getElementById("mainChart");
  if (ctx && window.Chart) {
    // eslint-disable-next-line no-undef
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Visits",
            data: [12, 19, 3, 5, 2, 3, 9],
            borderColor: "#1e90ff",
            backgroundColor: "rgba(30,144,255,0.15)",
            tension: 0.3,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }
});
