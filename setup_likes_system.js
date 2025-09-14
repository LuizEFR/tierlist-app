const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupLikesSystem() {
  console.log('🔧 Configurando sistema de likes...');
  
  try {
    // 1. Verificar se a tabela tierlist_likes existe
    console.log('📋 Verificando tabela tierlist_likes...');
    
    const { data: likesData, error: likesError } = await supabase
      .from('tierlist_likes')
      .select('*')
      .limit(1);
    
    if (likesError && likesError.code === 'PGRST116') {
      console.log('❌ Tabela tierlist_likes não existe. Criando...');
      
      // Criar tabela tierlist_likes via SQL
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS tierlist_likes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            tierlist_id UUID NOT NULL REFERENCES tier_lists(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(tierlist_id, user_id)
          );
          
          -- Criar índices para performance
          CREATE INDEX IF NOT EXISTS idx_tierlist_likes_tierlist_id ON tierlist_likes(tierlist_id);
          CREATE INDEX IF NOT EXISTS idx_tierlist_likes_user_id ON tierlist_likes(user_id);
          
          -- Habilitar RLS (Row Level Security)
          ALTER TABLE tierlist_likes ENABLE ROW LEVEL SECURITY;
          
          -- Políticas de segurança
          CREATE POLICY "Users can view all likes" ON tierlist_likes FOR SELECT USING (true);
          CREATE POLICY "Users can insert their own likes" ON tierlist_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
          CREATE POLICY "Users can delete their own likes" ON tierlist_likes FOR DELETE USING (auth.uid() = user_id);
        `
      });
      
      if (createError) {
        console.error('❌ Erro ao criar tabela tierlist_likes:', createError);
      } else {
        console.log('✅ Tabela tierlist_likes criada com sucesso!');
      }
    } else {
      console.log('✅ Tabela tierlist_likes já existe!');
    }
    
    // 2. Verificar se as colunas likes e views existem na tabela tier_lists
    console.log('📋 Verificando colunas likes e views na tabela tier_lists...');
    
    const { data: tierListData, error: tierListError } = await supabase
      .from('tier_lists')
      .select('likes, views')
      .limit(1);
    
    if (tierListError) {
      console.log('❌ Colunas likes/views não existem. Adicionando...');
      
      const { error: alterError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE tier_lists 
          ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
          ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
        `
      });
      
      if (alterError) {
        console.error('❌ Erro ao adicionar colunas:', alterError);
      } else {
        console.log('✅ Colunas likes e views adicionadas!');
      }
    } else {
      console.log('✅ Colunas likes e views já existem!');
    }
    
    // 3. Criar funções RPC para incrementar/decrementar likes e views
    console.log('📋 Criando funções RPC...');
    
    const { error: rpcError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Função para incrementar likes
        CREATE OR REPLACE FUNCTION increment_likes(tierlist_id UUID)
        RETURNS void AS $$
        BEGIN
          UPDATE tier_lists 
          SET likes = COALESCE(likes, 0) + 1 
          WHERE id = tierlist_id;
        END;
        $$ LANGUAGE plpgsql;
        
        -- Função para decrementar likes
        CREATE OR REPLACE FUNCTION decrement_likes(tierlist_id UUID)
        RETURNS void AS $$
        BEGIN
          UPDATE tier_lists 
          SET likes = GREATEST(COALESCE(likes, 0) - 1, 0) 
          WHERE id = tierlist_id;
        END;
        $$ LANGUAGE plpgsql;
        
        -- Função para incrementar views
        CREATE OR REPLACE FUNCTION increment_views(tierlist_id UUID)
        RETURNS void AS $$
        BEGIN
          UPDATE tier_lists 
          SET views = COALESCE(views, 0) + 1 
          WHERE id = tierlist_id;
        END;
        $$ LANGUAGE plpgsql;
      `
    });
    
    if (rpcError) {
      console.error('❌ Erro ao criar funções RPC:', rpcError);
    } else {
      console.log('✅ Funções RPC criadas com sucesso!');
    }
    
    console.log('🎉 Sistema de likes configurado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar configuração
setupLikesSystem();

