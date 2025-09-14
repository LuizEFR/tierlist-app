-- Script para adicionar coluna liked_by na tabela tier_lists
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna liked_by como array de UUIDs
ALTER TABLE tier_lists 
ADD COLUMN IF NOT EXISTS liked_by UUID[] DEFAULT '{}';

-- Adicionar colunas likes e views se não existirem
ALTER TABLE tier_lists 
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Criar índice para performance na coluna liked_by
CREATE INDEX IF NOT EXISTS idx_tier_lists_liked_by ON tier_lists USING GIN (liked_by);

-- Atualizar valores existentes para garantir que não sejam NULL
UPDATE tier_lists 
SET 
  liked_by = COALESCE(liked_by, '{}'),
  likes = COALESCE(likes, 0),
  views = COALESCE(views, 0)
WHERE liked_by IS NULL OR likes IS NULL OR views IS NULL;

-- Verificar se as colunas foram criadas corretamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'tier_lists' 
AND column_name IN ('liked_by', 'likes', 'views');

