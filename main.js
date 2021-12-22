let url =
  "https://api.box3.work/api/Contato/091286b6-fa97-4295-83ea-6476917a6056";
let idMudarCliente = 0;

/* Funções para validações ================================================= */
function validateEmail(email) {
  let re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function validatePhone(phone) {
  var regex = new RegExp(
    "^((1[1-9])|([2-9][0-9]))((3[0-9]{3}[0-9]{4})|(9[0-9]{3}[0-9]{5}))$"
  );
  return regex.test(phone);
}

function data_valida(date) {
  var matches = /(\d{4})[-.\/](\d{2})[-.\/](\d{2})/.exec(date);
  if (matches == null) {
    return false;
  }
  var dia = matches[3];
  var mes = matches[2] - 1;
  var ano = matches[1];
  var data = new Date(ano, mes, dia);
  return (
    data.getDate() == dia && data.getMonth() == mes && data.getFullYear() == ano
  );
}
/* ================================================================================= */

// Criar:
function createUser() {
  let nome = document.getElementById("nome").value;
  let telefone = document.getElementById("telefone").value;
  let email = document.getElementById("email").value;
  let check = document.getElementById("exampleCheck1").checked;
  let dataNascimento = document.getElementById("dataNascimento").value;

  if (
    nome != "" &&
    telefone != "" &&
    email != "" &&
    dataNascimento != "" &&
    validateEmail(email) &&
    validatePhone(telefone) &&
    data_valida(dataNascimento)
  ) {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        nome: nome,
        telefone: telefone,
        email: email,
        ativo: check,
        dataNascimento: dataNascimento,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then(alert("Contato criado !"));
  } else {
    alert("Por favor, Preencha os dados corretamente !");
  }
}

// Editar
async function alterarDadosCliente(element) {
  try {
    let nome = document.getElementById("mudarNome");
    let email = document.getElementById("mudarEmail");
    let telefone = document.getElementById("mudarTelefone");
    let check = document.getElementById("exampleCheck2");
    let dataNascimento = document.getElementById("mudarDataNascimento");
    const resposta = await fetch(url);
    const data = await resposta.json();
    let target = element.id;
    let newTarget = parseInt(target.slice(1, 10));

    for (user of data) {
      if (user.id == newTarget) {
        nome.value = user.nome;
        email.value = user.email;
        telefone.value = user.telefone;
        check.checked = user.ativo;
        dataNascimento.value = user.dataNascimento.slice(0, 10);
        idMudarCliente = newTarget;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function auxEditar() {
  let nome = document.getElementById("mudarNome").value;
  let email = document.getElementById("mudarEmail").value;
  let telefone = document.getElementById("mudarTelefone").value;
  let check = document.getElementById("exampleCheck2").checked;
  let dataNascimento = document.getElementById("mudarDataNascimento").value;
  if (
    nome != "" &&
    telefone != "" &&
    email != "" &&
    dataNascimento != "" &&
    validateEmail(email) &&
    validatePhone(telefone) &&
    data_valida(dataNascimento)
  ) {
    try {
      const response = await fetch(`${url}/${idMudarCliente}`, {
        method: "PUT",
        id: idMudarCliente,
        body: JSON.stringify({
          nome: nome,
          telefone: telefone,
          email: email,
          ativo: check,
          dataNascimento: dataNascimento,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const data = await response.json();
      if (data) {
        alert("Contato Alterado");
      } else {
        alert("Não foi possivel alterar");
      }
      await getContent();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  } else {
    alert("Por favor, Preencha os dado corretamente !");
  }
}

// Deletar contato
async function deletar(element) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    let target = element.id;
    let newTarget = parseInt(target.slice(1, 5));
    let requisicao = await fetch(`${url}/${newTarget}`, {
      method: "DELETE",
    }).then();

    if (requisicao.status === 200) {
      alert("Contato deletado");
      window.location.reload();
    } else {
      await fetch(`${url}/${newTarget}`, {
        method: "DELETE",
      }).then();
      if (requisicao.status !== 200) {
        alert("Não foi possivel deletar o contato.");
      }
    }
  } catch (error) {
    console.error(error);
  }
}

/* Vizualizar todos */
async function getContent() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    show(data);
  } catch (error) {
    console.error(error);
  }
}

getContent();

// Vizualizar um contato especifico
async function vizualizarContato(element) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    let target = element.id;
    let newTarget = parseInt(target.slice(1, 9));

    let id = document.getElementById("idSpan");
    let nome = document.getElementById("nomeSpan");
    let email = document.getElementById("emailSpan");
    let telefone = document.getElementById("telefoneSpan");
    let ativo = document.getElementById("ativoSpan");
    let dataNascimento = document.getElementById("dataNascimentoSpan");
    id.innerHTML = ``;
    nome.innerHTML = ``;
    email.innerHTML = ``;
    telefone.innerHTML = ``;
    ativo.innerHTML = ``;
    dataNascimento.innerHTML = ``;

    for (user of data) {
      let ative = user.ativo;
      let simbol = "";
      if (ative) {
        simbol = `<i class="fas fa-check"></i>`;
      } else {
        simbol = `<i class="fas fa-times"></i>`;
      }
      if (user.id === newTarget) {
        id.innerHTML = `${user.id}`;
        nome.innerHTML = `${user.nome}`;
        email.innerHTML = `${user.email}`;
        telefone.innerHTML = `${
          "(" +
          user.telefone.substring(0, 2) +
          ")" +
          " " +
          user.telefone.substring(2, 7) +
          "-" +
          user.telefone.substring(7, 11)
        }`;
        ativo.innerHTML = `${simbol}`;
        dataNascimento.innerHTML = `${
          user.dataNascimento.substring(8, 10) +
          "/" +
          user.dataNascimento.substring(5, 7) +
          "/" +
          user.dataNascimento.substring(0, 4)
        }`;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Mostrar contatos na tabela
function show(users) {
  let html = `
  <table class="table table-striped table-bordered">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Nome</th>
      <th scope="col">Email</th>
      <th scope="col">Telefone</th>
      <th scope="col">Ativo</th>
      <th scope="col">Data de nascimento</th>
      <th scope="col">Ações</th>
    </tr>
  </thead>
  <tbody>`;
  let usuarios = [];
  let contador = 0;

  for (let user of users) {
    usuarios[contador] = user.id;
    contador++;
  }

  usuarios = usuarios.sort();
  for (let i = 0; i < contador; i++) {
    for (let user of users) {
      if (user.id === usuarios[i]) {
        let ativo = user.ativo;
        let simbol = "";
        if (ativo) {
          simbol = `<i class="fas fa-check"></i>`;
        } else {
          simbol = `<i class="fas fa-times"></i>`;
        }
        html += `
      <tr>
        <th scope="row">${user.id}</th>
        <td>${user.nome}</td>
        <td>${user.email}</td>
        <td>${
          "(" +
          user.telefone.substring(0, 2) +
          ")" +
          " " +
          user.telefone.substring(2, 7) +
          "-" +
          user.telefone.substring(7, 11)
        }</td>
        <td>${simbol}</td>
        <td>${
          user.dataNascimento.substring(8, 10) +
          "/" +
          user.dataNascimento.substring(5, 7) +
          "/" +
          user.dataNascimento.substring(0, 4)
        }</td>
        <td><button type="button" class="btn btn-info" id="a${
          user.id
        }" data-toggle="modal" data-target="#vizualizarModal2" onclick="vizualizarContato(this)">Vizualizar Contato</button>
        <button type="button" class="btn btn-warning" id="b${
          user.id
        }" data-toggle="modal" data-target="#editarModal" onclick="alterarDadosCliente(this)">Editar Contato</button>
        <button type="button" class="btn btn-danger" id="c${
          user.id
        } data-toggle="modal" data-target="#deletarModal" href="#" onclick="deletar(this)">Deletar Contato</button>
        
        `;
      }
    }
  }

  document.getElementById("one").innerHTML =
    html +
    `</tbody>
  </table>`;
}

// Ocultar contatos
function ocultarClientes() {
  let html = "";
  document.getElementById("one").innerHTML = html;
}
// Fechar modal de edição
function closeModal() {
  $("#editarModal").modal("hide");
}
