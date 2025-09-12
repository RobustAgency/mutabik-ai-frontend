"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useOrganization } from '@/hooks/admin/useOrganization';
import { OrganizationMember } from '@/interfaces/Organization';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/utils/formatDate';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/custom/DataTable';
import Breadcrumbs from '@/components/custom/Breadcrumbs';
import ConfirmationDialog from '@/components/custom/ConfirmationDialog';
import { formatRole } from '@/utils/formatRole';

const OrganizationDetails: React.FC = () => {
    const params = useParams();
    const organizationId = Number(params.id);

    const { organization, loading, updating, updateOrganization } = useOrganization(organizationId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [editData, setEditData] = useState<{
        name: string;
        website: string;
        phone: string;
        country: string;
        is_active: boolean;
    }>({
        name: '',
        website: '',
        phone: '',
        country: '',
        is_active: true
    });

    React.useEffect(() => {
        if (organization) {
            setEditData({
                name: organization.name,
                website: organization.website || '',
                phone: organization.phone || '',
                country: organization.country,
                is_active: organization.is_active
            });
        }
    }, [organization]);

    // const handleSave = async () => {
    //     const success = await updateOrganization(editData);
    //     if (success) {
    //         setIsEditing(false);
    //     }
    // };

    // const handleCancel = () => {
    //     if (organization) {
    //         setEditData({
    //             name: organization.name,
    //             website: organization.website || '',
    //             phone: organization.phone || '',
    //             country: organization.country,
    //             is_active: organization.is_active
    //         });
    //     }
    //     setIsEditing(false);
    // };

    const handleToggleStatus = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirmToggle = async () => {
        if (!organization) return;

        try {
            const success = await updateOrganization({ is_active: !organization.is_active });
            if (success) {
                setShowConfirmDialog(false);
            }
        } catch (error) {
            console.error('Failed to update organization status:', error);
        }
    };

    const handleCloseDialog = () => {
        if (!updating) {
            setShowConfirmDialog(false);
        }
    };

    const memberColumns: ColumnDef<OrganizationMember>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <span className="pl-4 font-medium text-gray-900">{row.getValue('name')}</span>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => (
                <span className="text-gray-600">{row.getValue('email')}</span>
            ),
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => (
                <span className="text-gray-600">{formatRole(row.getValue('role'))}</span>
            ),
        },
        {
            accessorKey: 'created_at',
            header: 'Created At',
            cell: ({ row }) => {
                const createdAt = row.getValue('created_at') as string;
                return (
                    <p>
                        {createdAt ? formatDate(createdAt) : '-'}
                    </p>
                );
            },
        },
        // {
        //     id: 'actions',
        //     header: '',
        //     cell: ({ row }) => (
        //         <div className="flex items-center gap-2">
        //             <Button variant="ghost" size="sm">
        //                 <Eye className="w-4 h-4" />
        //                 View
        //             </Button>
        //             <Button variant="ghost" size="sm">
        //                 <Edit3 className="w-4 h-4" />
        //                 Edit
        //             </Button>
        //             <Button variant="ghost" size="sm">
        //                 <Trash2 className="w-4 h-4" />
        //                 Delete
        //             </Button>
        //         </div>
        //     ),
        // }
    ];

    const breadcrumbItems = [
        { label: 'Customers', href: '/admin/users-administration/customers' },
        { label: organization?.name || 'Loading...', href: '#' },
        { label: 'Edit', href: '#' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading organization details...</div>
            </div>
        );
    }

    if (!organization) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Organization not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className='w-full'>
                <Breadcrumbs items={breadcrumbItems} />
                <div className='w-full flex justify-between items-center flex-wrap'>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">{organization.name}</h1>
                    <Button
                        onClick={handleToggleStatus}
                        className={organization.is_active ? 'bg-red-400 hover:bg-red-500 duration-200' : 'bg-primary hover:bg-primary/90 duration-200'}
                        disabled={updating}
                    >
                        {organization.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                </div>

                {/* <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={handleCancel}>
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Organization
                        </Button>
                    )}
                </div> */}
            </div>

            {/* Organization Details Card */}
            <Card>
                <CardTitle className="flex items-center gap-2 text-lg font-bold px-6 border-b pb-4">
                    Organization Details
                </CardTitle>
                <CardContent className='px-5'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Organization Name</Label>
                                {isEditing ? (
                                    <Input
                                        id="name"
                                        value={editData.name}
                                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                                        className="mt-1"
                                    />
                                ) : (
                                    <div className="mt-2 text-gray-900 border border-[#E5E5E5] rounded-sm py-2 px-3">{organization.name}</div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="website">Website</Label>
                                {isEditing ? (
                                    <Input
                                        id="website"
                                        value={editData.website}
                                        onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                                        placeholder="https://example.com"
                                        className="mt-1"
                                    />
                                ) : (
                                    <div className="mt-2 text-gray-900 border border-[#E5E5E5] rounded-sm py-2 px-3">
                                        {organization.website ? (
                                            <a
                                                href={organization.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {organization.website}
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="phone">Contact Number</Label>
                                {isEditing ? (
                                    <Input
                                        id="phone"
                                        value={editData.phone}
                                        onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                                        className="mt-1"
                                    />
                                ) : (
                                    <div className="mt-2 text-gray-900 border border-[#E5E5E5] rounded-sm py-2 px-3">{organization.phone || '-'}</div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="country">Country</Label>
                                {isEditing ? (
                                    <Input
                                        id="country"
                                        value={editData.country}
                                        onChange={(e) => setEditData(prev => ({ ...prev, country: e.target.value }))}
                                        className="mt-1"
                                    />
                                ) : (
                                    <div className="mt-2 text-gray-900 border border-[#E5E5E5] rounded-sm py-2 px-3 capitalize">{organization.country}</div>
                                )}
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* Members Card */}
            <Card className='gap-0'>
                <CardHeader className='px-5'>
                    <CardTitle className='text-lg font-semibold '>
                        Members
                    </CardTitle>
                </CardHeader>
                <CardContent className='mt-0 py-0'>
                    {organization.members && organization.members.length > 0 ? (
                        <DataTable
                            columns={memberColumns}
                            data={organization.members}
                            loading={loading}
                        />
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No members found for this organization
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showConfirmDialog}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmToggle}
                title={`${organization.is_active ? 'Deactivate' : 'Activate'} Organization`}
                description={`Are you sure you want to ${organization.is_active ? 'deactivate' : 'activate'} "${organization.name}"? ${organization.is_active ? 'This will disable access for all members.' : 'This will restore access for all members.'}`}
                confirmText={organization.is_active ? 'Deactivate' : 'Activate'}
                cancelText="Cancel"
                type={organization.is_active ? 'danger' : 'success'}
                isLoading={updating}
                loadingText={organization.is_active ? 'Deactivating...' : 'Activating...'}
            />
        </div>
    );
};

export default OrganizationDetails;
