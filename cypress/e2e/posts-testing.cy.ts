describe('Testing posts features', () => {

  beforeEach(() => {
    cy.visit('http://localhost:8100');
    cy.contains('Créer un topic').click()
    cy.contains('Renseignez un nom de topic').type('MyTestingTopic')
    cy.contains('Ajouter').click()
    cy.contains('MyTestingTopic').click()
    cy.contains('MyTestingTopic').click()
  });

  it('Check the existence of the newly created posts', () => {
    cy.url().should('eq', 'http://localhost:8100/topic/2');
  })
})