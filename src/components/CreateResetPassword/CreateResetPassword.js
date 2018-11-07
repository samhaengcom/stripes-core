import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
  reduxForm,
  Field,
  Form,
  formValueSelector,
} from 'redux-form';
import isEmpty from 'lodash/isEmpty';
import remove from 'lodash/remove';
import some from 'lodash/some';

import {
  PasswordStrength,
  PasswordValidationField
} from '@folio/stripes-smart-components';
import {
  TextField,
  Button,
  Row,
  Col,
} from '@folio/stripes-components';

import FieldLabel from './components/FieldLabel';
import OrganizationLogo from '../OrganizationLogo';
import AuthErrorsContainer from '../AuthErrorsContainer/AuthErrorsContainer';

import { stripesShape } from '../../Stripes';

import styles from './CreateResetPassword.css';

class CreateResetPassword extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool,
    errors: PropTypes.arrayOf(PropTypes.object),
    formValues: PropTypes.object,
    submitSucceeded: PropTypes.bool,
    token: PropTypes.string.isRequired,
  };

  static defaultProps = {
    submitting: false,
    errors: [],
    formValues: {},
    submitSucceeded: false,
  };

  constructor(props) {
    super(props);

    this.translationNamespaces = {
      module: 'stripes-core',
      smartComponents: 'stripes-smart-components',
      page: 'stripes-core.createResetPassword',
      errors: 'stripes-core.errors',
      button: 'stripes-core.button',
    };
    this.newPasswordField = props.stripes.connect(PasswordValidationField);
    this.passwordMatchErrorCode = 'password.match.error';
    this.state = {
      passwordMasked: true,
    };
    this.validators = {
      confirmPassword: this.confirmPasswordFieldValidation,
    };
  }

  togglePasswordMask = () => {
    this.setState(({ passwordMasked }) => ({
      passwordMasked: !passwordMasked,
    }));
  };

  newPasswordFieldValidation = (valid, errorCode) => {
    this.handleValidation(
      valid,
      errorCode,
      this.translationNamespaces.smartComponents,
    );
  };

  confirmPasswordFieldValidation = (value, { newPassword, confirmPassword } = {}) => {
    const confirmPasswordValid = !(newPassword && confirmPassword && newPassword !== confirmPassword);

    this.handleValidation(
      confirmPasswordValid,
      this.passwordMatchErrorCode,
      this.translationNamespaces.errors,
    );
  };

  handleValidation = (valid, errorCode, translationNamespace) => {
    const { errors } = this.props;
    const error = {
      code: errorCode,
      translationNamespace,
    };

    if (valid) {
      remove(errors, error);
      return;
    }

    if (!some(errors, error)) {
      errors.push(error);
    }
  };

  render() {
    const {
      errors,
      handleSubmit,
      submitting,
      onSubmit,
      submitSucceeded,
      formValues: {
        newPassword,
        confirmPassword,
      },
      token,
    } = this.props;
    const { passwordMasked } = this.state;
    const submissionStatus = submitting || submitSucceeded;
    const buttonDisabled = !isEmpty(errors) || submissionStatus || !(newPassword && confirmPassword);
    const passwordType = passwordMasked ? 'password' : 'text';
    const buttonLabelId = `${this.translationNamespaces.module}.${submissionStatus ? 'settingPassword' : 'setPassword'}`;
    const passwordToggleLabelId = `${this.translationNamespaces.button}.${passwordMasked ? 'show' : 'hide'}Password`;

    // Todo don't have a back-end yet, should be parsed from token
    const username = 'diku_admin';

    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <Row center="xs">
            <Col xs={6}>
              <OrganizationLogo />
            </Col>
          </Row>
          <Row center="xs">
            <Col xs={6}>
              <h1 className={styles.header}>
                <FormattedMessage id={`${this.translationNamespaces.page}.header`} />
              </h1>
            </Col>
          </Row>
          <Row>
            <Form
              className={styles.form}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div data-test-new-password-field>
                <Row center="xs">
                  <Col xs={6}>
                    <FieldLabel htmlFor="new-password">
                      <FormattedMessage id={`${this.translationNamespaces.page}.newPassword`} />
                    </FieldLabel>
                  </Col>
                </Row>
                <Row
                  center="xs"
                  end="sm"
                >
                  <Col
                    xs={6}
                    sm={9}
                  >
                    <this.newPasswordField
                      id="new-password"
                      name="newPassword"
                      autoComplete="new-password"
                      component={PasswordStrength}
                      type={passwordType}
                      username={username}
                      inputClass={styles.input}
                      hasClearIcon={false}
                      validationEnabled={false}
                      errors={errors}
                      autoFocus
                      marginBottom0
                      fullWidth
                      token={token}
                      inputColProps={{
                        xs:12,
                        sm:8
                      }}
                      passwordMeterColProps={{
                        xs:12,
                        sm:4,
                        className:styles.passwordStrength
                      }}
                      handleValidation={this.newPasswordFieldValidation}
                      validate={this.validators.newPassword}
                    />
                  </Col>
                </Row>
              </div>
              <div data-test-confirm-password-field>
                <Row center="xs">
                  <Col xs={6}>
                    <FieldLabel htmlFor="confirm-password">
                      <FormattedMessage id={`${this.translationNamespaces.page}.confirmPassword`} />
                    </FieldLabel>
                  </Col>
                </Row>
                <Row
                  end="sm"
                  center="xs"
                  bottom="xs"
                >
                  <Col xs={6}>
                    <div className={styles.formGroup}>
                      <Field
                        id="confirm-password"
                        component={TextField}
                        name="confirmPassword"
                        type={passwordType}
                        marginBottom0
                        fullWidth
                        inputClass={styles.input}
                        validationEnabled={false}
                        hasClearIcon={false}
                        autoComplete="confirm-password"
                        validate={this.validators.confirmPassword}
                      />
                    </div>
                  </Col>
                  <Col
                    sm={3}
                    xs={12}
                  >
                    <div
                      data-test-change-password-toggle-mask-btn
                      className={styles.toggleButtonWrapper}
                    >
                      <Button
                        type="button"
                        buttonStyle="link"
                        onClick={this.togglePasswordMask}
                      >
                        <FormattedMessage id={passwordToggleLabelId} />
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
              <Row center="xs">
                <Col xs={6}>
                  <div className={styles.formGroup}>
                    <Button
                      buttonStyle="primary"
                      id="clickable-login"
                      type="submit"
                      buttonClass={styles.submitButton}
                      disabled={buttonDisabled}
                      fullWidth
                      marginBottom0
                    >
                      <FormattedMessage id={buttonLabelId} />
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row center="xs">
                <Col xs={6}>
                  <div className={styles.authErrorsWrapper}>
                    { !isEmpty(errors) && <AuthErrorsContainer errors={errors} /> }
                  </div>
                </Col>
              </Row>
            </Form>
          </Row>
        </div>
      </div>
    );
  }
}

const CreateResetPasswordForm = reduxForm({
  form: 'CreateResetPassword',
})(CreateResetPassword);
const selector = formValueSelector('CreateResetPassword');

export default connect(state => ({
  formValues: selector(
    state,
    'newPassword',
    'confirmPassword',
  )
}))(CreateResetPasswordForm);
