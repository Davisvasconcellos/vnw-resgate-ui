# 🛡️ VNW Resgate — Interface de Missão Crítica (V1.0)

Esta é a interface **Premium** do ecossistema **VNW Resgate**, desenvolvida em Next.js para ser uma ferramenta de campo ágil, humana e resiliente. Projetada para ser utilizada por voluntários e pessoas em situação de risco durante operações de salvamento.

---

## 🎨 Filosofia de Design: "Objective & Light"

Na V1.0, implementamos uma filosofia de design focada na **redução da carga cognitiva**. Em situações de estresse, cada segundo conta.

*   **Hierarquia de Peso Visual:** Cards minimalistas que priorizam o status e o impacto (número de pessoas) antes de detalhes secundários.
*   **Informação sob Demanda:** Detalhes técnicos, endereços longos e mensagens complexas ficam guardados em *Bottom Sheets* elegantes, liberando a interface principal para uma navegação fluida.
*   **Ações Intuitivas:** Substituímos botões de texto por ícones universais de ação, inspirados em sistemas de despacho de alta performance.

---

## 🚀 Funcionalidades da V1.0 (Core Engine)

### 1. 📲 Sistema de Notificações Onipresente
*   **Monitoramento Global:** O app monitora mudanças de status em segundo plano, alertando o usuário instantaneamente através de Toasts, Badges no perfil e Banners de alerta na Home.
*   **Centro de Dropdown:** Notificações acessíveis em qualquer página através de um menu suspenso integrado ao Header, mantendo o usuário sempre informado sobre o aceite de suas solicitações.

### 2. 🔌 Resiliência Offline & Fingerprinting (Identidade Invisível)
*   **Identidade sem Fricção:** Em situações de crise, exigir um cadastro pode ser fatal. Implementamos um serviço de *Fingerprinting* que gera um **ID Exclusivo de Dispositivo** baseado em metadados do hardware e navegador.
*   **Persistência de Sessão:** Esse ID é armazenado localmente e enviado em cada requisição, permitindo que o usuário acompanhe o status do seu resgate, receba notificações e atualize dados **sem nunca ter criado uma conta**.
*   **Sincronização Híbrida:** Assim que a conexão é restaurada, o sistema de sincronização local garante que os pedidos "presos" no dispositivo sejam despachados para a API de forma automática.

### 3. 🔋 Economia de Bateria (Dark Mode Profundo)
*   **Foco Mobile:** Design otimizado para telas OLED, utilizando tons de cinza profundos e pretos puros para estender a vida útil da bateria em áreas sem energia.

### 4. 👤 Conexão Humana via Google Auth
*   **Identificação Visual:** Integração com avatares do Google para que o solicitante veja o rosto do voluntário que está a caminho, aumentando a sensação de segurança.
*   **Canal Direto:** Botões de ação imediata para chamadas telefônicas e WhatsApp diretamente no detalhe do pedido.

### 5. 🏠 Gestão Inteligente de Abrigos
*   **Visibilidade de Ocupação:** Barras de progresso dinâmicas que mostram a lotação dos abrigos em tempo real para voluntários no campo.

### 6. 🌍 Internacionalização de Missão Crítica (i18n)
*   **Sistema Poliglota (PT-BR / EN):** Toda a interface, das notificações de SOS à gestão náutica, opera de forma dinâmica em múltiplos idiomas, permitindo a atuação de ajuda humanitária internacional e o suporte a refugiados ou turistas em áreas de risco.
*   **Contexto Cultural:** Adaptação de termos técnicos para garantir que as instruções de salvamento sejam claras e universais.

---

## 🛠️ Tecnologias
*   **Frontend:** Next.js 14 (App Router)
*   **Estado:** Redux Toolkit + Fingerprinting Device Auth
*   **Notificações:** React Hot Toast + Context API de Monitoramento
*   **Estilização:** CSS Vanilla & Tailwind (Design System Customizado)

---

## 🗺️ Roadmap para a V1.1 (Próximos Passos)

Estamos preparando o terreno para expandir a inteligência da plataforma:

*   **🛡️ Centro de Comando (Admin):** Área restrita para gestores de crise visualizarem o mapa de calor de pedidos pendentes em tempo real.
*   **📊 Módulo de Analytics:** Gerador de relatórios automáticos sobre tempo médio de atendimento, itens mais solicitados e fluxo de pessoas nos abrigos.
*   **💬 Chat Integrado:** Sistema de mensagens em tempo real (WebSockets) para coordenação direta dentro do app.
*   **♿ Acessibilidade (A11y):** Implementação de suporte completo para leitores de tela, navegação por teclado e otimização de contraste para garantir que a ajuda chegue a todos, sem distinção.

---

## 🚀 Como Rodar o Projeto

### 💻 Desenvolvimento Local
```bash
# 1. Instalar dependências
npm install

# 2. Configurar o arquivo .env.local
cp .env.example .env.local
# Preencha o .env.local com suas chaves (Firebase, API URL, etc).

# 3. Rodar o motor
npm run dev
```

### ☁️ Deploy em Produção (Render / Vercel)
Para rodar em produção através do **Render**:
1.  **Variáveis de Ambiente (OBRIGATÓRIO)**: Você deve configurar as variáveis de ambiente **no painel do seu Frontend** (não apenas na API). Use as chaves do seu `.env.example` como guia e cole na seção *Environment Variables* do painel do Render. Sem isso, o Firebase e a conexão com a API não funcionarão.
2.  **Firebase Settings**: Certifique-se de que o domínio do seu deploy (ex: `meuapp.onrender.com`) esteja na lista de **Domínios Autorizados** no console do Firebase (*Authentication > Settings*).

---

## 💎 Template Library (Exemplos de UI)

Para facilitar o desenvolvimento e a manutenção da consistência visual, este projeto conta com uma biblioteca de componentes integrada acessível via rotas:

*   **`/template` (Master Premium)**: O padrão visual definitivo V2.0, contendo os componentes de alta fidelidade e design moderno.
*   **`/template2` (Legacy Harvest)**: A colheita original de elementos V1.0, servindo como base histórica do design do sistema.
*   **`/template3` (União Integral)**: O repositório absoluto que empilha todos os elementos de ambos os mundos para consulta rápida e comparação.

---

## ⚖️ Propriedade Intelectual & Termos de Uso

Este projeto foi desenvolvido com **fins estritamente educacionais**.

**Propriedade Intelectual**: O design, os templates e a lógica desta aplicação são de propriedade exclusiva de **Davis Pereira de Vasconcellos**. É proibida a utilização comercial ou redistribuição sem autorização prévia.

---

**VNW Resgate** — *Tecnologia a serviço da vida.* 🚀🛡️
