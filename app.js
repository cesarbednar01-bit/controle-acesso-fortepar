const usuarioLogado = JSON.parse(
    sessionStorage.getItem("usuarioLogado")
);

if (!usuarioLogado) {
    window.location = "login.html";
}

let acessos =
    JSON.parse(localStorage.getItem("acessos")) || [];

const form =
    document.getElementById("formEntrada");

form.addEventListener("submit", registrarEntrada);

function registrarEntrada(e) {

    e.preventDefault();

    const acesso = {

        id: Date.now(),

        nome:
            document.getElementById("nome").value,

        tipo:
            document.getElementById("tipo").value,

        empresa:
            document.getElementById("empresa").value,

        tipoDocumento:
            document.getElementById("tipoDocumento").value,

        documento:
            document.getElementById("numeroDocumento").value,

        destino:
            document.getElementById("destino").value,

        observacao:
            document.getElementById("observacao").value,

        entrada:
            new Date().toLocaleString("pt-BR"),

        saida: null,

        status: "DENTRO"
    };

    acessos.push(acesso);

    salvar();

    form.reset();

    renderizar();
}

function registrarSaida(id) {

    const acesso =
        acessos.find(a => a.id === id);

    if (!acesso) return;

    const confirmar = confirm(
        `Confirma a saída de ${acesso.nome}?`
    );

    if (!confirmar) return;

    acesso.saida =
        new Date().toLocaleString("pt-BR");

    acesso.status = "FORA";

    salvar();

    renderizar();
}

function salvar() {

    localStorage.setItem(
        "acessos",
        JSON.stringify(acessos)
    );
}

function renderizar() {

    const tbody =
        document.getElementById("listaPresentes");

    tbody.innerHTML = "";

    const presentes =
        acessos.filter(
            a => a.status === "DENTRO"
        );

    presentes.forEach(acesso => {

        tbody.innerHTML += `
            <tr>
                <td>${acesso.nome || "-"}</td>

                <td>${acesso.tipo || "-"}</td>

                <td>${acesso.empresa || "-"}</td>

                <td>
                    ${acesso.tipoDocumento || "-"}:
                    ${acesso.documento || "-"}
                </td>

                <td>${acesso.destino || "-"}</td>

                <td>${acesso.entrada || "-"}</td>

                <td>
                    <button
                        class="btn-saida"
                        onclick="registrarSaida(${acesso.id})"
                    >
                        Saída
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById(
        "totalPresentes"
    ).innerText =
        presentes.length;

    document.getElementById(
        "totalEntradas"
    ).innerText =
        acessos.length;

    document.getElementById(
        "totalSaidas"
    ).innerText =
        acessos.filter(
            a => a.status === "FORA"
        ).length;
}

renderizar();