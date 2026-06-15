const usuariosPadrao = [{ id: 1, nome: 'Administrador', usuario: 'admin', senha: '123456', perfil: 'ADMIN', ativo: true }];
if (!localStorage.getItem('usuarios')) localStorage.setItem('usuarios', JSON.stringify(usuariosPadrao));
function login() {
    const u = document.getElementById('usuario').value;
    const s = document.getElementById('senha').value;
    const usuarios = JSON.parse(localStorage.getItem('usuarios'));
    const usuario = usuarios.find(x => x.usuario === u && x.senha === s && x.ativo);
    if (!usuario) { alert('Usuário ou senha inválidos'); return; }
    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    window.location = 'index.html';
}