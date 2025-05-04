document.getElementById("acessarDashboard");

// Função para fazer login
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("token", data.token); // Salva token no navegador
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    window.location.href = "/central-operacional";
  } else {
    alert("Erro: " + data.message);
  }
}

// Função para carregar a pagina central-operacional
async function carregarCentralOperacional() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://127.0.0.1:5000/verificar-token", {
    method: "GET",
    headers: { Authorization: token },
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("token", data.token); // Salva token no navegador
    window.location.href = "/central-operacional";
  } else {
    alert("Erro: " + data.message);
  }
}

// Função para carregar o dashboard
async function carregarDashboard() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://127.0.0.1:5000/verificar-token", {
    method: "GET",
    headers: { Authorization: token },
  });

  const data = await response.json();

  if (response.ok) {
    document.getElementById("mensagem").innerText = data.message;
  } else {
    alert("Acesso negado! Faça login novamente.");
    window.location.href = "/central-operacional";
  }
}

// Função para carregar o gráfico de recursos na dashboard
async function carregarGraficoRecursos() {
  const response = await fetch("/recursos/listar");
  const data = await response.json();
  const recursos = data.recursos;
  const tipos = [];
  const quantidades = [];
  recursos.forEach((recurso) => {
    tipos.push(recurso.tipo);
    quantidades.push(recurso.quantidade);
  });
  const ctx = document.getElementById("grafico-recursos").getContext("2d");
  const grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: tipos,
      datasets: [
        {
          label: "Quantidade de Recursos",
          data: quantidades,
          backgroundColor: [
            "rgba(232, 102, 102, 0.2)",
            "rgba(20, 149, 235, 0.2)",
            "rgba(189, 141, 20, 0.2)",
            "rgba(8, 67, 67, 0.2)",
            "rgba(51, 14, 125, 0.2)",
            "rgba(173, 92, 12, 0.2)",
          ],
          borderColor: [
            "rgba(255, 255, 255, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        ],
      },
    },
  });
}

// Função para carregar o número de recursos na dashboard
async function carregarNumeroRecursos() {
  const response = await fetch("/recursos/listar");
  const data = await response.json();
  const recursos = data.recursos;
  const numeroRecursos = recursos.length;
  document.getElementById("numero-recursos").innerText = numeroRecursos;
}

// Função para carregar os últimos recursos adicionados na dashboard
async function carregarUltimosRecursosAdicionados() {
  const response = await fetch("/recursos/listar");
  const data = await response.json();
  const recursos = data.recursos;
  const ultimosRecursos = recursos.slice(-5);
  const lista = document.getElementById("ultimos-recursos-adicionados");
  lista.innerHTML = "";
  ultimosRecursos.forEach((recurso) => {
    const li = document.createElement("li");
    li.textContent = recurso.tipo + " - " + recurso.placa;
    lista.appendChild(li);
  });
}

// Função para carregar os recursos removidos na dashboard ((usar futuramente))
async function carregarRecursosRemovidos() {
  const response = await fetch("/recursos/removidos/listar");
  const data = await response.json();
  console.log(data); // Adicione essa linha para verificar os dados
  const recursos = data.recursos;
  const lista = document.getElementById("recursos-removidos");
  lista.innerHTML = "";
  recursos.forEach((recurso) => {
    const li = document.createElement("li");
    li.textContent = recurso.tipo + " - " + recurso.placa;
    lista.appendChild(li);
  });
}

// Função para carregar o gráfico de usuários na dashboard
async function carregarGraficoUsuarios() {
  const response = await fetch("/carregar-usuarios");
  const data = await response.json();
  const usuarios = data.usuarios;
  const nomes = [];
  const quantidades = [];
  usuarios.forEach((usuario) => {
    nomes.push(usuario.nome);
    quantidades.push(1);
  });
  const ctx = document.getElementById("grafico-usuarios").getContext("2d");
  const grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: nomes,
      datasets: [
        {
          label: "Quantidade de Usuários",
          data: quantidades,
          backgroundColor: [
            "rgba(204, 30, 30, 0.2)",
            "rgba(9, 88, 142, 0.2)",
            "rgba(196, 147, 22, 0.2)",
            "rgba(16, 119, 119, 0.2)",
            "rgba(55, 17, 132, 0.2)",
            "rgba(215, 117, 18, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.1)",
            },
          },
        ],
      },
    },
  });
}

