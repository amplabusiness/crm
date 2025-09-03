import { requireEnv, getEnv } from './env.js';

const BASE = getEnv('CNPJA_BASE_URL', 'https://api.cnpja.com.br');

export async function getCompany(cnpj) {
  const key = requireEnv('CNPJA_API_KEY');
  const url = `${BASE}/companies/${cnpj}`;
  const res = await fetch(url, { headers: { 'Authorization': `Bearer ${key}` } });
  if (!res.ok) throw new Error(`CNPJa ${res.status}`);
  return res.json();
}

export function mapCompanyToRows(data) {
  const cnpj = (data?.taxId || '').replace(/\D+/g, '');
  const info = {
    cnpj,
    razao_social: data?.name || null,
    nome_fantasia: data?.alias || null,
    natureza_juridica: data?.nature || null,
    cnae_principal: data?.mainActivity?.code || null,
    cnae_principal_desc: data?.mainActivity?.text || null,
    abertura: data?.foundedOn || null,
    situacao: data?.status || null,
    capital_social: data?.shareCapital || null,
    porte: data?.size || null,
  };
  const end = {
    cnpj,
    cep: data?.address?.zip || null,
    uf: data?.address?.state || null,
    municipio: data?.address?.city || null,
    bairro: data?.address?.district || null,
    logradouro: data?.address?.street || null,
    numero: data?.address?.number || null,
    complemento: data?.address?.details || null,
  };
  const simples = {
    cnpj,
    optante: data?.simple?.optant ?? null,
    desde: data?.simple?.since || null,
    mei_optante: data?.mei?.optant ?? null,
    mei_desde: data?.mei?.since || null,
  };
  const cnaes = (data?.secondaryActivities || []).map(a => ({
    cnpj,
    cnae: a?.code || null,
    descricao: a?.text || null,
  }));
  const socios = (data?.partners || []).map(p => ({
    cnpj,
    socio_doc: (p?.taxId||'').replace(/\D+/g,''),
    socio_nome: p?.name || null,
    tipo: p?.type || null,
    qualificacao: p?.position || null,
    pais: p?.country || null,
    entrada: p?.since || null,
  }));
  return { info, end, simples, cnaes, socios };
}
