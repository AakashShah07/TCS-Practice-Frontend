import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { NextStep } from '@/components/ui/next-step';

export default function TCSNQTPillarPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'TCS NQT', href: '/tcs-nqt' },
  ];

  return (
    <div className="container mx-auto py-8">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-4xl font-bold mt-4">TCS NQT Preparation Guide</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Your complete guide to cracking the TCS NQT exam, from syllabus and pattern to topic-wise preparation.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Placeholder for content - will populate with actual links */}
        <div className="p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold">Core Subjects</h2>
          <ul className="mt-4 space-y-2">
            <li><a href="/tcs-nqt/aptitude" className="text-primary hover:underline">Quantitative Aptitude</a></li>
            <li><a href="/tcs-nqt/reasoning" className="text-primary hover:underline">Logical Reasoning</a></li>
            <li><a href="/tcs-nqt/verbal" className="text-primary hover:underline">Verbal Ability</a></li>
            <li><a href="/tcs-nqt/coding" className="text-primary hover:underline">Coding</a></li>
          </ul>
        </div>
      </div>

      <NextStep 
        label="View Preparation Strategy" 
        href="/tcs-nqt/preparation"
        description="Ready to start? Build your study plan with our preparation strategies."
      />
    </div>
  );
}
