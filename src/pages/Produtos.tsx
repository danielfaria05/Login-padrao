import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ProdutoForm } from "@/components/ProdutoForm";
import { canAccessProducts } from "@/lib/permissions";
import { apiRequest } from "@/lib/api";
import { Search, ArrowLeft, Loader2 } from "lucide-react";

interface ProdutoData {
  codprod?: string;
  codprodprinc?: string;
  numoriginal?: string;
  codfab?: string;
  descricao?: string;
  informacoestecnicas?: string;
  codfornec?: string;
  fornecedor?: string;
  codepto?: string;
  departamento?: string;
  codsec?: string;
  secao?: string;
  codmarca?: string;
  marca?: string;
  codncmex?: string;
  pesoliq?: number;
  pesobruto?: number;
  codauxiliartrib?: string;
  codauxiliar?: string;
  obs2?: string;
  alturam3?: number;
  larguram3?: number;
  comprimentom3?: number;
  tipoprod?: string;
  embalagemmaster?: string;
  descricao1?: string;
  descricao2?: string;
  descricao3?: string;
  dtexclusao?: string;
}

const Produtos = () => {
  const [permissoes, setPermissoes] = useState<string[]>([]);
  const [codigoBusca, setCodigoBusca] = useState("");
  const [produtoData, setProdutoData] = useState<ProdutoData>({});
  const [produtoCarregado, setProdutoCarregado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar autenticação e permissões
    const token = localStorage.getItem('token');
    const storedPermissoes = localStorage.getItem('permissoes');
    
    if (!token) {
      navigate('/');
      return;
    }

    if (storedPermissoes) {
      const parsedPermissoes = JSON.parse(storedPermissoes);
      setPermissoes(parsedPermissoes);
      
      // Verificar se tem permissão para acessar produtos
      if (!canAccessProducts(parsedPermissoes)) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar o cadastro de produtos.",
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }
    }
  }, [navigate, toast]);

  const buscarProduto = async () => {
    if (!codigoBusca.trim()) {
      toast({
        title: "Código necessário",
        description: "Digite um código de produto para buscar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest(`/produtos?codigo=${encodeURIComponent(codigoBusca)}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProdutoData(data);
        setProdutoCarregado(true);
        toast({
          title: "Produto encontrado",
          description: "Dados carregados com sucesso!"
        });
      } else if (response.status === 404) {
        // Produto não encontrado - carregar formulário vazio para novo produto
        setProdutoData({
          codprod: codigoBusca
        });
        setProdutoCarregado(true);
        toast({
          title: "Produto não encontrado",
          description: "Você pode cadastrar um novo produto com este código."
        });
      } else {
        throw new Error("Erro ao buscar produto");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao buscar o produto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      buscarProduto();
    }
  };

  const novoProduto = () => {
    setProdutoData({});
    setCodigoBusca("");
    setProdutoCarregado(false);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Cadastro de Produtos</h1>
              <p className="text-muted-foreground">
                Gerencie o cadastro de produtos do sistema
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={novoProduto}>
            Novo Produto
          </Button>
        </div>

        {/* Busca de Produto */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Produto</CardTitle>
            <CardDescription>
              Informe o código do produto para buscar ou criar um novo cadastro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="codigo">Código do Produto</Label>
                <Input
                  id="codigo"
                  value={codigoBusca}
                  onChange={(e) => setCodigoBusca(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite o código do produto"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={buscarProduto} disabled={isLoading} className="min-w-32">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário do Produto */}
        {produtoCarregado && (
          <ProdutoForm
            userPermissions={permissoes}
            produtoData={produtoData}
            onDataChange={setProdutoData}
          />
        )}
      </div>
    </div>
  );
};

export default Produtos;