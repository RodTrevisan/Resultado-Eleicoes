import https from 'https'

const url = 'https://resultados.tse.jus.br/oficial/ele2022/544/dados-simplificados/br/br-c0001-e000544-r.json'

function consultarResultado() { 
    const headers = {
        contentType: "application/json; charset=utf-8", 
        'Cache-Control': 'no-cache'
    }

    try {
        https.get(url, headers, res => {
            let data = []
            
            res.on('data', chunk => {
                data.push(chunk)
            })

            res.on('end', () => {
                if (data == undefined) return

                imprimirResultado(JSON.parse(data))
            })
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

    for (let i = 0; i < 5; i++) {
        let candidato = resultadoApuracaoVotacao.cand[i]

        console.log(`Nome Candidato: ${candidato.nm.padEnd(20, ' ')} | Votos Apurados: ${formatarValorNumerico(candidato.vap)} - ${candidato.pvap}%`)
    }
}

function formatarValorNumerico(value) {
    return Number(parseFloat(value).toFixed(2)).toLocaleString('pt', {
        minimumFractionDigits: 2
    });
}

consultarResultado()
setInterval(consultarResultado, 30000)