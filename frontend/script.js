let usuarios = [];
    let livros = [];
    let emprestimos = [];
    let idUsuario = 1, idLivro = 1, idEmprestimo = 1;

    const formUsuario = document.getElementById('formUsuario');
    const formLivro = document.getElementById('formLivro');
    const formEmprestimo = document.getElementById('formEmprestimo');

    const usuarioSelect = document.getElementById('usuarioSelect');
    const livroSelect = document.getElementById('livroSelect');
    const tabelaEmprestimos = document.getElementById('tabelaEmprestimos').querySelector('tbody');

    formUsuario.onsubmit = function(e) {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      usuarios.push({ id: idUsuario++, nome, email });
      atualizarUsuarios();
      formUsuario.reset();
    };

    formLivro.onsubmit = function(e) {
      e.preventDefault();
      const titulo = document.getElementById('titulo').value;
      const autor = document.getElementById('autor').value;
      const categoria = document.getElementById('categoria').value;
      const ano = document.getElementById('ano').value;
      livros.push({ id: idLivro++, titulo, autor, categoria, ano });
      atualizarLivros();
      formLivro.reset();
    };

    formEmprestimo.onsubmit = function(e) {
      e.preventDefault();
      const idUsuario = parseInt(usuarioSelect.value);
      const idLivro = parseInt(livroSelect.value);
      const dataEmprestimo = new Date().toLocaleDateString();
      const dataDevolucao = document.getElementById('dataDevolucao').value;
      emprestimos.push({
        id: idEmprestimo++,
        idUsuario,
        idLivro,
        dataEmprestimo,
        dataDevolucao,
        status: "Ativo"
      });
      renderizarEmprestimos();
      formEmprestimo.reset();
    };

    function atualizarUsuarios() {
      usuarioSelect.innerHTML = '';
      usuarios.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = `${u.nome} (${u.email})`;
        usuarioSelect.appendChild(opt);
      });
    }

    function atualizarLivros() {
      livroSelect.innerHTML = '';
      livros.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l.id;
        opt.textContent = `${l.titulo} - ${l.autor}`;
        livroSelect.appendChild(opt);
      });
    }

    function renderizarEmprestimos() {
      tabelaEmprestimos.innerHTML = '';
      emprestimos.forEach((e, index) => {
        const tr = document.createElement('tr');
        tr.className = 'status-' + e.status;
        const usuario = usuarios.find(u => u.id === e.idUsuario)?.nome || 'Desconhecido';
        const livro = livros.find(l => l.id === e.idLivro)?.titulo || 'Desconhecido';

        tr.innerHTML = `
          <td>${e.id}</td>
          <td>${usuario}</td>
          <td>${livro}</td>
          <td>${e.dataEmprestimo}</td>
          <td>${e.dataDevolucao}</td>
          <td>${e.status}</td>
          <td>
            <button onclick="alterarStatus(${index}, 'Devolvido')">Devolver</button>
            <button onclick="alterarStatus(${index}, 'Atrasado')">Atrasado</button>
            <button onclick="excluirEmprestimo(${index})">Excluir</button>
          </td>
        `;
        tabelaEmprestimos.appendChild(tr);
      });
    }

    function alterarStatus(index, novoStatus) {
      emprestimos[index].status = novoStatus;
      renderizarEmprestimos();
    }

    function excluirEmprestimo(index) {
      emprestimos.splice(index, 1);
      renderizarEmprestimos();
    }