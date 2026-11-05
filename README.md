# IFCE Carreiras — Área do estudante v1.0

## Alterações desta versão
- A tela inicial é o feed de oportunidades, com modos Para você e Recentes.
- Removida a aba independente Explorar vagas.
- Removido o atalho de Minhas candidaturas do cabeçalho do feed.
- Navegação organizada em Home, Work e Line.
- Home contém Home e Meu perfil.
- WORK é um único item na barra lateral. Dentro dele, abas internas reúnem Minhas candidaturas, Meus estágios e Documentos.
- Line agrupa Rede acadêmica e Mensagens.
- Removido o card ilustrativo vazio de Meus estágios; o aviso institucional foi preservado.
- A navegação mobile apresenta Home, Work, Line e Perfil; Work e Line abrem o menu lateral para acessar suas páginas.

## Executar no Windows
1. Extraia o ZIP.
2. Abra a pasta do projeto no VS Code.
3. Execute `npm install`.
4. Execute `npm run dev`.
5. Execute `npm run build` para validar a compilação.

Dados de vagas, afinidade, perfil e candidaturas são demonstrativos. Não há backend conectado nem persistência real.


## Navegação e rotas

A navegação usa React Router (`react-router-dom`). Rotas implementadas:

- `/` — Home
- `/work/applications` — Work / Minhas candidaturas
- `/work/internships` — Work / Meus estágios
- `/work/documents` — Work / Documentos
- `/line/network` — Line / Rede acadêmica
- `/line/messages` — Line / Mensagens
- `/profile` — Meu perfil

Os títulos redundantes das telas internas de Work e Line foram removidos; as abas já identificam o conteúdo.


## v1.0 — Detalhes da vaga

### Nova tela
- `/jobs/:id` — Detalhes da vaga, acessada pelos botões de detalhes/oportunidade no feed e pelos itens de candidatura que permitem consultar a vaga.

### Alterações visuais
- Página dedicada com identificação da empresa, título, tipo, modalidade, localização e prazo.
- Seções de descrição, atividades, requisitos/competências e informações da oportunidade.
- Painel lateral de remuneração e ações, adaptado para telas menores.
- Mantida a identidade visual do feed e dos componentes existentes.

### Alterações funcionais
- Os links de detalhes agora atualizam a URL para `/jobs/:id`.
- A ação de salvar vaga utiliza o mesmo estado local do feed.
- A ação de candidatura reaproveita a regra demonstrativa já existente e permite navegar para Minhas candidaturas após o registro.
- A rota identifica a vaga pelo ID e redireciona para Home caso o ID não exista.

### Limites e pendências
- Dados continuam fictícios e locais; não há API ou persistência.
- Atividades e informações complementares são conteúdo demonstrativo, não requisitos oficiais de uma vaga real.
- A validação de elegibilidade, campus, vínculo, prazo e permissões deverá ocorrer no backend.
