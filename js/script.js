/*
Link API: https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0
{
    "success": true,
    "response": [
        {
            "name": "Capodanno",
            "date": "2018-01-01"
        },
        {
            "name": "Epifania",
            "date": "2018-01-06"
        }
    ]
}


Descrizione:
Creiamo un calendario dinamico con le festività.
Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018 (unici dati disponibili sull’API).
Milestone 1
Creiamo il mese di Gennaio, e con la chiamata all'API inseriamo le festività.
Milestone 2
Diamo la possibilità di cambiare mese, gestendo il caso in cui l’API non possa ritornare festività.
Attenzione!
Ogni volta che cambio mese dovrò:
Controllare se il mese è valido (per ovviare al problema che l’API non carichi holiday non del 2018)
Controllare quanti giorni ha il mese scelto formando così una lista
Chiedere all’API quali sono le festività per il mese scelto
Evidenziare le festività nella lista
*/


$(document).ready(function () {
    //inizializzo data al 01/01/2018
    var currentDate = moment("2018-01-01", "YYYY-MM-DD");
    //RICHIAMO FUNZIONE PER AGGIORNARE TITOLO DATA
    aggiornaTitoloData(currentDate);
    //richiamo funzione per generare elenco date
    inserisciDate(currentDate);
    //chiamata ajax per restituzione array festività
    inserisciFestivita(currentDate);
    $('button.prev').click(function () {
        prev(currentDate);
    });
    $('button.next').click(function () {
        next(currentDate);
    });
});



function aggiornaTitoloData(data) {
    $('#title-date').attr('data-current-date', data.format("YYYY-MM-DD"));
    $('#title-date').html(data.format("MMMM YYYY"));
};

function inserisciDate(data) {
    //svuoto dati presenti in precedenza
    $('.calendar').empty();
    //compilo il calendario con Handlebars
    var source = document.getElementById("entry-template").innerHTML;
    var template = Handlebars.compile(source);

    for (var i = 1; i <= data.daysInMonth(); i++) {
        //costruisco il valore della data
        var costruisciData = moment(i + '-' + data.format("MM-YYYY"), "D-MM-YYYY")
        //compilo dati per Handlebars
        var context = {
            'date': costruisciData.format("DD-MMMM-YYYY"),
            'date-value': costruisciData.format("YYYY-MM-DD")
        };
        var html = template(context);
        $('.calendar').append(html);
    };
};

function inserisciFestivita(data) {
    $.ajax({
        url: "https://flynn.boolean.careers/exercises/api/holidays",
        method: "GET",
        data: {
            year: data.year(),
            month: data.month()
        },
        success: function (resp) {
            for (var i = 0; i < resp.response.length; i++) {
                var elemento = $('li[data-date-value="' + resp.response[i].date + '"');
                elemento.addClass('holiday');
                var nomeFesta = " - " + resp.response[i].name;
                elemento.append(nomeFesta)
            }
        },
        error: function (resp) {
            alert('errore');
            console.log(resp);
        }
    });
}

function prev(data) {
    if (data.month() == 0) {
        alert('Non puoi andare più indietro')
    } else {
        data.subtract(1, "M")
        aggiornaTitoloData(data);
        inserisciDate(data);
        inserisciFestivita(data);
    }

}
function next(data) {
    if (data.month() == 11) {
        alert('Non puoi andare più avanti')
    } else {
        data.add(1, "M")
        aggiornaTitoloData(data);
        inserisciDate(data);
        inserisciFestivita(data);
    }
}