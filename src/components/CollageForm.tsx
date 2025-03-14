import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PERIOD_OPTIONS, GRID_SIZE_OPTIONS } from '@/lib/lastfm';
import { sendGTMEvent } from '@next/third-parties/google'


// Helper function to safely get translations
const safeT = (t: ReturnType<typeof useTranslations>, key: string): string => {
  // This function helps bypass the TypeScript type checking for dynamic translation keys
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return t(key as any);
};

const createFormSchema = (t: ReturnType<typeof useTranslations>) => {
  return z.object({
    username: z.string().min(1, {
      message: safeT(t, 'form.username.required')
    }),
    period: z.string().default('7day'),
    gridSize: z.string().default('5x5'),
    type: z.enum(['artists', 'albums']).default('albums'),
  });
};

// Cookie helper functions
const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires}; path=/`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export default function CollageForm() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStoredUsername, setHasStoredUsername] = useState(false);
  
  // Form schema creation
  const formSchema = createFormSchema(t);
  
  // Create form with saved username if available
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      period: '7day',
      gridSize: '5x5',
      type: 'albums',
    },
  });

  // Function to clear stored username
  const clearStoredUsername = () => {
    // Clear from cookies
    document.cookie = 'lastfm_username=; max-age=0; path=/';
    
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lastfm_username');
    }
    
    // Reset form field
    form.setValue('username', '');
    setHasStoredUsername(false);
  };

  // Load the username from cookie when component mounts
  useEffect(() => {
    const savedUsername = getCookie('lastfm_username');
    if (savedUsername) {
      form.setValue('username', savedUsername);
      setHasStoredUsername(true);
    }
  }, [form]);
  
  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    sendGTMEvent({ event: 'generate_collage', value: { username: values.username, period: values.period, gridSize: values.gridSize, type: values.type } })
    
    setIsLoading(true);
    setError(null);

    try {
      // Validate username with API
      const validateResponse = await fetch(`/api/fetch-data?username=${values.username}`);
      if (!validateResponse.ok) {
        const errorData = await validateResponse.json();
        throw new Error(errorData.error || t('errors.invalidUsername'));
      }

      // Save username to cookie for 365 days
      setCookie('lastfm_username', values.username, 365);
      
      // Store in localStorage as backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastfm_username', values.username);
      }
      
      // Prepare URL parameters for collage page
      const params = new URLSearchParams({
        username: values.username,
        period: values.period,
        gridSize: values.gridSize,
        type: values.type,
      });

      router.push(`/${locale}/collage?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.generalError'));
      setIsLoading(false);
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="w-full p-6 md:p-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-200 font-medium">
                    {t('form.username.label')}
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        placeholder={t('form.username.placeholder')} 
                        {...field} 
                        className="bg-white/70 dark:bg-gray-800/70 border-0 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 h-11 rounded-xl text-gray-800 dark:text-gray-200"
                      />
                    </FormControl>
                    {hasStoredUsername && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5"
                      >
                        <button
                          type="button"
                          onClick={clearStoredUsername}
                          className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                          aria-label="Clear saved username"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </motion.div>
                    )}
                  </div>
                  <FormDescription className="text-gray-600 dark:text-gray-400">
                    {t('form.username.description')}
                  </FormDescription>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-200 font-medium">
                    {t('form.type.label')}
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-white/70 dark:bg-gray-800/70 border-0 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 h-11 rounded-xl text-gray-800 dark:text-gray-200">
                        <SelectValue placeholder={t('form.type.label')} className="text-gray-800 dark:text-gray-200" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700">
                      <SelectItem 
                        value="albums"
                        className="focus:bg-indigo-50 dark:focus:bg-indigo-900/30 text-gray-800 dark:text-gray-200"
                      >
                        {t('form.type.options.albums')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-200 font-medium">
                    {t('form.period.label')}
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-white/70 dark:bg-gray-800/70 border-0 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 h-11 rounded-xl text-gray-800 dark:text-gray-200">
                        <SelectValue placeholder={t('form.period.label')} className="text-gray-800 dark:text-gray-200" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700">
                      {PERIOD_OPTIONS.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className="focus:bg-indigo-50 dark:focus:bg-indigo-900/30 text-gray-800 dark:text-gray-200"
                        >
                          {safeT(t, `form.period.options.${option.value}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="gridSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-200 font-medium">
                    {t('form.gridSize.label')}
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-white/70 dark:bg-gray-800/70 border-0 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 h-11 rounded-xl text-gray-800 dark:text-gray-200">
                        <SelectValue placeholder={t('form.gridSize.label')} className="text-gray-800 dark:text-gray-200" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700">
                      {GRID_SIZE_OPTIONS.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className="focus:bg-indigo-50 dark:focus:bg-indigo-900/30 text-gray-800 dark:text-gray-200"
                        >
                          {safeT(t, `form.gridSize.options.${option.value}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-gray-600 dark:text-gray-400">
                    {t('form.gridSize.description')}
                  </FormDescription>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30"
            >
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </motion.div>
          )}

          <motion.div 
            variants={itemVariants}
            className="pt-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('common.processing')}
                </div>
              ) : (
                t('home.generateButton')
              )}
            </Button>
          </motion.div>
        </form>

       
   
      </Form>
    </motion.div>
  );
} 