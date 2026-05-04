# Kicker IQ - Backend Gateway

Este é o microserviço principal do projeto **Kicker IQ**, atuando como Gateway para o frontend e orquestrador para o serviço de Inteligência Artificial.

## 🚀 Tecnologias

- **Node.js** & **TypeScript**
- **Express 5** (Framework Web)
- **MongoDB** (Banco de dados NoSQL via Mongoose)
- **Cloudinary** (Armazenamento de imagens)
- **JWT** (Autenticação e Segurança)
- **Axios** (Comunicação com Microserviços)
- **Jest** (Testes Automatizados)
- **Docker** (Conteinerização)

## 🏗️ Arquitetura

O backend segue o padrão MVC (Model-View-Controller) adaptado para uma arquitetura de microserviços:

- **Controllers:** Lógica de controle das requisições.
- **Models:** Definição de schemas do MongoDB.
- **Services:** Integrações externas (Cloudinary, Model Service).
- **Middlewares:** Filtros de autenticação e upload.
- **Routes:** Definição dos endpoints da API.

## 🔌 Integração com IA

Este serviço é o único ponto de contato para o frontend acessar o **Model Service**. Ele repassa as métricas dos atletas para o modelo ONNX e retorna a classificação de perfil (explosivo, resistente, etc).

## 🛠️ Como rodar

### Via Docker (Recomendado)
Na raiz do projeto:
```bash
docker-compose up backend
```

### Manualmente
1. Instale as dependências: `npm install`
2. Configure o `.env` baseado no `src/config.ts`.
3. Rode em modo dev: `npm run dev`

---
Desenvolvido para a plataforma de análise de performance Kicker IQ.
