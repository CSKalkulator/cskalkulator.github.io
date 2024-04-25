## Witam na źródle prostego kalkulatora opłat car sharingu w Polsce. 

Jeśli chcesz współtworzyć ten , mini, projekt, to zapraszam. Np poprzez dodanie/edycję cennik (który znajduje się w public/data.json). Kod wykorzystuje bibliotekę React.

## Założenia projektu

* Wybierasz Miasto Rozpoczęcia Wynajmu. To Determinuje Którzy Operatorzy Są Brani Pod Uwagę.
* Obecnie Obsługiwani Operatorzy To: Traficar, Panek I 4Mobility
* Cena Za Postój Dotyczy Godzin 7-23.
* Przy Opcjach Dobowych Czas Jazdy/Postoju Nie Jest Brany Pod Uwagę
* Przy Panek Nie Brana Jest Pod Uwagę Cena Za Km Od 100 Km Wzwyz, Dla Cennika Standardowego (Nie Pakiet).
* Opcja Pokazywania Najbliższych Samochodów Wymaga Zgody Na Lokalizację (Po Kliknięciu Na Przycisk)
      Baza Dostępnych Samochodów Odświeżana Jest   Co 15 Minut
* Panek Zmienił Api, Dostęp Itp ; Chwilę Mi Zajmie Pobieranie Danych O Autach Z Nowego Api

## Jak uruchomić stronę lokalnie

Aby uruchomić swoją edycję strony do edycji,na swoim komputerze zrób:

1. Pobierz repozytorium (https://github.com/CSKalkulator/cskalkulator.github.io/archive/refs/heads/master.zip) i wypakuj albo (REKOMENDOWANE) sklonuj je komendą : ``` git clone https://github.com/CSKalkulator/cskalkulator.github.io/```
2. Zainstaluj node.js: https://nodejs.org/en/download/ 
3. Otwórz linię poleceń (takie okienko gdzie się podaje komendy pisząc na klawiaturze), odpowiedni dla Twojego systemu operacyjnego, w nim przejdź do katalogu z plikami z tego repozytorium (``cd <sciezka_do_katalogu>``) i wpisz: 
```npm install```
4. Właśnie zostały pobrane moduły, potrzebne przez aplikację . To było jednorazowa operacja. Aby uruchomić to wszystko wpisz: ```npm start```
5. Jeśli przeglądarka z stroną się sama nie otworzyła, to wpisz , w przeglądarce, adres: http://127.0.0.1:3000 

"Produkcyjna" wersja kodu, z tego repozytorium, jest dostępna pod adresem: https://cskalkulator.github.io/ 

Jeśli masz pytania/uwagi/sugestie itp, to zapraszam do zakładki [issues](https://github.com/CSKalkulator/cskalkulator.github.io/issues)

