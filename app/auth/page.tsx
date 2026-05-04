import { Cpu } from "lucide-react" // Changed icon to represent AI/Computing
import { LoginForm } from "../components/login-form"

export default function LoginPage() {
  return (
    // Background: Deep Midnight Slate to feel modern and "Cloud-native"
    <div className="grid min-h-svh lg:grid-cols-2 bg-[#020617]">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-3 font-semibold text-slate-100 tracking-tight">
            {/* 
                Brand Icon: Using a high-energy Cyan gradient 
                Matches the speed of Groq and the reliability of AWS 
            */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-liner-to-br from-cyan-400 to-blue-600 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <Cpu className="size-5" />
            </div>
            <span className="text-xl"><span className="text-cyan-400">AI</span> MediaProcessor </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* The form will stand out against the dark background */}
            <LoginForm />
          </div>
        </div>
      </div>

      {/* 
          Right side: Dynamic Tech Background
          Replacing the fence/lock with an abstract "Neural Network" or "Data Flow" feel
      */}
      <div className="relative hidden lg:block overflow-hidden border-l border-slate-800">
        {/* 
            You can use a high-quality abstract tech image or a CSS gradient mesh.
            If you have a new background image, put it in /tech-bg.jpg 
        */}
        <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center brightness-[0.7] contrast-[1.2]" />
        
        {/* 
            Overlay: A deep blue-to-transparent gradient to make the 
            transition from the login form seamless 
        */}
        <div className="absolute inset-0 bg-linear-to-r from-[#020617] via-transparent to-[#020617]/20" />
        
        {/* Sub-text for the branding side */}
        <div className="absolute bottom-10 left-10 right-10">
          <blockquote className="space-y-2">
            <p className="text-lg text-slate-300 font-light leading-relaxed">
              "Experience lightning-fast document intelligence powered by 
              <span className="text-cyan-400 font-medium"> Groq LPU™</span> and 
              <span className="text-blue-400 font-medium"> AWS Cloud</span>."
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  )
}