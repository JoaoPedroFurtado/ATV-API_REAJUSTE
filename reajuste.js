import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.get("/", (req, res) => {
    const idade = Number(req.query.idade);
    const sexo = req.query.sexo?.toUpperCase();
    const salarioBase = Number(req.query.salario_base);
    const anoContratacao = Number(req.query.anoContratacao);
    const matricula = Number(req.query.matricula);

    if (
        isNaN(idade) || idade <= 16 ||
        !["M", "F"].includes(sexo) ||
        isNaN(salarioBase) || salarioBase <= 0 ||
        isNaN(anoContratacao) || anoContratacao <= 1960 ||
        isNaN(matricula) || matricula <= 0
    ) {
        return res.send(`
            <h2>❌ Dados inválidos. Verifique se:</h2>
            <ul>
                <li>Idade > 16</li>
                <li>Sexo deve ser M ou F</li>
                <li>Salário base deve ser positivo</li>
                <li>Ano de contratação > 1960</li>
                <li>Matrícula > 0</li>
            </ul>
        `);
    }

    const anoAtual = new Date().getFullYear();
    const tempoEmpresa = anoAtual - anoContratacao;

    let percentualReajuste = 0;
    let valorDesconto = 0;
    let valorAcrescimo = 0;

    if (idade >= 18 && idade <= 39) {
        if (sexo === "M") {
            percentualReajuste = 0.10;
            valorDesconto = 10;
            valorAcrescimo = 17;
        } else {
            percentualReajuste = 0.08;
            valorDesconto = 11;
            valorAcrescimo = 16;
        }
    } else if (idade >= 40 && idade <= 69) {
        if (sexo === "M") {
            percentualReajuste = 0.08;
            valorDesconto = 9;
            valorAcrescimo = 15;
        } else {
            percentualReajuste = 0.06;
            valorDesconto = 8;
            valorAcrescimo = 14;
        }
    } else if (idade >= 70 && idade <= 99) {
        if (sexo === "M") {
            percentualReajuste = 0.15;
            valorDesconto = 7;
            valorAcrescimo = 13;
        } else {
            percentualReajuste = 0.17;
            valorDesconto = 6;
            valorAcrescimo = 12;
        }
    }

    const salarioReajustado = salarioBase + (salarioBase * percentualReajuste);
    const valorFinal = tempoEmpresa <= 10
        ? salarioReajustado - valorDesconto
        : salarioReajustado + valorAcrescimo;

    res.send(`
        <h1>✅ Cálculo realizado com sucesso!</h1>
        <p><strong>Idade:</strong> ${idade} anos</p>
        <p><strong>Sexo:</strong> ${sexo}</p>
        <p><strong>Salário base:</strong> R$ ${salarioBase.toFixed(2)}</p>
        <p><strong>Ano de contratação:</strong> ${anoContratacao}</p>
        <p><strong>Tempo de empresa:</strong> ${tempoEmpresa} anos</p>
        <p><strong>Matrícula:</strong> ${matricula}</p>
        <hr>
        <p><strong>Salário com reajuste:</strong> R$ ${salarioReajustado.toFixed(2)}</p>
        <p><strong>${tempoEmpresa <= 10 ? "Desconto" : "Acréscimo"} aplicado:</strong> R$ ${tempoEmpresa <= 10 ? valorDesconto.toFixed(2) : valorAcrescimo.toFixed(2)}</p>
        <p><strong>💰 Salário final:</strong> <span style="color:green">R$ ${valorFinal.toFixed(2)}</span></p>
    `);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
