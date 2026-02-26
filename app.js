let usuario = JSON.parse(localStorage.getItem("usuario")) || null;
let progresso = Number(localStorage.getItem("progresso")) || 1;
let diarios = JSON.parse(localStorage.getItem("diarios")) || {};
let diaAtual = null;

const conteudos = {
  1: "Deus me vê como amado(a).",
  2: "Deus me vê como filho(a).",
  3: "Deus me vê como escolhido(a).",
  4: "Deus me vê como perdoado(a).",
  5: "Deus me vê como obra-prima.",
  6: "Deus me vê com propósito.",
  7: "Deus me vê como vencedor(a)."
};

/* ========================= */
/* TROCA DE TELAS */
/* ========================= */
function goTo(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add("active");
    window.scrollTo(0, 0);
  }
}

/* ========================= */
/* CADASTRO */
/* ========================= */
let modoCadastro = true;

function alternarModo() {
  modoCadastro = !modoCadastro;

  const titulo = document.getElementById("authTitulo");
  const botao = document.getElementById("botaoAuth");
  const confirmar = document.querySelector(".cadastro-only");
  const alternarTexto = document.querySelector(".alternar span");

  if (modoCadastro) {
    titulo.innerText = "Criar Conta";
    botao.innerText = "Cadastrar";
    confirmar.style.display = "block";
    alternarTexto.innerText = "Entrar";
  } else {
    titulo.innerText = "Entrar";
    botao.innerText = "Login";
    confirmar.style.display = "none";
    alternarTexto.innerText = "Criar conta";
  }
}

function acaoAuth() {
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;
  const lembrar = document.getElementById("lembrar").checked;

  if (modoCadastro) {
    if (!nome || !email || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    const usuario = { nome, email, senha };
    localStorage.setItem("usuario", JSON.stringify(usuario));

    if (lembrar) {
      localStorage.setItem("logado", "true");
    }

    alert("Conta criada com sucesso!");
    goTo("home");
  } else {
    const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));

    if (!usuarioSalvo) {
      alert("Nenhuma conta encontrada.");
      return;
    }

    if (email === usuarioSalvo.email && senha === usuarioSalvo.senha) {
      if (lembrar) {
        localStorage.setItem("logado", "true");
      }

      goTo("home");
    } else {
      alert("E-mail ou senha incorretos.");
    }
  }
}

/* ========================= */
/* MENU */
/* ========================= */
function irParaDesafio() {
  carregarDashboard();
  goTo("dashboard");
}

function logout() {
  localStorage.removeItem("usuario");
  usuario = null;
  goTo("splash");
}

/* ========================= */
/* DASHBOARD */
/* ========================= */
function carregarDashboard() {
  if (!usuario) return;

  document.getElementById("saudacao").innerText =
    `Olá, ${usuario.nome} ✨`;

  document.getElementById("progressoTexto").innerText =
    `Dia atual: ${progresso}/7`;

  const container = document.getElementById("diasContainer");
  container.innerHTML = "";

  for (let i = 1; i <= 7; i++) {
    const card = document.createElement("div");
    card.className = "card-dia";

    if (i < progresso) {
      card.innerText = `Dia ${i} ✔`;
    } else if (i === progresso) {
      card.innerText = `Dia ${i} 🔓`;
      card.onclick = () => abrirDia(i);
    } else {
      card.innerText = `Dia ${i} 🔒`;
    }

    container.appendChild(card);
  }
}

/* ========================= */
/* ABRIR DIA */
/* ========================= */
function abrirDia(dia) {
  diaAtual = dia;

  document.getElementById("tituloDia").innerText = `Dia ${dia}`;
  document.getElementById("conteudoDia").innerText = conteudos[dia];
  document.getElementById("textoDiario").value = diarios[dia] || "";

  goTo("dia");
}

/* ========================= */
/* CONCLUIR DIA */
/* ========================= */
function concluirDia() {
  const texto = document.getElementById("textoDiario").value.trim();

  if (!texto) {
    alert("Escreva algo antes de concluir 💛");
    return;
  }

  diarios[diaAtual] = texto;
  localStorage.setItem("diarios", JSON.stringify(diarios));

  if (progresso < 7) {
    progresso++;
    localStorage.setItem("progresso", progresso);
  }

  carregarDashboard();
  goTo("dashboard");
}

/* ========================= */
/* CARREGAMENTO INICIAL */
/* ========================= */
window.onload = () => {
  if (usuario) {
    document.getElementById("boasVindas").innerText =
      `Bem-vindo(a), ${usuario.nome} ✨`;
    goTo("home");
  } else {
    goTo("splash");
  }
  
};