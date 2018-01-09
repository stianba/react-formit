import React from 'react';
import { storiesOf } from '@storybook/react';
import Formit from '../src/formit';

storiesOf('Formit', module).add('Standard', () => (
  <Formit>
    {({ onSubmit, getValue, setValue }) => (
      <form action="#" onSubmit={onSubmit}>
        <div>
          <label htmlFor="username">User name:</label>
          <input
            type="text"
            id="username"
            value={getValue('username')}
            onChange={e => setValue('username', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={getValue('password')}
            onChange={e => setValue('password', e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    )}
  </Formit>
));
