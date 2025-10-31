

import React from 'react';
import FrameworkTable from '@/components/admin/frameworks/createFramework/FrameworkTable';
import Breadcrumbs from '@/components/custom/Breadcrumbs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Page = () => {
  const breadcrumbItems = [
    { label: 'Frameworks' },
    { label: 'List' },
  ];

  return (
    <React.Fragment>
      <Breadcrumbs items={breadcrumbItems} />
      <div className='flex items-center justify-between mt-2 mb-10'>
        <h1 className="font-bold text-4xl text-neutral-900">Frameworks</h1>
        <Link href="/admin/compliance-library/frameworks/create">
          <Button
            className="px-6 py-2 rounded-lg"
          >
            Create Framework
          </Button>
        </Link>
      </div>
      <FrameworkTable />
    </React.Fragment>
  );
};

export default Page;
