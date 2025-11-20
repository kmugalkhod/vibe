import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import React from 'react'

type Props = {}

const Page = async (props: Props) => {
  const users = await prisma.post.findMany()
  return (
    <div>{JSON.stringify(users)}</div>
  )
}

export default Page