import { useState } from 'react';
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


const createFormSchema = (t: ReturnType<typeof useTranslations>) => {
  return z.object({
    username: z.string().min(1, t('form.username.required')),
    period: z.string().default('1month'),
    gridSize: z.string().default('5x5'),
    type: z.enum(['artists', 'albums']).default('albums'),
  });
};

export default function CollageForm() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const formSchema = createFormSchema(t);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      period: '1month',
      gridSize: '5x5',
      type: 'albums',
    },
  });

  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      
      const validateResponse = await fetch(`/api/fetch-data?username=${values.username}`);
      if (!validateResponse.ok) {
        const errorData = await validateResponse.json();
        throw new Error(errorData.error || t('errors.invalidUsername'));
      }

      
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
                  <FormControl>
                    <Input 
                      placeholder={t('form.username.placeholder')} 
                      {...field} 
                      className="bg-white/70 dark:bg-gray-800/70 border-0 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 h-11 rounded-xl"
                    />
                  </FormControl>
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
                      <SelectTrigger className="bg-white/70 dark:bg-gray-800/70 border-0 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 h-11 rounded-xl">
                        <SelectValue placeholder={t('form.type.label')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700">
                      <SelectItem 
                        value="albums"
                        className="focus:bg-indigo-50 dark:focus:bg-indigo-900/30 text-gray-800 dark:text-gray-200"
                      >
                        {t('form.type.options.albums')}
                      </SelectItem>
                      <SelectItem 
                        value="artists"
                        className="focus:bg-indigo-50 dark:focus:bg-indigo-900/30 text-gray-800 dark:text-gray-200"
                      >
                        {t('form.type.options.artists')}
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
                      <SelectTrigger className="bg-white/70 dark:bg-gray-800/70 border-0 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 h-11 rounded-xl">
                        <SelectValue placeholder={t('form.period.label')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700">
                      {PERIOD_OPTIONS.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className="focus:bg-indigo-50 dark:focus:bg-indigo-900/30 text-gray-800 dark:text-gray-200"
                        >
                          {t(`form.period.options.${option.value}`)}
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
                      <SelectTrigger className="bg-white/70 dark:bg-gray-800/70 border-0 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 h-11 rounded-xl">
                        <SelectValue placeholder={t('form.gridSize.label')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700">
                      {GRID_SIZE_OPTIONS.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className="focus:bg-indigo-50 dark:focus:bg-indigo-900/30 text-gray-800 dark:text-gray-200"
                        >
                          {t(`form.gridSize.options.${option.value}`)}
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