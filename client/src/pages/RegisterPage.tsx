import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { registerSchema, type RegisterSchema } from "@/schemas/auth.schemas";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/PasswordInput";
import { toast } from "sonner";

function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterSchema) {
    try {
      const response = await authService.register(
        data.name,
        data.email,
        data.password,
      );
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    } catch {
      toast.error("Erro ao criar conta. Tente novamente.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      {/* ── Espaço sideral: ponto de luz no canto superior esquerdo + feixes radiais ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 28% 28% at 8% 10%, rgba(255,255,255,0.13) 0%, transparent 100%),
            radial-gradient(ellipse 55% 40% at 8% 10%, rgba(190,210,255,0.07) 0%, transparent 100%),
            conic-gradient(
              from 30deg at 8% 10%,
              transparent 0deg,
              rgba(200,220,255,0.04) 18deg,
              transparent 36deg,
              rgba(200,220,255,0.03) 54deg,
              transparent 72deg,
              rgba(200,220,255,0.025) 90deg,
              transparent 108deg,
              rgba(200,220,255,0.02) 126deg,
              transparent 144deg,
              transparent 360deg
            ),
            radial-gradient(ellipse 100% 100% at 85% 90%, rgba(10,10,20,0.4) 0%, transparent 70%)
          `,
        }}
      />

      <div className="relative w-full max-w-sm space-y-8">
        {/* Marca e título */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Study Platform</h1>
          <p className="text-sm text-muted-foreground">Crie sua conta</p>
        </div>

        {/* Card glassmorphism + form */}
        <div className="backdrop-blur-md bg-card/30 border border-border/40 rounded-2xl p-8 shadow-xl shadow-black/30 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                aria-invalid={!!errors.name}
                className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                aria-invalid={!!errors.email}
                className="bg-background/50 border-border/50 focus:bg-background transition-colors"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Senha
              </Label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Confirmar senha
              </Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="••••••••"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 size={15} className="mr-2 animate-spin shrink-0" />
              )}
              {isSubmitting ? "Cadastrando…" : "Criar conta"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Já tem conta?{" "}
            <Link
              to="/login"
              className="text-foreground font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
