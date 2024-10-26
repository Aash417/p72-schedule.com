import { useParams } from 'next/navigation';

export function useInviteCode() {
   const { inviteCode } = useParams();
   return inviteCode as string;
}
