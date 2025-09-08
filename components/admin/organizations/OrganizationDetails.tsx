"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrganization } from '@/hooks/admin/useOrganization';
import { OrganizationMember } from '@/interfaces/Organization';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { formatDate } from '@/utils/formatDate';
import {
    Building2,
    Calendar,
    Users,
    ChevronLeft,
    Edit3,
    Save,
    X,
    Eye,
    Trash2
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/custom/DataTable';
import Breadcrumbs from '@/components/custom/Breadcrumbs';

interface OrganizationDetailsProps { }

const OrganizationDetails: React.FC<OrganizationDetailsProps> = () => {
    const params = useParams();
    const router = useRouter();
    const organizationId = Number(params.id);

    const { organization, loading, updateOrganization } = useOrganization(organizationId);

    const [isEditing, setIsEditing] = useState(false);
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

    const handleSave = async () => {
        const success = await updateOrganization(editData);
        if (success) {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        if (organization) {
            setEditData({
                name: organization.name,
                website: organization.website || '',
                phone: organization.phone || '',
                country: organization.country,
                is_active: organization.is_active
            });
        }
        setIsEditing(false);
    };

    const memberColumns: ColumnDef<OrganizationMember>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <span className="font-medium text-gray-900">{row.getValue('name')}</span>
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
            header: 'Roles',
            cell: ({ row }) => {
                const role = row.getValue('role') as string;
                return (
                    <Badge variant="light" color="info">
                        {role}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                        View
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                        Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </Button>
                </div>
            ),
        }
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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <Breadcrumbs items={breadcrumbItems} />
                        <h1 className="text-2xl font-bold text-gray-900 mt-2">{organization.name}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
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
                </div>
            </div>

            {/* Organization Details Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Organization Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
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
                                    <div className="mt-1 text-gray-900 font-medium">{organization.name}</div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="website">Email</Label>
                                {isEditing ? (
                                    <Input
                                        id="website"
                                        value={editData.website}
                                        onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                                        placeholder="https://example.com"
                                        className="mt-1"
                                    />
                                ) : (
                                    <div className="mt-1 text-gray-600">
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

                        {/* Right Column */}
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
                                    <div className="mt-1 text-gray-600">{organization.phone || '-'}</div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="country">Designation</Label>
                                {isEditing ? (
                                    <Input
                                        id="country"
                                        value={editData.country}
                                        onChange={(e) => setEditData(prev => ({ ...prev, country: e.target.value }))}
                                        className="mt-1"
                                    />
                                ) : (
                                    <div className="mt-1 text-gray-600">{organization.country}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="my-6 border-t border-gray-200"></div>

                    {/* Status and Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="status">Status</Label>
                            {isEditing ? (
                                <Switch
                                    id="status"
                                    checked={editData.is_active}
                                    onCheckedChange={(checked) => setEditData(prev => ({ ...prev, is_active: checked }))}
                                />
                            ) : (
                                <Badge variant="light" color={organization.is_active ? 'success' : 'error'}>
                                    {organization.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                                <div className="text-sm text-gray-500">Created</div>
                                <div className="text-sm font-medium">{formatDate(organization.created_at)}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                                <div className="text-sm text-gray-500">Last Updated</div>
                                <div className="text-sm font-medium">{formatDate(organization.updated_at)}</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Members Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Members
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {organization.members && organization.members.length > 0 ? (
                        <DataTable
                            columns={memberColumns}
                            data={organization.members}
                            searchKey="name"
                            searchPlaceholder="Search members..."
                            loading={loading}
                        />
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No members found for this organization
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default OrganizationDetails;
