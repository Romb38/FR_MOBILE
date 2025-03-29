describe('Advanced posts feature testing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Créer un topic').click();
    cy.contains('Renseignez un nom').type('MyTestingTopic');
    cy.contains('Ajouter').click();
    cy.contains('MyTestingTopic').click();

    cy.contains('Créer un post').click();
    cy.contains('Renseignez un nom').type('MyTestingPost');
    cy.contains('Renseignez une description').type('MyTestingPostDesc');
    cy.contains('Ajouter').click();
  });

  it('Go on the post pages', () => {
    cy.contains('MyTestingPost').click();
    cy.contains('MyTestingPostDesc').should('exist');
  });

  it('Edit a post', () => {
    cy.contains('MyTestingPost').click();
    cy.contains('Éditer le post').click();
    cy.contains('Renseignez un nom').type('MyPostName2');
    cy.contains('Renseignez une description').type('DescEditTesting');
    cy.contains('Sauvegarder').click();

    cy.contains('MyPostName2').should('exist');
    cy.contains('DescEditTesting').should('exist');
  });
});
