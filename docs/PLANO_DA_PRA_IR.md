# Plano para o Codex — Dá Pra Ir?

Implemente um MVP mobile em português que ajude PCDs, pessoas autistas e famílias a planejar uma consulta antes de sair de casa. Recorte: um bairro de São Paulo e a jornada de levar uma criança às consultas. Execute as cinco etapas em sequência, verificando cada entrega; reserve aproximadamente um terço do esforço ao refinamento visual da etapa 4.

1. **Criar e estruturar o aplicativo.**

   Com Node.js LTS instalado, execute na pasta vazia:

   ```bash
   npx create-expo-app@latest da-pra-ir
   cd da-pra-ir
   npx expo install expo-sqlite expo-font
   npm install @expo-google-fonts/inter
   npx expo start
   ```

   Use React Native, TypeScript e Expo Router do template padrão; escolha um SDK compatível com o Expo Go do dispositivo e registre a versão no README. Organize `src/app`, `components`, `features`, `services`, `db` e `theme`. Remova as telas de exemplo e prepare abas Explorar, Minhas visitas e Preferências, com detalhes e formulários em rotas próprias. **Entrega:** app abrindo no celular e navegação conectada.

2. **Preparar os dados e a persistência.**

   Crie um serviço mock assíncrono, consumido por uma camada de serviços, com oito locais fictícios, fotos ilustrativas incluídas no projeto, etapas da visita, características sensoriais, horários tranquilos e relatos. Sinalize os dados como demonstração. Use SQLite para locais, preferências, visitas, relatos e avisos; faça migrações e carga inicial uma única vez, sem sobrescrever contribuições.

   Cada informação comunitária terá data de registro, última confirmação e validade: avisos de hoje duram 24 horas; guias e relatos, 90 dias. Datas iniciais devem ser relativas à primeira execução. Preserve o histórico; informação vencida aparece como desatualizada e deixa de sustentar recomendações. **Entrega:** dados carregados pelo mock e alterações preservadas após fechar e reabrir o app. A colaboração entre aparelhos fica simulada neste MVP.

3. **Desenvolver a jornada completa.**

   Implemente preferências sem pedir diagnóstico, busca e filtros, ficha com **Como é / Como foi / Como está**, geração de plano e visita salva. O plano cruza necessidades com informações válidas e explica horário, entrada e cuidados sugeridos. Use regras determinísticas e resultados “Compatível com suas preferências”, “Há barreiras” ou “Informação insuficiente”; nunca trate ausência de informação como acessibilidade confirmada.

   Após a visita, ofereça “Deu certo?” com um toque e motivo opcional. Permita registrar, confirmar e resolver avisos anônimos. Mostre histórico de barreiras com datas e quantidade de registros, sem inventar dias de indisponibilidade entre relatos. Inclua carregamento, erro com nova tentativa, vazio e confirmação de salvamento. **Entrega:** fluxo completo funcionando e atualizando o banco e o plano.

4. **Refinar com dedicação o Swiss Design.**

   Desenvolva uma identidade editorial própria: grid consistente, alinhamento à esquerda, hierarquia tipográfica clara, Inter, espaçamento em múltiplos de 8, margens generosas, divisórias finas e poucos elementos decorativos. Prefira listas bem compostas e blocos discretos; use animações leves e opcionais.

   | Uso | Cor |
   | --- | --- |
   | Fundo marfim | `#F7F5F0` |
   | Azul pastel | `#DDE8F1` |
   | Verde sálvia | `#DEE9DE` |
   | Lavanda | `#E8DFF0` |
   | Pêssego | `#F1DED2` |
   | Texto principal | `#29332F` |

   Aplique pastéis nas superfícies e acentos, mantendo texto escuro e contraste legível. Garanta texto normal com contraste mínimo de 4,5:1, controles reconhecíveis, alvos de toque de pelo menos 48 × 48, fontes ampliáveis, rótulos para leitores de tela e estados comunicados também por texto e ícone. Revise cada tela em celular pequeno e com fonte grande; trate safe areas, teclado e rolagem. **Entrega:** todas as telas e estados com acabamento consistente, após revisão visual e correções.

5. **Validar e preparar a entrega acadêmica.**

   Execute `npx tsc --noEmit`, `npm run lint` e `npx expo-doctor`, corrigindo problemas encontrados. Teste as regras de compatibilidade e validade, a persistência após reiniciar e a jornada em dispositivo/emulador; confira a navegação com TalkBack ou VoiceOver. Verifique listas fluidas, imagens dimensionadas e consultas SQLite assíncronas.

   Prepare o repositório para GitHub, com README contendo Ficha da CitizenTech, problema, público, solução, recorte, stack, dados simulados, regras de validade, limitações, instruções de execução e prints reais. Inclua roteiro de vídeo de até três minutos mostrando preferências, consulta, plano, relato e persistência; deixe o campo do link para preenchimento após a gravação, sem inventar evidências. **Entrega:** código organizado e documentação para enviar o link do GitHub por um integrante no Teams até **19/11, às 23h55**, conforme o enunciado.

Referências técnicas: [criação do projeto Expo](https://docs.expo.dev/more/create-expo/), [SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) e [acessibilidade de texto no React Native](https://reactnative.dev/docs/text).
