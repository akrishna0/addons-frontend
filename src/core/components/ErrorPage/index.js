/* @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import log from 'core/logger';
import { getErrorComponent as getErrorComponentDefault } from 'core/utils';
import { loadErrorPage } from 'core/reducers/errorPage';
import type { ErrorPageState } from 'core/reducers/errorPage';
import type { DispatchFunc } from 'core/types/redux';

type Props = {|
  children: React.Node,
  getErrorComponent: typeof getErrorComponentDefault,
|};

type InjectedProps = {|
  dispatch: DispatchFunc,
  errorPage: ErrorPageState,
|};

type InternalProps = { ...Props, ...InjectedProps };

export class ErrorPageBase extends React.Component<InternalProps> {
  static defaultProps = {
    errorPage: {},
    getErrorComponent: getErrorComponentDefault,
  };

  componentDidCatch(error: Error, info: Object) {
    const { dispatch } = this.props;

    dispatch(loadErrorPage({ error }));
    log.error('Caught application error:', error, info);
  }

  render() {
    const { children, errorPage, getErrorComponent } = this.props;

    if (errorPage.hasError) {
      const ErrorComponent = getErrorComponent(errorPage.statusCode);
      return (
        <ErrorComponent error={errorPage.error} status={errorPage.statusCode} />
      );
    }

    return children;
  }
}

export const mapStateToProps = (state: {| errorPage: ErrorPageState |}) => ({
  errorPage: state.errorPage,
});

const ErrorPage: React.ComponentType<Props> = compose(connect(mapStateToProps))(
  ErrorPageBase,
);

export default ErrorPage;
