function revealDestination() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  for (let node = target; node; node = node.parentElement) {
    if (node.tagName === "DETAILS") node.open = true;
  }
  requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
}
window.addEventListener("hashchange", revealDestination);
revealDestination();
document.addEventListener("click", event => {
  const link = event.target.closest('a[href^="#"]');
  if (link && link.hash === location.hash) revealDestination();
});

function bindShell(shell) {
  const video = shell.querySelector("video");
  const play = shell.querySelector(".play-btn");
  if (!video || !play) return;
  const show = () => shell.classList.remove("is-playing");
  play.addEventListener("click", () => { video.play(); });
  video.addEventListener("play", () => shell.classList.add("is-playing"));
  video.addEventListener("pause", show);
  video.addEventListener("ended", show);
}
document.querySelectorAll(".video-shell").forEach(bindShell);

document.querySelectorAll("[data-play]").forEach(trigger => {
  trigger.addEventListener("click", event => {
    const shell = document.querySelector(trigger.getAttribute("data-play"));
    const video = shell && shell.querySelector("video");
    if (!video) return;
    event.preventDefault();
    shell.scrollIntoView({ block: "center" });
    video.play();
  });
});

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");
    document.querySelectorAll("[data-filter]").forEach(item => {
      item.setAttribute("aria-pressed", item === button ? "true" : "false");
    });
    document.querySelectorAll("[data-kind]").forEach(card => {
      const show = filter === "all" || card.getAttribute("data-kind") === filter;
      card.hidden = !show;
    });
  });
});
