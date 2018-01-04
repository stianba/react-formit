// @flow
import 'babel-polyfill';
import * as React from 'react';

type Value = string | Blob;
type FieldError = null | string;
type ResponseData = null | string | {};
type PostingError = null | string;

type submit = (e: Event) => Promise<boolean>;
type setValue = (fieldName: string, value: Value) => boolean;
type getValue = (fieldName: string) => Value;
type getFieldError = (fieldName: string) => FieldError;
type clearValues = () => boolean;

type FormitInterface = {
  onSubmit: submit,
  setValue: setValue,
  getValue: getValue,
  getFieldError: getFieldError,
  clearValues: clearValues,
  isPosting: boolean,
  postingError: PostingError,
  responseData: ResponseData
};

type Field = {
  name: string,
  value: Value,
  error: FieldError
};

type HiddenField = {
  name: string,
  value: Value
};

type DefaultField = {
  name: string,
  value: Value
};

type Header = {
  [key: string]: string
};

type Props = {
  action: string,
  responseAsJSON?: boolean,
  hiddenFields?: Array<HiddenField>,
  defaultValues?: Array<DefaultField>,
  headers?: Array<Header>,
  credentials?: 'omit' | 'include' | 'same-origin',
  children: FormitInterface => React.Node
};

type State = {
  posting: boolean,
  fields: Array<Field>,
  responseData: ResponseData,
  postingError: PostingError
};

class Formit extends React.Component<Props, State> {
  defaultProps: {
    hiddenFields: [],
    responseAsJSON: false
  };

  state = {
    posting: false,
    fields: [],
    responseData: null,
    postingError: null
  };

  componentWillMount() {
    const { hiddenFields, defaultValues } = this.props;

    if (hiddenFields && hiddenFields.length > 0) {
      const fields = hiddenFields.map(f =>
        Object.assign({}, f, { error: null })
      );

      this.setState({ fields });
    }

    if (defaultValues && defaultValues.length > 0) {
      const fields = defaultValues.map(f =>
        Object.assign({}, f, { error: null })
      );

      this.setState({ fields });
    }
  }

  setValue: setValue = (fieldName, value) => {
    const { posting, fields } = this.state;
    if (posting) return false;
    const existsIndex = fields.findIndex(f => f.name === fieldName);

    if (existsIndex > -1) {
      fields[existsIndex].value = value;
      this.setState({ fields });
      return true;
    }

    this.setState({
      fields: [...fields, { name: fieldName, value, error: null }]
    });

    return true;
  };

  getValue: getValue = fieldName => {
    const { fields } = this.state;
    const field = fields.find(f => f.name === fieldName);
    return field ? field.value : '';
  };

  getFieldError: getFieldError = fieldName => {
    const { fields } = this.state;
    const field = fields.find(f => f.name === fieldName);
    return field ? field.error : null;
  };

  clearValues: clearValues = () => {
    const { posting } = this.state;
    if (posting) return false;
    this.setState({ fields: [], postingError: null, responseData: null });
    return true;
  };

  submit: submit = async e => {
    const { action, headers, credentials, responseAsJSON } = this.props;
    const { posting, fields } = this.state;

    const formData = new FormData();
    const head = new Headers();
    let responseData: ResponseData;

    e.preventDefault();

    if (posting) return false;
    this.setState({ posting: true, postingError: null, responseData: null });

    fields.forEach(f => {
      formData.append(f.name, f.value);
    });

    if (headers) {
      headers.forEach(h => {
        for (let p in h) {
          head.append(p, h[p]);
        }
      });
    }

    try {
      const response = await fetch(action, {
        method: 'POST',
        headers: head,
        credentials: credentials ? credentials : 'omit',
        body: formData
      });

      if (responseAsJSON) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      this.setState({
        posting: false,
        fields: [],
        responseData
      });
    } catch (error) {
      this.setState({
        posting: false,
        postingError: error
      });
    }

    return true;
  };

  render() {
    const { children } = this.props;
    const { posting, postingError, responseData } = this.state;

    return children({
      onSubmit: this.submit,
      setValue: this.setValue,
      getValue: this.getValue,
      getFieldError: this.getFieldError,
      clearValues: this.clearValues,
      isPosting: posting,
      postingError,
      responseData
    });
  }
}

export default Formit;

export type {
  Value,
  FieldError,
  ResponseData,
  PostingError,
  FormitInterface,
  Field,
  HiddenField
};
