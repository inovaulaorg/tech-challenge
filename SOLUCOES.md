# SOLUCOES

Este documento descreve detalhadamente todas as soluções implementadas no desafio técnico, explicando o **o que foi feito**, **como foi feito** e **o porquê** de cada decisão.

---

## Backend

### 1. Configuração de Jest, Banco de Dados e Docker

- **Jest (`jest.config.js`)**:
  - Reduzi o número de workers e configurei o coverage para não travar a máquina.
  - **Porquê:** O coverage padrão estava incluindo arquivos que não eram testados, causando consumo desnecessário de recursos.

- **Docker (`docker-compose.yml`)**:
  - Corrigi variáveis sensíveis para usar `.env`.
  - Adicionei `restart: unless-stopped` e configurei o `healthcheck` com intervalos corretos.
  - **Porquê:** Garantir que o container do backend suba de forma estável e segura.

- **Database (`database.ts`)**:
  - Configurei todas as variáveis a partir da `.env`.
  - Otimizei o pool de conexões para ambientes de dev e produção.
  - Ativei SSL condicional apenas em produção.
  - **Porquê:** Evitar exposição de credenciais e melhorar performance em produção.

- **Index (`index.ts`)**:
  - Importe as variáveis de ambiente que antes não eram importadas.
  - **Porquê:** Garantir que todas as configurações do projeto utilizem as variáveis corretas.

---

### 2. Controllers e Rotas

- **AuthController**:
  - Mensagens de erro mais genéricas para não expor se o email ou senha estão incorretos.
  - Resposta otimizada para retornar exatamente o que o Sequelize fornece.
  - **Porquê:** Melhorar segurança e consistência na resposta da API.

- **CommentController**:
  - Corrigi o bypass de tipagem no `where` do Sequelize.
  - **Porquê:** Garantir segurança de tipo e evitar comportamentos inesperados.

- **PostController**:
  - Resolvi problemas de N+1 queries usando `eager loading`.
  - Corrigi validações incorretas.
  - **Porquê:** Melhorar performance e evitar consultas desnecessárias ao banco.

- **UploadController**:
  - Removi uma constante S3 que expunha dados sensíveis.
  - **Porquê:** Evitar vazamento de credenciais.

---

### 3. Models e Types

- **Post Model**:
  - Removido método que causava N+1 query.
  - Definidas associações com comentários e likes.
  - **Porquê:** Melhorar performance e garantir integridade das relações.

- **Types**:
  - Adicionado DTO para update do perfil.
  - **Porquê:** Garantir tipagem correta nas requisições.

---

### 4. Tests

- **Auth Tests**:
  - Validação de campos obrigatórios.
  - Senhas testadas como hash.
  - Teste de token JWT implementado.
  - **Porquê:** Garantir que a autenticação funcione corretamente sem expor dados sensíveis.

- **Setup**:
  - Carregamento das variáveis da `.env`.
  - **Porquê:** Permitir que os testes usem o ambiente correto.

---

## Frontend

### 1. Layout e Componentes

- **Layout (`Layout.tsx`, Header, Footer)**:
  - Padronização de cores e formatos.
  - Componentização para reutilização.
  - **Porquê:** Melhorar consistência visual e manutenção.

- **UI Components**:
  - Adicionados componentes como `CommentItem`, `LikeButton`.
  - **Porquê:** Reutilização em várias páginas.

- **Forms**:
  - Componentes como `InputField` e `CommentInput`.
  - **Porquê:** Reduzir repetição de código e padronizar UX.

---

### 2. Hooks e Services

- **useAuth**:
  - Agora consome `AuthContext` via `AuthProvider`.
  - **Porquê:** Modularização e reuso do estado de autenticação.

- **usePostsAdvanced**:
  - Corrigida lógica de fetch.
  - **Porquê:** Evitar inconsistências na listagem de posts.

- **PostService**:
  - Adicionado campo `isPublished`.
  - **Porquê:** Permitir controle de publicação de posts no frontend.

- **Api.ts**:
  - Removidos imports não utilizados.
  - **Porquê:** Limpeza de código.

---

### 3. Styles e Theme

- **GlobalStyle**:
  - Corrigida responsividade para mobile.
  - Melhorias de acessibilidade.
  - Otimização com `will-change`.
  - **Porquê:** Garantir UX consistente e performance.

- **Theme**:
  - Corrigidos breakpoints.
  - **Porquê:** Manter consistência visual em diferentes telas.

- **styled.d.ts**:
  - Adicionado para tipagem correta do tema.
  - **Porquê:** Garantir compatibilidade com Styled Components.

---

### 4. Pages e Tests

- **App.tsx**:
  - Atualizadas rotas, incluindo `ProfilePage`, `PostsPage`, `PostDetailPage`.
  - Proteção de rotas (`ProtectedRoute` e `PublicRoute`).
  - **Porquê:** Fluxo de navegação completo e seguro.

- **App.test.tsx**:
  - Testes para todas as páginas principais.
  - Mock dos services (`authService`, `postService`, etc).
  - **Porquê:** Garantir que todas as interações e fluxos principais estão cobertos.

- **PostsPage.tsx**:
  - Página de listagem de posts criada.
  - **Porquê:** Exibir todos os posts com paginação.

---

### Observações Finais

- Todos os testes do frontend e backend passam (`npm test`).
- Build de produção e Docker funcionando (`npm run build` e `docker-compose up`).
- Commit organizados por tipo: `feat`, `refactor`, `chore`, `style`, `test`, `docs`.

