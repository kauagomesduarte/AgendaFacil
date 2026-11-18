# AgendaFácil

AgendaFácil é uma aplicação web para gerenciamento de empresas, funcionários, serviços e agendamentos.

O projeto é dividido em uma API REST com Node.js/Express e uma interface web com React/Vite.

## Funcionalidades

- Cadastro e autenticação de usuários por cookie HTTP-only
- Cadastro e gerenciamento de empresas
- Perfis por empresa: `OWNER`, `MANAGER` e `EMPLOYEE`
- Gestão de funcionários e vínculos com empresas
- Cadastro e associação de serviços aos funcionários
- Configuração de horários semanais
- Consulta de horários disponíveis por empresa, serviço, data e funcionário
- Criação e cancelamento de agendamentos pelos clientes
- Confirmação, rejeição, cancelamento, conclusão e marcação de falta
- Restrições de horários, conflitos de agenda e hierarquia de permissões
- Interface dedicada para clientes, empresas e funcionários

## Tecnologias

### Frontend

- React 19
- Vite 8
- React Router DOM 7
- JavaScript
- CSS
- Framer Motion
- GSAP
- React Icons

### Backend

- Node.js
- TypeScript
- Express 5
- Prisma 7
- PostgreSQL
- Zod
- JSON Web Token (JWT)
- bcrypt
- cookie-parser

## Estrutura do projeto

```text
AgendaFacil-main/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── src/
│       ├── @types/
│       ├── config/
│       ├── controllers/
│       ├── dtos/
│       ├── libs/
│       ├── middlewares/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       └── utils/
├── Frontend/
│   └── src/
│       ├── components/
│       ├── CSS/
│       ├── pages/
│       └── services/
├── API_CONTRACT.txt
└── README.md
```

## Arquitetura

O backend segue uma organização em camadas:

```text
Rotas -> Middlewares -> Controllers -> Services -> Repositories -> Prisma/PostgreSQL
```

- **Routes:** expõem os endpoints HTTP
- **Middlewares:** valida entrada, autenticação, autorização e erros
- **Controllers:** recebem requisições e definem respostas
- **Services:** aplicam as regras de negócio
- **Repositories:** executam operações com o banco
- **DTOs:** definem validações de dados com Zod

## Pré-requisitos

- Node.js 20 ou superior
- npm
- PostgreSQL
- Um terminal compatível

## Configuração

### 1. Instalar as dependências

Na raiz do repositório:

```bash
cd backend
npm install
```

Em outro terminal:

```bash
cd Frontend
npm install
```

### 2. Configurar o backend

Crie o arquivo `backend/.env` com as seguintes variáveis:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/agendafacil"
JWT_SECRET="substitua_por_um_segredo_seguro"
JWT_EXPIRES_IN="1h"
FRONTEND_URL="http://localhost:5173"
```

- `DATABASE_URL`: conexão PostgreSQL usada pelo Prisma
- `JWT_SECRET`: segredo usado para assinar os tokens JWT
- `JWT_EXPIRES_IN`: validade do token, por exemplo `1h`
- `FRONTEND_URL`: URL adicional permitida pelo CORS; a aplicação aceita automaticamente `localhost` e `127.0.0.1` na porta 5173

Não confirme credenciais reais ou o arquivo `backend/.env` no repositório.

Opcionalmente, crie `Frontend/.env` para apontar o frontend a uma API remota:

```env
VITE_API_URL="http://localhost:3000"
```

Para desenvolvimento local, essa variável pode ser omitida. Nesse caso, o Vite usa o proxy configurado em `vite.config.js`.

### 3. Criar o banco e aplicar o schema

Crie a base `agendafacil` no PostgreSQL e execute:

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

Durante o desenvolvimento, novas migrations podem ser criadas com:

```bash
npx prisma migrate dev
```

Para abrir o Prisma Studio:

```bash
npx prisma studio
```

## Executando o projeto

Inicie o backend:

```bash
cd backend
npm run dev
```

O backend ficará disponível em:

```text
http://localhost:3000
```

Em outro terminal, inicie o frontend:

```bash
cd Frontend
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

O Vite encaminha `/auth`, `/users`, `/comp` e `/booking` para `http://localhost:3000`.

## Scripts

