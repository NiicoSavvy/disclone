import React from 'react';
import { Form, Input, Segment, Button, Icon } from 'semantic-ui-react';

export function RegisterForm(props) {
  const { data, errors, handleChange, handleSubmit, loading } = props;

  return (
    <Form size="large" onSubmit={handleSubmit} loading={loading}>
      <Segment stacked>
        <Form.Field error={!!errors.username}>
          <Input
            fluid
            name="username"
            value={data.username}
            id="username"
            placeholder="username"
            onChange={handleChange}
            type="text"
            required
          />
          {errors.username && <p>{errors.username}</p>}
        </Form.Field>

        <Form.Field error={!!errors.email}>
          <Input
            fluid
            name="email"
            value={data.email}
            id="email"
            placeholder="Email Address"
            onChange={handleChange}
            type="email"
            required
          />
          {errors.email && <p>{errors.email}</p>}
        </Form.Field>

        <Form.Field error={!!errors.password}>
          <Input
            fluid
            icon
            name="password"
            value={data.password}
            id="password"
            placeholder="Password"
            onChange={handleChange}
            type="password"
            required
          >
            <input />
            <Icon name="wifi" />
          </Input>
          {errors.password && <p>{errors.password}</p>}
        </Form.Field>

        <Button fluid disabled={loading} size="large" color="orange">
          Register
        </Button>
      </Segment>
    </Form>
  );
}
