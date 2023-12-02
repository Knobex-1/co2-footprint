//Funktion wird in Papa.parse() um Code Wiederholungen zu vermeiden
//Hinzufügen des erstellten Optionsfeld zur jeweiligen Datalist
function createOption(value) {
    let option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    return option;
}
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
                {title:"CO&sup2;-Emissionen in t", field:"co2", sorter:"number", formatterParams:"color"},
            ],
        });
        //Test DataList für Filter
        let errorText = document.getElementById("errorText");
        let companyNames = results.data.map(entry => entry.company);//Erzeugt ein Array das nur aus den Firmennamen der table.csv Datei besteht. Problem: Wenn eine Firma doppelt vorkommen, ist diese mit im Array
        let uniqueCompanyNames = [...new Set(companyNames)];//Durch "Set" werden alle doppelten Firmennamen aus dem Array entfernt
        let company_dList = document.getElementById("company_dList");
        let company_filter = document.getElementById("company_filter");
        let country_filter = document.getElementById("country_filter");
        let countryNames = results.data.map(entry => entry.country);//Erzeugt ein Array das nur aus den Länder der table.csv Datei besteht. Problem: Wenn Länder doppelt vorkommen, sind diese mit im Array
        let uniqueCountryNames = [...new Set(countryNames)];//Durch "Set" werden alle doppelten Ländernamen aus dem Array entfernt
        uniqueCountryNames.forEach(name =>{ //Hinzufügen der Länder aus dem Array mit der forEach() Funktion
            country_filter.appendChild(createOption(name)); //Hinzufügen des erstellten Optionsfeld zur Datalist Countrylist
        });
        
        //Company Filter
        document.getElementById("country_filter").addEventListener('change', change);
        function change(){
            company_dList.textContent =""; // Auswahl leeren
            company_filter.value =""; //setzt den Value auf ""
            if (country_filter.value != "Alle Länder"){
                let filteredCompanySection = results.data.filter(entry => entry.country === country_filter.value);
                let filteredCompanyNames = filteredCompanySection.map(entry => entry.company);//Erzeugt ein Array das nur aus den Firmennamen der table.csv Datei besteht. Problem: Wenn eine Firma doppelt vorkommen, ist diese mit im Array
                let filteredUniqueCompanyNames = [...new Set(filteredCompanyNames)];//Durch "Set" werden alle doppelten Firmennamen aus dem Array entfernt
                filteredUniqueCompanyNames.forEach(name =>{
                    company_dList.appendChild(createOption(name));
                });
            } else {
                uniqueCompanyNames.forEach(name =>{
                    company_dList.appendChild(createOption(name));
                });
            }
        };

        //Country Filter fehlt noch und FilterFunktion
        document.getElementById("filterButton").addEventListener('click', filtern);
        function filtern(){
            table.clearFilter();//Löscht alle Filter Einstellungen
            errorText.textContent = ""; //Leeren der Fehleranzeige
            //Wenn ein Unternehmen oder Land nicht gefunden wird. Wird ein Fehler ausgegebn und die Funktion beendet.
            if (company_filter.value && !uniqueCompanyNames.includes(company_filter.value) && company_filter.value !="") { 
                errorText.textContent = "Ungültige Unternehmenauswahl.";
                return;
            }
            if (country_filter.value && !uniqueCountryNames.includes(country_filter.value) && country_filter.value !="Alle Länder") {
                errorText.textContent = "Ungültige Länderauswahl.";
                return;
            }
            if (country_filter.value != "Alle Länder" && country_filter.value != "") { //Prüft ob NICHT im country_filter.value "Alle Länder" und das dieser nicht Leer ist
                table.setFilter("country", "=", country_filter.value); //Einstellen des Filters country mit den Wert aus dem Select Element
                if (company_filter.value != "") {
                    // Überprüft ob das Unternehmen im ausgewählten Land existiert
                    let match = results.data.some(entry => entry.country === country_filter.value && entry.company === company_filter.value);
                    if (match) {
                        table.setFilter("company", "=", company_filter.value);
                    } else {
                        errorText.textContent = "Das ausgewählte Unternehmen existiert nicht im gewählten Land.";
                        company_filter.value =""; //setzt den Value auf ""
                    }
                }
            }  else if (company_filter.value !="") { //überprüft ob das Felt nicht leer ist
                table.setFilter("company", "=", company_filter.value);
            } else {
            }
        };
        change();//führt die Funktion einmalig aus um die DataList von Unternehmen zu befüllen
    }
});
