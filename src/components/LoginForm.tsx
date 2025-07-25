import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, User, Lock } from "lucide-react";
import { apiRequest } from "@/lib/api";

interface LoginResponse {
  token: string;
  permissoes?: string[];
}

const LoginForm = () => {
  const [codigo, setCodigo] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ codigo?: string; senha?: string }>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { codigo?: string; senha?: string } = {};
    
    if (!codigo.trim()) {
      newErrors.codigo = "Código/usuário é obrigatório";
    }
    
    if (!senha.trim()) {
      newErrors.senha = "Senha é obrigatória";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiRequest("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo: codigo.trim(),
          senha: senha.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }

      const data: LoginResponse = await response.json();
      
      // Armazenar token no localStorage
      localStorage.setItem("token", data.token);
      
      // Armazenar permissões se disponíveis
      if (data.permissoes) {
        localStorage.setItem("permissoes", JSON.stringify(data.permissoes));
      }

      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
        variant: "default",
      });

      // Redirecionar para dashboard após 1 segundo
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);

    } catch (error) {
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-card">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <LogIn className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Bem-vindo
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codigo" className="text-sm font-medium text-foreground">
                Código/Usuário
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="codigo"
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className={`pl-10 ${errors.codigo ? 'border-destructive' : ''}`}
                  placeholder="Digite seu código ou usuário"
                  disabled={isLoading}
                />
              </div>
              {errors.codigo && (
                <p className="text-sm text-destructive">{errors.codigo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha" className="text-sm font-medium text-foreground">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className={`pl-10 ${errors.senha ? 'border-destructive' : ''}`}
                  placeholder="Digite sua senha"
                  disabled={isLoading}
                />
              </div>
              {errors.senha && (
                <p className="text-sm text-destructive">{errors.senha}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;