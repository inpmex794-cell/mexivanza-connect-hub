import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BusinessDirectory } from '@/components/business/business-directory';
import { BusinessSubmissionForm } from '@/components/business/business-submission-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Plus, Search } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export const BusinessDirectoryPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="directory" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="directory" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  {t('directory.browse_businesses', 'Explorar negocios')}
                </TabsTrigger>
                <TabsTrigger value="submit" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t('directory.add_business', 'Agregar negocio')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="directory">
                <BusinessDirectory />
              </TabsContent>

              <TabsContent value="submit">
                <BusinessSubmissionForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};