import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// VALIDA LOGIN

const usuarioLogado =
JSON.parse(
    sessionStorage.getItem("usuarioLogado")
);

if (!usuarioLogado) {

    window.location = "login.html";
}

// LOGOUT

window.logout = function () {

    sessionStorage.clear();

    window.location = "login.html";
};

let acessos = [];

// CARREGA FIRESTORE

async function carregarDados() {

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

        carregarPreview(acessos);

        console.log(
            `${acessos.length} registros carregados`
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar relatórios:",
            erro
        );
    }
}

// CARREGA TABELA

function carregarPreview(lista = acessos) {

    const tbody =
    document.getElementById(
        "previewRelatorio"
    );

    tbody.innerHTML = "";

    if (lista.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center">
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

                <td>${acesso.destino || "-"}</td>

                <td>${acesso.entrada || "-"}</td>

                <td>${acesso.saida || "-"}</td>

                <td>

                    ${
                        acesso.status === "DENTRO"

                        ? '<span class="status-dentro">🟢 DENTRO</span>'

                        : '<span class="status-fora">🔴 FORA</span>'
                    }

                </td>

            </tr>

        `;
    });
}

// FILTROS

function obterDadosFiltrados() {

    const tipo =
    document
    .getElementById("tipo")
    .value
    .toLowerCase();

    const empresa =
    document
    .getElementById("empresa")
    .value
    .toLowerCase();

    return acessos.filter(a => {

        const filtroTipo =

            !tipo ||

            (a.tipo || "")
            .toLowerCase()
            .includes(tipo);

        const filtroEmpresa =

            !empresa ||

            (a.empresa || "")
            .toLowerCase()
            .includes(empresa);

        return (
            filtroTipo &&
            filtroEmpresa
        );
    });
}

// EVENTOS

document
.getElementById("tipo")
.addEventListener(
    "change",
    () => carregarPreview(
        obterDadosFiltrados()
    )
);

document
.getElementById("empresa")
.addEventListener(
    "input",
    () => carregarPreview(
        obterDadosFiltrados()
    )
);

// PDF

window.gerarPDF = function () {

    const dados =
    obterDadosFiltrados();

    const { jsPDF } =
    window.jspdf;

    const doc =
    new jsPDF(
        "landscape"
    );

    doc.setFontSize(18);

    doc.text(
        "CONTROLE DE ACESSO FORTEPAR",
        14,
        15
    );

    doc.setFontSize(11);

    doc.text(
        `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
        14,
        22
    );

    const linhas = dados.map(a => [

        a.nome || "-",

        a.tipo || "-",

        a.empresa || "-",

        `${a.tipoDocumento || "-"} ${a.documento || "-"}`,

        a.destino || "-",

        a.entrada || "-",

        a.saida || "-",

        a.status || "-"
    ]);

    doc.autoTable({

        startY: 30,

        head: [[

            "Nome",
            "Tipo",
            "Empresa",
            "Documento",
            "Destino",
            "Entrada",
            "Saída",
            "Status"

        ]],

        body: linhas

    });

    doc.save(
        "Relatorio_Acessos.pdf"
    );
};

// EXCEL

window.exportarExcel = function () {

    const dados =
    obterDadosFiltrados();

    const planilha =
    dados.map(a => ({

        Nome: a.nome,
        Tipo: a.tipo,
        Empresa: a.empresa,

        Documento:
            `${a.tipoDocumento || ""} ${a.documento || ""}`,

        Destino: a.destino,
        Entrada: a.entrada,
        Saida: a.saida,
        Status: a.status

    }));

    const ws =
    XLSX.utils.json_to_sheet(
        planilha
    );

    const wb =
    XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Relatorio"
    );

    XLSX.writeFile(
        wb,
        "Relatorio_Acessos.xlsx"
    );
};

// INICIALIZA

carregarDados();