### Backend

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor com hot reload |
| `npm test` | Executa os testes dos cálculos de horários |
| `npx prisma generate` | Gera o cliente Prisma |
| `npx prisma migrate dev` | Cria e aplica migrations durante o desenvolvimento |
| `npx prisma migrate deploy` | Aplica migrations existentes |
| `npx prisma studio` | Abre o painel visual do banco |

### Frontend

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento Vite |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Serve o build de produção |
| `npm run lint` | Executa o ESLint |

## Modelo de dados

Principais entidades:

- `User`: usuário global da plataforma
- `Company`: empresa e seu fuso horário
- `CompanyUser`: vínculo entre usuário, empresa e papel
- `Service`: serviço pertencente a uma empresa
- `EmployeeService`: associação entre funcionário e serviço
- `Schedule`: intervalo semanal de trabalho
- `Appointment`: agendamento realizado por um cliente

Os dados que podem ser alterados depois de uma reserva são preservados em snapshots no agendamento, como nome da empresa, nome do funcionário, nome e preço do serviço, nome e e-mail do cliente e duração.

O banco usa PostgreSQL e timestamps com timezone.

## Rotas principais

| Área | Prefixo |
|---|---|
| Usuários | `/users` |
| Autenticação | `/auth` |
| Empresas | `/comp` |
| Funcionários | `/comp/:companyId/emp` |
| Serviços | `/comp/:companyId/serv` |
| Horários semanais | `/comp/:companyId/emp/:employeeId/schedules` |
| Agendamentos da empresa | `/comp/:companyId/appointments` |
| Disponibilidade e agendamentos do cliente | `/booking` |

### Autenticação

- `POST /users`: cria usuário
- `POST /auth/login`: autentica e define o cookie `token`
- `GET /auth/me`: obtém o usuário autenticado
- `POST /auth/logout`: encerra a sessão

O cookie é HTTP-only e enviado automaticamente pelo frontend por meio de `credentials: "include"`.

### Usuários

- `GET /users/:id`
- `PATCH /users/:id`

### Empresas

- `POST /comp`
- `GET /comp`
- `GET /comp/:id`
- `PATCH /comp/:id`
- `DELETE /comp/:id`

### Serviços

- `POST /comp/:companyId/serv`
- `GET /comp/:companyId/serv`
- `GET /comp/:companyId/serv/:serviceId`
- `PATCH /comp/:companyId/serv/:serviceId`
- `DELETE /comp/:companyId/serv/:serviceId`

### Horários e agendamentos

- Consulta e criação de horários semanais
- Consulta de disponibilidade em intervalos de 15 minutos
- Criação de agendamentos com validação de fuso, duração e conflitos
- Cancelamento pelo cliente
- Alteração do status pelo funcionário ou administração da empresa

Consulte [API_CONTRACT.txt](./API_CONTRACT.txt) para o contrato completo, parâmetros, corpos de requisição, respostas e regras de autorização.

## Telas do frontend

| Rota | Tela |
|---|---|
| `/` | Página inicial |
| `/login` | Login |
| `/cadastro` | Cadastro |
| `/clientes` | Busca de estabelecimentos e agendamento |
| `/meus-horarios` | Horários do cliente |
| `/minha-conta` | Dados da conta |
| `/agenda-empresa` | Agenda da empresa |
| `/servicos` | Gestão de serviços |
| `/funcionarios` | Gestão de funcionários |
| `/horarios` | Gestão de horários da empresa |
| `/agenda` e `/agenda-funcionario` | Agenda do funcionário |
| `/horarios-funcionario` | Horários do funcionário |
| `/fila-espera` e `/fila-de-espera` | Fila de espera |

## Rotas de interface não utilizadas ou em implementação

Algumas telas existentes podem depender de endpoints ainda não expostos ou podem não estar integradas ao backend atual. Consulte `API_CONTRACT.txt` para confirmar o comportamento efetivo da API.

## Builds e validação

Frontend:

```bash
cd Frontend
npm run lint
npm run build
```

Backend:

```bash
cd backend
npm test
```

## Observações de segurança

- Mantenha `JWT_SECRET` fora do controle de versão
- Use HTTPS e cookies `Secure` em produção
- Configure `FRONTEND_URL` para o domínio real do frontend em produção
- Restrinja o acesso ao banco PostgreSQL
- Revise as regras de autorização antes de disponibilizar a API publicamente

## Licença

Licença definida como ISC nos pacotes do projeto.
