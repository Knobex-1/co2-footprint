window.addEventListener('load', function() {
    // table.cvs mit PapaParse parsen
    Papa.parse("table.csv", {
        download: true,
        header:true, //Interpretiert erste Zeile als Kopfzeile
        dynamicTyping:true, //Daten in das richtige Format umformatieren
        complete: function(results) {
            // Tabulator mit den Daten initialisieren
            var table = new Tabulator("#example-table", {
                data: results.data,
                columns: [
                    {title:"Unternehmen", field:"company", sorter:"string"},
                    {title:"Branche", field:"industry", sorter:"string"},
                    {title:"Land", field:"country", sorter:"string"},
                    {title:"CO&sup2;-Emissionen", field:"co2", sorter:"number"},
                ],
            });
        }
    });
});