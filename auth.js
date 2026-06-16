const usuariosPadrao = [
    {
        id: 1,
        nome: "Administrador",
        usuario: "admin",
        senha: "123456",
        perfil: "ADMIN",
        ativo: true
    }
];

if (!localStorage.getItem("usuarios")) {
    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuariosPadrao)
    );
}

// LOGIN
function login() {

    const usuarioDigitado =
        document.getElementById("usuario").value;

    const senhaDigitada =
        document.getElementById("senha").value;

    const usuarios = JSON.parse(
        localStorage.getItem("usuarios")
    ) || [];

    const usuario = usuarios.find(
        u =>
            u.usuario === usuarioDigitado &&
            u.senha === senhaDigitada &&
            u.ativo === true
    );

    if (!usuario) {

        alert("Usuário ou senha inválidos!");

        return;
    }

    sessionStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuario)
    );

    window.location.href = "index.html";
}

// LOGOUT
function logout() {

    sessionStorage.removeItem("usuarioLogado");

    window.location.href = "login.html";
}

// VERIFICA LOGIN
function verificarLogin() {

    // Não verifica login na tela de login
    if (window.location.pathname.includes("login.html")) {
        return;
    }

    const usuarioLogado =
        sessionStorage.getItem("usuarioLogado");

    if (!usuarioLogado) {

        window.location.href = "login.html";

        return;
    }

    const usuario = JSON.parse(usuarioLogado);

    const nomeUsuario =
        document.getElementById("nomeUsuario");

    if (nomeUsuario) {

        nomeUsuario.textContent =
            usuario.nome;
    }
}

// Executa automaticamente
document.addEventListener(
    "DOMContentLoaded",
    verificarLogin
);