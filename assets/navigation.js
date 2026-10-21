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

const alt = new URLSearchParams(location.search).get("palette") === "alt";
if (alt) document.documentElement.dataset.palette = "alt";
const paper = getComputedStyle(document.body).getPropertyValue("--paper").trim();
const themeMeta = document.querySelector('meta[name="theme-color"]');
if (themeMeta && paper) themeMeta.setAttribute("content", paper);
const zh = document.documentElement.lang === "zh-Hans";
document.querySelectorAll("a[href]").forEach(anchor => {
  let url;
  try { url = new URL(anchor.getAttribute("href"), location.href); } catch { return; }
  if (url.origin !== location.origin) return;
  if (anchor.classList.contains("palette-toggle")) {
    if (alt) url.searchParams.delete("palette");
    else url.searchParams.set("palette", "alt");
    anchor.textContent = alt ? (zh ? "原调色" : "First palette") : (zh ? "另一组暖色" : "Warmer palette");
  } else if (alt) {
    url.searchParams.set("palette", "alt");
  }
  const query = url.searchParams.toString();
  anchor.href = url.pathname + (query ? "?" + query : "") + url.hash;
});
