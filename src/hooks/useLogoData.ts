import logoPaths from '@/public/logo-paths.json';

export function useLogoData() {
  return { data: logoPaths as Record<string, string>, loading: false, error: null };
}