// Carregar as funcionalidades ao iniciar a página dashboard
carregarGraficoRecursos();
carregarNumeroRecursos();
carregarUltimosRecursosAdicionados();
carregarRecursosRemovidos();
carregarGraficoUsuarios();

// Função para adicionar usuário - ref. página usuarios.html
async function adicionarUsuario(event) {
  event.preventDefault();

  const novoUsuario = document.getElementById("novoUsuario").value;
  const novaSenha = document.getElementById("novaSenha").value;
  const hierarquia = document.getElementById("hierarquia").value; // <-- pegar hierarquia do select

  const response = await fetch("http://127.0.0.1:5000/adicionar-usuario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ novoUsuario, novaSenha, hierarquia }), // <-- enviar hierarquia
  });

  const data = await response.json();

  if (response.ok) {
    alert("Usuário adicionado com sucesso!");
    document.getElementById("form-adicionar-usuario").reset?.(); // limpar, se quiser
    carregarUsuarios();
  } else {
    alert("Erro ao adicionar usuário: " + data.message);
  }
}

// Função para carregar usuários
async function carregarUsuarios() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Faça login primeiro");
    window.location.href = "/";
    return;
  }

  const response = await fetch("http://127.0.0.1:5000/carregar-usuarios", {
    method: "GET",
    headers: { Authorization: token },
  });

  const data = await response.json();

  if (response.ok) {
    const listaUsuarios = document.getElementById("listaUsuarios");
    listaUsuarios.innerHTML = "";

    data.usuarios.forEach((usuario) => {
      const li = document.createElement("li");
      li.textContent = `Usuário: ${usuario.nome} | Hierarquia: ${usuario.hierarquia}`;
      listaUsuarios.appendChild(li);

      // Adicionar botões de ação para cada usuário
      const divAcoes = document.createElement("div");
      divAcoes.innerHTML = `  
      <button onclick="editarUsuario(${usuario.id})">Editar</button>
      
      <button onclick="excluirUsuario(${usuario.id})">Excluir</button>
    `;
      listaUsuarios.appendChild(divAcoes);
    });
  } else {
    console.log("Erro ao carregar usuários:", data.message);
  }
}

// Função para editar usuário
async function editarUsuario(id) {
  const novoNome = prompt("Digite o novo nome do usuário:");
  const novaSenha = prompt("Digite a nova senha do usuário:");

  const response = await fetch(`http://127.0.0.1:5000/editar-usuario/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ novoNome, novaSenha }),
  });

  const data = await response.json();

  if (response.ok) {
    alert("Usuário editado com sucesso!");
    // Atualize a página com os novos dados do usuário
  } else {
    alert("Erro ao editar usuário:", data.message);
  }
}

// Função para excluir usuário
async function excluirUsuario(id) {
  const response = await fetch(`http://127.0.0.1:5000/excluir-usuario/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (response.ok) {
    alert("Usuário excluído com sucesso!");
    carregarUsuarios();
  } else {
    alert("Erro ao excluir usuário:", data.message);
  }
}

// Função para adicionar recurso
async function adicionarRecurso() {
  const tipo = document.getElementById("tipo").value;
  const placa = document.getElementById("placa").value;
  const marca = document.getElementById("marca").value;
  const modelo = document.getElementById("modelo").value;
  const ano = document.getElementById("ano").value;
  const quantidade = document.getElementById("quantidade").value;
  let valorTexto = document.getElementById("valor").value;
  let valor = parseFloat(valorTexto.replace(/[R$\s.]/g, "").replace(",", "."));
  const local_operacao = document.getElementById("local_operacao").value;
  const response = await fetch("/recursos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tipo,
      placa,
      marca,
      modelo,
      ano,
      quantidade,
      valor,
      local_operacao,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    alert("Recurso adicionado com sucesso!");
    document.getElementById("form-adicionar-recurso").reset(); // limpar o formulário
    carregarRecursos();
  } else {
    alert("Erro ao adicionar recurso:", data.message);
  }
}

