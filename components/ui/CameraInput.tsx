'use client'

import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface Props {
  onCapture?: (file: File | null) => void
  preview?: string | null
}

export default function CameraInput({ onCapture, preview }: Props) {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Função para parar a câmera com segurança
  const stopCameraAPI = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
  }

  // Efeito para ligar a câmera assim que a UI do modal for montada
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function setupCamera() {
        if (!isCameraActive) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false
            });
            
            activeStream = stream;
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Força o play em dispositivos que bloqueiam autoplay sem interação
                try {
                    await videoRef.current.play();
                } catch (playError) {
                    console.error("Erro ao dar play no vídeo:", playError);
                }
            }
        } catch (err) {
            console.error("Erro ao acessar câmera:", err);
            toast.error("Permissão de câmera negada ou não disponível.");
            setIsCameraActive(false);
        }
    }

    setupCamera();

    return () => {
        if (activeStream) {
            activeStream.getTracks().forEach(t => t.stop());
        }
    }
  }, [isCameraActive]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (context) {
        // Usa as dimensões REAIS do vídeo sendo exibido
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' })
            onCapture?.(file)
            setIsCameraActive(false)
            stopCameraAPI()
          }
        }, 'image/jpeg', 0.8)
      }
    }
  }

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onCapture?.(file)
  }

  return (
    <div className="relative font-sans">
      {!isCameraActive ? (
        <div className="relative">
          <div
            onClick={(e) => {
                if (navigator.mediaDevices?.getUserMedia) {
                    e.preventDefault();
                    setIsCameraActive(true);
                }
            }}
            className="flex flex-col items-center justify-center w-full min-h-[160px] rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 cursor-pointer overflow-hidden transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.98] group"
          >
            {preview ? (
              <div className="absolute inset-0 w-full h-full animate-in fade-in duration-500">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Trocar Foto</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-6 text-slate-400">
                <div className="w-14 h-14 rounded-full bg-white dark:bg-white/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-sm">
                    <span
                    className="material-symbols-outlined text-[32px] text-primary"
                    style={{ fontVariationSettings: `'FILL' 1` }}
                    >
                    photo_camera
                    </span>
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white">Tirar Foto Agora</p>
                <p className="text-[10px] font-medium opacity-60">Toque para abrir a câmera</p>
              </div>
            )}
            
            <input
                id="camera-input-fallback"
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={handleManualChange}
            />
          </div>
          
          {preview && (
            <button
              type="button"
              onClick={() => {
                onCapture?.(null);
                stopCameraAPI();
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg active:scale-90 transition-transform z-10"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      ) : (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-between p-6 animate-in fade-in duration-300">
           <div className="w-full flex justify-between items-center text-white pt-4">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest tracking-[0.2em]">{preview ? 'Alterar Foto' : 'Capturar Local'}</span>
              </div>
              <button 
                type="button"
                onClick={() => { setIsCameraActive(false); stopCameraAPI(); }}
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-all backdrop-blur-md"
              >
                 <span className="material-symbols-outlined italic">close</span>
              </button>
           </div>

           <div className="relative w-full max-w-sm aspect-[3/4] rounded-[3.5rem] overflow-hidden bg-slate-900 border-2 border-white/20 shadow-2xl reveal-pop">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover"
              />
              {/* Overlay decorativo de foco */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-white/20">
                 <div className="w-32 h-32 border-2 border-dashed border-white/20 rounded-full" />
              </div>
           </div>

           <div className="w-full flex items-center justify-around pb-12">
              <div className="w-14 h-14" /> {/* Spacer */}
              
              <div className="relative p-2 rounded-full border-4 border-white/10">
                 <button 
                    type="button"
                    onClick={takePhoto}
                    className="w-20 h-20 rounded-full bg-white shadow-2xl active:scale-90 transition-all flex items-center justify-center group"
                  >
                      <div className="w-[88%] h-[88%] rounded-full border-2 border-black/5 group-hover:scale-95 transition-transform" />
                  </button>
              </div>

              <label htmlFor="manual-upload" className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-all cursor-pointer backdrop-blur-md border border-white/5">
                 <span className="material-symbols-outlined text-white">gallery_thumbnail</span>
                 <input 
                    id="manual-upload" 
                    type="file" 
                    accept="image/*" 
                    className="sr-only" 
                    onChange={(e) => {
                        handleManualChange(e);
                        setIsCameraActive(false);
                        stopCameraAPI();
                    }}
                 />
              </label>
           </div>
           
           <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  )
}
