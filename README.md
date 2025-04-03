# Desafio Frontend – Requisitos

Este documento apresenta os requisitos para implementação do frontend, garantindo compatibilidade com as regras e endpoints definidos no backend.

## 1. Validações

Você deve ajustar as entidades (model e sql) de acordo com as regras abaixo: 

- `Product.name` é obrigatório, não pode ser vazio e deve ter no máximo 100 caracteres.
- `Product.description` é opcional e pode ter no máximo 255 caracteres.
- `Product.price` é obrigatório deve ser > 0.
- `Product.status` é obrigatório.
- `Product.category` é obrigatório.
- `Category.name` deve ter no máximo 100 caracteres.
- `Category.description` é opcional e pode ter no máximo 255 caracteres.

## 2. Refatoração
- Devido às constantes atualizações do Angular e Angular Material, substitua todas as ocorrências de `mat-form-field` por componentes customizados para inputs e textareas, que sejam parametrizáveis e reutilizáveis em todos os formulários.

## 3. Otimização de Performance
- Ajuste as listagens e consultas para suportar paginação, conforme implementado no backend, garantindo o desempenho mesmo com grande volume de dados.

## 4. Refatoração  
- Atualize os componentes de produto para utilizar a nova versão da API:
  - Use o endpoint **`/api/v2/products`** para todas as operações relacionadas a produtos.

## 6. Autenticação e Gerenciamento de Usuários

Implemente as seguintes funcionalidades:

- **Usuários Admin**
  - Crie componentes para listagem e edição de usuários (apenas para usuários com role `admin`).

- **Profile do Usuário**
  - Implemente um formulário que permita ao usuário visualizar seus dados (`name`, `email`, `role`) e alterar sua senha.
  - Exiba, ao lado dos menus de "Products" e "Categories", o nome do usuário autenticado com um link para o profile.
    - Utilize o endpoint **`/auth/context`** para obter os dados do usuário (id, email e role).
 

## 7. Permissões e Controle de Acesso

Adapte as telas e funcionalidades de acordo com a role do usuário:

- Usuários com role `admin` possuem acesso completo (criar, editar e excluir produtos, categorias e usuários).
- Outros usuários terão acesso limitado conforme definido nos requisitos do projeto.

---

# Perguntas

1. Considerando uma aplicação frontend complexa, qual arquitetura (ex.: component-based, Flux/Redux ou MVVM) você adotaria e por que?

Para uma aplicação frontend complexa, adotaria uma arquitetura Component-Based combinada com Redux (NGRX no Angular) pelos seguintes motivos:
- Gerenciamento centralizado e previsível do estado da aplicação
- Fluxo de dados unidirecional que facilita o debugging e manutenção
- Separação clara de responsabilidades entre componentes, serviços e estado
- Facilidade de implementar features complexas como undo/redo
- Melhor performance através de detecção de mudanças otimizada
- Excelente suporte para testes unitários e integração

2. Como você otimiza a performance do frontend ao lidar com grandes volumes de dados e múltiplos componentes, especialmente utilizando paginação e renderização condicional?

A otimização seria realizada através de:
- Implementação de paginação no servidor com cache no cliente
- Virtual scrolling para listas longas usando CDK Virtual Scroll
- Lazy loading de módulos e componentes
- Uso de trackBy nas diretivas ngFor
- Detecção de mudanças OnPush em componentes
- Memoização de computações pesadas
- Carregamento sob demanda de dados
- Compressão e minificação de assets
- Implementação de service workers para cache

3. Quais métodos e frameworks de teste (unitários e de integração) você empregaria para assegurar a qualidade dos componentes customizados e da interface?

A estratégia de testes incluiria:
- Testes unitários com Jasmine e Karma para componentes isolados
- Jest para testes de serviços e pipes
- Cypress para testes E2E e integração
- Testing Library para testes centrados no usuário
- Storybook para documentação e testes visuais de componentes
- NgMocks para mock de dependências
- Code coverage com Istanbul
- Testes de acessibilidade com axe-core
- CI/CD com execução automática de testes

4. Quais práticas de segurança específicas para o frontend você implementaria para prevenir vulnerabilidades como XSS, CSRF e manipulação inadequada do DOM?

As práticas de segurança incluiriam:
- Sanitização de inputs e outputs usando DomSanitizer
- Implementação de Content Security Policy (CSP)
- Uso de HttpOnly cookies para tokens
- XSRF/CSRF tokens em requisições
- Validação robusta de dados no cliente
- Escape de HTML em conteúdo dinâmico
- Autenticação JWT com refresh tokens
- Proteção contra clickjacking com X-Frame-Options
- Auditoria regular de dependências
- Implementação de rate limiting no cliente

5. Como garantir a compatibilidade e responsividade dos componentes customizados em diferentes navegadores e dispositivos, mantendo uma experiência consistente para o usuário?

A compatibilidade seria garantida através de:
- Design system consistente e bem documentado
- Uso de CSS Grid e Flexbox para layouts responsivos
- Media queries para diferentes breakpoints
- Abordagem mobile-first no desenvolvimento
- Testes cross-browser automatizados
- Polyfills para recursos modernos
- Fallbacks para funcionalidades não suportadas
- Testes em diferentes dispositivos e resoluções
- Uso de unidades relativas (rem, em, %)
- Validação de acessibilidade WCAG

6. De que forma você estruturaria a comunicação com a API (incluindo versionamento de endpoints) e trataria erros de forma a manter a robustez da aplicação?

A estruturação da comunicação com a API seria:
- Interceptors para tratamento global de erros e tokens
- Versionamento via URL (/api/v1/, /api/v2/)
- Retry com backoff exponencial para falhas temporárias
- Circuit breaker para falhas persistentes
- Tipagem forte com interfaces TypeScript
- Transformação de dados em pipes
- Cache com estratégia de invalidação
- Tratamento específico de erros por domínio
- Logging e monitoramento de erros
- Feedback visual apropriado para o usuário

Obs: Estas respostas são puramente textuais e representam uma visão geral das abordagens que seriam adotadas no projeto.

---

## Guia de Execução do Projeto

### Pré-requisitos
- Node.js (versão 20.x ou superior)
- NPM (versão 10.x ou superior)
- Backend do projeto rodando na porta 8080

### Instalação e Execução
1. Clone o repositório e instale as dependências:
```bash
git clone <repository-url>
cd desafio-frontend
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm start
```
O aplicativo estará disponível em http://localhost:4200

### Credenciais de Acesso
- Você pode registrar um novo usuário através do endpoint `/auth/register`

### Estrutura do Projeto
O projeto foi implementado utilizando:
- Angular 19
- Angular Material para componentes de UI
- Typescript para tipagem forte
- SCSS para estilização
- JWT para autenticação

A estrutura de diretórios segue o padrão:
```
src/
├── app/
│   ├── components/    # Componentes da aplicação
│   ├── services/      # Serviços para comunicação com API
│   ├── models/        # Interfaces e tipos
│   ├── guards/        # Guards de rota
│   └── interceptors/  # Interceptors HTTP
├── environments/      # Configurações de ambiente
└── assets/           # Recursos estáticos
```

### Solução de Problemas
1. Se a porta 4200 estiver em uso:
```bash
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

2. Problemas de conexão com backend:
- Verifique se o backend está rodando na porta 8080
- Verifique se o arquivo proxy.conf.json está configurado
- Limpe o cache do navegador

3. Outros problemas:
- Limpe a cache do npm: `npm cache clean --force`
- Delete node_modules e reinstale: `rm -rf node_modules && npm install`
