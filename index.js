import https from 'https'

const url = 'https://resultados.tse.jus.br/oficial/ele2022/544/dados-simplificados/br/br-c0001-e000544-r.json'

function consultarResultado() { 
    const headers = {
        contentType: "application/json; charset=utf-8", 
        'Cache-Control': 'no-cache',
        timout: 1000
    }

    try {
        https.get(url, headers, res => {
            if (res.statusCode != 200) return;
            
            let data = []
            
            res.on('data', chunk => {
                data = chunk
            })

            res.on('end', () => {
                imprimirResultado(JSON.parse(data))
            })
        }).on('error', err => {
            console.log('Erro: ', err.message)
        })
    } catch (ex) {
        console.log(ex)
    }
}


function imprimirResultado(resultadoApuracaoVotacao) {
    console.clear()

    console.log(`Total de Votos Apurados: ${formatarValorNumerico(resultadoApuracaoVotacao.esi)} - ${resultadoApuracaoVotacao.psi}%`)
    console.log(`Total de Abstençoes: ${formatarValorNumerico(resultadoApuracaoVotacao.a)} - ${resultadoApuracaoVotacao.pa}%`)
    console.log('')

    console.log('------------------------------------------------------------');
    console.log('- Nome Candidato       | Votos Contabilizados | % de Votos -');
    console.log('------------------------------------------------------------');

    for (let i = 0; i < 5; i++) {
        let candidato = new Candidato(resultadoApuracaoVotacao.cand[i]);

        console.log(`- ${candidato.nomeCandidato} | ${candidato.votosContabilizados} | ${candidato.percentualVotos} -`);
    }

    console.log('------------------------------------------------------------');
}

function formatarValorNumerico(value) {
    return Number(parseFloat(value)).toLocaleString('pt', {
        minimumFractionDigits: 0
    });
}

consultarResultado()
setInterval(consultarResultado, 30000)

class Candidato {
    constructor(candidato) {
        this.nomeCandidato = candidato.nm.padEnd(20, ' ');
        this.votosContabilizados = formatarValorNumerico(candidato.vap).padEnd(20, ' ');
        this.percentualVotos = (candidato.pvap + '%').padEnd(10, ' ');
    }
}