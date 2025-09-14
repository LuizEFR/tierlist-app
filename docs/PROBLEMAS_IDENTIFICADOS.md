# Problemas Identificados na Aplicação Tierlist

## Análise Realizada em 12/09/2025

### 1. Problemas de Relacionamento de Dados

#### 1.1 Produtos sem Categoria
- **Problema**: Todos os produtos aparecem como "Sem categoria" na listagem
- **Causa**: Possível problema no relacionamento entre tabelas `products` e `categories`
- **Impacto**: Dificulta a organização e filtragem de produtos

#### 1.2 Relacionamento tier_lists e profiles
- **Problema**: Mencionado no contexto herdado como problema de relacionamento
- **Necessário**: Verificar se o relacionamento está funcionando corretamente

### 2. Funcionalidades Funcionais (Parcialmente)

#### 2.1 Criação de Tierlist - FUNCIONANDO
- ✅ Formulário de criação carrega corretamente
- ✅ Dropdown de categorias funciona
- ✅ Produtos são carregados na seção "Produtos não classificados"
- ✅ Interface de tiers (S, A, B, C, D) é exibida

#### 2.2 Drag-and-Drop - PRECISA TESTE
- ❓ Funcionalidade implementada no código
- ❓ Precisa testar se funciona corretamente na prática

### 3. Funcionalidades Ausentes ou Incompletas

#### 3.1 Visualização de Tierlist
- **Problema**: TierListView.tsx mostra dados genéricos/hardcoded
- **Necessário**: Conectar com dados reais das tierlists criadas

#### 3.2 Sistema de Likes
- **Problema**: Funcionalidade não implementada completamente
- **Necessário**: Implementar persistência de likes no banco

#### 3.3 Contador de Views
- **Problema**: Não incrementa automaticamente
- **Necessário**: Implementar função de incremento de views

#### 3.4 Análise de Especialista
- **Problema**: Seção hardcoded, não permite input do usuário
- **Necessário**: Adicionar campos para análise personalizada

#### 3.5 Tag "Verified Review"
- **Problema**: Aparece sem propósito claro
- **Necessário**: Remover ou dar funcionalidade real

### 4. Melhorias Necessárias nos Formulários

#### 4.1 Formulário de Categorias
- **Necessário**: Adicionar campos extras para diversificar tipos de itens

#### 4.2 Formulário de Produtos
- **Necessário**: Adicionar campos extras para especificações técnicas

### 5. Problemas de Persistência

#### 5.1 Dados de Tierlist
- **Problema**: Precisa verificar se dados são salvos corretamente
- **Necessário**: Testar fluxo completo de criação → visualização

## Prioridades de Correção

1. **Alta**: Corrigir relacionamento produtos-categorias
2. **Alta**: Implementar drag-and-drop funcional
3. **Alta**: Conectar TierListView com dados reais
4. **Média**: Implementar likes e views funcionais
5. **Média**: Adicionar campos de análise de especialista
6. **Baixa**: Melhorar formulários com campos extras

