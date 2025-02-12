describe('Topic testing', () => {

  beforeEach(() => {
    cy.visit('/');
    cy.contains('Créer un topic').click()
    cy.contains('Renseignez un nom').type('MyTestingTopic')
    cy.contains('Ajouter').click()
  });

  it('Create and delete a new topic', () => {
    cy.contains('MyTestingTopic').should('exist')
  })

  cy.contains('ion-label', 'MyTestingTopic')
    .parents('ion-item')
    .find('ion-button[data-action="delete"]')
    .click();
})
