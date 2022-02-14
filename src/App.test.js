import { render, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    // Not sure why the Author chose MockAdapter over jest nock but...
    // for now don't worry about it.
    const fakeAxios = new MockAdapter(axios);
    // Normally this is not good to do but this tutorial
    // series did not build out a full UI with add bugs.
    fakeAxios.onGet('/bugs').reply(200, [{ id: 1, description: 'Test bug' }]);
  });

  test('renders learn react link', async () => {
    render(<App />);
    const bugs = await screen.findAllByText(/test bug/i);
    expect(bugs).toHaveLength(2);
  });
});
