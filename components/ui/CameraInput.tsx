'use client'

interface Props {
  onCapture?: (file: File | null) => void
  preview?: string | null
}

export default function CameraInput({ onCapture, preview }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onCapture?.(file)
  }

  return (
    <div className="relative">
      <label
        htmlFor="camera-input"
        className="flex flex-col items-center justify-center w-full min-h-[160px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 cursor-pointer overflow-hidden transition-all hover:border-blue-400 hover:bg-blue-50 active:scale-[0.98]"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Foto capturada"
            className="h-full w-full object-cover absolute inset-0"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 py-6 text-slate-400">
            <span
              className="material-symbols-outlined text-[48px]"
              style={{ fontVariationSettings: `'FILL' 0` }}
            >
              photo_camera
            </span>
            <p className="text-sm font-semibold">Toque para tirar uma foto</p>
            <p className="text-xs opacity-70">Ajuda a localizar e priorizar seu pedido</p>
          </div>
        )}
      </label>
      <input
        id="camera-input"
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={handleChange}
      />
      {preview && (
        <button
          type="button"
          onClick={() => onCapture?.(null)}
          className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 backdrop-blur-sm"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  )
}
