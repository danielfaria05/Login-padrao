import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CampoProduto } from "./CampoProduto";
import { apiRequest } from "@/lib/api";
import { Save, Loader2 } from "lucide-react";

interface ProdutoData {
  codigoProduto: string;
  descricao: string;
  unidadeMedida: string;
  categoria: string;
  subcategoria: string;
  marca: string;
  preco: string;
  precoPromocional: string;
  estoque: string;
  estoqueMinimo: string;
  peso: string;
  dimensoes: string;
  codigoBarras: string;
  fornecedor: string;
  ncm: string;
  cst: string;
  aliquotaICMS: string;
  aliquotaIPI: string;
  origem: string;
  ativo: boolean;
  observacoes: string;
}

interface ProdutoFormProps {
  userPermissions: string[];
  produtoData: ProdutoData;
  onDataChange: (data: ProdutoData) => void;
}

export const ProdutoForm = ({ userPermissions, produtoData, onDataChange }: ProdutoFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFieldChange = (fieldName: keyof ProdutoData, value: any) => {
    onDataChange({
      ...produtoData,
      [fieldName]: value
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(produtoData)
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Produto salvo com sucesso!"
        });
      } else {
        throw new Error("Erro ao salvar produto");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar o produto. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basicas" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basicas">Informações Básicas</TabsTrigger>
          <TabsTrigger value="comerciais">Comerciais</TabsTrigger>
          <TabsTrigger value="tecnicas">Técnicas</TabsTrigger>
          <TabsTrigger value="tributarias">Tributárias</TabsTrigger>
        </TabsList>

        <TabsContent value="basicas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados principais do produto</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CampoProduto
                fieldName="codigoProduto"
                label="Código do Produto"
                value={produtoData.codigoProduto}
                onChange={(value) => handleFieldChange("codigoProduto", value)}
                userPermissions={userPermissions}
                placeholder="Digite o código do produto"
              />
              <CampoProduto
                fieldName="descricao"
                label="Descrição"
                value={produtoData.descricao}
                onChange={(value) => handleFieldChange("descricao", value)}
                userPermissions={userPermissions}
                placeholder="Descrição do produto"
              />
              <CampoProduto
                fieldName="unidadeMedida"
                label="Unidade de Medida"
                value={produtoData.unidadeMedida}
                onChange={(value) => handleFieldChange("unidadeMedida", value)}
                userPermissions={userPermissions}
                type="select"
                options={[
                  { value: "UN", label: "Unidade" },
                  { value: "KG", label: "Quilograma" },
                  { value: "LT", label: "Litro" },
                  { value: "MT", label: "Metro" }
                ]}
              />
              <CampoProduto
                fieldName="categoria"
                label="Categoria"
                value={produtoData.categoria}
                onChange={(value) => handleFieldChange("categoria", value)}
                userPermissions={userPermissions}
                placeholder="Categoria do produto"
              />
              <CampoProduto
                fieldName="subcategoria"
                label="Subcategoria"
                value={produtoData.subcategoria}
                onChange={(value) => handleFieldChange("subcategoria", value)}
                userPermissions={userPermissions}
                placeholder="Subcategoria do produto"
              />
              <CampoProduto
                fieldName="marca"
                label="Marca"
                value={produtoData.marca}
                onChange={(value) => handleFieldChange("marca", value)}
                userPermissions={userPermissions}
                placeholder="Marca do produto"
              />
              <div className="md:col-span-2">
                <CampoProduto
                  fieldName="ativo"
                  label="Produto Ativo"
                  value={produtoData.ativo}
                  onChange={(value) => handleFieldChange("ativo", value)}
                  userPermissions={userPermissions}
                  type="switch"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comerciais" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Comerciais</CardTitle>
              <CardDescription>Preços e dados de vendas</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CampoProduto
                fieldName="preco"
                label="Preço"
                value={produtoData.preco}
                onChange={(value) => handleFieldChange("preco", value)}
                userPermissions={userPermissions}
                type="number"
                placeholder="0,00"
              />
              <CampoProduto
                fieldName="precoPromocional"
                label="Preço Promocional"
                value={produtoData.precoPromocional}
                onChange={(value) => handleFieldChange("precoPromocional", value)}
                userPermissions={userPermissions}
                type="number"
                placeholder="0,00"
              />
              <CampoProduto
                fieldName="estoque"
                label="Estoque Atual"
                value={produtoData.estoque}
                onChange={(value) => handleFieldChange("estoque", value)}
                userPermissions={userPermissions}
                type="number"
                placeholder="0"
              />
              <CampoProduto
                fieldName="estoqueMinimo"
                label="Estoque Mínimo"
                value={produtoData.estoqueMinimo}
                onChange={(value) => handleFieldChange("estoqueMinimo", value)}
                userPermissions={userPermissions}
                type="number"
                placeholder="0"
              />
              <CampoProduto
                fieldName="fornecedor"
                label="Fornecedor"
                value={produtoData.fornecedor}
                onChange={(value) => handleFieldChange("fornecedor", value)}
                userPermissions={userPermissions}
                placeholder="Nome do fornecedor"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tecnicas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Técnicas</CardTitle>
              <CardDescription>Especificações técnicas do produto</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CampoProduto
                fieldName="peso"
                label="Peso (kg)"
                value={produtoData.peso}
                onChange={(value) => handleFieldChange("peso", value)}
                userPermissions={userPermissions}
                type="number"
                placeholder="0,00"
              />
              <CampoProduto
                fieldName="dimensoes"
                label="Dimensões (cm)"
                value={produtoData.dimensoes}
                onChange={(value) => handleFieldChange("dimensoes", value)}
                userPermissions={userPermissions}
                placeholder="ex: 10x20x30"
              />
              <CampoProduto
                fieldName="codigoBarras"
                label="Código de Barras"
                value={produtoData.codigoBarras}
                onChange={(value) => handleFieldChange("codigoBarras", value)}
                userPermissions={userPermissions}
                placeholder="Código de barras"
              />
              <div className="md:col-span-2">
                <CampoProduto
                  fieldName="observacoes"
                  label="Observações"
                  value={produtoData.observacoes}
                  onChange={(value) => handleFieldChange("observacoes", value)}
                  userPermissions={userPermissions}
                  type="textarea"
                  placeholder="Observações adicionais sobre o produto"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tributarias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Tributárias</CardTitle>
              <CardDescription>Dados fiscais e tributários</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CampoProduto
                fieldName="ncm"
                label="NCM"
                value={produtoData.ncm}
                onChange={(value) => handleFieldChange("ncm", value)}
                userPermissions={userPermissions}
                placeholder="Código NCM"
              />
              <CampoProduto
                fieldName="cst"
                label="CST"
                value={produtoData.cst}
                onChange={(value) => handleFieldChange("cst", value)}
                userPermissions={userPermissions}
                placeholder="Código CST"
              />
              <CampoProduto
                fieldName="aliquotaICMS"
                label="Alíquota ICMS (%)"
                value={produtoData.aliquotaICMS}
                onChange={(value) => handleFieldChange("aliquotaICMS", value)}
                userPermissions={userPermissions}
                type="number"
                placeholder="0,00"
              />
              <CampoProduto
                fieldName="aliquotaIPI"
                label="Alíquota IPI (%)"
                value={produtoData.aliquotaIPI}
                onChange={(value) => handleFieldChange("aliquotaIPI", value)}
                userPermissions={userPermissions}
                type="number"
                placeholder="0,00"
              />
              <CampoProduto
                fieldName="origem"
                label="Origem"
                value={produtoData.origem}
                onChange={(value) => handleFieldChange("origem", value)}
                userPermissions={userPermissions}
                type="select"
                options={[
                  { value: "0", label: "Nacional" },
                  { value: "1", label: "Estrangeira - Importação direta" },
                  { value: "2", label: "Estrangeira - Adquirida no mercado interno" }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="min-w-32">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Produto
            </>
          )}
        </Button>
      </div>
    </div>
  );
};