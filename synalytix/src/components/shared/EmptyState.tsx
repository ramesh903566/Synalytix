interface EmptyStateProps {
  icon:        string    // Material Symbol name
  title:       string
  description: string
  action?:     { label: string; onClick: () => void }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">{icon}</span>
      <h3 className="font-semibold text-on-surface mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant max-w-xs mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary-container transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
