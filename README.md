# Projeto Form PostgreSQL

## Visão geral do projeto

A aplicação gerencia dois tipos principais de registros:

- `PersonRecord`: cadastro de uma pessoa.
- `RequestRecord`: cadastro de uma requisição.

O projeto usa servidor Express com templates Handlebars (`hbs`) para renderizar páginas HTML no servidor.

## Estrutura principal

- `src/main.ts`: ponto de entrada da aplicação.
- `src/app.module.ts`: configuração global do NestJS, carregamento do `ConfigModule`, conexão com PostgreSQL via `TypeOrmModule` e importação do `FormModule`.
- `src/form/form.module.ts`: módulo responsável pelas rotas e serviços de formulário.
- `src/form/form.controller.ts`: controla requisições HTTP e renderiza as views.
- `src/form/form.service.ts`: lógica de negócio para salvar e consultar registros.
- `src/form/entities/person.record.entity.ts`: entidade TypeORM para pessoas.
- `src/form/entities/request.record.entity.ts`: entidade TypeORM para requisições.
- `views/`: templates `hbs` para páginas de formulário, lista de registros, detalhes e sucesso.

## Funcionalidades

- Cadastro de pessoas
- Cadastro de requisições
- Listagem de registros existentes
- Exibição de detalhes individuais
- Renderização de páginas com Handlebars
- Persistência de dados em PostgreSQL via TypeORM

## Requisitos

- Node.js 20+ (ou compatível com as dependências do projeto)
- PostgreSQL
- NPM

## Instalação

1. Clone o repositório:

```bash
git clone https://seu-repositorio.git
cd projeto-form-postgres
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente para o PostgreSQL:

- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`

Por exemplo, crie um arquivo `.env` na raiz do projeto com:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=seu_banco
```

## Execução

### Em desenvolvimento

```bash
npm run start:dev
```

### Modo produção

```bash
npm run build
npm run start:prod
```

## Scripts úteis

- `npm run start`: inicia a aplicação.
- `npm run start:dev`: inicia em modo de desenvolvimento com recarga automática.
- `npm run build`: compila o projeto.
- `npm run test`: executa testes unitários.
- `npm run test:e2e`: executa testes de ponta a ponta.
- `npm run test:cov`: gera relatório de cobertura de testes.
- `npm run lint`: verifica e corrige problemas de lint.

## Como usar

Depois de iniciar a aplicação, acesse o endereço padrão `http://localhost:3000`.

A partir daí, você poderá:

- preencher formulários de pessoa e requisição;
- visualizar listas de registros cadastrados;
- acessar detalhes de cada registro;
- receber confirmação de envio bem-sucedido.

## Banco de dados

A configuração de conexão com PostgreSQL está em `src/app.module.ts`, usando `ConfigModule` para ler variáveis de ambiente.

O TypeORM está configurado para sincronizar automaticamente as entidades:

- `PersonRecord`
- `RequestRecord`

## Observações

- A aplicação usa `synchronize: true` no TypeORM, o que é conveniente para desenvolvimento, mas não é recomendado para produção sem controle de migrações.
- Ajuste as views em `views/` para personalizar o layout e os formulários.

## Licença

Este projeto não possui licença definida no `package.json` e está marcado como `private: true`.

