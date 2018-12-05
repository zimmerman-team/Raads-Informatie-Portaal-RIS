const data = {
  title: 'Voeg nieuwe gebruiker toe',
  cancelButTxt: 'Annuleren',
  applyButTxt: 'Uitnodigen',
  selectTypeTxt: 'Selecteer type gebruiker',
  nameTxt: 'Voornaam',
  lastNameTxt: 'Achternaam',
  emailTxt: 'email',
  mobileNrTxt: 'mobiel nummer',
  asteriskTxt: 'Verplichte velden',
  typeChoices: [
    {
      label: 'Selecteer type gebruiker -',
      value: false,
    },
    {
      label:
        'Super Administrator - (Griffie medewerker - LET OP: volledig gebruik van de RIS invoermodule)',
      value: 'admin',
    },
    {
      label:
        'Auteur - (Griffie medewerker - LET OP: volledig gebruik RIS invoermodule, kan geen Admin gebruikers aanmaken)',
      value: 'auteur',
    },
    {
      label: 'Raadslid - (LET OP: LET OP: bekijk gepubliceerde / ongepubliceerde informatie)',
      value: 'raadslid',
    },
    {
      label: 'Reguliere gebruiker - (Kan alleen gebruik maken van de publieke RIS applicatie)',
      value: 'regular',
    },
  ],
};

export default data;
