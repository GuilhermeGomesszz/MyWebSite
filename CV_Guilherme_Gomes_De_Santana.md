# Guilherme Gomes De Santana

**Desenvolvedor Backend / Full Stack Junior**

Americana, SP  
20 anos  
Telefone: (19) 92012-3094  
E-mail: agsguilherme955@gmail.com  
GitHub: https://github.com/GuilhermeGomesszz  
LinkedIn: https://www.linkedin.com/in/guilherme-santana-661904255/

## Objetivo

Busco uma oportunidade como Desenvolvedor Junior, Estagiario de Desenvolvimento, Suporte Tecnico ou areas relacionadas a tecnologia, onde eu possa aplicar meus conhecimentos em desenvolvimento web, APIs, banco de dados, autenticacao, deploy e suporte tecnico.

Tenho interesse em evoluir profissionalmente criando solucoes praticas, seguras e funcionais, com foco em resolver problemas reais e aprender continuamente com projetos, equipe e boas praticas de desenvolvimento.

## Resumo Profissional

Profissional em inicio de carreira na area de tecnologia, com formacao tecnica em suporte de computadores e experiencia pratica no desenvolvimento de uma aplicacao web completa para gerenciamento de barbearia.

No projeto, desenvolvi uma API com Node.js, Express, Prisma e PostgreSQL, incluindo autenticacao com JWT, cadastro e login de usuarios, controle de permissoes por perfil, gerenciamento de servicos, barbeiros, clientes e agendamentos. Tambem trabalhei com deploy em ambiente web, seed de banco de dados, variaveis de ambiente e correcao de bugs reais em producao.

Tenho facilidade para aprender novas ferramentas, investigar erros, entender fluxos de sistema e aplicar melhorias tanto no backend quanto no frontend.

## Formacao

**Curso Tecnico de Assistente de Suporte de Computadores**  
SENAC

Conhecimentos desenvolvidos:

- Manutencao e suporte a computadores
- Instalacao e configuracao de sistemas
- Atendimento e resolucao de problemas tecnicos
- Fundamentos de redes, hardware e software
- Organizacao e diagnostico de falhas

## Projeto Principal

### Sistema de Agendamento para Barbearia

Projeto web desenvolvido para gerenciar o funcionamento de uma barbearia, permitindo cadastro de usuarios, login, listagem de servicos, agendamento de horarios, controle de barbeiros e area administrativa.

O sistema foi desenvolvido com foco em simular uma aplicacao real, com backend, frontend, banco de dados, autenticacao, deploy e tratamento de erros.

**Repositorio:**  
https://github.com/GuilhermeGomesszz

### O que foi feito

- Criei uma API REST para conectar o frontend ao banco de dados.
- Desenvolvi rotas de cadastro, login, logout e recuperacao de senha.
- Implementei autenticacao com JWT e cookies HTTP-only.
- Criei controle de acesso por tipo de usuario: CLIENT, BARBER e ADMIN.
- Desenvolvi CRUD de servicos para administradores.
- Criei listagem de servicos para clientes.
- Implementei fluxo de agendamento entre cliente, barbeiro e servico.
- Configurei banco de dados PostgreSQL com Prisma ORM.
- Criei script de seed para popular servicos iniciais no banco.
- Configurei variaveis de ambiente para banco, JWT e servicos externos.
- Realizei deploy da aplicacao em ambiente web.
- Corrigi bugs encontrados apos o deploy.

### Como foi feito

O backend foi construido com Node.js e Express, usando rotas separadas por responsabilidade. A comunicacao com o banco foi feita com Prisma ORM, permitindo consultas organizadas e mais seguras.

Para autenticacao, utilizei JWT para gerar tokens de sessao e cookies HTTP-only para reduzir o risco de acesso indevido pelo JavaScript do navegador. As permissoes foram controladas por middlewares, permitindo que apenas usuarios autorizados acessassem determinadas rotas.

No frontend, utilizei HTML, CSS e JavaScript para criar telas de login, cadastro, dashboard, servicos, area do barbeiro e area administrativa. As chamadas para a API foram feitas com `fetch`, enviando credenciais quando necessario.

O banco de dados foi estruturado com Prisma, incluindo entidades como usuarios, servicos, agendamentos e carrinho. Tambem foi criado um seed para cadastrar servicos automaticamente no banco apos o deploy.

