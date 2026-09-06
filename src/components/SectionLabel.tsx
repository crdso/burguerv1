interface SectionLabelProps {
  index: string
  label: string
  align?: 'left' | 'right'
}

export function SectionLabel({ index, label, align = 'left' }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-3 ${align === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <span className="h-px w-10 bg-ember" aria-hidden="true" />
      <span className="font-body text-xs font-semibold uppercase tracking-widest2 text-ember">
        {index} — {label}
      </span>
    </div>
  )
}
