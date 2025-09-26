import { useState, useCallback } from 'react';
import { memberService, type Member, type UpdateMemberData } from '@/service/app/members';
import { toast } from 'react-toastify';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await memberService.getMembers();
      
      if (!response.error) {
        setMembers(response.data);
      } else {
        setError(response.message || 'Failed to fetch members');
        toast.error(response.message || 'Failed to fetch members');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch members';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMember = useCallback(async (userId: number, data: UpdateMemberData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await memberService.updateMember(userId, data);
      
      if (!response.error) {
        setMembers(prev => 
          prev.map(member => 
            member.id === userId ? response.data : member
          )
        );
        toast.success('Member updated successfully');
        return true;
      } else {
        setError(response.message || 'Failed to update member');
        toast.error(response.message || 'Failed to update member');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update member';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMember = useCallback(async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await memberService.deleteMember(userId);
      
      if (!response.error) {
        setMembers(prev => prev.filter(member => member.id !== userId));
        toast.success('Member deleted successfully');
        return true;
      } else {
        setError(response.message || 'Failed to delete member');
        toast.error(response.message || 'Failed to delete member');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete member';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    members,
    loading,
    error,
    fetchMembers,
    updateMember,
    deleteMember,
  };
};