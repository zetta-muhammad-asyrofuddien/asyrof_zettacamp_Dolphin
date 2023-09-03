Cypress.Commands.add('login', () => {
    // Visit the page
    cy.visit('http://localhost:4200');
    
    // Log in
    cy.get('[data-cy=input-name]').type('astqaga_susah_kali_ini_ji');
    cy.get('[data-cy=input-password]').type('your_password');
    cy.get('[data-cy=btn-login]').click();
    
    // Wait for the profile to become visible and check the content
    cy.get('[data-cy=text-navbar-profile-name]').should('be.visible').should('contain', 'Hi,');
    });
    
    Cypress.Commands.add('logout', () => {
    // Log out
    cy.get('[data-cy=btn-logout]').click();
    
    // Wait for the login form to appear after logging out
    cy.get('[data-cy=text-title-login]').should('be.visible').should('contain', 'Login');
    });
    