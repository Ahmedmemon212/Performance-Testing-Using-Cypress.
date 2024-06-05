describe('API Forget Password Test', () => {
  let users;

  // Load users from the fixture before running tests
  before(() => {
    cy.fixture('users').then((data) => {
      users = data;
    });
  });

  it('should request password reset for multiple users using API', () => {
    users.forEach(user => {
      // Use cy.request to make the API request
      cy.request({
        method: 'POST',
        url: 'http://64.23.210.0:3002/auth/forget-password',
        body: {
          email: user.email
        },
        failOnStatusCode: false // Continue tests even if the status code is not 2xx
      }).then(response => {
        // Log detailed information about the response
        cy.log(`Response for user ${user.email}:`, JSON.stringify(response, null, 2));

        // Check response status
        if (response.status === 200 || response.status === 201) {
          // Check if the response contains expected properties
          cy.log(`Password reset request successful for user: ${user.email}`);
          expect(response.body).to.have.property('message').and.to.be.oneOf([
            'Password reset link sent',
            'Email sent successfully'
          ]); // example assertion
        } else {
          // Log the status code and any error message
          cy.log(`Request failed for user: ${user.email} with status code: ${response.status}`);
          if (response.body && response.body.error) {
            cy.log(`Error message: ${response.body.error}`);
          }
        }

        // Add assertions to ensure the test fails if the response is not as expected
        expect(response.status).to.be.oneOf([200, 201, 400, 404]); // Adjust based on expected status codes
        if (response.status !== 200 && response.status !== 201) {
          expect(response.body).to.have.property('error'); // Example assertion for error cases
        }
      });
    });
  });
});
