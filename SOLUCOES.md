🔧 Soluções Implementadas no Desafio Técnico
Este documento detalha as correções e melhorias aplicadas em todas as áreas do projeto, conforme solicitado no desafio técnico.

📊 Resumo Geral das Correções
✅ Performance (Backend): Eliminados os problemas críticos de N+1 queries nos controladores de posts.

✅ Segurança (Backend): Implementado um middleware de validação de input robusto e corrigida uma vulnerabilidade crítica no sistema de autenticação JWT.

✅ DevOps (Docker): A configuração do Docker foi tornada segura e resiliente, removendo segredos expostos e adicionando health checks e políticas de reinício.

✅ Testes Quebrados (Full-Stack): Corrigidas todas as assertions incorretas nos testes de backend e frontend, e ajustada a configuração do Jest para garantir a execução correta.

🚀 1. Backend - Correção de Performance (N+1 Queries)
O problema mais crítico da aplicação era a cascata de consultas ao banco de dados (N+1) nos endpoints de listagem e detalhe de posts.

getPosts (Listagem de Posts)
❌ Antes: O código fazia uma consulta para obter os posts e, em seguida, um loop que disparava duas novas consultas para cada post (uma para contar comentários, outra para contar likes). Para 10 posts, isto resultava em 1 + 10 + 10 = 21 consultas.

✅ Depois: A lógica foi refatorada para usar subconsultas Sequelize.literal diretamente na consulta principal. Isto permite que o próprio banco de dados calcule as contagens de forma otimizada.

Resultado: O número de consultas foi reduzido para apenas 2, independentemente do número de posts na página (uma para os posts e contagens, e outra para verificar os likes do utilizador).

// Solução implementada no postController.ts
const { count, rows: posts } = await Post.findAndCountAll({
  // ... outras cláusulas
  attributes: {
    include: [
      [
        Sequelize.literal('(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."postId" = "Post"."id")'),
        'commentCount',
      ],
      [
        Sequelize.literal('(SELECT COUNT(*) FROM "Likes" WHERE "Likes"."postId" = "Post"."id")'),
        'likeCount',
      ],
    ],
  },
});

getPostById (Detalhe de um Post)
❌ Antes: O código buscava o post e depois fazia consultas separadas para buscar comentários e os seus autores, resultando em múltiplas idas ao banco.

✅ Depois: Foi implementado "eager loading" (carregamento adiantado) de forma aninhada. A consulta agora busca o post, o seu autor, todos os comentários, os autores de cada comentário e os likes numa única consulta otimizada.

// Solução implementada no postController.ts
const post = await Post.findByPk(parseInt(id), {
  include: [
    { model: User, as: 'author' },
    {
      model: Comment,
      as: 'comments',
      include: [{ model: User, as: 'author' }],
    },
    { model: Like, as: 'likes' },
  ],
});

🔐 2. Backend - Melhorias de Segurança
Foram identificadas e corrigidas várias vulnerabilidades de segurança.

Validação de Input com Joi
❌ Antes: Nenhum endpoint que recebia dados (register, login, createPost, createComment, etc.) validava o corpo da requisição.

✅ Depois: Foi criado um middleware genérico e robusto (validationMiddleware.ts) que utiliza a biblioteca Joi para definir schemas de validação para todos os inputs. Este middleware é agora aplicado nas rotas, garantindo que nenhum dado malformado ou malicioso chegue aos controladores.

// Exemplo de schema em validationMiddleware.ts
export const createPostSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  content: Joi.string().min(1).max(50000).required(),
  // ... outras regras
});

// Exemplo de aplicação na rota em postRoutes.ts
router.post('/', protect, validateRequest(createPostSchema), createPost);

Vulnerabilidade do Segredo JWT
❌ Antes: O middleware de autenticação (authMiddleware.ts) usava um segredo de recurso ('fallback-secret') caso a variável de ambiente JWT_SECRET não estivesse definida. Isto é uma falha crítica que permitiria a um atacante forjar tokens de autenticação.

✅ Depois: O segredo de recurso foi removido. Foi adicionada uma verificação "fail-fast" no início do ficheiro que encerra a aplicação se o JWT_SECRET não estiver definido, garantindo que o sistema nunca execute num estado inseguro.

// Solução implementada no authMiddleware.ts
if (!process.env.JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
}
const JWT_SECRET = process.env.JWT_SECRET;

// ...
jwt.verify(token, JWT_SECRET); // Sem fallback

🐳 3. DevOps - Configuração Docker Segura e Resiliente
O ficheiro docker-compose.yml original apresentava problemas graves de segurança e confiabilidade.

❌ Antes:

Senhas e segredos estavam expostos em texto plano.

Ausência de health checks, causando erros de conexão com o banco de dados.

Ausência de restart policies, fazendo com que os contentores não reiniciassem após uma falha.

✅ Depois:

Todas as variáveis sensíveis foram movidas para um ficheiro .env na raiz do projeto, que é lido pelo Docker Compose.

Foi adicionado um healthcheck ao serviço do postgres para garantir que o banco de dados esteja pronto antes de o backend iniciar.

Foi adicionada a política restart: unless-stopped a todos os serviços para garantir que eles reiniciem automaticamente em caso de falha.

# Snippet do docker-compose.yml corrigido
services:
  postgres:
    # ...
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      # ...

  backend:
    # ...
    env_file:
      - .env
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

🧪 4. Testes Quebrados (Full-Stack)
Todos os testes que estavam a falhar foram identificados e corrigidos.

Testes do Backend (auth.test.ts)
❌ Antes: Os testes continham assertions logicamente incorretas (ex: expect(user.username).toBe('wrongusername')).

✅ Depois: As assertions foram corrigidas para refletir o comportamento esperado da aplicação, garantindo que os testes validem a funcionalidade correta e passem com sucesso.

// Exemplo de correção no auth.test.ts
it('should create a user with the correct username', () => {
  // ...
  expect(user.username).toBe(userData.username); // Corrigido
});

Testes do Frontend (App.test.tsx e Configuração)
❌ Antes: Os testes falhavam por múltiplos motivos: procuravam por texto que não existia, geravam conflitos de roteamento e a configuração do Jest não conseguia processar dependências (axios) e ficheiros CSS.

✅ Depois:

Testes Relevantes: Os testes foram reescritos para procurar por conteúdo que realmente existe na aplicação (ex: "TechBlog" no cabeçalho). Para resolver a ambiguidade de múltiplos elementos, foi utilizada a função within para restringir a busca a uma secção específica da página.

Configuração do Jest: O package.json foi atualizado para instruir o Jest a:

Transformar a dependência axios (transformIgnorePatterns).

Mapear ficheiros .css para um mock vazio, evitando erros de sintaxe (moduleNameMapper).

Conflito de Roteamento: O BrowserRouter duplicado foi removido do ficheiro de teste, resolvendo o erro de "Router dentro de Router".

// Exemplo de correção no App.test.tsx
test('deve renderizar o título do blog no cabeçalho', () => {
  render(<App />);
  const header = screen.getByRole('banner');
  const titleElement = within(header).getByText(/TechBlog/i);
  expect(titleElement).toBeInTheDocument();
});
