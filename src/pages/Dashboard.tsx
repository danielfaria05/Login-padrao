import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, User, Package, ArrowDown, ArrowUp, BarChart3 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { canAccessProducts } from "@/lib/permissions";

const Dashboard = () => {
  const [permissoes, setPermissoes] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [nomeUsuario, setNomeUsuario] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há token no localStorage
    const storedToken = localStorage.getItem("token");
    const storedPermissoes = localStorage.getItem("permissoes");
    const storedNome = localStorage.getItem("nomeUsuario");

    if (!storedToken) {
      // Redirecionar para login se não houver token
      window.location.href = "/";
      return;
    }

    setToken(storedToken);
    setNomeUsuario(storedNome || "Usuário");
    
    if (storedPermissoes) {
      try {
        const parsedPermissoes = JSON.parse(storedPermissoes);
        console.log("Dashboard - Permissões carregadas do localStorage:", parsedPermissoes);
        setPermissoes(parsedPermissoes);
      } catch (error) {
        console.error("Erro ao parsear permissões:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("permissoes");
    localStorage.removeItem("nomeUsuario");
    
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-card p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Bem-vindo ao sistema {nomeUsuario}</p>
            </div>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </Button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Submenu - Cadastro de Produtos */}
          {canAccessProducts(permissoes) && (
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20"
              onClick={() => navigate('/produtos')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Cadastro de Produtos
                </CardTitle>
                <CardDescription>
                  Gerencie o cadastro de produtos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Consulte e mantenha as informações dos produtos do sistema.
                </p>
                <Button className="mt-4 w-full" variant="outline">
                  Acessar Módulo
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Submenu - Entradas */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDown className="h-5 w-5 text-green-600" />
                Entradas
              </CardTitle>
              <CardDescription>
                Controle de entradas de mercadorias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Registre e gerencie as entradas de produtos no estoque.
              </p>
              <Button className="mt-4 w-full" variant="outline">
                Acessar Módulo
              </Button>
            </CardContent>
          </Card>

          {/* Submenu - Saídas */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUp className="h-5 w-5 text-red-600" />
                Saídas
              </CardTitle>
              <CardDescription>
                Controle de saídas de mercadorias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Registre e gerencie as saídas de produtos do estoque.
              </p>
              <Button className="mt-4 w-full" variant="outline">
                Acessar Módulo
              </Button>
            </CardContent>
          </Card>

          {/* Submenu - Inventários */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Inventários
              </CardTitle>
              <CardDescription>
                Gestão de inventários e contagens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Realize contagens e ajustes de inventário do estoque.
              </p>
              <Button className="mt-4 w-full" variant="outline">
                Acessar Módulo
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;