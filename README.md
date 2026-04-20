# 🛡️ VNW Resgate — Interface de Missão Crítica (V1.0)

Esta é a interface **Premium** do ecossistema **VNW Resgate**, desenvolvida em Next.js para ser uma ferramenta de campo ágil, humana e resiliente. Projetada para ser utilizada por voluntários e pessoas em situação de risco durante operações de salvamento.

---

## 🎨 Filosofia de Design: "Objective & Light"

Na V1.0, implementamos uma filosofia de design focada na **redução da carga cognitiva**. Em situações de estresse, cada segundo conta.

*   **Hierarquia de Peso Visual:** Cards minimalistas que priorizam o status e o impacto (número de pessoas) antes de detalhes secundários.(priorizei a informação mais importante primeiro)
*   **Informação sob Demanda:** Detalhes técnicos, endereços longos e mensagens complexas ficam guardados em *Bottom Sheets* elegantes, liberando a interface principal para uma navegação fluida.(a maioria dos cards, exibem o ou tras informações ao tocar)
*   **Ações Intuitivas:** Substituímos botões de texto por ícones universais de ação, inspirados em sistemas de despacho de alta performance.(menos poluição visual, mais ação)

---

## 🚀 Funcionalidades da V1.0 (Core Engine)

### 1. 📲 Sistema de Notificações Onipresente
*   **Monitoramento Global:** O app monitora mudanças de status em segundo plano, alertando o usuário instantaneamente através de Toasts, Badges no perfil e Banners de alerta na Home.
*   **Centro de Dropdown:** Notificações acessíveis em qualquer página através de um menu suspenso integrado ao Header, mantendo o usuário sempre informado sobre o aceite de suas solicitações.

### 2. 🔌 Resiliência Offline & Fingerprinting (Identidade Invisível)
*   **Identidade sem Fricção:** Em situações de crise, exigir um cadastro pode ser fatal. Implementamos um serviço de *Fingerprinting* que gera um **ID Exclusivo de Dispositivo** baseado em metadados do hardware e navegador.
*   **Persistência de Sessão:** Esse ID é armazenado localmente e enviado em cada requisição, permitindo que o usuário acompanhe o status do seu resgate, receba notificações e atualize dados **sem nunca ter criado uma conta**.
*   **Sincronização Híbrida:** Assim que a conexão é restaurada, o sistema de sincronização local garante que os pedidos "presos" no dispositivo sejam despachados para a API de forma automática.(o usuário não perde nada mesmo sem internet)
* **Não obrigatoriedade de login** o usuário não precisa fazer login para usar o aplicativo, mas pode fazer login para usar o aplicativo e ganha o selo de verificado. A intenção é reduzir a fricção para o usuário que precisa de ajuda imediata, mas também oferecer a opção de se identificar para ter acesso a mais recursos.
*   **PWA** O aplicativo é um PWA (Progressive Web App), o que significa que ele pode ser instalado no dispositivo do usuário e funcionar offline.
*   **Camera** O aplicativo pode usar a câmera do dispositivo para tirar fotos e enviá-las para a API. Basta enviar para o endpoint documentado na api com a folder, no env tem a folder padrão, no caso vnw e todos os arquivos ficam salvos nas subpasas de rescue,missing,etc . não achei necessário criar subfolder para cada resgate com id do usuario, pois cada resgate tem um id unico e os arquivos ficam salvos nas subpastas de rescue,missing,etc . Mas é perfeitamente possível criar subfolder para cada resgate com id do usuario, se achar melhor.
*   **Maps** O aplicativo usa o mapa do google para exibir os pedidos de ajuda e os abrigos. Usei o OpenStreet Maps para evitar complicações e custos com a api do Google O Mapa também troca o tema de acordo com a preferência do usuário. COmo usei o Haversine na api para calcular a distância, o mapa também usa o Haversine para calcular a distância entre o usuário e os abrigos. Tornei-o o mais interativo possível, com zoom e um expand do canvas. Inicialmente, carrega todos os pontos de resgate e abrigos no mapa, mas só exibe na lista os que estão dentro do raio escolhido pelo usuário. por exemplo: uma área no mapa tem 200 pedidos, mas o voluntário só pode atender os que estão a 5km dele, então ele pode marcar o raio e só serão exibidos os pedidos que estão dentro desse raio. o Usuário pode mover o ponto central do raio e assim atualizar a lista de solicitações.
a ideia de mover o ponto é a seguinte: imagine que o voluntário aceite um resgate a 5km dele e tem uma van com 10 lugares e está resgatando 2 pessoas; assim ele está em um local onde não tem muitos pedidos, então ele pode mover o ponto central do raio para mais perto do resgate que ele aceitou e assim ele poderá ver os pedidos que estão mais próximos do local do resgate e atender mais pessoas de uma vez aproveitando a viagem.
*   **Segmentação visual** Resolvi separar em dois grupos , quem precisa de ajuda e quem pode ajudar. Desta maneira a aplicação pode ficar com menos poluição visual e ser masi objetiva em cada área. Também, tem uma distinçã ode cores, quem precisa de ajuda é vermelho e branco (as cores intenacionais de emergência) e quem pode ajudar é azul e branco (as cores intenacionais de ajuda humanitária)
*   **Desaparecidos** Criei uma área para pessoas desaparecidas que prioriza a imagem e o nome da pessoa, os detalhes são visto somente ao clicar. para manter a objetividade e não poluir a tela com informações desnecessárias. 
*   **Abrigos** Criei uma área cadastro e gestão de abrigos. Qualquer um usuário logado pode cadastrar um abrigo e se tornar um ponto de ajuda. talvez a pessoa tenha uma casa grande, um estabelecimento ou espaço que possa receber pessoas temporariamente.Assim pode ajudar a desafogar os abrigos oficiais e também ajudar pessoas que precisam de ajuda imediata. O usuário pode gerir o abrigo e fazer checkin e checkout de pessoas. esta informação de lotação é atualizada automaticamente pelo sistema. OBS: nesta vrsão inicial, não criei um sistema de verificação de abrigos, então qualquer usuário logado pode cadastrar um abrigo, mas futuramente pretendo implementar um sistema de verificação de abrigos. Tambem não implementei a parte de receber doações, e a opção de pausar/desabilitar o abrigo pois vou pensar na regra de negócio para isso (se tiver abrigados? alguém levando para o abrigo? soft delete? status ativo/inativo?).
*   **Voluntários** Criei uma área cadastro e gestão de voluntários. Qualquer um usuário logado pode se tornar um voluntário. O usuário pode gerir o perfil e adicionar suas competências.Existe um onboarding para voluntários que coleta informações sobre suas competências e disponibilidade, tipo de Automóvel/barco, etc . mas isso não está sendo usado ainda, pois a api não está implementada para isso. Agora o voluntario simplesmente aceita e gerencia as missões que estão disponíveis para ele. mas a ideia futura é que no painel admin, possa ter um sistema de gestão de voluntários que possa aprovar, reprovar, ou solicitar para alguma tarefa. Imagine que pessoas estão em áreas que só chegue de barco ou 4x4 , assim o admin poderia filtrar e mandar uma notificação para os voluntários que tem barco ou 4x4 e estão mais próximos da área de resgate solicitando ajuda específica EX: precisamos de vans para transportar pessoas do Abrigo-A para o Abrigo-B.
*   **Kpis** Criei uma área de kpis que mostra algumas informações sobre o aplicativo, como o número de pedidos de ajuda, o número de voluntários, o número de abrigos, etc. A ideia não é de gamificação e sim de mostrar a realidade da situação e o impacto que o aplicativo está tendo na sociedade fazendo o voluntário se sentir parte de algo maior e mais importante. 


