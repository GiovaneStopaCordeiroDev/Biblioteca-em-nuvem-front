# Biblioteca em Nuvem — Front-end

Front-end da Biblioteca Escolar desenvolvido com HTML, CSS e JavaScript puros. A aplicação consome a API REST do repositório de back-end e não exige etapa de build.

## Estrutura

- `index.html`: página pública e login do bibliotecário.
- `dashboard.html`: painel inicial protegido.
- `assets/css`: estilos globais, tokens visuais e estilos das páginas.
- `assets/js/core`: configuração, cliente HTTP e mensagens compartilhadas.
- `assets/js/services`: chamadas reais para dashboard, livros, usuários e empréstimos.
- `assets/js/pages`: comportamento das páginas de livros, empréstimos e configurações.
- `assets/fonts`: fontes utilizadas no projeto.
- `assets/icons`: ícones SVG locais.

## Execução local

1. Inicie o back-end em `http://localhost:5080` no modo Development.
2. Sirva a raiz deste projeto com o servidor local incluído:

```bash
node serve-local.mjs
```

Esse servidor desativa cache durante o desenvolvimento e aceita tanto
`/livros` quanto `/livros.html`.

3. Abra `http://localhost:5500` no navegador.

> O uso de um servidor HTTP é necessário porque o JavaScript utiliza módulos ES.

O back-end local já permite a origem `http://localhost:5500`. Cadastre antes o bibliotecário conforme o README do back-end.

## Configuração da API

A URL não fica espalhada pelos serviços. O único valor padrão está em `assets/js/runtime-config.js`:

```js
export const runtimeConfig = Object.freeze({
  apiBaseUrl: "http://localhost:5080/api/v1",
  requestTimeoutMs: 15_000,
});
```

Ao publicar o front-end, substitua `apiBaseUrl` pela URL HTTPS pública da API, incluindo `/api/v1`, e troque `http://localhost:5080` pela mesma origem na diretiva `connect-src` das páginas HTML. Esse arquivo não pode conter senhas, chaves privadas ou tokens. A URL não pode ser alterada pelo navegador; isso impede que uma sessão seja enviada acidentalmente a outro servidor.

Se front e API forem publicados no mesmo domínio por meio de proxy reverso, também é possível usar `apiBaseUrl: "/api/v1"`.

## Autenticação

O login chama `POST /api/v1/auth/login`. A API valida o hash da senha e devolve um token aleatório de sessão; somente o hash desse token é persistido no banco. O front mantém a sessão em `sessionStorage`, envia `Authorization: Bearer` nas chamadas e a remove no logout, na expiração ou diante de `401`.

Não inclua usuário, senha, tokens nem string de conexão nos arquivos do front-end. Em produção, publique front e API somente por HTTPS e restrinja CORS à origem exata do site.

## Publicação separada

Quando o front e o back estiverem em domínios diferentes:

- publique o front em qualquer host estático com HTTPS;
- configure `apiBaseUrl` com a URL pública da API;
- configure no back-end `Cors__AllowedOrigins__0` com a origem exata do front, sem caminho;
- configure `AllowedHosts` no back-end com o host público da API;
- use o gerenciador de segredos da hospedagem para a conexão do banco.

Não utilize curingas de CORS em produção.
