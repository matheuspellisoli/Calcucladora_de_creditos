$("#dateAccounting").val(new Date().toISOString().slice(0, 10));
$("#dateSolicitation").val(new Date().toISOString().slice(0, 10));

function getValue() {

    var dateAccounting = $("#dateAccounting").val();
    var dateSolicitation = $("#dateSolicitation").val();
    var plan = $("#plan option:selected").text();
    var difference = (new Date(dateSolicitation) - new Date(dateAccounting))
    difference = Math.ceil(difference / (1000 * 3600 * 24));

    if (plan == "Outros") {

        if ($("#otherValue").val() == "") {
            var perci = 0;
        } else {
            var perci = $("#otherValue").val();
        }

    } else {
        var perci = $("#plan").val();
    }

    var periodInput = $("#period").val();
    if (periodInput == 1) {
        var period = 30;
    } else if (periodInput == 3) {
        var period = 90;
    } else if (periodInput == 6) {
        var period = 183;
    } else if (periodInput == 12) {
        var period = 365;
    }

    var discount = {
        "mensal": 0.6,
        "trimestral": 0.55,
        "semestral": 0.5,
        "anual": 0.45
    }

    values = {
        "dateAccounting": dateAccounting,
        "dateSolicitation": dateSolicitation,
        "difference": difference,
        "period": period,
        "plan": plan,
        "perci": perci,
        "discount": discount
    }

    return values;

}

function setPerci(value) {
    valuePlan = parseFloat(value.perci);
    var discount = value.discount;
    var planoHospedagem = value.plan.includes('Hospedagem');

    if (planoHospedagem) {
        $("#mensalComDesconto").text((valuePlan * discount.mensal).toFixed(2));
        $("#trimestralComDesconto").text(((valuePlan * 3) * discount.trimestral).toFixed(2));
        $("#semestralComDesconto").text(((valuePlan * 6) * discount.semestral).toFixed(2));
        $("#anualcomDesconto").text(((valuePlan * 12) * discount.anual).toFixed(2));
    } else {
        $("#mensalComDesconto").text("Não há desconto");
        $("#trimestralComDesconto").text("Não há desconto");
        $("#semestralComDesconto").text("Não há desconto");
        $("#anualcomDesconto").text("Não há desconto");
    }

    $("#mensalSemDesconto").text(valuePlan.toFixed(2));
    $("#trimestralSemDesconto").text((valuePlan * 3).toFixed(2));
    $("#semestralSemDesconto").text((valuePlan * 6).toFixed(2));
    $("#anualSemDesconto").text((valuePlan * 12).toFixed(2));
}


function getPerci(period, plan) {
    var primeiroPagamento = $("#primeiroPagamento").prop("checked");
    var planoHospedagem = plan.includes('Hospedagem');
    var adicionarDesconto = primeiroPagamento && planoHospedagem;

    if (period == 30) {
        perci = adicionarDesconto ? $("#mensalComDesconto").text() : $("#mensalSemDesconto").text();
    } else if (period == 90) {
        perci = adicionarDesconto ? $("#trimestralComDesconto").text() : $("#trimestralSemDesconto").text();
    } else if (period == 183) {
        perci = adicionarDesconto ? $("#semestralComDesconto").text() : $("#semestralSemDesconto").text();
    } else if (period == 365) {
        perci = adicionarDesconto ? $("#anualcomDesconto").text() : $("#anualSemDesconto").text();
    }

    return perci;
}

function setResult() {

    var input = getValue();

    $("#DiasContratados").text(input.period);
    $("#DiasUsados").text(input.difference);
    $("#diasNaoUsados").text(input.period - input.difference);
    $("#valorPago").text(getPerci(input.period, input.plan));
    var valorUsado = (((input.difference * 100) / input.period) * getPerci(input.perci, input.plan)) / 100
    valorUsado = valorUsado.toFixed(2)
    $("#valorUsado").text(valorUsado);
    var Creditos = getPerci(input.perci, input.plan) - valorUsado;
    $("#Creditos").text(Creditos.toFixed(2));
}

function getResult() {

    var contractedDays = $("#DiasContratados").text();
    var usedDays = $("#DiasUsados").text();
    var unusedDays = $("#diasNaoUsados").text();
    var valueUsed = $("#valorPago").text()
    var credits = $("#Creditos").text()

    values = {
        "contractedDays": contractedDays,
        "usedDays": usedDays,
        "unusedDays": unusedDays,
        "valueUsed": valueUsed,
        "credits": credits
    }

    return values;
}


function setFine(value) {

    fine = ((value * 0.03)).toFixed(2);
    $("#multaDeAtrazo").text(fine);
    valueFine = parseFloat(value) + parseFloat(fine);
    $("#valorComMulta").text(valueFine.toFixed(2));
    reduction = ((valueFine - value) * 100) / 103
    $("#deducaoDaMulta").text(reduction.toFixed(2));
}


function dateValidade() {
    var dateAccounting = $("#dateAccounting").val();
    var dateSolicitation = $("#dateSolicitation").val();
    var difference = (new Date(dateSolicitation) - new Date(dateAccounting))
    if (difference < 0) {
        $('#error').text("Cuidado, a data de cancelamento esta menor que a de contabilização.")
        $("#dateAccounting").val(new Date().toISOString().slice(0, 10));
        $("#dateSolicitation").val(new Date().toISOString().slice(0, 10));
        modal.style.display = "block";
        console.log("erro")
    }
}

function manage() {
    //debug()
    dateValidade()
    var input = getValue();
    var plan = $("#plan option:selected").text();

    if (plan == "Outros") {
        $("#otherValue").prop("disabled", false);
        $("#otherValueDiv").show();
    } else {
        $("#otherValue").prop("disabled", true);
        $("#otherValueDiv").hide();
    }
    setPerci(input);
    setResult();
    setFine(getPerci(input.period, input.plan))


}

$("#otherValue").keyup(function () {
    $(this).val(this.value.replace(",", ''));
    $(this).val(this.value.replace(/[a-z]/, ''));
});


$("#otherValue").change(function () {

    manage()
});
$("#plan").change(function () {
    manage()
});
$("#period").change(function () {
    manage()
});
$("#dateAccounting").focusout(function () {
    manage()
});
$("#dateSolicitation").focusout(function () {
    manage()
});
$("#otherValueDiv").hide();



manage()




function debug() {
    console.log("Dados de Entrada: ");
    console.log(getValue())
    console.log("Dados de Saida: ");
    console.log(getResult());

}

var modal = document.getElementById('myModal');

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
