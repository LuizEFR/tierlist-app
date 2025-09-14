## Fase 1: Análise e Diagnóstico dos Problemas
- [x] Reiniciar a aplicação e fazer login
- [x] Acessar a página de criação de tierlist e verificar o comportamento do drag-and-drop
- [x] Identificar que os cards de produto têm poucas informações
- [ ] Acessar uma tierlist existente e verificar o erro de carregamento

## Fase 2: Aprimoramento do Card de Produto na Criação de Tierlist
- [x] Identificar o componente do card de produto no CreateTierList.tsx
- [x] Expandir a interface Product para incluir mais campos (marca, modelo, preço, avaliação, etc.)
- [x] Atualizar query do Supabase para buscar os novos campos
- [x] Criar componente ProductCard melhorado com mais informações visíveis
- [x] Substituir os cards antigos pelos novos em todas as seções (tiers e produtos não classificados)
- [x] Atualizar DragOverlay para usar o novo ProductCard

## Fase 3: Correção da Funcionalidade Drag-and-Drop
- [ ] Analisar o código responsável pelo drag-and-drop na página de criação de tierlist
- [ ] Identificar a causa do problema onde o produto não é associado ao tier
- [ ] Implementar a correção para que o produto seja corretamente associado ao tier e removido da lista de não classificados

## Fase 4: Correção do Erro de Carregamento de Tierlists Existentes
- [ ] Analisar o código da página de visualização de tierlist (TierListView.tsx ou TierListViewSimple.tsx)
- [ ] Identificar a causa do erro de carregamento
- [ ] Implementar a correção para que as tierlists existentes sejam carregadas corretamente

## Fase 5: Testes Finais e Entrega
- [ ] Testar a funcionalidade de drag-and-drop com os cards de produto aprimorados
- [ ] Testar o carregamento de tierlists existentes
- [ ] Testar a criação de uma nova tierlist e sua visualização
- [ ] Entregar a aplicação corrigida e melhorada

