import React from 'react';
import { Link } from 'react-router-dom';
import { firebaseAuth, database, firebase } from '../../../firebase';
import { Grid, Header, Message } from 'semantic-ui-react';
import md5 from 'md5';

import { RegisterForm } from './Form';

class Register extends React.Component {
  state = {
    data: {
      username: '',
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

    if (err.toLowerCase().includes('username')) {
      errors.username = true;
    }
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

    const errors = this.validate(this.state.data);
    this.setState({ errors });

    if (Object.keys(errors).length === 0) {
      this.setState({ loading: true });
      firebaseAuth
        .createUserWithEmailAndPassword(
          this.state.data.email,
          this.state.data.password
        )
        .then(createdUser => {
          // console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: this.state.data.username,
              photoURL: `https://www.gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            .then(() => {
              this.saveUser(createdUser).then(() => {
                //TODO: toast Welcome createdUser.user.displayName
                this.setState({ loading: false });
              });
            })
            .catch(err => {
              // console.log(err);
              this.handleGlobalError(err.message);
              this.setState({ loading: false });
            });
        })
        .catch(err => {
          // console.log(err);
          this.handleGlobalError(err.message);
          this.setState({ loading: false });
        });
    }
  };

  saveUser = createdUser => {
    return database
      .ref('users')
      .child(createdUser.user.uid)
      .set({
        id: createdUser.user.uid,
        username: createdUser.user.displayName,
        avatar: createdUser.user.photoURL,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });
  };

  validate = data => {
    const errors = {};

    if (!data.username) errors.username = 'Username cannot be blank';
    if (data.username.length < 3) errors.username = 'Username too Short';

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
          <Header as="h1" textAlign="center" color="orange">
            Create an Account
          </Header>

          {errors.global && (
            <Message negative>
              <Message.Header>Error</Message.Header>
              <p>{errors.global}</p>
            </Message>
          )}
          <br />

          <RegisterForm
            data={data}
            errors={errors}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            loading={loading}
          />

          <Message>
            Have an account? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