// Adicionar evento de submit ao formulário de adicionar recurso
document
  .getElementById("form-adicionar-recurso")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    adicionarRecurso();
  });

// Função para editar recurso
async function editarRecurso(id) {
  const tipo = prompt("Digite o novo tipo do recurso:");
  const placa = prompt("Digite a nova placa do recurso:");
  const marca = prompt("Digite a nova marca do recurso:");
  const modelo = prompt("Digite o novo modelo do recurso:");
  const ano = prompt("Digite o novo ano do recurso:");
  const quantidade = prompt("Digite a nova quantidade do recurso:");
  const valorTexto = prompt("Digite o novo valor do recurso:");
  const valor = parseFloat(
    valorTexto.replace(/[R$\s.]/g, "").replace(",", ".")
  );
  const local_operacao = prompt("Digite o novo local de operação do recurso:");

  const response = await fetch(`/editar-recurso/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tipo,
      placa,
      marca,
      modelo,
      ano,
      quantidade,
      valor, // aqui vai o valor já tratado
      local_operacao,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    alert("Recurso editado com sucesso!");
    carregarRecursos();
  } else {
    alert("Erro ao editar recurso:", data.message);
  }
}

// Função para remover recurso
async function removerRecurso(id) {
  const response = await fetch(`/excluir-recurso/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (response.ok) {
    alert("Recurso removido com sucesso!");
    carregarRecursos();
  } else {
    alert("Erro ao remover recurso:", data.message);
  }
}

// funcoes das paginas (carregamento)
function dashboard() {
  window.location.href = "/dashboard";
}

// função para projeto futuro ((não será usada no momento))
function visualizarPerfil() {
  // código para visualizar o perfil
  window.location.href = "/perfil";
}

// função para projeto futuro ((não será usada no momento))
function editarPerfil() {
  // código para editar o perfil
  window.location.href = "/editar-perfil";
}

// função de análise de usuários - com base na autoização por token
async function usuarios() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Faça login primeiro");
    window.location.href = "/";
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/verificar-token", {
      method: "GET",
      headers: { Authorization: token },
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Acesso negado");
      window.location.href = "/central-operacional";
      return;
    }

    // Apenas se for admin, redireciona (( somente ao admin pode acessar essa pagina ))
    window.location.href = "/usuarios?token=" + token;
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao acessar usuários");
    window.location.href = "/central-operacional";
  }
}

function recursos() {
  window.location.href = "/recursos";
}

function sairRecursos() {
  window.location.href = "/central-operacional";
}

// função de logout - remove o token para maior segurança do sistema
function logout() {
  // código para sair
  localStorage.removeItem("token");
  window.location.href = "/";
}

// Carrega os recursos - editar e remover
function carregarRecursos() {
  fetch("/recursos/listar")
    .then((response) => response.json())
    .then((data) => {
      const tabela = document.querySelector("table tbody");
      tabela.innerHTML = "";
      data.recursos.forEach((recurso) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
          <td>${recurso.id}</td>
          <td>${recurso.tipo}</td>
          <td>${recurso.placa}</td>
          <td>${recurso.marca}</td>
          <td>${recurso.modelo}</td>
          <td>${recurso.ano}</td>
          <td>${recurso.quantidade}</td>
          <td>${parseFloat(recurso.valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}</td>
          <td>${recurso.local_operacao}</td>
          <td>
            <button class="button" onclick="editarRecurso(${
              recurso.id
            })">Editar</button>
            <button class="button" onclick="removerRecurso(${
              recurso.id
            })">Remover</button>
          </td>
        `;
        tabela.appendChild(linha);
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar recursos:", error);
    });
}

// Função deixar o campo valor em reais no formulário de adicionar recurso
function formatarMoeda(campo) {
  let valor = campo.value;

  // Remove tudo que não for número
  valor = valor.replace(/\D/g, "");

  // Converte para float com 2 casas decimais
  valor = (parseInt(valor) / 100).toFixed(2);

  // Converte para moeda BRL
  valor = valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  campo.value = valor;
}