### 3. 🔋 Economia de Bateria (Dark Mode Profundo)
*   **Foco Mobile:** Design otimizado para telas OLED, utilizando tons de cinza profundos e pretos puros para estender a vida útil da bateria em áreas sem energia.(nessas horas de emergência a vida útil da bateria é muito importante)

### 4. 👤 Conexão Humana via Google Auth
*   **Identificação Visual:** Integração com avatares do Google para que o solicitante veja o rosto do voluntário que está a caminho, aumentando a sensação de segurança.
*   **Canal Direto:** Botões de ação imediata para chamadas telefônicas e WhatsApp diretamente no detalhe do pedido.(o usuário pode entrar em contato direto com o voluntário)

### 5. 🏠 Gestão Inteligente de Abrigos
*   **Visibilidade de Ocupação:** Barras de progresso dinâmicas que mostram a lotação dos abrigos em tempo real para voluntários no campo.(o voluntário pode ver quantos lugares estão disponíveis no abrigo e desembarcar pessoas nos mais livres)

### 6. 🌍 Internacionalização de Missão Crítica (i18n)
*   **Sistema Poliglota (PT-BR / EN):** Toda a interface, das notificações de SOS à gestão náutica, opera de forma dinâmica em múltiplos idiomas, permitindo a atuação de ajuda humanitária internacional e o suporte a refugiados ou turistas em áreas de risco.(o usuário pode mudar o idioma do aplicativo na tela inicial, no menu header ou nas configurações de perfil)
*   **Contexto Cultural:** Adaptação de termos técnicos para garantir que as instruções de salvamento sejam claras e universais.

### 7. 📍 Radar de Proximidade & Inteligência Geográfica
*   **Localização Base:** O sistema permite que o usuário defina uma coordenada central (ex: sua casa ou abrigo) através de um seletor visual com *Reverse Geocoding* automático.
*   **Centramento Inteligente:** O radar de missões (`/nearby`) prioriza e centraliza automaticamente o mapa na localização salva do usuário, eliminando a dependência do GPS instável do navegador.

### 8. 🎯 Onboarding Inteligente (Zero Friction)
*   **Redirecionamento Condicional:** O sistema detecta automaticamente usuários sem endereço de referência e os conduz diretamente para a conclusão do perfil.
*   **Modo de Edição Automático:** Ao ser redirecionado, o perfil entra em modo de edição instantaneamente com instruções contextuais para o uso do mapa.

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
*   **💬 Chat Integrado:** Sistema de mensagens em tempo real (WebSockets) para coordenação direta dentro do app.(talvez com Redis, e integrar um sistema de notificação push pois o PWA é um pouco limitado em relação a isso. Vamos ver o que dá pra fazer no render)
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
