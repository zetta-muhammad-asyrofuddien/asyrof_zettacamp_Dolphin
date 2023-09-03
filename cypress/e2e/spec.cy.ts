// before(() => {
//   cy.visit('http://localhost:4200/')
//   .wait(500)
//     .get('[data-cy="input-name"]').type('Asyrof')
//     .wait(500)
//     .get('[data-cy="input-password"]').type('12345')
//     .wait(500)
//     .get('[data-cy="btn-login"]').click()
    
    
// })


describe('Cypress Test', () => {
  it('Login, add item, remove, checkout, logout', () => {
    cy.visit('http://localhost:4200/')
  .wait(500)
    .get('[data-cy="input-name"]').type('Asyrof')
    .wait(500)
    .get('[data-cy="input-password"]').type('12345')
    .wait(500)
    .get('[data-cy="btn-login"]').click()
    //Add Cart
    const menuItems = cy.get('[data-cy="btn-add-menu-item-to-cart"]');
    menuItems.click({multiple : true})
    cy.wait(500)
    menuItems.eq(0).click();
    cy.wait(500)
    menuItems.eq(0).click();
    cy.wait(500)

    //Remove Cart
    const removeItem = cy.get('[data-cy="btn-remove-item-from-cart"]');
    removeItem.eq(0).click();
    removeItem.eq(0).click();
    cy.wait(500)
    
    //Logout
    .get('[data-cy="btn-checkout"]').click()
    cy.wait(500)
    .get('[data-cy="btn-logout"]').click()
    
    
    
  })
  // it('Logout', () => {
    
  //  cy.wait(500)
  //   .visit('http://localhost:4200/')
  //   .get('[data-cy="btn-logout"]').click()
    
  // })
  
})

