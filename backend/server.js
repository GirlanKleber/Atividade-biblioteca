const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
host: "localhost",
user: "root",
password: "SUA_SENHA",
database: "biblioteca"
});


db.connect(err => {
if (err) throw err;
console.log("Conectado ao MySQL!");
});


app.post("/usuarios", (req, res) => {
const { nome, email } = req.body;
db.query("INSERT INTO usuarios (nome, email) VALUES (?, ?)", [nome, email], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ id: result.insertId, nome, email });
});
});

app.get("/usuarios", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


app.post("/livros", (req, res) => {
  const { titulo, autor, categoria, ano } = req.body;
  db.query("INSERT INTO livros (titulo, autor, categoria, ano) VALUES (?, ?, ?, ?)",
    [titulo, autor, categoria, ano], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, titulo, autor, categoria, ano });
    });
});

app.get("/livros", (req, res) => {
  db.query("SELECT * FROM livros", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


app.post("/emprestimos", (req, res) => {
  const { usuario_id, livro_id, data_devolucao } = req.body;
  const hoje = new Date().toISOString().slice(0, 10);
  db.query(
    "INSERT INTO emprestimos (usuario_id, livro_id, data_emprestimo, data_devolucao) VALUES (?, ?, ?, ?)",
    [usuario_id, livro_id, hoje, data_devolucao],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId, usuario_id, livro_id, data_emprestimo: hoje, data_devolucao, status: "Ativo" });
    }
  );
});

app.get("/emprestimos", (req, res) => {
  db.query(`
    SELECT e.id, u.nome AS usuario, l.titulo AS livro, e.data_emprestimo, e.data_devolucao, e.status
    FROM emprestimos e
    JOIN usuarios u ON e.usuario_id = u.id
    JOIN livros l ON e.livro_id = l.id
  `, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


app.put("/emprestimos/:id/status", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  db.query("UPDATE emprestimos SET status = ? WHERE id = ?", [status, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ id, status });
  });
});


app.delete("/emprestimos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM emprestimos WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Empréstimo removido" });
  });
});


app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));







formUsuario.onsubmit = async function(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  const res = await fetch("http://localhost:3000/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email })
  });
  const novo = await res.json();
  console.log("Usuário cadastrado:", novo);
  carregarUsuarios();
  formUsuario.reset();
};

async function carregarUsuarios() {
  const res = await fetch("http://localhost:3000/usuarios");
  const lista = await res.json();
  usuarioSelect.innerHTML = "";
  lista.forEach(u => {
    const opt = document.createElement("option");
    opt.value = u.id;
    opt.textContent = `${u.nome} (${u.email})`;
    usuarioSelect.appendChild(opt);
  });
}