const request = require('supertest');
const { expect } = require('chai');

// Since the API is a collection of serverless functions, we need to test the deployed or locally running dev server.
// This test assumes `vercel dev` is running and the API is available at http://localhost:3000
const api = request('http://localhost:3000');

describe('Configuration API', () => {
  it('GET /api/config should return public configuration', (done) => {
    api
      .get('/api/config')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        // Check for the correct structure and types
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('telegramBotUsername').that.is.a('string');
        expect(res.body).to.have.property('websiteUrl').that.is.a('string');

        // Ensure no sensitive data is present
        expect(res.body).to.not.have.property('SUPABASE_SERVICE_ROLE_KEY');
        expect(res.body).to.not.have.property('YOOKASSA_SECRET_KEY');

        done();
      });
  });
});
