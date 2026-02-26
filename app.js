/* ========================= */
/* VARIÁVEIS GLOBAIS */
/* ========================= */
let usuario = JSON.parse(localStorage.getItem("usuario"));
let progresso = Number(localStorage.getItem("progresso")) || 1;
let diarios = JSON.parse(localStorage.getItem("diarios")) || {};
let diaAtual = null;

  const desafios = {
  1: {
    frase: "Deus me vê como amado(a).",
    versiculo: "‘Com amor eterno eu te amei; por isso com bondade te atraí.’ – Jeremias 31:3"
  },
  2: {
    frase: "Deus me vê como filho(a).",
    versiculo: "‘Mas a todos quantos o receberam, deu-lhes o poder de serem feitos filhos de Deus.’ – João 1:12"
  },
  3: {
    frase: "Deus me vê como escolhido(a).",
    versiculo: "‘Vocês são geração eleita.’ – 1 Pedro 2:9"
  },
  4: {
    frase: "Deus me vê como perdoado(a).",
    versiculo: "‘Se confessarmos os nossos pecados, Ele é fiel e justo para nos perdoar.’ – 1 João 1:9"
  },
  5: {
    frase: "Deus me vê como obra-prima.",
    versiculo: "‘Somos feitura dele.’ – Efésios 2:10"
  },
  6: {
    frase: "Deus me vê com propósito.",
    versiculo: "‘Porque sou eu que conheço os planos que tenho para vocês.’ – Jeremias 29:11"
  },
  7: {
    frase: "Deus me vê como vencedor(a).",
    versiculo: "‘Em todas estas coisas somos mais que vencedores.’ – Romanos 8:37"
  }
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
/* CADASTRO / LOGIN */
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
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const confirmarSenha = document.getElementById("confirmarSenha").value.trim();
  const lembrar = document.getElementById("lembrar").checked;

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

    if (lembrar) {
      localStorage.setItem("logado", "true");
    }

    const boasVindas = document.getElementById("boasVindas");
    if (boasVindas) {
      boasVindas.innerText = `Bem-vindo(a), ${usuario.nome} ✨`;
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

      usuario = usuarioSalvo;

      if (lembrar) {
        localStorage.setItem("logado", "true");
      }

      const boasVindas = document.getElementById("boasVindas");
      if (boasVindas) {
        boasVindas.innerText = `Bem-vindo(a), ${usuario.nome} ✨`;
      }

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
/* DASHBOARD */
/* ========================= */
function carregarDashboard() {

  if (!usuario) return;

  progresso = Number(localStorage.getItem("progresso")) || 1;
  diarios = JSON.parse(localStorage.getItem("diarios")) || {};

  const saudacao = document.getElementById("saudacao");
  const progressoTexto = document.getElementById("progressoTexto");
  const container = document.getElementById("diasContainer");

  if (!container) return;

  if (saudacao) {
    saudacao.innerText = `Olá, ${usuario.nome} ✨`;
  }

  if (progressoTexto) {
    progressoTexto.innerText = `Dia atual: ${progresso}/7`;
  }

  container.innerHTML = "";

  for (let i = 1; i <= 7; i++) {

    const card = document.createElement("div");
    card.className = "card-dia";

    if (i < progresso) {
      card.innerText = `Dia ${i} ✔`;
    } 
    else if (i === progresso) {
      card.innerText = `Dia ${i} 🔓`;
      card.onclick = () => abrirDia(i);
    } 
    else {
      card.innerText = `Dia ${i} 🔒`;
    }

    container.appendChild(card);
  }
}
/* LIBERAR DESAFIO NO DIA */
/*==========================/


function desafioDisponivel() {
  const agora = new Date();
  const hora = agora.getHours();
  return hora >= 6 && hora < 24;
}
 

/* ========================= */
/* ABRIR DIA */
/* ========================= */
function abrirDesafio() {

  if (!desafioDisponivel()) {
    alert("O desafio estará disponível das 06:00 às 00:00 🙏");
    return;
  }

  const dia = Number(localStorage.getItem("progresso")) || 1;

  const desafio = desafios[dia];

  if (!desafio) {
    alert("Todos os desafios já foram concluídos 🎉");
    return;
  }

  document.getElementById("tituloDesafio").innerText = `Desafio do Dia ${dia}`;
  document.getElementById("fraseDesafio").innerText = desafio.frase;
  document.getElementById("versiculoDesafio").innerText = desafio.versiculo;

  goTo("desafio");
}

/* CONCLUIR DESAFIO */

function concluirDesafio() {

  const texto = document.getElementById("textoReflexao").value.trim();

  if (!texto) {
    alert("Escreva sua reflexão antes de concluir 💛");
    return;
  }

  let progresso = Number(localStorage.getItem("progresso")) || 1;
  let diarios = JSON.parse(localStorage.getItem("diarios")) || {};

  diarios[progresso] = texto;

  localStorage.setItem("diarios", JSON.stringify(diarios));

  if (progresso < 7) {
    progresso++;
    localStorage.setItem("progresso", progresso);
  }

  alert("Jornada quase completa ✨");

  goTo("dashboard");
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

  progresso = Number(localStorage.getItem("progresso")) || 1;

  if (progresso < 7) {
    progresso++;
    localStorage.setItem("progresso", progresso);
  }

  carregarDashboard();
  goTo("dashboard");
}


/* ========================= */
/* INICIALIZAÇÃO */
/* ========================= */
window.addEventListener("DOMContentLoaded", () => {

  const logado = localStorage.getItem("logado");
  const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));

  if (logado === "true" && usuarioSalvo) {

    usuario = usuarioSalvo;

    // Garante que progresso e diarios existam
    if (!localStorage.getItem("progresso")) {
      localStorage.setItem("progresso", "1");
    }

    if (!localStorage.getItem("diarios")) {
      localStorage.setItem("diarios", JSON.stringify({}));
    }

    carregarDashboard();
    goTo("dashboard");

  } else {
    goTo("splash");
  }

});
