import { FeedbackType } from '../types'

interface Props {
  type: FeedbackType
  text: string
  visible: boolean
}

const typeClasses: Record<FeedbackType, string> = {
  low:     'bg-[rgba(224,64,48,0.15)] border-red-dim text-[#ff8070]',
  high:    'bg-[rgba(240,112,48,0.15)] border-orange-dim text-orange',
  win:     'bg-[rgba(245,197,24,0.15)] border-amber-dim text-amber',
  lose:    'bg-[rgba(224,64,48,0.15)] border-red-dim text-[#ff8070]',
  timeout: 'bg-[rgba(120,80,60,0.2)] border-text-muted text-text-secondary',
  info:    'bg-card border-card-border text-text-secondary',
}

export default function FeedbackBox({ type, text, visible }: Props) {
  return (
    <div
      className={`min-h-[50px] px-[18px] py-[13px] rounded-xl text-center text-[15px] font-bold
        flex items-center justify-center gap-2 border transition-all duration-300
        ${typeClasses[type]}
        ${visible ? 'opacity-100 animate-feedbackPop' : 'opacity-0'}
      `}
    >
      <span>{text}</span>
    </div>
  )
}
