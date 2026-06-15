const usuarioLogado =
JSON.parse(
    sessionStorage.getItem("usuarioLogado")
);

if (!usuarioLogado) {
    window.location = "login.html";
}

function carregarHistorico() {

    const acessos =
    JSON.parse(
        localStorage.getItem("acessos")
    ) || [];

    const tbody =
    document.getElementById(
        "historicoBody"
    );

    tbody.innerHTML = "";

    acessos.forEach(acesso => {

        tbody.innerHTML += `
        <tr>

            <td>${acesso.nome || '-'}</td>

            <td>${acesso.tipo || '-'}</td>

            <td>${acesso.empresa || '-'}</td>

            <td>
                ${acesso.tipoDocumento || '-'}:
                ${acesso.documento || '-'}
            </td>

            <td>${acesso.entrada || '-'}</td>

            <td>${acesso.saida || '-'}</td>

            <td>
                ${acesso.status === "DENTRO"
                    ? "🟢 DENTRO"
                    : "🔴 FORA"}
            </td>

        </tr>
        `;
    });

}

carregarHistorico();