### Por que foi feito

O projeto foi desenvolvido para praticar a construcao de uma aplicacao completa, indo alem de telas estaticas. A ideia foi criar um sistema com funcionalidades reais, como autenticacao, perfis de usuario, persistencia em banco, regras de permissao e deploy.

Tambem serviu para aprender como resolver problemas comuns de sistemas publicados na web, como configuracao de banco remoto, variaveis de ambiente, conexao entre frontend e backend e tratamento de erros em producao.

## Bugs Solucionados no Projeto

- Corrigi erro no registro de usuarios causado por chamada incorreta da funcao de geracao de token.
- Ajustei problema de login em que o usuario entrava e era redirecionado novamente para a tela de login.
- Corrigi falhas de conexao no frontend causadas por URLs incorretas de API em algumas paginas.
- Executei e validei o comando de seed para popular os servicos no banco de dados.
- Corrigi problema relacionado ao aviso de SSL do PostgreSQL, ajustando o modo de conexao para `sslmode=verify-full`.
- Investiguei erro `EACCES` em consultas do Prisma durante testes locais.
- Validei endpoint de servicos retornando `200 OK` apos ajuste de conexao.
- Revisei o fluxo de autenticacao, cookies, JWT e permissoes.
- Identifiquei pontos de seguranca a melhorar antes de expor a aplicacao amplamente na web.

## Ferramentas e Tecnologias Utilizadas

### Backend

- Node.js
- Express.js
- JavaScript ES Modules
- API REST
- Middlewares
- Nodemon

### Banco de Dados

- PostgreSQL
- Prisma ORM
- Prisma Client
- Prisma Migrations
- Seed de banco de dados
- Adapter PostgreSQL para Prisma
- Biblioteca `pg`

### Autenticacao e Seguranca

- JWT
- Cookies HTTP-only
- Bcrypt
- Validador Zod
- Rate limiting com `express-rate-limit`
- Variaveis de ambiente com `dotenv`
- Controle de acesso por perfil de usuario

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API
- Formularios de login e cadastro
- Dashboard de usuario
- Paginas administrativas

### Deploy e Ambiente

- Render
- Banco PostgreSQL remoto
- Configuracao de `.env`
- Scripts NPM
- Logs de servidor
- Debug de erros em producao

### Outras Bibliotecas

- `cookie-parser`
- `compression`
- `node-cache`
- `resend`

### Versionamento

- Git
- GitHub

## Competencias Tecnicas

- Desenvolvimento de APIs REST
- Criacao de rotas e controllers
- Modelagem basica de banco de dados
- Integracao entre frontend e backend
- Autenticacao de usuarios
- Controle de permissoes
- Validacao de dados
- Tratamento de erros
- Debug por logs
- Deploy de aplicacoes web
- Uso de variaveis de ambiente
- Execucao de scripts de seed
- Organizacao de projeto Node.js

## Competencias Comportamentais

- Facilidade para aprender
- Persistencia para resolver problemas
- Atencao a detalhes
- Boa adaptacao a novas ferramentas
- Interesse por desenvolvimento e suporte tecnico
- Capacidade de investigar erros por logs
- Organizacao para separar problemas e buscar solucoes

## Experiencia Pratica

**Projeto pessoal - Sistema de Barbearia**  
Desenvolvedor do projeto

Atuei no desenvolvimento da aplicacao desde a estrutura inicial ate o deploy, passando por criacao de rotas, controllers, integracao com banco, autenticacao, telas do frontend e correcao de erros reais apos publicacao.

Principais responsabilidades:

- Criar endpoints para cadastro, login, servicos e agendamentos.
- Integrar o sistema com banco PostgreSQL usando Prisma.
- Criar validacoes para dados recebidos pela API.
- Implementar controle de acesso por tipo de usuario.
- Configurar seed para popular dados iniciais.
- Testar endpoints e corrigir bugs.
- Analisar logs de erro em ambiente local e no deploy.
- Melhorar configuracoes de conexao com banco remoto.

## Idiomas

**Portugues:** nativo

## Informacoes Adicionais

Disponivel para oportunidades na area de desenvolvimento, suporte tecnico, estagio em TI ou posicoes junior relacionadas a tecnologia.

