# Update do plano — Dá Pra Ir? com identidade e participação

**Direção de produto e design · 17/11/2026 · proposta para as próximas etapas**

Este documento complementa o [plano original](PLANO_DA_PRA_IR.md). Em decisões de experiência e funcionalidade, esta atualização tem precedência. Permanecem o público, o recorte de Vila Mariana, os oito locais fictícios, a stack, a persistência, as regras de validade, a acessibilidade e a entrega acadêmica. A estrutura técnica da etapa 1 será aproveitada.

**Direção visual atualizada:** adotar padrões familiares de aplicativos de serviço. O Swiss Design do plano original contribui com organização, alinhamento e clareza; a composição das telas e os controles seguem a base mobile da seção 5. A identidade da marca aparece nas cores, nas imagens e no percurso da visita.

## 1. A ideia que organiza o app

**Dá Pra Ir? é um companheiro de preparação: a família conhece os passos da visita, monta seu roteiro e leva esse roteiro consigo.**

Assinatura da marca: **“Antes de sair, conheça o caminho.”**

A funcionalidade que dá personalidade ao produto será a **pré-visita guiada**: uma sequência visual da chegada ao fim da consulta, que a pessoa pode percorrer antes de sair e consultar durante a visita. As informações da comunidade aparecem ligadas a cada momento desse percurso.

A jornada principal passa a ser:

**Escolher um local → conhecer os passos → preparar o roteiro → acompanhar a visita → contar como foi.**

O interesse vem de reconhecer o lugar, fazer escolhas e ver a preparação tomar forma. O usuário terá algo concreto para fazer e levar consigo desde a primeira jornada funcional.

## 2. O que a primeira versão revelou

As telas atuais explicam o que o produto poderá fazer. Expressões como “conhecer a estrutura do plano”, grandes blocos de apresentação e avisos repetidos ocupam o espaço da atividade principal. O mesmo formato de título, parágrafo e cartão se repete em quase toda a navegação.

A próxima implementação deve transformar essa apresentação em uso: selecionar, percorrer, marcar, retomar e contribuir. O texto de apoio aparece junto da decisão que precisa explicar. Uma tela de formulário preparada na etapa 1 não conta como funcionalidade entregue enquanto não aceitar uma escolha e preservar seu resultado.

## 3. Cinco experiências que dão vida ao produto

### 3.1. Seu jeito de ir

As preferências serão escolhas curtas sobre situações concretas. Exemplos de rótulos:

- “Preciso de uma entrada sem degraus.”
- “Menos ruído faz diferença.”
- “Uma espera com menos movimento ajuda.”
- “Quero conhecer as etapas antes de chegar.”

Cada opção tem um ícone, uma frase e um controle reconhecível de seleção. Organizar por mobilidade, ambiente e comunicação, mostrando um grupo de cada vez. Permitir voltar, editar e pular a configuração para explorar os locais.

Ao selecionar uma necessidade, atualizar um resumo curto: **“Vamos destacar informações sobre entrada e ruído.”** Depois de salvar, a mudança deve aparecer nas fichas. Seleções não podem desaparecer ao fechar o aplicativo.

Manter um perfil de preferências por instalação neste MVP. Não solicitar nome da criança, diagnóstico, documento, foto ou cadastro. Nenhuma seleção significa preferências ainda não definidas; não autoriza classificar um local como compatível.

### 3.2. Pré-visita guiada — a experiência principal

Na ficha do local, a ação principal será **“Ver o passo a passo”**. Ela abre uma sequência com cinco momentos, adaptados ao guia disponível:

| Momento | O que ajuda a entender |
| --- | --- |
| Chegar | Qual é o ponto de chegada e o que observar antes da entrada |
| Entrar | Como acessar a recepção e se orientar |
| Esperar | Como é o ambiente de espera e o que se sabe sobre movimento e ruído |
| Consultar | Quais etapas do atendimento foram descritas no guia |
| Sair | Como encerrar o percurso e voltar ao roteiro |

Cada passo mostra uma imagem ou pictograma, uma frase principal e até dois detalhes relevantes para as preferências escolhidas. Informações adicionais ficam em “Ver detalhes”. Oferecer **Anterior**, **Próximo** e **Ver todos os passos**, sem depender de gestos laterais.

