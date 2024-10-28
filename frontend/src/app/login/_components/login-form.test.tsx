import { render, screen } from '@testing-library/react';
import LoginForm from './login-form';

describe('#LoginForm', () => {
  it('should render correctly', () => {
    render(<LoginForm />);

    expect(screen.getByText('Bem-vindo!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('exemplo@gmail.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Insira sua senha')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it.todo('should not submit if inputs are empty');
  it.todo('should display an error when email is invalid');
  it.todo('should call onSubmit if inputs are filled');
});
