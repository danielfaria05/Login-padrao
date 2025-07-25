// Mapeamento de permissões por campo baseado no perfil Oracle
export interface FieldPermission {
  visible: boolean;
  editable: boolean;
}

export interface ProductPermissions {
  [fieldName: string]: FieldPermission;
}

// Mapeamento de permissões por perfil
export const FIELD_PERMISSIONS: Record<string, ProductPermissions> = {
  "1": { // Admin - acesso total
    codigoProduto: { visible: true, editable: true },
    descricao: { visible: true, editable: true },
    unidadeMedida: { visible: true, editable: true },
    categoria: { visible: true, editable: true },
    subcategoria: { visible: true, editable: true },
    marca: { visible: true, editable: true },
    preco: { visible: true, editable: true },
    precoPromocional: { visible: true, editable: true },
    estoque: { visible: true, editable: true },
    estoqueMinimo: { visible: true, editable: true },
    peso: { visible: true, editable: true },
    dimensoes: { visible: true, editable: true },
    codigoBarras: { visible: true, editable: true },
    fornecedor: { visible: true, editable: true },
    ncm: { visible: true, editable: true },
    cst: { visible: true, editable: true },
    aliquotaICMS: { visible: true, editable: true },
    aliquotaIPI: { visible: true, editable: true },
    origem: { visible: true, editable: true },
    ativo: { visible: true, editable: true },
    observacoes: { visible: true, editable: true }
  },
  "2": { // Operacional - acesso limitado
    codigoProduto: { visible: true, editable: false },
    descricao: { visible: true, editable: true },
    unidadeMedida: { visible: true, editable: true },
    categoria: { visible: true, editable: true },
    subcategoria: { visible: true, editable: true },
    marca: { visible: true, editable: true },
    preco: { visible: false, editable: false }, // Oculto
    precoPromocional: { visible: false, editable: false }, // Oculto
    estoque: { visible: true, editable: false },
    estoqueMinimo: { visible: true, editable: true },
    peso: { visible: true, editable: true },
    dimensoes: { visible: true, editable: true },
    codigoBarras: { visible: true, editable: true },
    fornecedor: { visible: true, editable: false },
    ncm: { visible: false, editable: false }, // Oculto
    cst: { visible: false, editable: false }, // Oculto
    aliquotaICMS: { visible: false, editable: false }, // Oculto
    aliquotaIPI: { visible: false, editable: false }, // Oculto
    origem: { visible: true, editable: false },
    ativo: { visible: true, editable: false },
    observacoes: { visible: true, editable: true }
  }
};

export const getFieldPermission = (userPermissions: string[], fieldName: string): FieldPermission => {
  // Usa a primeira permissão encontrada (pode ser expandido para múltiplas permissões)
  const permission = userPermissions[0] || "2";
  const fieldPermissions = FIELD_PERMISSIONS[permission];
  
  return fieldPermissions[fieldName] || { visible: false, editable: false };
};

export const canAccessProducts = (userPermissions: string[] | null | undefined): boolean => {
  // Verifica se o usuário tem permissão para acessar produtos
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  return userPermissions.some(p => p === "1" || p === "2");
};