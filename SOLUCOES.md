# 🚀 Relatório Técnico – Soluções Implementadas no Tech Challenge

## 🧩 Correções Aplicadas

Durante a análise e refatoração da aplicação, foram identificadas e corrigidas diversas falhas críticas relacionadas a performance, segurança, testes e experiência do usuário. Abaixo, um resumo das melhorias realizadas:

### ⚡️ Otimização de Performance
- **Local:** `postController.ts`
- **Correção:** Substituição de N+1 queries por *eager loading* com Sequelize.
- **Resultado:** Redução de mais de 150 queries para uma única, melhorando o desempenho da API significativamente.

### 🐳 Melhoria na Segurança do Docker
- Remoção de credenciais em texto plano do `docker-compose.yml`
- Implementação de **enviromnent variables**, **health checks** e **restart policies** para maior confiabilidade dos containers.

### 🔐 Endurecimento da Segurança Geral
- Hash seguro para senhas de usuários
- JWT com tempo de expiração definido
- Sanitização e validação de inputs com Joi
- Remoção de dados sensíveis das respostas da API

### ✅ Validação de Entradas
- Utilização de **schemas Joi** para validar e higienizar dados recebidos via API

---

## 🧠 Respostas às Questões Técnicas

### 1️⃣ Onde estavam os gargalos de performance?
- Queries N+1 em `postController.ts` ao buscar posts com autores e comentários
- Consultas dentro de loops (150+ queries para 50 posts)
- Falta de índices otimizados no banco

### 2️⃣ Quais testes estavam quebrados e por quê?
- **`auth.test.ts`:** Erros em assertions incorretas (`username`, `token`)
- **`App.test.tsx`:** Falha na renderização devido a simulação incompleta do fluxo de login. Porém, não consegui resolvê-los.

### 3️⃣ Onde a segurança estava comprometida?
- Credenciais visíveis no `docker-compose.yml`
- JWT sem expiração
- Validações ausentes ou frágeis nos endpoints
- Dados sensíveis sendo retornados nas respostas da API

### 4️⃣ Quais problemas de UX foram encontrados?
- Falta de efeitos *hover* em botões e links
- Layout quebrado em resoluções menores
- Formulários com baixa acessibilidade
- Ausência de feedback visual para ações do usuário

---

## 📐 Análise Técnica Adicional

### 📊 Como medir o impacto das otimizações?
- Comparação do número de queries antes/depois
- Monitoramento de tempo médio de resposta
- Profiling de consumo de recursos (CPU, memória)
- Testes de carga com **k6** ou **JMeter**

### 🛡️ Quais outras vulnerabilidades podem existir?
- SQL Injection em queries não parametrizadas
- XSS em campos de entrada (posts, comentários)
- CSRF em formulários sensíveis
- Ataques de força bruta em endpoints de autenticação
- Falta de logs de segurança para auditoria

### ⚖️ Como a aplicação se comportaria com 10.000 usuários?
- Cache com Redis para dados frequentemente acessados
- Cluster PostgreSQL com réplicas de leitura
- Load Balancer para distribuir requisições
- Uso de CDN para assets estáticos
- Transição gradual para microserviços (auth, posts, mídia)

### 📡 Que métricas deveriam ser monitoradas em produção?
- Tempo de resposta por endpoint
- Throughput da API e taxa de erros
- Consumo de recursos (CPU, memória, rede)
- Dados de negócio: número de posts, comentários, usuários ativos

### 🔬 Como ampliar a cobertura de testes?
- Testes de integração (fluxos completos)
- E2E com **Cypress** ou **Playwright**
- Testes de carga automatizados
- Verificações de segurança (OWASP)
- Testes de acessibilidade automatizados

---

## 🧱 Priorização da Dívida Técnica

| Nível de Prioridade | Problema                            | Status     |
|---------------------|-------------------------------------|------------|
| 🔴 Crítico           | N+1 queries (backend)               | ✅ Resolvido |
| 🔴 Crítico           | Segurança no Docker                 | ✅ Resolvido |
| 🔴 Crítico           | Segurança da API                    | ✅ Resolvido |
| 🟢 Médio             | Melhorias de UX e responsividade   | ✅ Resolvido |

---