Exemplo ilustrativo de um cartão: **“Primeiro, a recepção.”** Abaixo: “Segundo o guia, a recepção fica depois da entrada principal.” Uma observação sobre acesso aparece no mesmo cartão, quando houver evidência válida.

Uma ação **“Ver junto”** amplia a apresentação em passos, com frases diretas e menos controles secundários, para quem quiser mostrar o percurso a uma criança ou acompanhante. Entrar e sair desse modo deve ser simples. Essa apresentação mantém disponíveis os avisos importantes do passo.

Se uma etapa não foi descrita, mostrar **“Ainda não sabemos como é esta parte”** e oferecer uma pergunta para confirmar. Fotos ilustrativas não confirmam degraus, acesso, iluminação ou qualquer característica do estabelecimento. O guia apresenta a sequência registrada; não promete que a consulta acontecerá exatamente daquela forma.

**Momento que deve marcar a demonstração:** a pessoa escolhe o que importa para sua visita, abre os passos e encontra essas necessidades destacadas nos momentos relevantes.

### 3.3. Meu roteiro — a preparação vira algo utilizável

Ao terminar a pré-visita, oferecer **“Preparar minha visita”**. O formulário pede o local e, opcionalmente, data e horário. O roteiro reúne três blocos:

1. **O que já sabemos:** horário sugerido, entrada e cuidados, com justificativas curtas quando sustentados por dados válidos.
2. **O que falta confirmar:** perguntas derivadas das informações ausentes ou vencidas.
3. **O que quero levar ou fazer:** checklist editável de preparativos pessoais.

Quando a família informar um horário já marcado, preservá-lo no roteiro. Horários tranquilos servem como contexto para escolher um agendamento; não substituem o horário da consulta informado pela pessoa.

Transformar lacunas em próximos passos. Se o acesso não foi informado, por exemplo, acrescentar a pergunta **“A entrada tem degraus?”**. Se a informação sobre um elevador venceu, indicar o que precisa ser confirmado novamente. A recomendação permanece “Informação insuficiente” quando aplicável.

O checklist pode começar com até três sugestões de organização, como “Revisar o horário”, “Confirmar a entrada” e “Separar os itens que já fazem parte da nossa rotina”. Permitir adicionar, editar, concluir e remover itens. Não gerar orientações médicas ou presumir quais objetos uma criança precisa usar.

Exibir progresso concreto, como **“2 de 3 preparativos concluídos”**. Esse número representa apenas o checklist pessoal. Marcar um item não confirma uma característica do local nem resolve um aviso comunitário.

Salvar o roteiro e os preparativos em SQLite. Ao retornar, oferecer **“Continuar minha preparação”** no ponto em que a pessoa parou.

### 3.4. Agora vou — um modo útil durante a visita

Uma visita salva ganha a ação **“Agora vou”**. Ela abre uma tela de consulta rápida com o passo atual, a próxima etapa, os preparativos e os avisos relevantes.

O avanço acontece por ação explícita: **“Estou nesta etapa”**. Permitir voltar e escolher outra etapa. Não depender de GPS, detectar presença ou inferir que alguém foi atendido.

Separar os dois tipos de progresso:

- Avançar na pré-visita significa conhecer o guia.
- Avançar em “Agora vou” significa registrar manualmente o andamento da visita.

Ler todos os cartões não encerra uma visita. O encerramento exige **“Finalizar visita”**. A etapa atual deve sobreviver ao fechamento do app e aparecer em **“Retomar visita”**.

O modo deve funcionar com dados locais já carregados e imagens incluídas no projeto. Antes de sair, mostrar a data das informações e as pendências de confirmação. O funcionamento offline não torna um aviso mais recente do que sua última confirmação.

### 3.5. Como foi? — contribuir a partir do que acabou de acontecer

Depois do encerramento manual, mostrar **“Deu certo para vocês?”**, com as opções **“Deu certo”** e **“Tive dificuldade”**. O motivo é opcional. Permitir dispensar a pergunta e responder depois em Minhas visitas.

O local já vem preenchido. Se a pessoa relatar dificuldade, oferecer categorias como entrada, espera e comunicação, além de texto opcional. Uma barreira atual pode seguir para o formulário de aviso com esse contexto aproveitado.

