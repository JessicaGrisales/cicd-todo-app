describe('Enregistrement, connexion et déconnexion', () => {

  beforeEach(() => {
    cy.resetDb();
    cy.visit('/');
  });

  it('Enregistrer un nouvel utilisateur', () => {
    cy.visit('/register');

    cy.get('input[name="email"]').type(Cypress.env('USER_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('USER_PASSWORD'));
    cy.get('input[name="confirmation"]').type(Cypress.env('USER_PASSWORD'));

    cy.get('button[type="submit"]').contains('Créer un compte').click();

    cy.visit('/');
    cy.url().should('include', '/login');
  });

  it('Se connecter à un utilisateur existant', () => {

    // Intercepter les appels API liés aux tâches pour s'assurer avant de poursuivre.
    cy.intercept('GET', '/api/todo').as('getTodos');
    
    cy.createUser(Cypress.env('USER_EMAIL'),Cypress.env('USER_PASSWORD'));
    cy.visit('/login');

    cy.get('input[name="email"]').type(Cypress.env('USER_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('USER_PASSWORD'));

    cy.get('button[type="submit"]').contains('Connecter').click();

    // Attend le chargement initial des todos
    cy.wait('@getTodos');

    // Vérifie que l’on est bien redirigé vers la page d’accueil après connexion
    cy.get('nav.bg-gray-800 a').contains('Mes Tâches').should('exist');

    // Vérifie que la page d’accueil est bien chargée
    cy.url().should('include', '/');

    // Vérifie la présence du composant de création de tâche
    cy.get('h2').contains('Nouvelle tâche').should('exist');
  });

  it('La déconnexion fonctionne', () => {
    cy.createUser(Cypress.env('USER_EMAIL'), Cypress.env('USER_PASSWORD'));
    cy.login(Cypress.env('USER_EMAIL'), Cypress.env('USER_PASSWORD'));

    // Assure-toi que l’état “connecté” est effectif avant d’ouvrir le menu
    cy.visit('/');
    cy.location('pathname').should('eq', '/');
    cy.get('h2').contains('Nouvelle tâche').should('exist');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.a('string');
    });

    // Ouvre le menu et clique sur "logout"
    cy.get('[data-testid="menu-button"]').should('be.visible').click();
    cy.get('[data-testid="menu-logout"]').should('be.visible').click();

    // Vérifie que le token n’est plus en localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.equal(null);
    });

    // Vérifie la redirection vers /login
    cy.location('pathname').should('eq', '/login');
  });

});
