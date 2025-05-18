# 📚 MinhaLivraria

MinhaLivraria é uma aplicação web desenvolvida com React que permite o registro, login e gerenciamento de uma lista de livros. Os usuários podem visualizar livros em um painel após autenticação.

## 🚀 Funcionalidades

- Registro de novos usuários
- Autenticação com login e logout
- Listagem de livros via API
- Painel de controle com informações personalizadas

## 📁 Estrutura dos Arquivos

- `App.js`: Componente principal da aplicação
- `Auth.js / auth.js`: Gerenciamento de autenticação e contexto
- `Login.js`: Formulário de login
- `Register.js`: Formulário de registro
- `Dashboard.js`: Painel principal após login
- `bookApi.js`: Funções para consumir a API de livros
- `index.html`: Página HTML principal

## 🛠️ Tecnologias Utilizadas

- React
- JavaScript (ES6+)
- HTML5/CSS3
- Context API para gerenciamento de autenticação

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/minha-livraria.git
cd minha-livraria
```

2. Instale as dependências:

```bash
npm install

```
3. Inicie o servidor:
   
```bash
npm start
```

A aplicação estará disponível em http://localhost:3000.

## 🔐 Autenticação

A autenticação é baseada em tokens armazenados localmente no navegador. O arquivo auth.js fornece funções para login, logout e verificação de autenticação.
