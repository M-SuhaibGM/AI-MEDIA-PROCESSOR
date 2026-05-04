"use client"

import { useState, useEffect } from "react" // Added useEffect
import { useSession, signIn } from "next-auth/react" // Added useSession
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession() // Get session status
  const router = useRouter()

  // --- REDIRECT LOGIC START ---
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/") // Redirect to home/dashboard if already logged in
      router.refresh() // Optional: Ensures server components see the new session
    }
  }, [status, router])
  // --- REDIRECT LOGIC END ---

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      toast.error("Something went wrong during login");
      console.error(error);
      setIsLoading(false);
    }
  };

  // If session is loading, you might want to show a skeleton or nothing
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-slate-200 bg-white shadow-xl ring-1 ring-slate-900/5">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-slate-600 font-medium text-balance">
            Login with your Google account to access your documents
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                disabled={isLoading || status === "authenticated"} 
                className={cn(
                  "w-full py-7 text-lg font-bold transition-all duration-200",
                  "border-slate-300 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-900",
                  "shadow-sm hover:shadow-md active:scale-[0.98]",
                  (isLoading || status === "authenticated") && "opacity-80 cursor-not-allowed"
                )}
                onClick={handleLogin}
              >
                <div className="flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Image
                        src="/google.png"
                        height={24}
                        width={24}
                        alt="Google Icon"
                      />
                      <span>Continue with Google</span>
                    </>
                  )}
                </div>
              </Button>
            </div>

            <div className="text-center text-sm px-2">
              <p className="text-slate-500 font-medium leading-relaxed">
                By clicking continue, you agree to our{" "}
                <a href="#" className="text-slate-900 font-bold underline underline-offset-4 hover:text-[#c2a16d] transition-colors">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-slate-900 font-bold underline underline-offset-4 hover:text-[#c2a16d] transition-colors">
                  Privacy
                </a>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}