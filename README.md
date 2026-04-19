# 🛡️ VNW Resgate — Interface de Missão Crítica

Esta é a interface "Premium" do ecossistema **VNW Resgate**, desenvolvida em Next.js para ser uma ferramenta de campo ágil, humana e resiliente. Projetada para ser utilizada por voluntários e pessoas em situação de risco durante desastres naturais e operações de salvamento.

---

## 🆘 Funcionalidades de Impacto (Life-Saving Features)

Implementamos uma série de recursos focados na **preservação da vida**, **economia de recursos** e **segurança humana**:

### 1. 🔋 Modo de Economia de Bateria (Dark Mode)
*   **Design OLED-Ready:** A interface suporta modo escuro profundo para economizar bateria em dispositivos móveis, um recurso crucial em áreas com interrupção de energia elétrica.
*   **Baixa Luminosidade:** Reduz o brilho da tela, ideal para resgates noturnos, evitando ofuscar a visão do voluntário.

### 2. 📱 Instalação PWA (Nativo no Celular)
*   **Acesso Instantâneo:** Pode ser instalado na tela de início do smartphone sem depender de lojas de aplicativos (App Store/Play Store).
*   **Resiliência de Rede:** Cache inteligente para garantir que informações críticas de contato e localização estejam disponíveis mesmo com sinal de internet instável.

### 3. 🔐 Privacidade e Proteção de Dados
*   **Ocultação de Contatos:** O número de telefone do solicitante de ajuda é **ocultado em pedidos abertos** para prevenir golpes e assédio. O contato só é liberado para o voluntário que assume oficialmente a missão.
*   **Rastreabilidade por UUID:** Cada solicitação possui um identificador único seguro (`id_code`), permitindo o acompanhamento sem expor IDs sequenciais do banco de dados.

### 4. 🚀 Workflow de Resgate Inteligente
*   **Acesso à Câmera Nativa:** Possibilita o envio rápido de fotos do local/ocorrência para que a equipe de triagem possa avaliar a urgência visualmente.
*   **Triagem por Modais:** Categorias específicas com cores e ícones distintos para: **Resgate (SOS)**, **Abrigo**, **Médico**, **Alimento**, **Transporte** e **Barco**.

### 5. 👥 Visibilidade Logística Humana
*   **Contador de Pessoas Prioritário:** A quantidade de vítimas/pessoas em risco é exibida diretamente no card da tarefa. Isso permite que o voluntário saiba instantaneamente se o seu veículo (carro, barco ou jet-ski) comporta aquele grupo.

### 6. 🏠 Automação de Abrigos (Sistema de Fluxo Completo)
*   **Check-in Automatizado:** Ao finalizar uma missão com destino a um abrigo oficial, o sistema cria automaticamente o registro de entrada (`ShelterEntry`), atualizando a ocupação do abrigo em tempo real.
*   **Capacidade Flexível:** O sistema permite o registro de pessoas mesmo além da capacidade nominal em situações extremas, mantendo a visibilidade real da superlotação para gestão de recursos e suprimentos.

---

## 🎨 Design System e UX
*   **Aesthetics Premium:** Interface moderna com bordas de `2.5rem`, tipografia hierárquica (Plus Jakarta Sans) e micro-animações para reduzir o estresse cognitivo do usuário em situações de crise.
*   **Filtros Geográficos:** Localização em tempo real via Haversine no frontend para mostrar apenas o que está no raio de atuação do voluntário.

---

## 🗺️ Geolocalização e Inteligência Espacial

O sistema de mapas do VNW Resgate não é apenas visual; ele utiliza lógica matemática para otimizar o tempo de resposta:

###  algoritmo de Haversine
*   **Precisão Geográfica:** Utilizamos a **Fórmula de Haversine** para calcular a distância ortodrômica entre dois pontos na superfície da Terra (latitude e longitude).
*   **Filtragem Híbrida:** 
    *   **Backend:** A API processa o raio de busca (`radiusKm`) diretamente no banco de dados para entregar apenas registros pertinentes, reduzindo o tráfego de dados.
    *   **Frontend:** O mapa sincroniza em tempo real com a lista, recalculando as distâncias dinamicamente conforme o voluntário se movimenta.

### 🔍 Filtros Dinâmicos de Proximidade
*   **Raio Adaptável:** O usuário pode alternar entre raios de **1km, 2km, 5km ou 10km**, ideal para diferentes cenários (resgate a pé, de carro ou embarcação).
*   **Pins Inteligentes:** 
    *   **Pedidos (SOS):** As cores dos pins mudam conforme a criticidade (Urgente = Vermelho, Moderado = Laranja).
    *   **Abrigos:** Os pins mudam de cor conforme a lotação real (Verde = Vagas, Vermelho = Lotação > 90%).

### 📸 Integração com Câmera e Endereço
*   **Geocodificação Reversa:** Ao mover o pin no mapa, o sistema utiliza OpenStreetMap (Nominatim) para converter coordenadas em endereços reais automaticamente.
*   **Evidência Visual:** O sistema de captura de foto via câmera nativa vincula a imagem diretamente às coordenadas GPS, evitando erros de localização em áreas inundadas onde placas de rua podem estar submersas.

---

## 🛠️ Tecnologias
*   **Frontend:** Next.js 14 (App Router)
*   **Estado:** Redux Toolkit + Axios com interceptores JWT
*   **PWA:** @ducanh2912/next-pwa
*   **Estilização:** TailwindCSS (Custom Design System)
*   **Mapas:** Leaflet / OpenStreetMap

---

## 🚀 Como Rodar o Projeto

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente (.env.local)
# IMPORTANTE: A URL deve terminar com /api/v1 para que as rotas funcionem corretamente
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# 3. Rodar em desenvolvimento
npm run dev
```

---

## 🔑 Configurações Críticas (Firebase/Produção)

Para que o sistema de autenticação e upload funcione corretamente em produção, você **deve**:

1.  **Autorizar Domínios:** No console do Firebase, vá em *Authentication > Settings > Authorized Domains* e adicione a URL do seu deploy (ex: `vnw-resgate-ui.onrender.com`).
2.  **Configurar CORS:** Se estiver utilizando o Firebase Storage para imagens, certifique-se de que as regras de CORS permitam o domínio do seu frontend.
3.  **Variáveis de Ambiente:** Garanta que todas as chaves `NEXT_PUBLIC_FIREBASE_*` estejam preenchidas no painel de configurações do Render.

---

---

**VNW Resgate** — *Tecnologia a serviço da vida.* 🚀🛡️