O retorno geral da visita registra uma experiência. “Deu certo” não confirma automaticamente todos os recursos de acessibilidade. Confirmar ou resolver uma característica ou um aviso exige a ação específica prevista no plano original.

Depois de salvar, mostrar **“Relato salvo”** e o registro com sua data. A interface deve informar que a colaboração é simulada e que a contribuição fica neste aparelho. O MVP não pode sugerir publicação em uma rede de famílias que ainda não existe.

## 4. Como ficam as três abas

| Aba | Função na experiência |
| --- | --- |
| Explorar | Descobrir locais e iniciar uma preparação |
| Minhas visitas | Retomar preparativos, acompanhar a visita e responder como foi |
| Preferências | Ajustar o que o app deve destacar; título da página: “Preferências”, com “Seu jeito de ir” como apoio opcional |

### Explorar começa com uma ação

Mostrar um cabeçalho compacto, o bairro e, logo abaixo, a busca e os filtros. Na primeira utilização, oferecer **“Preparar uma visita”** em um bloco curto. A apresentação institucional fica em “Sobre o projeto”. A pessoa deve encontrar conteúdo útil sem passar por uma capa de apresentação.

Quando existir uma visita em andamento, colocá-la no primeiro bloco de conteúdo abaixo da busca, com o próximo passo e **“Retomar visita”**. Caso contrário, destacar a próxima visita com data futura ou o último planejamento sem data. Esse cartão é compacto; a lista completa continua em Minhas visitas.

Exemplo com uma visita já salva, a ser validado no celular:

```text
Dá Pra Ir?                    Vila Mariana · SP
[lupa  Buscar local                          ]
[Sem degraus] [Menos ruído] [Filtros]

Próxima visita
┌───────────────────────────────────────────┐
│ Nome do local fictício                    │
│ Data escolhida ou “Em planejamento”        │
│ 2 de 3 preparativos concluídos             │
│ [Continuar preparação]                    │
└───────────────────────────────────────────┘

Locais em Vila Mariana
[Foto] Nome do local                      >
       Demonstração · resumo relevante

Explorar       Minhas visitas       Preferências
```

Cada local mostra foto, nome, indicação de demonstração e um resumo curto relacionado às escolhas da pessoa. Expor uma razão importante e uma pendência quando houver. Ao abrir a ficha, o passo a passo ganha destaque; **Como é / Como foi / Como está** continuam acessíveis como seções de consulta, com detalhes sob demanda.

Os filtros precisam dizer o que selecionam. Um filtro de entrada sem degraus usa somente informações válidas que confirmem essa característica. Mostrar o resultado vazio com a possibilidade de revisar filtros e consultar locais sem informação suficiente, identificados como tal.

### Minhas visitas mostra continuidade

Organizar por **Em andamento**, **Planejadas** e **Concluídas**. Cada item leva à ação pertinente: retomar, preparar ou contar como foi. Mostrar somente os grupos que tiverem visitas.

No vazio, usar **“Sua próxima visita pode começar aqui”** e **“Escolher um local”**. Quando houver falha de carregamento, oferecer nova tentativa sem apagar o rascunho nem representar o erro como lista vazia.

## 5. Base de design: familiar, simples e consistente

**Objetivo: a pessoa reconhece onde está, o que pode tocar e qual é o próximo passo ao abrir uma tela.** A experiência combina cabeçalhos compactos, navegação inferior, busca, listas com fotos, campos rotulados e botões com hierarquia clara.

