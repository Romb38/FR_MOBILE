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

  it('Delete a new topic', () => {
    cy.get('#delete-2').click()
    cy.contains('MyTestingTopic').should('not.exist');
  })
})