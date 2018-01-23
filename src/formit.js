// @flow
import 'babel-polyfill';
import * as React from 'react';

type Method = 'post' | 'get';
type Credentials = 'omit' | 'include' | 'same-origin';
type Value = string | Blob;
type ResponseData = null | string | {};
type PostingError = null | string;

type submit = (e: Event) => Promise<boolean>;
type setFields = (newFields: Array<Field>) => boolean;
type setValue = (name: string, value: Value) => boolean;
type getValue = (name: string) => Value;
type clearValues = () => boolean;

type FormitInterface = {
  onSubmit: submit,
  setValue: setValue,
  getValue: getValue,
  setFields: setFields,
  clearValues: clearValues,
  isPosting: boolean,
  postingError: PostingError,
  response: Response | null,
  responseData: ResponseData
};

type Field = {
  name: string,
  value: Value
};

type Header = {
  [key: string]: string
};

type SubmitResponse = {
  action: string,
  credentials: Credentials,
  headers: Array<Header>,
  fields: Array<Field>
};

type SuccessfulSubmitResponse = {
  ...SubmitResponse,
  response: Response,
  responseData: ResponseData
};

type FailedSubmitResponse = {
  ...SubmitResponse,
  error: PostingError
};

type Props = {
  action: string,
  credentials?: Credentials,
  responseAsJSON?: boolean,
  dontFlushFieldsOnSubmit?: boolean,
  defaultFields?: Array<Field>,
  headers?: Array<Header>,
  onValueSet?: Field => void,
  beforeSubmit?: (Array<Field>) => boolean,
  onSuccessfulSubmit?: SuccessfulSubmitResponse => void,
  onFailedSubmit?: FailedSubmitResponse => void,
  children: FormitInterface => React.Node
};

type State = {
  posting: boolean,
  fields: Array<Field>,
  response: Response | null,
  responseData: ResponseData,
  postingError: PostingError
};

class Formit extends React.Component<Props, State> {
  defaultProps: {
    credentials: 'omit',
    defaultFields: [],
    responseAsJSON: false,
    dontFlushFieldsOnSubmit: false
  };

  state = {
    posting: false,
    fields: [],
    response: null,
    responseData: null,
    postingError: null
  };

  componentWillMount() {
    const { defaultFields } = this.props;
    this.setDefaultFields(defaultFields);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setDefaultFields(nextProps.defaultFields);
  }

  mergeFields = (oldFields: Array<Field>, newFields: Array<Field>) => {
    const fields = [...oldFields];

    newFields.forEach(newField => {
      const existsIndex = fields.findIndex(
        field => field.name === newField.name
      );

      if (existsIndex > -1) {
        fields[existsIndex].value = newField.value;
      } else {
        fields.push(newField);
      }
    });

    return fields;
  };

  setDefaultFields = (defaultFields?: Array<Field>) => {
    const { fields } = this.state;

    if (defaultFields && defaultFields.length > 0) {
      const mergedFields = this.mergeFields(fields, defaultFields);

      this.setState({
        fields: mergedFields
      });
    }
  };

  setFields: setFields = newFields => {
    const { posting, fields } = this.state;

    if (posting) {
      return false;
    }

    const mergedFields = this.mergeFields(fields, newFields);

    this.setState({
      fields: mergedFields
    });

    return true;
  };

  setValue: setValue = (name, value) => {
    const { onValueSet } = this.props;
    const { posting, fields } = this.state;

    if (posting) {
      return false;
    }

    const field = { name, value };
    const mergedFields = this.mergeFields(fields, [field]);

    this.setState({
      fields: mergedFields
    });

    if (typeof onValueSet === 'function') {
      onValueSet(field);
    }

    return true;
  };

  getValue: getValue = name => {
    const { fields } = this.state;
    const field = fields.find(f => f.name === name);
    return field ? field.value : '';
  };

  clearValues: clearValues = () => {
    const { posting } = this.state;

    if (posting) {
      return false;
    }

    this.setState({
      fields: [],
      postingError: null,
      responseData: null
    });

    return true;
  };

  submit: submit = async e => {
    const {
      action,
      headers,
      credentials,
      responseAsJSON,
      dontFlushFieldsOnSubmit,
      beforeSubmit,
      onSuccessfulSubmit,
      onFailedSubmit
    } = this.props;

    const { posting, fields } = this.state;

    e.preventDefault();

    if (typeof beforeSubmit === 'function') {
      if (!beforeSubmit(fields)) {
        return false;
      }
    }

    const method = 'post';
    const formData = new FormData();
    const head = new Headers();
    let responseData: ResponseData;

    if (posting) {
      return false;
    }

    this.setState({
      posting: true,
      postingError: null,
      responseData: null
    });

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

    const responseCallbackData = {
      method,
      action,
      credentials: credentials || 'omit',
      headers: headers || [],
      fields
    };

    try {
      const response = await fetch(action, {
        method,
        headers: head,
        credentials,
        body: formData
      });

      if (responseAsJSON) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      this.setState({
        posting: false,
        fields: dontFlushFieldsOnSubmit ? fields : [],
        responseData
      });

      if (typeof onSuccessfulSubmit === 'function') {
        onSuccessfulSubmit({
          ...responseCallbackData,
          response,
          responseData
        });
      }
    } catch (error) {
      this.setState({
        posting: false,
        postingError: error
      });

      if (typeof onFailedSubmit === 'function') {
        onFailedSubmit({
          ...responseCallbackData,
          error
        });
      }
    }

    return true;
  };

  render() {
    const { children } = this.props;
    const { posting, postingError, response, responseData } = this.state;

    return children({
      onSubmit: this.submit,
      setFields: this.setFields,
      setValue: this.setValue,
      getValue: this.getValue,
      clearValues: this.clearValues,
      isPosting: posting,
      postingError,
      response,
      responseData
    });
  }
}

export default Formit;

export type {
  Method,
  Credentials,
  Value,
  ResponseData,
  PostingError,
  FormitInterface,
  Field,
  SuccessfulSubmitResponse,
  FailedSubmitResponse
};
