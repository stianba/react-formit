# react-formit

Super simple and super flexible React form.

```
$ yarn add react-formit
```

## Usage

```javascript
import Formit from 'react-formit';

const App = () => (
  <Formit
    action="/post-that-form"
    hiddenFields={[{ name: 'hiddenValue', value: 'Woo, secret' }]}
    headers={[
      {
        Authorization:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ'
      }
    ]}
    responseAsJSON
  >
    {({
      onSubmit,
      setValue,
      getValue,
      clearValues,
      isPosting,
      postingError,
      responseData
    }) => (
      <form onSubmit={onSubmit}>
        <label for="username">Username:</label>
        <input
          type="text"
          id="username"
          onChange={e => setValue('username', e.target.value)}
          value={getValue('username')}
        />
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={e => setValue('password', e.target.value)}
          value={getValue('password')}
        />
        <Button type="submit">Submit</Button>
        <Button onClick={clearValues}>Cancel</Button>
        {responseData !== null && <p>{responseData.mySuccessMessage}</p>}
      </form>
    )}
  </Formit>
);

render(<App />, document.getElementById('app'));
```
