function iniciar() {
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    var deslocFundo = 1;
    var deslocJogador = 10;
    var deslocInimigo1 = 5;
    var deslocInimigo2 = 3;
    var deslocAmigo = 1;
    var deslocDisparo = 15;

    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var energia = 3;

    var posicaoY = parseInt(Math.random() * 334);
    var intervalo = 30;
    var podeAtirar = true;
    var fimJogo = false;
    var jogo = {};
    var TECLA = {W: 87, S: 83, D: 68}

    var somFundo = document.getElementById("somFundo");
    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var somResgate = document.getElementById("somResgate");
    var somPerdido = document.getElementById("somPerdido");
    var somFimJogo = document.getElementById("somFimJogo");

    somFundo.addEventListener("ended", function(){somFundo.currentTime = 0; somFundo.play();}, false);
    somFundo.play();

    jogo.pressionou = [];

    //Verifica se o jogador pressionou alguma tecla
    $(document).keydown(function(e) {
        jogo.pressionou[e.which] = true;
    })

    $(document).keyup(function(e) {
        jogo.pressionou[e.which] = false;
    })

    jogo.timer = setInterval(loop, intervalo);

    function loop() {
        moverFundo();
        moverJogador();
        moverInimigo1();
        moverInimigo2();
        moverAmigo();
        tratarColisoes();
        exibirPlacar();
        exibirEnergia();
    }

    function moverFundo() {
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda - deslocFundo);
    }

    function moverJogador() {
        if (jogo.pressionou[TECLA.W]) {
            var topo = parseInt($("#jogador").css("top"));

            if (topo >= 0) {
                $("#jogador").css("top", topo - deslocJogador);
            }
        }

        if (jogo.pressionou[TECLA.S]) {
            var topo = parseInt($("#jogador").css("top"));

            if (topo <= 434) {
                $("#jogador").css("top", topo + deslocJogador);
            }
        }
        
        if (jogo.pressionou[TECLA.D]) {
            atirar();
        }
    }

    function moverInimigo1() {
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posicaoX - deslocInimigo1);
        $("#inimigo1").css("top", posicaoY);

        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }
    }

    function moverInimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX - deslocInimigo2);

        if (posicaoX <= 0) {
            $("#inimigo2").css("left", 775);
        }
    }

    function moverAmigo() {
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX + deslocAmigo);

        if (posicaoX > 906) {
            $("#amigo").css("left", 0);
        }
    }

    function atirar() {
        if (podeAtirar == true) {
            somDisparo.play();
            podeAtirar = false;

            tiroX = parseInt($("#jogador").css("left")) + 190;
            tiroY = parseInt($("#jogador").css("top")) + 37;
            $("#fundoGame").append("<div id='disparo'></div>")
            $("#disparo").css("left", tiroX);
            $("#disparo").css("top", tiroY);

            var tempoDisparo = window.setInterval(executarDisparo, intervalo);
        }

        function executarDisparo() {    
            tiroX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", tiroX + deslocDisparo);
    
            if (tiroX > 900) {
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        }
    }

    function tratarColisoes() {
        var colisao1 = $("#jogador").collision($("#inimigo1"));
        var colisao2 = $("#jogador").collision($("#inimigo2"));
        var colisao3 = $("#disparo").collision($("#inimigo1"));
        var colisao4 = $("#disparo").collision($("#inimigo2"));
        var colisao5 = $("#jogador").collision($("#amigo"));
        var colisao6 = $("#inimigo2").collision($("#amigo"));

        if (colisao1.length > 0) {
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explodirInimigo1(inimigo1X, inimigo1Y);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);

            energia--;
        }

        if (colisao2.length > 0) {
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explodirInimigo1(inimigo2X, inimigo2Y);

            $("#inimigo2").remove();
            reposicionarInimigo2();

            energia--;
        }

        if (colisao3.length > 0) {
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explodirInimigo1(inimigo1X, inimigo1Y);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);

            $("#disparo").css("left", 950);

            pontos += 100;
            deslocInimigo1 += 0.3;
        }

        if (colisao4.length > 0) {
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explodirInimigo1(inimigo2X, inimigo2Y);

            $("#inimigo2").remove();
            reposicionarInimigo2();

            $("#disparo").css("left", 950);

            pontos += 50;
        }

        if (colisao5.length > 0) {
            somResgate.play();
            $("#amigo").remove();
            reposicionarAmigo();
            salvos++;
        }

        if (colisao6.length > 0) {
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            morrerAmigo(amigoX, amigoY);

            $("#amigo").remove();
            reposicionarAmigo();
            perdidos++;
        }
    }

    function explodirInimigo1(inimigo1X, inimigo1Y) {
        somExplosao.play();

        $("#fundoGame").append("<div id='explosao1'></div>")
        $("#explosao1").css("background-image", "url(../imagens/explosao.png)");
        $("#explosao1").css("left", inimigo1X);
        $("#explosao1").css("top", inimigo1Y);
        $("#explosao1").animate({width:200, opacity:0}, "slow");

        var tempoExplosao = window.setInterval(removerExplosao, 1000);

        function removerExplosao() {
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
            $("#explosao1").remove();
        }
    }

    function morrerAmigo() {
        somPerdido.play();

        $("#fundoGame").append("<div id='explosao3' class='anima4'></div>")
        $("#explosao3").css("left", amigoX);
        $("#explosao3").css("top", amigoY);

        var tempoExplosao3 = window.setInterval(removerExplosao3, 1000);

        function removerExplosao3() {
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
            $("#explosao3").remove();
        }
    }

    function reposicionarInimigo2() {
        var tempoColisao4 = window.setInterval(reposicionar4, 5000);

        function reposicionar4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if (fimJogo == false) {
                $("#fundoGame").append("<div id='inimigo2'></div>")
            }
        }
    }

    function reposicionarAmigo() {
        var tempoAmigo = window.setInterval(reposicionar6, 6000);

        function reposicionar6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;

            if (fimJogo == false) {
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            }
        }
    }

    function exibirPlacar() {
        $("#placar").html("<h2>Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    }

    function exibirEnergia() {
        if (energia == 3) {
            $("#energia").css("background-image", "url(../imagens/energia3.png");
        } else if (energia == 2) {
            $("#energia").css("background-image", "url(../imagens/energia2.png");
        } else if (energia == 1) {
            $("#energia").css("background-image", "url(../imagens/energia1.png");
        } else if (energia == 0) {
            $("#energia").css("background-image", "url(../imagens/energia0.png");
            terminar();
        }
    }

    function terminar() {
        fimJogo = true;
        somFundo.pause();
        somFimJogo.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null;

        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();

        $("#fundoGame").append("<div id='fim'></div>");
        $("#fim").html("<h1>GAME OVER</h1>        <p>Sua pontuação foi: " + pontos + "</p>        <div id='reinicio' onClick=reiniciarJogo()><h3>Jogar Novamente</h3></div>");
//        $("#fim").html("<p>Sua pontuação foi: " + pontos + "</p>") +
//        $("#fim").html("<div id='reinicio' onClick=reiniciarJogo()><h3>Jogar Novamente</h3></div>");
    }
}

function reiniciarJogo() {
    somFimJogo.pause();
    $("#fim").remove();
    iniciar();
}