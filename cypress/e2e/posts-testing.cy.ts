describe('Testing posts features', () => {

  beforeEach(() => {
    cy.visit('/');
    cy.contains('Créer un topic').click();
    cy.contains('Renseignez un nom').type('MyTestingTopic');
    cy.contains('Ajouter').click();
    cy.contains('MyTestingTopic').click();    
  });

  it('Check the existence of a newly created post', () => {
    cy.contains('Créer un post').click();
    cy.contains('Renseignez un nom').type('MyTestingPost');
    cy.contains('Renseignez une description').type('MyTestingPostDesc');
    cy.contains('Ajouter').click();
    cy.get('.post-item').should('have.length', 1);
  });

  it('Check the existence of a multiple created posts', () => {
    cy.contains('Créer un post').click();
    cy.contains('Renseignez un nom').type('MyTestingPost');
    cy.contains('Renseignez une description').type('MyTestingPostDesc');
    cy.contains('Ajouter').click();

    cy.contains('Créer un post').click();
    cy.contains('Renseignez un nom').type('MyTestingPost2');
    cy.contains('Renseignez une description').type('MyTestingPostDesc2');
    cy.contains('Ajouter').click();

    cy.contains('Créer un post').click();
    cy.contains('Renseignez un nom').type('MyTestingPost3');
    cy.contains('Renseignez une description').type('MyTestingPostDesc3');
    cy.contains('Ajouter').click();

    cy.get('.post-item').should('have.length', 3);
  });
})