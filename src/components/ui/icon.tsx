import { icons, type LucideProps } from "lucide-react"
import { memo } from "react"

interface IconProps extends LucideProps {
  name: string
  fallback?: string
}

const Icon = memo(({ name, fallback = "CircleAlert", ...props }: IconProps) => {
  const LucideIcon = icons[name as keyof typeof icons] || icons[fallback as keyof typeof icons]
  if (!LucideIcon) return null
  return <LucideIcon {...props} />
})

Icon.displayName = "Icon"
export default Icon
