import React from 'react';
import { Link } from 'react-router-dom';
import { firebaseAuth } from '../../../firebase';
import { Grid, Header, Message } from 'semantic-ui-react';

import { LoginForm } from './Form';

class Login extends React.Component {
  state = {
    data: {
      email: '',
      password: '',
    },
    loading: false,
    errors: {},
  };

  handleChange = e => {
    if (this.state.errors[e.target.name]) {
      const errors = Object.assign({}, this.state.errors);
      delete errors[e.target.name];
      this.setState({
        data: { ...this.state.data, [e.target.name]: e.target.value },
        errors,
      });
    } else {
      this.setState({
        data: { ...this.state.data, [e.target.name]: e.target.value },
      });
    }
  };

  handleGlobalError = err => {
    const errors = {};
    errors.global = err;

    if (err.toLowerCase().includes('email')) {
      errors.email = true;
    }
    if (err.toLowerCase().includes('password')) {
      errors.password = true;
    }

    this.setState({ errors });
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.onValidate(this.state.data);
    this.setState({ errors });

    if (Object.keys(errors).length === 0) {
      this.setState({ loading: true });
      firebaseAuth
        .signInWithEmailAndPassword(
          this.state.data.email,
          this.state.data.password
        )
        .then(({ user }) => {
          //TODO: Toast Welcome back user.displayName
          this.setState({ loading: false });
        })
        .catch(err => {
          this.handleGlobalError(err.message);
          this.setState({ loading: false });
        });
    }
  };

  onValidate = data => {
    const errors = {};

    //if (!isEmail(data.email)) errors.email = "Invalid email";

    if (!data.password) errors.password = 'Password cannot be blank';
    if (data.password.length < 6) errors.password = 'Password too Short';

    return errors;
  };

  render() {
    const { data, errors, loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="page">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" textAlign="center" color="teal">
            Hey, welcome back!
          </Header>

          {errors.global && (
            <Message negative>
              <Message.Header>Error</Message.Header>
              <p>{errors.global}</p>
            </Message>
          )}
          <br />

          <LoginForm
            data={data}
            errors={errors}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            loading={loading}
          />

          <Message>
            Need an account? <Link to="/register">Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
