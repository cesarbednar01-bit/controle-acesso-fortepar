import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const usuarioLogado =
JSON.parse(
    sessionStorage.getItem("usuarioLogado")
);

if (!usuarioLogado) {
    window.location = "login.html";
}

let acessos = [];

// CONVERTE DATA BR PARA TIMESTAMP

function converterData(dataTexto) {

    if (!dataTexto) return 0;

    const [data, hora] =
        dataTexto.split(", ");

    const [dia, mes, ano] =
        data.split("/");

    return new Date(
        `${ano}-${mes}-${dia}T${hora}`
    ).getTime();
}

async function carregarHistorico() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "acessos")
            );

        acessos = [];

        snapshot.forEach(doc => {

            acessos.push({
                firebaseId: doc.id,
                ...doc.data()
            });

        });

        // ORDENA DO MAIS NOVO PARA O MAIS ANTIGO

        acessos.sort((a, b) => {

            return (
                converterData(b.entrada) -
                converterData(a.entrada)
            );

        });

        renderizarHistorico(acessos);

        console.log(
            `${acessos.length} registros carregados`
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar histórico:",
            erro
        );
    }
}

function renderizarHistorico(lista) {

    const tbody =
    document.getElementById(
        "historicoBody"
    );

    tbody.innerHTML = "";

    if (lista.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    Nenhum registro encontrado
                </td>
            </tr>
        `;

        return;
    }

    lista.forEach(acesso => {

        tbody.innerHTML += `
        <tr>

            <td>${acesso.nome || "-"}</td>

            <td>${acesso.tipo || "-"}</td>

            <td>${acesso.empresa || "-"}</td>

            <td>
                ${acesso.tipoDocumento || "-"}:
                ${acesso.documento || "-"}
            </td>

            <td>${acesso.entrada || "-"}</td>

            <td>${acesso.saida || "-"}</td>

            <td>
                ${acesso.status === "DENTRO"
                    ? "🟢 DENTRO"
                    : "🔴 FORA"}
            </td>

        </tr>
        `;
    });
}

window.filtrarHistorico = function () {

    const nome =
        document
        .getElementById("filtroNome")
        .value
        .toLowerCase();

    const documento =
        document
        .getElementById("filtroDocumento")
        .value
        .toLowerCase();

    const empresa =
        document
        .getElementById("filtroEmpresa")
        .value
        .toLowerCase();

    const filtrados =
        acessos.filter(acesso => {

            const filtroNome =

                !nome ||

                (acesso.nome || "")
                .toLowerCase()
                .includes(nome);

            const filtroDocumento =

                !documento ||

                (acesso.documento || "")
                .toString()
                .toLowerCase()
                .includes(documento);

            const filtroEmpresa =

                !empresa ||

                (acesso.empresa || "")
                .toLowerCase()
                .includes(empresa);

            return (
                filtroNome &&
                filtroDocumento &&
                filtroEmpresa
            );
        });

    // ORDENA RESULTADO FILTRADO

    filtrados.sort((a, b) => {

        return (
            converterData(b.entrada) -
            converterData(a.entrada)
        );

    });

    renderizarHistorico(
        filtrados
    );
};

carregarHistorico();