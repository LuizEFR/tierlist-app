# Aplicação TierList

## Descrição
Esta é uma aplicação web para criação e gerenciamento de TierLists, permitindo aos usuários organizar e classificar itens em diferentes categorias. O projeto foi otimizado para melhor organização, remoção de arquivos desnecessários e atualização da documentação.

## Estrutura do Projeto
```
tierlist_app/
├── src/
│   ├── assets/             # Imagens e outros ativos estáticos
│   ├── components/         # Componentes React reutilizáveis
│   │   ├── layouts/        # Layouts de página
│   │   └── ui/             # Componentes de UI (shadcn/ui)
│   ├── data/               # Dados mockados ou de exemplo
│   │   └── mock/           # Dados de exemplo para desenvolvimento
│   ├── hooks/              # Hooks React personalizados
│   ├── integrations/       # Integrações com serviços externos (ex: Supabase)
│   ├── lib/                # Funções utilitárias
│   ├── pages/              # Páginas da aplicação
│   │   └── Dashboard/      # Páginas específicas do dashboard
│   ├── App.css             # Estilos globais da aplicação
│   ├── App.tsx             # Componente principal da aplicação (com Lazy Loading)
│   ├── index.css           # Estilos CSS principais (TailwindCSS)
│   ├── main.tsx            # Ponto de entrada da aplicação
│   └── vite-env.d.ts       # Definições de tipo para Vite
├── docs/                   # Documentação adicional do projeto (incluindo propostas de melhoria)
├── index.html              # Arquivo HTML principal
├── package.json            # Metadados e dependências do projeto
├── tailwind.config.ts      # Configuração do Tailwind CSS
├── tsconfig.json           # Configuração do TypeScript
├── vite.config.ts          # Configuração do Vite
└── README.md               # Este arquivo de documentação
```

## Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:
- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node.js) ou [Yarn](https://yarnpkg.com/) (alternativa ao npm)

## Instalação
1. Clone o repositório (se aplicável) ou navegue até o diretório do projeto:
   ```bash
   cd tierlist_app
   ```
2. Instale as dependências do projeto:
   ```bash
   npm install
   # ou
   yarn install
   ```

## Execução
Para iniciar a aplicação em modo de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta disponível).

## Melhorias Implementadas

*   **Lazy Loading de Rotas:** As rotas do dashboard agora utilizam `React.lazy` e `Suspense` para carregamento assíncrono, melhorando o tempo de carregamento inicial da aplicação.
*   **Funcionalidade de Exportação de Dados:** Adicionada uma funcionalidade básica de exportação de TierLists para JSON na página de gerenciamento de TierLists (`/dashboard/tierlists`).

## Exportação e Importação de Dados

### Exportação
Atualmente, a aplicação utiliza o Supabase para persistência de dados. Para exportar dados, você pode:
1. Acessar o painel do Supabase do seu projeto.
2. Navegar até a seção `Table Editor` ou `SQL Editor`.
3. Utilizar as opções de exportação de dados (CSV, JSON) fornecidas pelo Supabase para as tabelas relevantes (ex: `products`, `categories`, `tierlists`).
4. **No frontend:** Utilize o botão "Exportar Tierlists (JSON)" disponível na página `/dashboard/tierlists` para baixar um arquivo JSON com suas tierlists.

### Importação
Para importar dados para a aplicação, você pode:
1. Utilizar as funcionalidades de importação do painel do Supabase.
2. Inserir dados diretamente via `SQL Editor`.
3. Desenvolver um script ou funcionalidade na aplicação para consumir arquivos CSV/JSON e popular o banco de dados via API do Supabase. (Esta funcionalidade não está implementada por padrão e exigiria desenvolvimento adicional).

## Próximos Passos e Melhorias Sugeridas

Para continuar aprimorando a robustez, facilidade de execução e performance do projeto, considere as seguintes propostas detalhadas no arquivo `docs/propostas_melhoria.md`:

*   **Otimização da Estrutura de Pastas:** Organização por funcionalidade para projetos maiores.
*   **Otimização de Imagens:** Compressão, redimensionamento e lazy loading.
*   **Virtualização de Listas Longas:** Para melhorar a performance em listas com muitos itens.
*   **Testes Automatizados:** Implementação de testes unitários, de integração e E2E.
*   **Funcionalidade de Importação no Frontend:** Adicionar um componente de upload para importar dados.
*   **Otimização do Supabase:** Indexação de banco de dados, uso de Realtime e Row Level Security (RLS).

## Contribuição
Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades. Por favor, siga as diretrizes de contribuição (a serem definidas).

## Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE.md` para mais detalhes.

