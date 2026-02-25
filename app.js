let usuario = JSON.parse(localStorage.getItem("usuario")) || null;
let progresso = Number(localStorage.getItem("progresso")) || 1;
let diarios = JSON.parse(localStorage.getItem("diarios")) || {};

const conteudos = {
  1: "Deus me vê como amado(a).",
  2: "Deus me vê como filho(a).",
  3: "Deus me vê como escolhido(a).",
  4: "Deus me vê como perdoado(a).",
  5: "Deus me vê como obra-prima.",
  6: "Deus me vê com propósito.",
  7: "Deus me vê como vencedor(a)."
};

function goTo(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(screen).classList.add("active");
}

function cadastrar() {
  const nome = document.getElementById("nome").value;

  usuario = { nome };
  localStorage.setItem("usuario", JSON.stringify(usuario));
  localStorage.setItem("progresso", 1);

  carregarDashboard();
  goTo("dashboard");
}

function carregarDashboard() {
  document.getElementById("saudacao").innerText = Olá, ${usuario.nome} ✨;
  document.getElementById("progressoTexto").innerText = Dia atual: ${progresso}/7;

  const container = document.getElementById("diasContainer");
  container.innerHTML = "";

  for (let i = 1; i <= 7; i++) {
    const card = document.createElement("div");
    card.className = "card-dia";

    if (i < progresso) {
      card.innerText = Dia ${i} ✔;
    } else if (i === progresso) {
      card.innerText = Dia ${i} 🔓;
      card.onclick = () => abrirDia(i);
    } else {
      card.innerText = Dia ${i} 🔒;
    }

    container.appendChild(card);
  }
}

function abrirDia(dia) {
  document.getElementById("tituloDia").innerText = Dia ${dia};
  document.getElementById("conteudoDia").innerText = conteudos[dia];
  document.getElementById("textoDiario").value = diarios[dia] || "";

  window.diaAtual = dia;
  goTo("dia");
}

function concluirDia() {
  const texto = document.getElementById("textoDiario").value;
  diarios[diaAtual] = texto;

  localStorage.setItem("diarios", JSON.stringify(diarios));

  if (progresso < 7) progresso++;
  localStorage.setItem("progresso", progresso);

  carregarDashboard();
  goTo("dashboard");
}

window.onload = () => {
  if (usuario) {
    carregarDashboard();
    goTo("dashboard");
  }
};