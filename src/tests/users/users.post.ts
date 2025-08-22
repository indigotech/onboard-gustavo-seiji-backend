import { describe, it } from 'node:test';
import axios from 'axios';
import { expect } from 'chai';

describe('User Creation', () => {
  it('should work correctly', async () => {
    const response = await axios.get('http://localhost:8080/hello');
    expect(response.data).to.equal('Hello World!');
  });
});
