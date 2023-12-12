describe('Hate route', () => {
  beforeEach(() => cy.visit('/'));

  it('Hate route works', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.contains("App").should("exist")
  });
});