Usar como referência as convenções de navegação de [Apple HIG — Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) e [Android — padrões entre plataformas](https://developer.android.com/design/ui/mobile/guides/foundations/translate-designs). As medidas, cores e composições abaixo são decisões do Dá Pra Ir?, a validar em execução.

### 5.1. Estrutura de tela e navegação

- **Cabeçalho:** título curto e, em telas internas, controle de voltar na posição esperada. Títulos como “Preferências”, “Nova visita” e “Detalhes do local” identificam a tarefa. Uma frase de apoio é opcional.
- **Abas inferiores:** manter Explorar, Minhas visitas e Preferências sempre na mesma ordem nas três telas principais. Cada destino tem ícone e rótulo visíveis, inclusive quando está vazio.
- **Seleção da aba:** usar cor de destaque no ícone e no rótulo. Se houver fundo de seleção, limitar o destaque à área do ícone, com tratamento discreto. A barra deve ser percebida como navegação.
- **Telas internas:** detalhes, formulários e pré-visita usam navegação de pilha com retorno previsível. O botão Voltar, o gesto disponível no sistema e o retorno do Android respeitam o histórico. Ao voltar à lista, preservar busca, filtros e posição de rolagem quando aplicável.
- **Cabeçalho disponível:** manter o retorno acessível durante a rolagem. Retirar o grande bloco de “Voltar + subtítulo em caixa alta + título de apresentação” usado no esqueleto atual.
- **Padrões conhecidos:** lupa para busca, calendário para visitas, controles de ajuste para preferências, seta para voltar, marca de seleção para concluído e chevron para abrir detalhes. Ações importantes têm rótulo textual.

Manter os componentes e comportamentos apropriados de cada plataforma, com a mesma organização do conteúdo. A barra inferior não deve cobrir o último item nem a ação de um formulário.

### 5.2. Busca, filtros e cartões reconhecíveis

A busca aparece perto do topo de Explorar, com lupa, campo de entrada, texto **“Buscar local”** e controle para limpar quando houver conteúdo. Mostrar a quantidade de resultados e uma saída clara quando a busca não encontrar locais. A posição e o escopo da busca devem ser fáceis de reconhecer, conforme [Apple HIG — Searching](https://developer.apple.com/design/human-interface-guidelines/searching).

Filtros rápidos usam botões compactos com rótulos específicos, como **“Sem degraus”** e **“Menos ruído”**. O estado selecionado tem marca de seleção e aparência distinta. **“Filtros”** abre as opções adicionais, com **“Aplicar filtros”** e **“Limpar filtros”**. Evitar depender de uma faixa lateral parcialmente escondida para descobrir opções.

Usar uma lista vertical de locais. Cada cartão contém foto ou miniatura, nome, bairro, identificação de demonstração e um resumo relevante para as preferências. A área de abertura é clara e tem um único destino. A altura se adapta ao texto, com conteúdo compacto e espaçamento regular.

O cartão de uma visita contém nome do local, data ou “Em planejamento”, estado e a ação de continuidade. Um indicador **“2 de 3 preparativos”** só aparece quando existem itens. Cartões de resumo usam superfície branca, cantos arredondados e separação discreta; os grandes blocos de texto sobre fundos pastéis deixam de ser o padrão de toda a interface.

### 5.3. Tipografia, cores e espaçamento básicos

Manter Inter nos pesos Regular, Medium e SemiBold. Usar caixa normal nos títulos e nos controles. A escala base proposta é:

| Uso | Tamanho / entrelinha | Peso |
| --- | --- | --- |
| Título no cabeçalho | 20 / 28 | SemiBold |
| Nome do local ou título principal no conteúdo | 24 / 32 | SemiBold |
| Título de seção ou cartão | 18 / 24 | SemiBold |
| Texto, campo e botão | 16 / 24 | Regular ou SemiBold conforme a função |
| Informação complementar | 14 / 20 | Regular |
| Rótulo da aba | 12 / 16 | Medium |

Esses são tamanhos iniciais em unidades lógicas, com ampliação pela preferência do sistema. Reservar títulos maiores à apresentação “Ver junto”, quando útil. Permitir quebra de linha e crescimento dos componentes com fonte ampliada.

| Elemento | Direção proposta |
| --- | --- |
| Fundo geral | Marfim `#F7F5F0` |
| Cartões, campos e barra de navegação | Branco `#FFFFFF` |
| Ação principal e seleção | Verde `#2F6B4F`, com texto branco nos botões preenchidos |
| Texto principal | `#29332F` |
| Texto secundário | `#56625B` |
| Borda de campo | `#7B897F`; foco com destaque verde |
| Pastéis do plano original | Superfícies pequenas, avisos e apoio às etapas |
| Margens laterais no celular | 16; ampliar conforme o espaço disponível |
| Espaçamentos recorrentes | 8, 16 e 24 |
| Cantos | 12 para campos e botões; 16 para cartões; formato de cápsula nos filtros |
| Botão principal | Altura mínima de 52; crescer se o texto exigir |
| Área interativa mínima | 48 × 48, inclusive em ícones e controles compactos |

O verde proposto com texto branco tem contraste aproximado de 6,29:1; os textos principal e secundário ultrapassam 4,5:1 sobre branco e marfim. Conferir novamente os pares usados na implementação, incluindo os pastéis. Bordas decorativas e separadores podem ser suaves; o contorno e o foco de um campo precisam permitir reconhecer o controle.

O azul pode apoiar a pré-visita, a sálvia os preparativos, a lavanda os relatos e o pêssego as pendências. Usar a cor primária de ação de forma consistente entre as telas, mesmo quando a seção tem outro pastel. Estados continuam identificados por texto e ícone.

### 5.4. Botões e elementos que parecem tocáveis

Definir três tratamentos: **principal preenchido**, **secundário com contorno** e **ação textual**. Dar destaque a uma ação principal por tela ou etapa. Exemplos: “Salvar visita”, “Próximo passo” e “Aplicar filtros”. A hierarquia e os rótulos seguem as convenções de [Apple HIG — Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons).

Usar o mesmo tratamento para a mesma função ao longo do app. Um chevron indica abertura de detalhes em uma linha da lista; ele não é obrigatório em todo botão. Título, aviso e selo de estado devem ter aparência informativa. Elementos apresentados como controles precisam responder ao toque.

Prever estados normal, pressionado, focado, carregando e indisponível. Ao salvar, mostrar **“Salvando…”** e impedir envio duplicado. Em caso de falha, reativar a ação e preservar o preenchimento. A confirmação de salvamento aparece junto da atualização da tela, para que o resultado continue identificável após a mensagem desaparecer.

### 5.5. Formulários, seleções e checklist

- **Campos:** rótulo permanente acima do campo, valor ou exemplo dentro dele e ajuda curta quando necessária. Indicar “opcional” no rótulo quando for o caso.
- **Entrada:** usar teclado apropriado ao conteúdo e seletores familiares para data e horário. O teclado não cobre o campo em edição nem impede alcançar a ação de salvar.
- **Preferências:** opções independentes com caixas de seleção; tocar no texto também altera a escolha. Mostrar o estado selecionado claramente e concluir com “Salvar preferências”.
- **Configuração imediata:** interruptores servem para ajustes ligados/desligados que entram em vigor na hora, como a opção de animações.
- **Checklist:** caixa de seleção, texto e estado concluído na mesma linha. A pessoa pode desmarcar; editar ou remover exige uma ação identificável.
- **Validação:** mostrar a mensagem perto do campo e dizer como corrigir, por exemplo, “Informe uma data válida”. Manter foco e ordem de leitura coerentes.

Rótulos que continuam visíveis durante o preenchimento e teclados apropriados são referências de [Apple HIG — Text fields](https://developer.apple.com/design/human-interface-guidelines/text-fields). No app, os formulários devem pedir somente o necessário para a tarefa em curso.

### 5.6. Composição familiar para cada tarefa

| Tela | Composição a implementar |
| --- | --- |
| Explorar | Cabeçalho compacto, busca, filtros, resumo de visita quando existir e lista de locais com foto |
| Detalhes do local | Cabeçalho com retorno, foto, nome, resumo de compatibilidade, ação “Ver o passo a passo” e consulta a Como é / Como foi / Como está |
| Preferências | Grupos de opções com caixas de seleção e ação “Salvar preferências” |
| Nova visita | Local escolhido, campos de data e horário opcionais e ação “Salvar visita” |
| Pré-visita | Indicador textual “Passo 2 de 5”, imagem ou pictograma, descrição e controles Anterior / Próximo |
| Meu roteiro | Resumo da visita, pendências e lista de preparativos com caixas de seleção |
| Agora vou | Etapa atual em destaque, próxima etapa e botão explícito para registrar o avanço |
| Como foi | Duas opções claras de resposta e espaço opcional para motivo |

Na ficha, apresentar **Como é / Como foi / Como está** como seções selecionáveis com rótulos sempre visíveis. Em fonte ampliada, reorganizar os controles para caberem com legibilidade. Evitar acumular na abertura três blocos extensos de informações; mostrar o conteúdo da seção escolhida.

Quando uma ação precisar permanecer disponível, usar uma área inferior própria, com espaço reservado no conteúdo e respeito à área segura. Durante a edição, essa área acompanha o teclado ou entra na rolagem de forma acessível. Alturas fixas não podem cortar os controles na fonte ampliada.

### 5.7. Identidade e retorno das interações

O **ponto ligado a um caminho** permanece na marca e na indicação dos passos da visita. O progresso também aparece por escrito. O conjunto de pictogramas de entrada, recepção, espera, consulta e saída ajuda a reconhecer o percurso; busca, retorno, seleção e salvamento continuam usando controles conhecidos.

Manter estados de carregamento, erro, vazio e salvamento curtos e acionáveis, com componentes consistentes. Um aviso informativo pode ocupar uma linha ou um pequeno bloco; uma barreira relevante recebe destaque próximo da decisão que ela afeta.

Animações podem acompanhar mudanças iniciadas pelo usuário, respeitando redução de movimento e uma opção para desativá-las. Toda a jornada deve funcionar sem animação, reprodução automática de áudio ou avanço automático dos passos.

### 5.8. Aplicação nos componentes existentes

Na próxima implementação, ajustar primeiro os componentes compartilhados para que o padrão alcance todas as telas:

| Componente | Alteração de design prevista |
| --- | --- |
| `Screen` | Separar cabeçalho e conteúdo; tornar subtítulo e texto de apoio opcionais; ajustar margens e densidade |
| `AppTabBar` | Três destinos estáveis, ícone e rótulo, seleção discreta e adaptação à fonte ampliada |
| `Action` | Tratamentos principal, secundário e textual, com estados coerentes e alturas flexíveis |
| Busca e filtros | Componentes reutilizáveis com entrada, limpeza, seleção e rótulos visíveis |
| Cartões de local e visita | Estrutura compacta com hierarquia de nome, contexto, estado e continuidade |
| Campos e linhas de seleção | Rótulo, controle, foco, erro e área completa de toque padronizados |

Reaproveitar React Native e a navegação existentes, preferindo controles nativos ou componentes que respeitem suas convenções. Aplicar a base nas primeiras telas funcionais e refinar os detalhes na etapa 4.

### 5.9. Voz do produto

| Momento | Texto de interface |
| --- | --- |
| Começar | “Vamos preparar a próxima visita?” |
| Abrir o guia | “Ver o passo a passo” |
| Destacar uma escolha | “Você pediu atenção ao ruído.” |
| Dado ausente | “Ainda falta confirmar a entrada.” |
| Retomar | “Seu roteiro está aqui.” |
| Salvar | “Visita salva. Você pode voltar a ela quando precisar.” |
| Registrar experiência | “Relato salvo.” |

Nos fluxos funcionais, substituir “conhecer a estrutura” e descrições de funcionalidades futuras pelas ações correspondentes. Manter uma indicação compacta e persistente de **demonstração**. Fotos e locais fictícios continuam identificados. Avisos específicos aparecem onde alteram uma decisão, sem repetir um grande texto geral em toda tela.

## 6. A resposta para “dá pra ir?” continua explicável

Preservar exatamente os três resultados do plano original. Para as necessidades selecionadas, aplicar esta precedência:

1. **Há barreiras:** existe evidência válida de ao menos uma condição que contraria uma necessidade selecionada.
2. **Informação insuficiente:** não há barreira confirmada para essas escolhas, mas falta informação válida sobre alguma delas, ou nenhuma preferência foi definida.
3. **Compatível com suas preferências:** todas as necessidades selecionadas têm informação válida favorável e nenhuma barreira conhecida correspondente.

Mostrar as razões e os limites. “Compatível” se refere às preferências avaliadas, com base nas informações disponíveis; não garante que toda a experiência será acessível. Uma visita com barreira e lacunas deve mostrar ambas, mesmo tendo “Há barreiras” como resultado principal.

Avisos duram 24 horas; guias e relatos, 90 dias, conforme o plano original. Informações expiradas continuam no histórico, identificadas como desatualizadas, e não sustentam recomendações. A expiração de um aviso não significa que a barreira foi resolvida.

Ao reabrir uma visita salva, reavaliar a validade das informações que sustentam o roteiro. Preservar os preparativos concluídos e destacar recomendações que precisem de revisão. Guardar as preferências usadas na criação da visita; oferecer aplicação explícita de novas preferências quando elas mudarem.

## 7. Exemplo de uma jornada que vale demonstrar

Uma pessoa seleciona entrada sem degraus e menos ruído. Escolhe um dos locais fictícios e abre a pré-visita. O passo da entrada traz uma condição descrita no guia; o passo da espera tem informação sensorial vencida.

A ficha mostra **“Informação insuficiente”** e explica a lacuna. Ao preparar a visita, o roteiro cria uma pergunta sobre a espera e permite montar os preparativos. A pessoa marca um item, fecha o app e encontra o roteiro preservado ao voltar.

Na visita, abre “Agora vou” e registra manualmente que está na recepção. Depois de finalizar, informa que teve dificuldade na espera. Esse retorno aparece no histórico com data; um aviso sobre a situação atual pode ser registrado separadamente.

Essa sequência deve ser inteiramente acionável. É o primeiro fluxo a implementar antes de expandir a variação dos oito locais.

## 8. Dados adicionais e limites de implementação

Manter React Native, TypeScript, Expo Router, SQLite e o SDK já validado. Reaproveitar as rotas existentes. Acrescentar somente as telas necessárias para a pré-visita e o acompanhamento, com sugestões de caminhos `/ensaio/[localId]` e `/acompanhar/[visitId]`.

| Informação | Regra de implementação |
| --- | --- |
| Passos por local | Ordem, título, descrição, pictograma, imagem opcional e vínculo com o guia que sustenta a informação |
| Características por passo | Associar condições sensoriais, acesso e avisos ao momento relevante; manter origem e validade |
| Visita | Data opcional, estado planejada/em andamento/concluída e preferências usadas no roteiro |
| Posição de leitura | Guardar separadamente da etapa atual da visita |
| Preparativos | Itens pessoais vinculados à visita, editáveis, com conclusão persistida |
| Pendências | Perguntas ligadas às informações ausentes ou vencidas, sem converter marcação pessoal em confirmação pública |
| Experiência | Resultado geral e motivo opcional; referências específicas quando houver uma contribuição sobre uma condição |

Adicionar tabelas e campos por migrações versionadas, sem apagar o que foi salvo. Consumir dados por `services`; manter SQL fora das telas. Preparação e acompanhamento devem continuar funcionando a partir do banco local.

Para o conteúdo inicial, prever uma foto ilustrativa local por estabelecimento e pictogramas reutilizáveis por etapa. Os oito locais precisam ter diferenças que mudem decisões: condições favoráveis, barreiras conhecidas, lacunas e informações vencidas. Não multiplicar o mesmo exemplo oito vezes nem criar dados apresentados como reais.

O MVP mantém o escopo de um bairro, um perfil por aparelho e colaboração simulada. Mapa geográfico com rotas acessíveis, integração com agenda, notificações, chat, vídeos, tour 360°, múltiplos perfis e backend compartilhado ficam para uma evolução posterior. O núcleo funciona sem IA generativa em execução.

## 9. Atualização das cinco etapas de execução

| Etapa original | Ajuste nesta direção | Entrega verificável |
| --- | --- | --- |
| 1. Estrutura | Aproveitar o projeto, padronizar cabeçalho, abas e controles compartilhados e revisar as entradas das novas tarefas. Fazer a troca dos textos de apresentação junto da funcionalidade correspondente. | Base familiar de navegação e componentes, com entrada para pré-visita e acompanhamento quando implementados |
| 2. Dados e persistência | Incluir passos por local, preparativos pessoais e estados da visita. Preparar os oito locais e as situações de validade. | Mock, migrações e carga única; dados e alterações preservados após reiniciar |
| 3. Jornada | Implementar primeiro o exemplo da seção 7 de ponta a ponta; depois completar a diversidade dos oito locais. | Escolhas mudam o destaque do guia; roteiro salva; checklist e etapa são retomados; contribuições atualizam dados e avaliação |
| 4. Refinamento | Aplicar a base de design familiar da seção 5, a identidade de percurso e os padrões de cada tarefa. Reservar aproximadamente um terço do esforço total ao acabamento, como previsto. | Busca, listas, formulários e estados consistentes, revisados em celular pequeno, fonte ampliada, redução de movimento e leitor de tela |
| 5. Validação e entrega | Acrescentar testes de retomada e distinção entre ler o guia, concluir preparativos e avançar na visita. Atualizar prints e vídeo. | Checks técnicos aprovados, jornada nativa verificada e documentação com evidências reais |

**Prioridade obrigatória:** pré-visita guiada, preferências aplicadas, roteiro com checklist, retomada em “Agora vou” e retorno após a visita.

**Acabamento adicional, se o núcleo estiver completo:** transições leves, refinamento dos pictogramas e apresentações extras do percurso. Ajustes de escopo não podem cortar persistência, estados de erro, indicação de demonstração, validade dos dados ou acessibilidade.

## 10. Critérios para considerar a mudança entregue

- A primeira tela oferece uma tarefa útil, e a família consegue começar sem ler uma apresentação institucional.
- A abertura de Explorar permite reconhecer o cabeçalho, encontrar a busca e ver o início de conteúdo útil em um celular de referência de 360 × 800, na fonte padrão. Na fonte ampliada, o conteúdo continua alcançável por rolagem.
- As três abas mantêm posição e rótulos; a aba atual é identificável e o retorno das telas internas preserva o contexto da navegação.
- Ações principais, secundárias, campos, cartões e seleções usam os mesmos padrões nas diferentes telas. Elementos informativos não aparentam ser botões.
- Campos mantêm rótulos visíveis durante o preenchimento e os erros explicam a correção necessária sem apagar os dados.
- As preferências alteram os destaques da ficha e dos passos; o efeito aparece na interface e pode ser explicado.
- O guia permite avançar, voltar e consultar todos os passos com botões e leitor de tela.
- Uma informação ausente produz uma pendência de confirmação; uma informação vencida deixa de sustentar a recomendação.
- O checklist aceita edição e preserva seus estados após fechar e reabrir o app.
- Ler o último passo do guia não conclui a visita; a etapa de acompanhamento muda somente por ação explícita.
- Uma visita em andamento pode ser retomada no mesmo ponto, com os preparativos preservados.
- Um retorno positivo geral não confirma automaticamente recursos de acessibilidade; um aviso vencido não aparece como resolvido.
- Os oito locais, imagens e relatos de carga inicial continuam identificados como demonstração.
- Fonte ampliada, rolagem, áreas seguras, teclado e controles de pelo menos 48 × 48 continuam funcionais. Texto normal mantém contraste mínimo de 4,5:1.
- As telas distinguem carregamento, erro, vazio e informação insuficiente; formulários preservam o preenchimento após falha recuperável.
- O roteiro funciona com dados locais, sem depender de animação, conta, GPS ou conexão durante o percurso.

Em uma rodada de avaliação, verificar se uma pessoa consegue explicar para que serve o app depois de usá-lo, encontrar a próxima ação e retomar sua preparação sem orientação externa. Essa avaliação é uma atividade pendente; não apresentar a proposta como validada com famílias.

## 11. Roteiro da apresentação acadêmica, até três minutos

| Tempo | Demonstração |
| --- | --- |
| 0:00–0:20 | Problema, público e proposta de conhecer os passos antes de sair |
| 0:20–0:45 | Preferências e escolha de um local fictício |
| 0:45–1:20 | Pré-visita, destaque personalizado e uma informação que falta confirmar |
| 1:20–1:55 | Roteiro, checklist e reabertura do app para demonstrar persistência |
| 1:55–2:20 | “Agora vou”, registro manual de etapa e retomada |
| 2:20–2:45 | Encerramento, relato e atualização visível no histórico |
| 2:45–3:00 | Dados simulados, limitações e identificação da equipe |

Gravar somente funcionalidades concluídas. O link do vídeo permanece para preenchimento após a gravação, conforme o plano original. A data de entrega acadêmica continua a mesma.
