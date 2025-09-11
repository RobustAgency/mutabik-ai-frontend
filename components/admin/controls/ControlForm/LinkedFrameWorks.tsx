"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { CustomMultiSelect } from '@/components/custom/CustomMultiSelect';
import { useFrameworks } from '@/hooks/admin/useFrameworks';

interface LinkedFrameworksProps {
    value: string[];
    onChange: (value: string[]) => void;
}

const LinkedFrameworks = ({ value, onChange }: LinkedFrameworksProps) => {
    const filters = useMemo(() => ({ per_page: 100 }), []);
    const { frameworks, loading } = useFrameworks(filters);
    const [frameworkOptions, setFrameworkOptions] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        if (frameworks && frameworks.length > 0) {
            const options = frameworks.map(framework => ({
                value: framework.id.toString(),
                label: `${framework.code} - ${framework.name}`
            }));
            setFrameworkOptions(options);
        }
    }, [frameworks]);

    return (
        <div className='space-y-2'>
            <Label>Linked Frameworks <span className='text-red-500'>*</span></Label>
            <CustomMultiSelect
                options={frameworkOptions}
                value={value}
                onChange={onChange}
                placeholder={loading ? "Loading frameworks..." : "Select frameworks"}
            />
        </div>
    );
};

export default LinkedFrameworks;