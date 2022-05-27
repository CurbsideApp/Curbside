/* eslint-disable no-undef */
import '@testing-library/cypress/add-commands';

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe ('End to end testing with Cypress', () => {

    it('logs in', () => {
    cy.visit('http://localhost:3000');
    cy.findByRole('button', {  name: /log in/i}).click();
    cy.findByRole('textbox', {  name: /email/i}).clear().type('cypress@curbside.com');
    cy.findByLabelText(/password/i).clear().type('cypress');
    cy.findByRole('button', {  name: /log in/i}).click();
  })

  // it('adds a new listing', () => {
    //   // cy.visit('http://localhost:3000');
    //   cy.get('#root > div > div > div:nth-child(3) > a:nth-child(3) > i').click();
    //   cy.findByLabelText('Title', {selector: 'input'}).click({force: true}).type('Test title');
    //   cy.findByLabelText('Price', {selector: 'input'}).click({force: true}).type(11.22);
    //   cy.get('.form-select').select('Used');
    //   cy.findByLabelText('Description', {selector: 'textarea'}).type('Test item description');
    //   cy.findByLabelText('Photos').selectFile('cypress/fixtures/testPicture.png');
    //   cy.findByLabelText('Categories', {selector: 'input'}).type('ca').findByText('Cars');
    // })

    it('select item for sale and chat', () => {
    // cy.visit('http://localhost:3000');
    cy.get('#root > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > a > div > div:nth-child(2)').click({force: true});
    cy.findByRole('button', {name: /contact seller/i}).click({force: true});
    cy.findByRole('textbox').type('Hi, I am a bot testing this chat');
    cy.findByRole('button', {  name: /send/i}).click();
    cy.get('#root > div > div > div:nth-child(1) > button > i').click();
  })

  it('logs out', () => {
    // cy.visit('http://localhost:3000');
    cy.get('#root > div > div > div:nth-child(3) > button > i').click();
    cy.findByRole('button', {  name: /log out/i}).click();
  })
})