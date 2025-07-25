import { useEffect, useState } from 'react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';

export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();
  const { user } = useUser();

  useEffect(() => {
    if (!client || !user) return;
    
    const loadCall = async () => {
      try {
        const callId = Array.isArray(id) ? id[0] : id;
        console.log('Loading call with ID:', callId);
        
        // First try to get existing call
        const { calls } = await client.queryCalls({ 
          filter_conditions: { id: callId } 
        });

        if (calls.length > 0) {
          console.log('Found existing call:', calls[0]);
          setCall(calls[0]);
        } else {
          // Create a new call if none exists
          console.log('No existing call found, creating new call');
          const newCall = client.call('default', callId);
          await newCall.create();
          console.log('Created new call:', newCall);
          setCall(newCall);
        }

        setIsCallLoading(false);
      } catch (error) {
        console.error('Error loading/creating call:', error);
        setIsCallLoading(false);
      }
    };

    loadCall();
  }, [client, id, user]);

  return { call, isCallLoading };
};
