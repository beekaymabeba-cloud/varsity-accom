import { NextResponse } from 'next/server'
import { prisma } from '../../../db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  
  try {
    const property = await prisma.property.findUnique({
      where: { id: resolvedParams.id },
      include: {
        campus: {
          include: {
            university: true
          }
        }
      }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}