# 07 - Redosled implementacije

## Cilj lekcije

Cilj je da studenti vide praktican redosled kojim se projekat uvecava. Lekcija povezuje sve prethodne teme u jednu mapu rada.

## Teorijsko objasnjenje

Velika promena se lakse sprovodi kada se podeli na faze. Svaka faza treba da donese merljivu vrednost i da ostavi projekat u ispravnom stanju. Redosled je vazan: prvo se uvode brze provere, zatim stabilnija baza, zatim okruzenje, pa tek onda kompletna CI/CD automatizacija.

Dobar roadmap ne znaci da sve mora da se uradi odjednom. On znaci da tim zna zasto radi sledeci korak i kako ce proveriti da je uspeo.

## Veza sa Todo aplikacijom

Predlozeni redosled za Todo aplikaciju:

1. Frontend unit/component testovi.
2. Backend API i integracioni testovi.
3. PostgreSQL i Flyway migracije.
4. Docker Compose lokalno okruzenje.
5. GitHub Actions CI.
6. E2E testovi u CI.

Ovim redosledom projekat prvo dobija brzu sigurnosnu mrezu, zatim realniju bazu, pa ponovljivo okruzenje i automatizovane provere.

## Pojmovi za pamcenje

- fazna implementacija;
- acceptance kriterijum;
- regresiona zastita;
- lokalna provera;
- CI provera;
- stabilan main branch.

## Prakticna vezba

Za svaku fazu napisi:

- cilj faze;
- fajlove koji ce se najverovatnije menjati;
- komandu kojom se faza proverava;
- rizik ako se faza preskoci.

## Pitanja za proveru znanja

1. Zasto frontend testovi mogu da dodju pre Docker-a?
2. Zasto je bolje uvesti PostgreSQL pre ozbiljnog E2E CI toka?
3. Koji je minimum da bi faza bila zavrsena?
4. Kako znamo da roadmap nije samo lista zelja nego plan rada?
