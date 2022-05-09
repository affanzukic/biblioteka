# README
Ovo je oficijelni repozitorij online biblioteke Četvrte gimnazije Ilidža.

### Informacije o stacku
Ova biblioteka je napravljena koristeći sljedeći stack:
- [Next.js](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)

### Doprinos kodu
Svaki doprinos kodu je moguće uraditi __isključivo__ koristeći `dev` branch.

__NAPOMENA:__ svaku promjenu je potrebno odobriti od strane [glavnog reviewera](https://github.com/affanzukic) da bi se uspješno ubacila u glavni kod na `master` branch

## Pokretanje aplikacije
Za pokretanje aplikacije je potrebno imati instalirane sljedeće stvari:
- `git`
- `nodejs`
- `npm`
- `yarn`

### Development
Da bi se aplikacija pokrenula za development, potrebno je unijeti sljedeće komande u shell/command prompt:
- `git clone https://github.com/affanzukic/biblioteka.git`
- `cd biblioteka`
- `git switch dev`
- Unutar foldera `biblioteka` napraviti `.env.local` fajl sa varijablama opisane unutar `firebase/clientApp.ts` fajla
- Poslije napravljenog `.env.local` fajla, pokrenuti `yarn dev`
- U browseru, ukucati url `localhost:3000`
