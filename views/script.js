function cadastrar() {
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const creci = document.getElementById("creci").value;

    if (nome.trim().length < 2) {
        alert("O nome deve ter pelo menos 2 caracteres.");
        return;
    }

    if (cpf.trim().length !== 11 || !/^\d{11}$/.test(cpf)) {
        alert("O CPF deve ter exatamente 11 dígitos numéricos.");
        return; 
    }

    if (creci.trim().length < 2) {
        alert("O CRECI deve ter pelo menos 2 caracteres.");
        return; 
    }

    const dados = {
        nome: nome,
        cpf: cpf,
        creci: creci
    };

    fetch('http://localhost:8000/api.php', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert('Corretor cadastrado com sucesso! ID: ' + data.id);
            buscarCorretores();  // Chama a função para atualizar a tabela
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao cadastrar corretor');
    });
}



//Função buscar corretores já cadastrados no banco de dados
function buscarCorretores() {
    fetch('http://localhost:8000/api.php', {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        atualizarTabela(data); 
    })
    .catch(error => {
        console.error('Erro ao buscar os corretores:', error);
    });
}

// Função para atualizar a tabela com os corretores já cadastrados
function atualizarTabela(corretores) {
    const tabelaBody = document.querySelector('.tabela tbody');
    tabelaBody.innerHTML = ''; 

    corretores.forEach(corretor => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${corretor.id}</td>
            <td>${corretor.nome}</td>
            <td>${corretor.cpf}</td>
            <td>${corretor.creci}</td>
            <td class= button-table>
                <button onclick="editarCorretor(${corretor.id})">Editar</button>
                <button onclick="excluirCorretor(${corretor.id})">Excluir</button>
            </td>
        `;
        tabelaBody.appendChild(tr);
    });
}

window.onload = buscarCorretores;


// Função para deletar um corretor
function excluirCorretor(id) {
    if (confirm('Tem certeza que deseja excluir este corretor?')) {
        fetch('http://localhost:8000/api.php', {
            method: 'DELETE',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert(data.message);
            buscarCorretores();
        })
        .catch(error => {
            console.error('Erro ao excluir o corretor:', error);
        });
    }
}

// Função para abrir o modal
function editarCorretor(id) {
    window.idCorretorEditando = id;
    document.getElementById("modal-editar").style.display = "block"; // Abre o modal apenas quando clicado no botão
}


// Função para salvar as edições
function salvarEdicao() {
    const nome = document.getElementById("nome-editar").value;
    const cpf = document.getElementById("cpf-editar").value;
    const creci = document.getElementById("creci-editar").value;
    const mensagemDiv = document.getElementById("mensagem");

    fetch('http://localhost:8000/api.php', {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: "PUT", 
        body: JSON.stringify({
            id: window.idCorretorEditando,
            nome: nome,
            cpf: cpf,
            creci: creci
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Corretor editado com sucesso:", data);
        alert("Corretor editado com sucesso!");
        
        fecharModal();
        buscarCorretores(); 
    })
    .catch(error => {
        console.error('Erro ao editar o corretor:', error);
        alert('Erro ao editar o corretor');
    });
}

// Função para fechar o modal
function fecharModal() {
    document.getElementById("modal-editar").style.display = "none";
}

// Fechar o modal se o usuário clicar fora da área do modal
window.onclick = function(event) {
    if (event.target === document.getElementById("modal-editar")) {
        fecharModal();
    }
}
