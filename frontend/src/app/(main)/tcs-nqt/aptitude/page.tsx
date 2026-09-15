import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { NextStep } from '@/components/ui/next-step';

export default function AptitudePillarPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'TCS NQT', href: '/tcs-nqt' },
    { label: 'Aptitude', href: '/tcs-nqt/aptitude' },
  ];

  return (
    <div className="container mx-auto py-8">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-4xl font-bold mt-4">Quantitative Aptitude</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Master the quantitative aptitude section with our topic-wise guides, shortcuts, and practice questions.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {/* Placeholder - will link to specific topic pages */}
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold text-lg">Percentage</h2>
          <a href="/aptitude/percentage" className="text-primary hover:underline">Learn & Practice</a>
        </div>
      </div>

      <NextStep 
        label="Take Aptitude Mock Test" 
        href="/mock-tests/aptitude"
        description="Ready to test your aptitude? Take a timed mock test."
      />
    </div>
  );
}
