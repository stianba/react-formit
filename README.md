# react-formit

Super simple and super flexible React form.

```
$ yarn add react-formit
```

## Usage

```javascript
import Formit from 'react-formit';

const locale = "no";
const localization = vasadu(localizationData, locale);

const App = () => (
  <Formit
    action="/post-that-form"
    hiddenFields={[{ name: 'hiddenValue', value: 'Woo, secret' }]}
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
        <input
          type="text"
          name="username"
          onChange={e => setValue('username', e.target.value)}
          value={getValue('username')}
        />
        <input
          type="password"
          name="password"
          onChange={e => setValue('password', e.target.value)}
          value={getValue('password')}
        />
      </form>
    )}
  </Formit>
);

render(<App />, document.getElementById('app'));
```