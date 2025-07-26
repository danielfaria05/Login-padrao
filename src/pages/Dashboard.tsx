import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Shield, User, Package, ArrowDown, ArrowUp, BarChart3, Archive } from "lucide-react";
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

  const makeAuthenticatedRequest = async () => {
    try {
      const response = await apiRequest("/protected-route", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Requisição bem-sucedida",
          description: "Dados obtidos com sucesso!",
        });
        console.log("Dados:", data);
      } else {
        throw new Error("Erro na requisição");
      }
    } catch (error) {
      toast({
        title: "Erro na requisição",
        description: "Verifique sua conexão e tente novamente.",
        variant: "destructive",
      });
    }
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

          {/* Token Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Informações de Autenticação</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Token: {token ? "Ativo" : "Inativo"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Permissões: {Array.isArray(permissoes) && permissoes.length > 0 ? permissoes.join(", ") : "Nenhuma"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Exemplo de requisição autenticada */}
          <Card>
            <CardHeader>
              <CardTitle>Exemplo de Requisição</CardTitle>
              <CardDescription>
                Teste uma requisição autenticada para a API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={makeAuthenticatedRequest}
                className="w-full"
              >
                Fazer Requisição Protegida
              </Button>
            </CardContent>
          </Card>

          {/* Módulos baseados em permissões */}
          {Array.isArray(permissoes) && permissoes.includes("1") && (
            <Card>
              <CardHeader>
                <CardTitle>Módulo 1</CardTitle>
                <CardDescription>Disponível para permissão "1"</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Este módulo está disponível para você.
                </p>
              </CardContent>
            </Card>
          )}

          {Array.isArray(permissoes) && permissoes.includes("2") && (
            <Card>
              <CardHeader>
                <CardTitle>Módulo 2</CardTitle>
                <CardDescription>Disponível para permissão "2"</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Este módulo está disponível para você.
                </p>
              </CardContent>
            </Card>
          )}

          {Array.isArray(permissoes) && permissoes.includes("3") && (
            <Card>
              <CardHeader>
                <CardTitle>Módulo 3</CardTitle>
                <CardDescription>Disponível para permissão "3"</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Este módulo está disponível para você.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;