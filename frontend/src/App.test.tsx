import React from 'react';
import { render, screen, within } from '@testing-library/react';
import App from './App';

// O 'describe' ajuda a agrupar testes relacionados ao mesmo componente.
describe('Componente App', () => {
  
  // Teste corrigido: Verifica se um elemento central da aplicação, como o
  // título no cabeçalho, é renderizado corretamente.
  test('deve renderizar o título do blog no cabeçalho', () => {
    render(<App />);

    // CORREÇÃO: Para evitar ambiguidade, primeiro encontramos o elemento <header>
    // pelo seu papel semântico de "banner".
    const header = screen.getByRole('banner');

    // Em seguida, usamos 'within' para procurar o texto "TechBlog" apenas
    // DENTRO do elemento do cabeçalho. Isso garante que o teste seja específico.
    const titleElement = within(header).getByText(/TechBlog/i);
    
    // Verifica se o elemento foi encontrado no documento.
    expect(titleElement).toBeInTheDocument();
  });

  // Segundo teste corrigido: Em vez de procurar um texto que não existe,
  // vamos verificar se o rodapé também é renderizado.
  test('deve renderizar o texto de direitos de autor no rodapé', () => {
    render(<App />);

    // Procura por um texto que sabemos que está no Footer.
    const footerElement = screen.getByText(/All rights reserved/i);
    
    // Verifica se o elemento do rodapé está presente.
    expect(footerElement).toBeInTheDocument();
  });

});

