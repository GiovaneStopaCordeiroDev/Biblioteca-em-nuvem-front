# Biblioteca em Nuvem — Front-end

Front-end da Biblioteca Escolar desenvolvido com HTML, CSS e JavaScript puros. A aplicação consome a API REST do repositório de back-end e não exige etapa de build.

## Estrutura

- `index.html`: ponto de entrada da aplicação.
- `assets/css`: estilos globais, tokens visuais e estilos das páginas.
- `assets/js/core`: configuração, cliente HTTP e mensagens compartilhadas.
- `assets/js/services`: chamadas reais para dashboard, livros, usuários e empréstimos.
- `assets/js/pages`: comportamento das páginas de livros, empréstimos e configurações.
- `assets/fonts`: fontes utilizadas no projeto.
- `assets/icons`: ícones SVG locais.

## Execução local

1. Inicie o back-end em `http://localhost:5080` no modo Development.
2. Sirva a raiz deste projeto com um servidor HTTP local. Com Node.js:

```bash
npx serve . --listen 5500
```

3. Abra `http://localhost:5500` no navegador.

> O uso de um servidor HTTP é necessário porque o JavaScript utiliza módulos ES.

O back-end local já permite a origem `http://localhost:5500` e usa autenticação demonstrativa somente em loopback.

## Configuração da API

A URL não fica espalhada pelos serviços. O único valor padrão está em `assets/js/runtime-config.js`:

```js
export const runtimeConfig = Object.freeze({
  apiBaseUrl: "http://localhost:5080/api/v1",
  requestTimeoutMs: 15_000,
});
```

Ao publicar o front-end, substitua `apiBaseUrl` pela URL HTTPS pública da API, incluindo `/api/v1`. Esse arquivo não pode conter senhas, chaves privadas ou tokens. A página de configurações permite uma substituição local por navegador para testes; essa substituição não altera o arquivo publicado.

Se front e API forem publicados no mesmo domínio por meio de proxy reverso, também é possível usar `apiBaseUrl: "/api/v1"`.

## Autenticação

Em produção, a API exige um access token do Supabase no cabeçalho `Authorization: Bearer`. O cliente HTTP lê temporariamente `biblioteca.accessToken` do `sessionStorage`. A página de configurações permite testar um token sem gravá-lo no repositório nem mantê-lo após o encerramento da aba.

A tela definitiva de login deverá autenticar com Supabase Auth e preencher essa mesma sessão. Nunca inclua access tokens, `service_role`, string de conexão ou segredo do banco em arquivos do front-end.

## Publicação separada

Quando o front e o back estiverem em domínios diferentes:

- publique o front em qualquer host estático com HTTPS;
- configure `apiBaseUrl` com a URL pública da API;
- configure no back-end `Cors__AllowedOrigins__0` com a origem exata do front, sem caminho;
- configure `AllowedHosts` no back-end com o host público da API;
- use o gerenciador de segredos da hospedagem para banco e Supabase.

Não utilize curingas de CORS em produção.
