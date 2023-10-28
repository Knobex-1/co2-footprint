// parsen der CSV Datei "table.cvs" mit PapaParse
Papa.parse("/data/table.csv", {
    download: true, //Download der angegeben Datei vom angegebenen Pfad
    header:true, //Interpretiert erste Zeile als Kopfzeile
    dynamicTyping:true, //automatische Konvertierung der String-Werte in ihren Typ
    complete: function(results) { //Nach Abschluss des Parsen--> Callback Funktion um die Erebnisse dem Tabulator als results.data weiterzugeben
        // Tabulator mit den Daten initialisieren
        var table = new Tabulator("#co2-table", {
            layout:"fitDataStretch",
            height:400,
            data: results.data, //Results von Papa.parse aus der "/data/table.csv" einsetzen als Daten für den Tabulator
            columns: [ //Definiert die Spalten für den Tabulator
                {title:"Unternehmen", field:"company", sorter:"string"},
                {title:"Branche", field:"industry", sorter:"string"},
                {title:"Land", field:"country", sorter:"string"},
                {title:"CO&sup2;-Emissionen", field:"co2", sorter:"number", formatterParams:"color"},
            ],
        });
        //Test DataList für Filter
        let country_dList = document.getElementById("country_dList");
        let country_filter = document.getElementById("country_filter");
        let countryNames = results.data.map(entry => entry.country);//Erzeugt ein Array das nur aus den Länder der table.csv Datei besteht. Problem: Wenn Länder doppelt vorkommen, sind diese mit im Array
        let uniqueCountryNames = [...new Set(countryNames)];//Durch "Set" werden alle doppelten Ländernamen aus dem Array entfernt
        uniqueCountryNames.forEach(name =>{
            let option = document.createElement("option");
            option.value = name;
            country_dList.appendChild(option);
        });
        //Country Filter fehlt noch und FilterFunktion
        document.getElementById("filterButton").addEventListener('click', filtern);
        function filtern(){
            if (country_filter.value) {
                table.setFilter("country", "=", country_filter.value);
            } else {
                table.removeFilter("country", "=", country_filter.value);
            }
        };
        
        //Test DataList für Filter
        let company_dList = document.getElementById("company_dList");
        let company_filter = document.getElementById("company_filter");
        let companyNames = results.data.map(entry => entry.company);//Erzeugt ein Array das nur aus den Länder der table.csv Datei besteht. Problem: Wenn Länder doppelt vorkommen, sind diese mit im Array
        let uniqueCompanyNames = [...new Set(companyNames)];//Durch "Set" werden alle doppelten Ländernamen aus dem Array entfernt
        uniqueCompanyNames.forEach(name =>{
            let option = document.createElement("option");
            option.value = name;
            company_dList.appendChild(option);
        });

    }
});
