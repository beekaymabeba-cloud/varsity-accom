"use server"

import { prisma } from './db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProperty(formData: FormData) {
  // Extract data from the form
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseInt(formData.get('price') as string, 10)
  const gender = formData.get('gender') as string
  const imageUrl = formData.get('imageUrl') as string
  const campusId = formData.get('campusId') as string

  // Save to the database
  await prisma.property.create({
    data: {
      name,
      description,
      price,
      gender,
      imageUrl,
      campusId,
    },
  })

  // Refresh the cache so the new property shows up immediately
  revalidatePath(`/campus`)
  
  // Send the user back to the homepage after saving
  redirect('/')
}