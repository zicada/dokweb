Oppsett:

For at prosjektet skal kunne kjøre på en hvilken som helst server må følgende konfigurasjon utføres:

- Kopere innholdet av htdocs på cd'en til en mappe som kan nåes av webserveren.
- Sette riktige permissions slik at webserveren kan skrive til mappene data og imgdata, og lese fra resten
- Editere getdata.py og sette riktig bane til mappen data. getdata.py og alle andre python scripts ligger i mappen scripts
- Legge til getdata.py i en cronjob som kjører hvert minutt. Dette er kun nødvendig om man ønsker ny data. En kan alternativt benytte dataen som alerede ligger i data-mappen
- Editere getsensors.py, ajaxpost.py, jsajax.py og serverside.py og sette riktig bane til data.
- Sett samtlige python-script executable
- Pass på at webserver-oppsettet tillate å kjøre python-cgi scripts fra hvilken som helst mappe.

Prosjektet skal nå fungere fint.

-- Gruppe 4

