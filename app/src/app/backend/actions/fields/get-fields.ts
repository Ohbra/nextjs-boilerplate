"use server"

import { prisma } from "../../prisma/prisma"

export type Field = {
  id: string
  name: string
  slug: string
}

export interface PaginatedFieldsResponse {
  success: boolean
  fields: Field[]
  totalCount: number
  totalPages: number
  currentPage: number
  message?: string
}

export async function getFieldsFromTags(page = 1, limit = 10, searchQuery?: string): Promise<PaginatedFieldsResponse> {
  try {
    // Calculate offset
    const offset = (page - 1) * limit

    // Build where clause for search
    const whereClause = searchQuery?.trim()
      ? {
          tag_name: {
            contains: searchQuery.trim(),
            mode: "insensitive" as const,
          },
        }
      : {}

    // Get total count
    const totalCount = await prisma.tag.count({
      where: whereClause,
    })

    // Get paginated results
    const tags = await prisma.tag.findMany({
      where: whereClause,
      select: {
        tag_name: true,
      },
      orderBy: {
        tag_name: "asc",
      },
      skip: offset,
      take: limit,
    })

    const formattedFields: Field[] = tags.map((tag) => ({
      id: tag.tag_name,
      name: tag.tag_name,
      slug: tag.tag_name.toLowerCase().replace(/\s+/g, "-"),
    }))

    const totalPages = Math.ceil(totalCount / limit)

    return {
      success: true,
      fields: formattedFields,
      totalCount,
      totalPages,
      currentPage: page,
    }
  } catch (error) {
    console.error("Error fetching fields from tags:", error)
    return {
      success: false,
      message: "Failed to fetch fields",
      fields: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
    }
  }
}
