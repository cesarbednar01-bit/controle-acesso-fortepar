import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const usuarioLogado = JSON.parse(
    sessionStorage.getItem("usuarioLogado")
);

if (!usuarioLogado) {
    window.location = "login.html";
}

let acessos = [];

async function carregarAcessos() {

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

        renderizar();

        console.log(
            `${acessos.length} acessos carregados`
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar acessos:",
            erro
        );

        renderizar();
    }
}


const form =
    document.getElementById("formEntrada");

form.addEventListener("submit", registrarEntrada);

async function registrarEntrada(e) {

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

    try {

        const docRef = await addDoc(
            collection(db, "acessos"),
            acesso
        );

        acesso.firebaseId = docRef.id;

        console.log("Acesso salvo no Firestore");

        acessos.push(acesso);

        form.reset();

        renderizar();

    } catch (erro) {

        console.error(erro);

        alert("Erro ao salvar no Firestore");
    }

}

async function registrarSaida(id) {

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

    try {

        await updateDoc(
            doc(
                db,
                "acessos",
                acesso.firebaseId
            ),
            {
                saida: acesso.saida,
                status: "FORA"
            }
        );

        console.log(
            "Saída atualizada no Firestore"
        );

    } catch (erro) {

        console.error(
            "Erro ao atualizar saída:",
            erro
        );
    }

    renderizar();

}

window.registrarSaida = registrarSaida;



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

    // TOTAL PRESENTES

    document.getElementById(
        "totalPresentes"
    ).innerText =
        presentes.length;

    // DATA DE HOJE

    const hoje =
        new Date()
            .toLocaleString("pt-BR")
            .split(",")[0];

    // ENTRADAS DE HOJE

    const entradasHoje =
        acessos.filter(a => {

            if (!a.entrada)
                return false;

            return a.entrada.startsWith(
                hoje
            );

        }).length;

    // SAÍDAS DE HOJE

    const saidasHoje =
        acessos.filter(a => {

            if (!a.saida)
                return false;

            return a.saida.startsWith(
                hoje
            );

        }).length;

    // ATUALIZA CARDS

    document.getElementById(
        "totalEntradas"
    ).innerText =
        entradasHoje;

    document.getElementById(
        "totalSaidas"
    ).innerText =
        saidasHoje;
}

carregarAcessos();

window.testeFirebase = async function () {

    try {

        const docRef = await addDoc(
            collection(db, "acessos"),
            {
                nome: "Teste Firebase",
                data: new Date().toISOString()
            }
        );

        console.log(
            "Documento criado:",
            docRef.id
        );

        alert("Teste enviado para o Firestore!");

    } catch (erro) {

        console.error(erro);

        alert("Erro ao gravar no Firestore");
    }
};