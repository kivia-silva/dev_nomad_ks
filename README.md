# Dev Nomad - Backend

Este é um projeto de infraestrutura de backend em JavaScript (Node.js) seguindo os princípios de **SOLID** e **Clean Architecture**.

## 🚀 O que temos até agora

O projeto está sendo estruturado com uma arquitetura limpa, separando responsabilidades em camadas. Atualmente, o foco tem sido na integração com o **Firebase** para autenticação de usuários e banco de dados (Firestore).

### 📁 Estrutura de Diretórios

A estrutura atual do projeto reflete a separação de responsabilidades (Clean Architecture):

- **`controllers/`**: Contém os controladores (ex: `userController.js`) que lidam com as requisições e respostas.
- **`models/`**: Contém as entidades do domínio. Atualmente possui o modelo `User` que representa os dados de um usuário (uid, email, displayName, photoURL, etc).
- **`repositories/`**: Camada responsável por abstrair o acesso a dados (ex: `userRepository.js`).
- **`routes/`**: Definição das rotas da API (ex: `userRoute.js`).
- **`services/`**: Contém as regras de negócio e integrações externas.
  - `authService.js`: Serviço de autenticação utilizando o `firebase/auth` (criação de usuário, login, logout, atualização de perfil).
  - `firestoreService.js`: Serviço para interação com o banco de dados Firebase Firestore.
  - `conn.js`: Gerenciamento de conexão.
- **`firebase/`**: Configuração de inicialização do Firebase (`firebase.js`).

### 🛠️ Tecnologias e Dependências

- **Node.js** (utilizando ES Modules `"type": "module"`)
- **Firebase** (`^12.19.0`): Utilizado para Autenticação e Firestore.

### ✨ Funcionalidades Implementadas

Através da camada de serviços (`authService.js`), já temos a base para:

- Criar conta de usuário com e-mail e senha.
- Realizar login (Sign In) com e-mail e senha.
- Atualizar perfil do usuário (Nome e Foto).
- Realizar logout (Sign Out).
- Observar mudanças de estado de autenticação.

## 📦 Como Instalar

```bash
# Clone o repositório
git clone https://github.com/victoricoma/dev_nomad.git

# Acesse a pasta do projeto
cd dev_nomad

# Instale as dependências
npm install
```
