import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CampoProduto } from "./CampoProduto";
import { apiRequest } from "@/lib/api";
import { Save, Loader2 } from "lucide-react";

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
                fieldName="codprod"
                label="Código do Produto"
                value={produtoData.codprod || ""}
                onChange={(value) => handleFieldChange("codprod", value)}
                userPermissions={userPermissions}
                placeholder="Digite o código do produto"
              />
              <CampoProduto
                fieldName="descricao"
                label="Descrição"
                value={produtoData.descricao || ""}
                onChange={(value) => handleFieldChange("descricao", value)}
                userPermissions={userPermissions}
                placeholder="Descrição do produto"
              />
              <CampoProduto
                fieldName="departamento"
                label="Departamento"
                value={produtoData.departamento || ""}
                onChange={(value) => handleFieldChange("departamento", value)}
                userPermissions={userPermissions}
                placeholder="Departamento do produto"
              />
              <CampoProduto
                fieldName="secao"
                label="Seção"
                value={produtoData.secao || ""}
                onChange={(value) => handleFieldChange("secao", value)}
                userPermissions={userPermissions}
                placeholder="Seção do produto"
              />
              <CampoProduto
                fieldName="marca"
                label="Marca"
                value={produtoData.marca || ""}
                onChange={(value) => handleFieldChange("marca", value)}
                userPermissions={userPermissions}
                placeholder="Marca do produto"
              />
              <CampoProduto
                fieldName="fornecedor"
                label="Fornecedor"
                value={produtoData.fornecedor || ""}
                onChange={(value) => handleFieldChange("fornecedor", value)}
                userPermissions={userPermissions}
                placeholder="Nome do fornecedor"
              />
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
                fieldName="numoriginal"
                label="Número Original"
                value={produtoData.numoriginal || ""}
                onChange={(value) => handleFieldChange("numoriginal", value)}
                userPermissions={userPermissions}
                placeholder="Número original"
              />
              <CampoProduto
                fieldName="codfab"
                label="Código Fabricante"
                value={produtoData.codfab || ""}
                onChange={(value) => handleFieldChange("codfab", value)}
                userPermissions={userPermissions}
                placeholder="Código do fabricante"
              />
              <CampoProduto
                fieldName="tipoprod"
                label="Tipo de Produto"
                value={produtoData.tipoprod || ""}
                onChange={(value) => handleFieldChange("tipoprod", value)}
                userPermissions={userPermissions}
                placeholder="Tipo do produto"
              />
              <CampoProduto
                fieldName="embalagemmaster"
                label="Embalagem Master"
                value={produtoData.embalagemmaster || ""}
                onChange={(value) => handleFieldChange("embalagemmaster", value)}
                userPermissions={userPermissions}
                placeholder="Embalagem master"
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
                fieldName="pesoliq"
                label="Peso Líquido (kg)"
                value={produtoData.pesoliq?.toString() || ""}
                onChange={(value) => handleFieldChange("pesoliq", parseFloat(value) || 0)}
                userPermissions={userPermissions}
                type="number"
                placeholder="0,00"
              />
              <CampoProduto
                fieldName="pesobruto"
                label="Peso Bruto (kg)"
                value={produtoData.pesobruto?.toString() || ""}
                onChange={(value) => handleFieldChange("pesobruto", parseFloat(value) || 0)}
                userPermissions={userPermissions}
                type="number"
                placeholder="0,00"
              />
              <CampoProduto
                fieldName="alturam3"
                label="Altura (m³)"
                value={produtoData.alturam3?.toString() || ""}
                onChange={(value) => handleFieldChange("alturam3", parseFloat(value) || 0)}
                userPermissions={userPermissions}
                type="number"
                placeholder="0,00"
              />
              <CampoProduto
                fieldName="larguram3"
                label="Largura (m³)"
                value={produtoData.larguram3?.toString() || ""}
                onChange={(value) => handleFieldChange("larguram3", parseFloat(value) || 0)}
                userPermissions={userPermissions}
                type="number"
                placeholder="0,00"
              />
              <CampoProduto
                fieldName="comprimentom3"
                label="Comprimento (m³)"
                value={produtoData.comprimentom3?.toString() || ""}
                onChange={(value) => handleFieldChange("comprimentom3", parseFloat(value) || 0)}
                userPermissions={userPermissions}
                type="number"
                placeholder="0,00"
              />
              <div className="md:col-span-2">
                <CampoProduto
                  fieldName="informacoestecnicas"
                  label="Informações Técnicas"
                  value={produtoData.informacoestecnicas || ""}
                  onChange={(value) => handleFieldChange("informacoestecnicas", value)}
                  userPermissions={userPermissions}
                  type="textarea"
                  placeholder="Informações técnicas do produto"
                />
              </div>
              <div className="md:col-span-2">
                <CampoProduto
                  fieldName="obs2"
                  label="Observações"
                  value={produtoData.obs2 || ""}
                  onChange={(value) => handleFieldChange("obs2", value)}
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
                fieldName="codncmex"
                label="NCM"
                value={produtoData.codncmex || ""}
                onChange={(value) => handleFieldChange("codncmex", value)}
                userPermissions={userPermissions}
                placeholder="Código NCM"
              />
              <CampoProduto
                fieldName="codauxiliartrib"
                label="Código Auxiliar Tributário"
                value={produtoData.codauxiliartrib || ""}
                onChange={(value) => handleFieldChange("codauxiliartrib", value)}
                userPermissions={userPermissions}
                placeholder="Código auxiliar tributário"
              />
              <CampoProduto
                fieldName="codauxiliar"
                label="Código Auxiliar"
                value={produtoData.codauxiliar || ""}
                onChange={(value) => handleFieldChange("codauxiliar", value)}
                userPermissions={userPermissions}
                placeholder="Código auxiliar"
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