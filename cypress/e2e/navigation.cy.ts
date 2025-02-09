describe('Goes back and forth in the website', () => {
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
    cy.contains('MyTestingPost').click();
  })

  it('Should go to 404', () => {

    // Completely impossible URL
    cy.visit("/ezubfzefuezbfu");
    cy.contains("404").should("exist");

    // Valid /topic but not valid TopicId
    cy.visit("/topic/ezubfzefuezbfu");
    cy.contains("404").should("exist")

    // Valid /topic/1 but not valid PostId
    cy.visit("/topic/1/1");
    cy.contains("404").should("exist");

  })

  it('Go from a post to the main menu', () => {
    cy.contains('MyTestingPostDesc').should('exist')
    cy.get('#backRoute-MyTestingPost').click();
    cy.contains('MyTestingTopic').should('exist');
    cy.get('#backRoute-MyTestingTopic').click();
    cy.contains('Reddot').should('exist');
  })

  it('Go from a post to the main menu by opening all modals', () => {
    cy.contains('Éditer le post').click();
    cy.contains('Renseignez un nom').type('MyTestingPost2');
    cy.contains('Annuler').click();
    cy.contains('MyTestingPostDesc').should('exist');
    cy.contains('MyTestingPost2').should('not.exist');
    cy.get('#backRoute-MyTestingPost').click();

    cy.contains('Créer un post').click();
    cy.contains('Renseignez un nom').type('MyTestingPost2');
    cy.contains('Renseignez une description').type('MyTestingPostDesc2');
    cy.contains('Annuler').click();
    cy.contains('MyTestingPost').should('exist');
    cy.contains('MyTestingPost2').should('not.exist');
    cy.get('#backRoute-MyTestingTopic').click();

    cy.contains('Créer un topic').click();
    cy.contains('Renseignez un nom').type('MyTestingTopic2');
    cy.contains('Annuler').click();
    cy.contains('Reddot').should('exist');
    cy.contains('MyTestingTopic2').should('not.exist')
  })

})
