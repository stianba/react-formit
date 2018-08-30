# react-formit

Super simple and super flexible React form.

```
$ yarn add react-formit
```

## Usage

### Bare minimum

```javascript
import Formit from 'react-formit';

const App = () => (
  <Formit action="/">
    {({ onSubmit, setValue, getValue }) => (
      <form onSubmit={onSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          onChange={e => setValue('username', e.target.value)}
          value={getValue('username')}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={e => setValue('password', e.target.value)}
          value={getValue('password')}
          required
        />
        <button type="submit">Submit</button>
      </form>
    )}
  </Formit>
);

render(<App />, document.getElementById('app'));
```

### Full package

```javascript
import Formit from 'react-formit';

const App = () => (
  <Formit
    action="/"
    method="POST" // default
    defaultFields={[
      { name: 'username', value: 'Stian' },
      { name: 'password', value: 'mightyPassword' }
    ]}
    credentials="same-origin"
    headers={[
      {
        Authorization:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ'
      }
    ]}
    onValueSet={field => console.log(field.name, field.value)}
    beforeSubmit={fields =>
      window.confirm(
        `Are you sure you want your username to be ${
          fields.find(f => f.name === 'username').value
        }?`
      )
    }
    onSuccessfulSubmit={data =>
      console.log(
        data.method,
        data.action,
        data.credentials,
        data.headers,
        data.fields,
        data.response,
        data.responseData
      )
    }
    onFailedSubmit={data =>
      console.log(
        data.method,
        data.action,
        data.credentials,
        data.headers,
        data.fields,
        data.error
      )
    }
    responseAsJSON
    dontFlushFieldsOnSubmit
  >
    {({
      onSubmit,
      setFields,
      setValue,
      getValue,
      clearValues,
      isPosting,
      postingError,
      response,
      responseData
    }) => (
      <form onSubmit={onSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          onChange={e => setValue('username', e.target.value)}
          value={getValue('username')}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={e => setValue('password', e.target.value)}
          value={getValue('password')}
          required
        />
        <label htmlFor="both">Set both:</label>
        <input
          type="text"
          id="both"
          onChange={e =>
            setFields([
              { name: 'username', value: e.target.value },
              { name: 'password', value: e.target.value }
            ])
          }
          value={getValue('username')}
          required
        />
        <button type="submit" disabled={isPosting}>
          {isPosting ? 'Submitting...' : 'Submit'}
        </button>
        <a onClick={clearValues}>Cancel</a>
        {responseData !== null && <p>{responseData.mySuccessMessage}</p>}
      </form>
    )}
  </Formit>
);

render(<App />, document.getElementById('app'));
```
