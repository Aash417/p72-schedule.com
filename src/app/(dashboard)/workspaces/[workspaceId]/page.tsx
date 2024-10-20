'use client';
import { useParams } from 'next/navigation';

export default function Page() {
   const { workspaceId } = useParams();

   return <div>workspace id: {workspaceId}</div>;
}
