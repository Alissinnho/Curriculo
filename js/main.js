/* ---------- Renderização ---------- */
function el(tag, cls, text){
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  if(text) e.textContent = text;
  return e;
}
function link(href, label, cls){
  const a = el("a", "btn " + cls, label);
  a.href = href; a.target = "_blank"; a.rel = "noopener";
  return a;
}
function render(container, lista){
  if(lista.length === 0){
    container.replaceWith(el("div", "empty", "Nenhum projeto por aqui ainda. Adicione itens na lista \"projetos\" do arquivo index.html."));
    return;
  }
  lista.forEach(p => {
    const card = el("article", "card");
    card.append(el("h3", "", p.titulo), el("p", "", p.descricao));
    const chips = el("ul", "chips");
    (p.tecnologias || []).forEach(t => chips.append(el("li", "", t)));
    card.append(chips);
    const links = el("div", "links");
    if(p.repo) links.append(link(p.repo, "Ver código", "primary"));
    if(p.demo) links.append(link(p.demo, "Ver online", ""));
    card.append(links);
    container.append(card);
  });
}
const marcados = projetos.filter(p => p.destaque);
render(document.getElementById("grid-destaques"), (marcados.length ? marcados : projetos).slice(0, 3));
render(document.getElementById("grid-todos"), projetos);

/* ---------- Navegação ---------- */
const navLinks = [...document.querySelectorAll("nav a")];
const secoes = [...document.querySelectorAll(".screen")];

function marcar(id){
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
}
function route(){
  const hash = location.hash.slice(1);
  const emProjetos = hash === "projetos";
  document.getElementById("v-principal").classList.toggle("on", !emProjetos);
  document.getElementById("v-projetos").classList.toggle("on", emProjetos);
  if(emProjetos){
    marcar("destaques");
    document.title = "Projetos | Alisson Daledone";
    window.scrollTo(0, 0);
    return;
  }
  document.title = "Alisson Daledone | Ciência da Computação";
  const alvo = document.getElementById(hash);
  if(alvo && alvo.classList.contains("screen")){
    alvo.scrollIntoView();
    marcar(hash);
  }else{
    window.scrollTo(0, 0);
    marcar("quem-sou-eu");
  }
}
window.addEventListener("hashchange", route);
route();

/* destaca no menu a seção que está na tela */
const obs = new IntersectionObserver(entradas => {
  if(!document.getElementById("v-principal").classList.contains("on")) return;
  entradas.forEach(e => { if(e.isIntersecting) marcar(e.target.id); });
}, {rootMargin: "-45% 0px -50% 0px"});
secoes.forEach(s => obs.observe(s));

document.getElementById("ano").textContent = new Date().getFullYear();

/* ---------- Menu do celular ---------- */
const btnMenu = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");
function fecharMenu(){
  menu.classList.remove("aberto");
  btnMenu.setAttribute("aria-expanded", "false");
  btnMenu.setAttribute("aria-label", "Abrir menu");
}
btnMenu.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  btnMenu.setAttribute("aria-expanded", String(aberto));
  btnMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
});
menu.addEventListener("click", e => { if(e.target.closest("a")) fecharMenu(); });
document.addEventListener("keydown", e => { if(e.key === "Escape") fecharMenu(); });
window.addEventListener("resize", () => { if(window.innerWidth > 760) fecharMenu(); });
