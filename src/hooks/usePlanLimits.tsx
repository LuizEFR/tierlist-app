import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface PlanLimits {
  categories: number;
  products: number;
  parameters: number;
  tierlists: number;
}

interface UsageCounts {
  categories: number;
  products: number;
  parameters: number;
  tierlists: number;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  'standard': {
    categories: 2,
    products: 20,
    parameters: 6,
    tierlists: 2
  },
  'professional': {
    categories: 10,
    products: 50,
    parameters: 10,
    tierlists: 10
  },
  'master': {
    categories: 30,
    products: 50,
    parameters: 15,
    tierlists: 50
  }
};

export function usePlanLimits() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageCounts>({
    categories: 0,
    products: 0,
    parameters: 0,
    tierlists: 0
  });
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState<string>('standard');

  useEffect(() => {
    if (user) {
      fetchUsage();
      fetchUserTier();
    }
  }, [user]);

  const fetchUserTier = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user!.id)
        .single();

      if (error) throw error;
      setUserTier(data?.subscription_tier || 'standard');
    } catch (error) {
      console.error('Erro ao buscar tier do usuário:', error);
      setUserTier('standard');
    }
  };

  const fetchUsage = async () => {
    try {
      const [categoriesRes, productsRes, parametersRes, tierlistsRes] = await Promise.all([
        supabase
          .from('categories')
          .select('id', { count: 'exact' })
          .eq('user_id', user!.id),
        supabase
          .from('products')
          .select('id', { count: 'exact' })
          .eq('user_id', user!.id),
        supabase
          .from('parameters')
          .select('id', { count: 'exact' })
          .eq('user_id', user!.id),
        supabase
          .from('tier_lists')
          .select('id', { count: 'exact' })
          .eq('user_id', user!.id)
      ]);

      setUsage({
        categories: categoriesRes.count || 0,
        products: productsRes.count || 0,
        parameters: parametersRes.count || 0,
        tierlists: tierlistsRes.count || 0
      });
    } catch (error) {
      console.error('Erro ao buscar uso:', error);
    } finally {
      setLoading(false);
    }
  };

  const limits = PLAN_LIMITS[userTier] || PLAN_LIMITS['standard'];

  const canCreate = {
    categories: usage.categories < limits.categories,
    products: usage.products < limits.products,
    parameters: usage.parameters < limits.parameters,
    tierlists: usage.tierlists < limits.tierlists
  };

  const getUsagePercentage = (type: keyof UsageCounts): number => {
    return Math.round((usage[type] / limits[type]) * 100);
  };

  return {
    usage,
    limits,
    canCreate,
    userTier,
    loading,
    getUsagePercentage,
    refreshUsage: fetchUsage
  };
}