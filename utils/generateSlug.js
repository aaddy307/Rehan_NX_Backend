export const generateSlug = async (text, Model) => {
  let baseSlug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')

  if (!Model) {
    return baseSlug
  }

  let slug = baseSlug
  let counter = 1

  while (await Model.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}