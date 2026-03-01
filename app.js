/* ========================= */
/* VARIÁVEIS GLOBAIS */
/* ========================= */
let usuario = JSON.parse(localStorage.getItem("usuario")) || null;
let progresso = Number(localStorage.getItem("progresso")) || 1;
let diarios = JSON.parse(localStorage.getItem("diarios")) || {};

const desafios = {
  1: { frase: "Deus me vê como amado(a).", versiculo: "Jeremias 31:3" },
  2: { frase: "Deus me vê como filho(a).", versiculo: "João 1:12" },
  3: { frase: "Deus me vê como escolhido(a).", versiculo: "1 Pedro 2:9" },
  4: { frase: "Deus me vê como perdoado(a).", versiculo: "1 João 1:9" },
  5: { frase: "Deus me vê como obra-prima.", versiculo: "Efésios 2:10" },
  6: { frase: "Deus me vê com propósito.", versiculo: "Jeremias 29:11" },
  7: { frase: "Deus me vê como vencedor(a).", versiculo: "Romanos 8:37" }
};

/* ========================= */
/* TROCA DE TELAS */
/* ========================= */
function goTo(screenId) {
  document.querySelectorAll(".screen").forEach(s =>
    s.classList.remove("active")
  );

  const tela = document.getElementById(screenId);
  if (tela) {
    tela.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/* ========================= */
/* LOGIN / CADASTRO */
/* ========================= */
let modoCadastro = true;

function alternarModo() {
  modoCadastro = !modoCadastro;

  const titulo = document.getElementById("authTitulo");
  const botao = document.getElementById("botaoAuth");
  const confirmar = document.querySelector(".cadastro-only");
  const alternarTexto = document.querySelector(".alternar span");

  if (!titulo || !botao || !confirmar || !alternarTexto) return;

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
  const nome = document.getElementById("nome")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const senha = document.getElementById("senha")?.value.trim();
  const confirmarSenha = document.getElementById("confirmarSenha")?.value.trim();
  const lembrar = document.getElementById("lembrar")?.checked;

  if (modoCadastro) {
    if (!nome || !email || !senha || !confirmarSenha) {
      alert("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    usuario = { nome, email, senha };
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("progresso", "1");
    localStorage.setItem("diarios", JSON.stringify({}));

    if (lembrar) localStorage.setItem("logado", "true");

    alert("Conta criada com sucesso!");
    goTo("home");

  } else {
    const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));

    if (!usuarioSalvo) {
      alert("Nenhuma conta encontrada.");
      return;
    }

    if (email === usuarioSalvo.email && senha === usuarioSalvo.senha) {
      usuario = usuarioSalvo;
      if (lembrar) localStorage.setItem("logado", "true");
      goTo("home");
    } else {
      alert("E-mail ou senha incorretos.");
    }
  }
}

/* ========================= */
/* LOGOUT */
/* ========================= */
function logout() {
  localStorage.removeItem("logado");
  usuario = null;
  goTo("splash");
}

/* ========================= */
/* LIBERAR DESAFIO */
/* ========================= */
function desafioDisponivel() {
  const hora = new Date().getHours();
  return hora >= 6 && hora < 24;
}

/* ========================= */
/* ABRIR DESAFIO */
/* ========================= */
function abrirDesafio() {
  if (!desafioDisponivel()) {
    alert("Disponível das 06:00 às 00:00 🙏");
    return;
  }

  progresso = Number(localStorage.getItem("progresso")) || 1;

  if (progresso > 7) {
    alert("Todos os desafios já foram concluídos 🎉");
    return;
  }

  const desafio = desafios[progresso];
  if (!desafio) return;

  document.getElementById("tituloDesafio").innerText = `Desafio do Dia ${progresso}`;
  document.getElementById("fraseDesafio").innerText = desafio.frase;
  document.getElementById("versiculoDesafio").innerText = desafio.versiculo;
  document.getElementById("textoReflexao").value = "";

  goTo("desafio");
}

/* ========================= */
/* CONCLUIR DESAFIO */
/* ========================= */
function concluirDesafio() {
  const textarea = document.getElementById("textoReflexao");
  const texto = textarea?.value.trim();

  if (!texto) {
    alert("Escreva sua reflexão 💛");
    return;
  }

  progresso = Number(localStorage.getItem("progresso")) || 1;
  diarios = JSON.parse(localStorage.getItem("diarios")) || {};

  diarios[progresso] = texto;
  localStorage.setItem("diarios", JSON.stringify(diarios));

  if (progresso < 7) {
    progresso++;
    localStorage.setItem("progresso", progresso);
    alert("Jornada quase completa ✨");
  } else {
    localStorage.setItem("progresso", "8");
    alert("Parabéns! Você concluiu os 7 dias 🎉");
  }

  goTo("home");
}

/* ========================= */
/* DIÁRIO */
/* ========================= */
function abrirDiario() {
  diarios = JSON.parse(localStorage.getItem("diarios")) || {};
  const container = document.getElementById("listaDiario");

  container.innerHTML = "";

  Object.keys(diarios).forEach(dia => {
    const bloco = document.createElement("div");
    bloco.className = "card";
    bloco.innerHTML = `
      <h3>Dia ${dia}</h3>
      <p>${diarios[dia]}</p>
    `;
    container.appendChild(bloco);
  });

  goTo("diario");
}

/* ========================= */
/* INICIALIZAÇÃO */
/* ========================= */
window.addEventListener("DOMContentLoaded", () => {

  const logado = localStorage.getItem("logado");
  const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));

  if (logado === "true" && usuarioSalvo) {
    usuario = usuarioSalvo;

    if (!localStorage.getItem("progresso")) {
      localStorage.setItem("progresso", "1");
    }

    if (!localStorage.getItem("diarios")) {
      localStorage.setItem("diarios", JSON.stringify({}));
    }

    goTo("home");
  } else {
    goTo("splash");
  }

});