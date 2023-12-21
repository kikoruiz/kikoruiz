export function taggedPictures({
  tags,
  excludeTags = []
}: {
  tags: string[]
  excludeTags: string[]
}) {
  return function ({keywords}: {keywords: string[]}) {
    return (
      tags.some(tag => keywords.includes(tag)) &&
      keywords.every(keyword => !excludeTags.includes(keyword))
    )
  }
}
