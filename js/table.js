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
        let country_filter = document.getElementById("country_filter");
        let countryNames = results.data.map(entry => entry.country);//Erzeugt ein Array das nur aus den Länder der table.csv Datei besteht. Problem: Wenn Länder doppelt vorkommen, sind diese mit im Array
        let uniqueCountryNames = [...new Set(countryNames)];//Durch "Set" werden alle doppelten Ländernamen aus dem Array entfernt
        uniqueCountryNames.forEach(name =>{ //Hinzufügen der Länder aus dem Array mit der forEach() Funktion
            let option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            country_filter.appendChild(option); //Hinzufügen des erstellten Optionsfeld zur Datalist Countrylist
        });
        
        //Company Filter
        let company_dList = document.getElementById("company_dList");
        let company_filter = document.getElementById("company_filter");
        document.getElementById("country_filter").addEventListener('change', change());
        function change(){
            company_dList.innerHTML =""; // Auswahl leeren
            company_filter.value =""; //setzt den Value auf ""
            if (country_filter.value != "Alle Länder"){
                let filteredCompanySection = results.data.filter(entry => entry.country === country_filter.value);
                let companyNames = filteredCompanySection.map(entry => entry.company);//Erzeugt ein Array das nur aus den Firmennamen der table.csv Datei besteht. Problem: Wenn eine Firma doppelt vorkommen, ist diese mit im Array
                let uniqueCompanyNames = [...new Set(companyNames)];//Durch "Set" werden alle doppelten Firmennamen aus dem Array entfernt
                uniqueCompanyNames.forEach(name =>{
                    console.log(name);
                    let option = document.createElement("option");
                    option.value = name;
                    company_dList.appendChild(option);
                });
            } else {
                let companyNames = results.data.map(entry => entry.company);//Erzeugt ein Array das nur aus den Firmennamen der table.csv Datei besteht. Problem: Wenn eine Firma doppelt vorkommen, ist diese mit im Array
                let uniqueCompanyNames = [...new Set(companyNames)];//Durch "Set" werden alle doppelten Firmennamen aus dem Array entfernt
                uniqueCompanyNames.forEach(name =>{
                    console.log(name);
                    let option = document.createElement("option");
                    option.value = name;
                    company_dList.appendChild(option);
                });
            }
        };

        //Country Filter fehlt noch und FilterFunktion
        let filters = []; //hinzufügen eines Filter Array
        document.getElementById("filterButton").addEventListener('click', filtern);
        function filtern(){
            table.clearFilter();//Löscht alle Filter EInstellungen um danach den company Filter zu setzten
            if (country_filter.value != "Alle Länder" && country_filter.value != "") { //Prüft ob NICHT im country_filter.value "Alle Länder" und das dieser nicht Leer ist
                table.setFilter("country", "=", country_filter.value); //Einstellen des Filters country mit den Wert aus dem Select Element
                if (company_filter.value != "") {
                    table.setFilter("company", "=", company_filter.value);
                } 
            } else if (country_filter.value = "Alle Länder" && company_filter.value == "") {
                table.clearFilter();
            } else {
                table.clearFilter();
                table.setFilter("company", "=", company_filter.value);
            }

        };


    }
});
