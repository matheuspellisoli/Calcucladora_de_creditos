function getValue() {

    var dateAccounting = $("#dateAccounting").val();
    var dateSolicitation = $("#dateSolicitation").val();
    var plan =  $("#plan option:selected").text();
    var difference = (new Date (dateSolicitation) - new Date (dateAccounting))
        difference =  Math.ceil(difference / (1000 * 3600 * 24));
    
    if(plan == "Outros"){
       
        if($("#otherValue").val() == ""){
            var perci = 0;
        }else{
            var perci =   $("#otherValue").val();
        }
        
    }else{
        var perci = $("#plan").val();        
    }
    
    var periodInput = $("#period").val();
    if( periodInput == 1){
        var period = 30;        
    }else if(periodInput == 3){
        var period = 90;        
    }else if(periodInput == 6){
        var period = 183;
    }else if(periodInput == 12){
        var period = 365;
    }

    values = {
        "dateAccounting" : dateAccounting,
        "dateSolicitation" : dateSolicitation,
        "difference" : difference,
        "period" : period,
        "plan" : plan,
        "perci" : perci
    }

    return values;
    
}

function setPerci(value){
    valuePlan =parseFloat(value);
        $("#mensalSemDesconto").text(valuePlan);
        $("#mensalComDesconto").text(valuePlan);

        $("#trimestralSemDesconto").text((valuePlan * 3).toFixed(2));
        $("#trimestralComDesconto").text(((valuePlan * 3)*0.97).toFixed(2));

        $("#semestralSemDesconto").text((valuePlan * 6).toFixed(2));
        $("#semestralComDesconto").text(((valuePlan * 6)*0.94).toFixed(2));

        $("#anualSemDesconto").text((valuePlan * 12).toFixed(2));
        $("#anualcomDesconto").text(((valuePlan * 12)*0.88).toFixed(2)); 
}


function getPerci(period){
    if( period == 30){
       perci =  $("#mensalComDesconto").text()
    }else if(period == 90){
        perci = $("#trimestralComDesconto").text()
    }else if(period == 183){
        perci = $("#semestralComDesconto").text()
    }else if(period == 365){
        perci = $("#anualcomDesconto").text()
    }
    return perci;
}

function  setResult(){

    var input = getValue();

    $("#DiasContratados").text(input.period);   
    $("#DiasUsados").text(input.difference);
    $("#diasNaoUsados").text(input.period - input.difference);        
    $("#valorPago").text(getPerci(input.period));
    var valorUsado =  (((input.difference *100)/ input.period) * input.perci) /100
    valorUsado =  valorUsado.toFixed(2)
    $("#valorUsado").text(valorUsado); 
    var Creditos = input.perci - valorUsado;       
    $("#Creditos").text(Creditos.toFixed(2));
}

function getResult(){

    var contractedDays =  $("#DiasContratados").text();   
    var usedDays = $("#DiasUsados").text();
    var unusedDays = $("#diasNaoUsados").text();
    var valueUsed = $("#valorPago").text()
    var credits =  $("#Creditos").text()    

    values = {
        "contractedDays": contractedDays,
        "usedDays": usedDays,
        "unusedDays": unusedDays,
        "valueUsed": valueUsed,
        "credits": credits
    }

    return values;
}


 function setFine(value){

    fine = ((value * 0.03)).toFixed(2);
    $("#multaDeAtrazo").text(fine);
    valueFine = parseFloat(value)+ parseFloat(fine);
    $("#valorComMulta").text(valueFine);
    reduction = ((valueFine - value)*100)/103   
    $("#deducaoDaMulta").text(reduction.toFixed(2));
 }


 function dateValidade(){
    var dateAccounting = $("#dateAccounting").val();
    var dateSolicitation = $("#dateSolicitation").val();
    var difference = (new Date (dateSolicitation) - new Date (dateAccounting))
    if(difference < 0){
        $('#errorText').text("A data de contabilização deve ser maior que a de solicitação")
        $('#exampleModal').modal();
        $("#dateAccounting").val(new Date().toISOString().slice(0,10));
        $("#dateSolicitation").val(new Date().toISOString().slice(0,10));
    }
 }

function manage(){   

    //debug()

    var input = getValue();
    var plan =  $("#plan option:selected").text();

    if(plan == "Outros"){
        $( "#otherValue" ).prop( "disabled", false );        
    }else{
        $( "#otherValue" ).prop( "disabled", true );     
        $("#otherValue").val("");   
    }
    setPerci(input.perci);
    setResult();   
    setFine(getPerci(input.period))
    
    
}

$("#otherValue").keyup(function() {
    $(this).val(this.value.replace(/\D/, ''));
    var tecla = event.key;
    if(tecla != "Enter"){
        if(tecla != "Backspace"){
            if(tecla >= 0 || tecla <= 9){        
                }else{
                    $('#errorText').text("digite apenas números no valor")
                    $('#exampleModal').modal();
                }  
        }  
    }
});





$("#otherValue").change(function() {
    manage()      
});
$("#plan").change(function() {
    manage()  
});
$("#period").change(function() {
    manage()  
});
$("#dateAccounting").change(function() {
    dateValidade()
    manage()  
});
$("#dateSolicitation").change(function() {
    dateValidade()
    manage()    
});


$("#dateAccounting").val(new Date().toISOString().slice(0,10));
$("#dateSolicitation").val(new Date().toISOString().slice(0,10));
manage()




function debug(){
    console.log("Dados de Entrada: ");
    console.log(getValue()) 
    console.log("Dados de Saida: ");
    console.log(getResult());
    
}