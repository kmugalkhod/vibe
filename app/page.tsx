

import { Button } from '@/components/ui/button'
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { trpc, getQueryClient } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ClientGreeting } from './api/trpc/[trpc]/client';

type Props = {}

const Page = async (props: Props) => {

  const queryClient = getQueryClient()

  void queryClient.prefetchQuery(trpc.hello.queryOptions({
    text : "Kunal Prefetch"
  }))
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <Suspense fallback={<p>Loading....</p>}>
          <ClientGreeting/>
        </Suspense>
      </div>
    </HydrationBoundary>
  )
}

export default Page