# Guia de Deployment - Formulário de Contacto

## Problemas Identificados e Soluções

### ✅ **Problemas Corrigidos:**

1. **API não integrada com Resend.com**
   - **Antes**: Retornava sucesso falso sem enviar email
   - **Agora**: Integração completa com Resend API

2. **Variáveis de ambiente não carregadas**
   - **Antes**: Código não carregava `.env.local`
   - **Agora**: Sistema automático de carregamento em desenvolvimento

3. **Typo no nome da empresa**
   - **Antes**: `"theSmoohPath <onboarding@resend.dev>"`
   - **Agora**: `"theSmoothPath <onboarding@resend.dev>"`

4. **Validação incompleta**
   - **Antes**: Validava apenas 3 campos
   - **Agora**: Valida todos os 6 campos do formulário

5. **Falta de logging**
   - **Antes**: Sem logs para debug
   - **Agora**: Logging detalhado em console

## Configuração para Produção (Vercel)

### 1. **Variáveis de Ambiente na Vercel**

No painel da Vercel (vercel.com), adicione estas variáveis:

```
RESEND_API_KEY=re_LbdLcyNv_M2UgBTiC31dAfiQeib2SFpXc
EMAIL_FROM="theSmoothPath <onboarding@resend.dev>"
EMAIL_TO_DEFAULT=luispintocosta@hotmail.com
```

**Localização no painel da Vercel:**
1. Vá ao seu projeto
2. Settings → Environment Variables
3. Adicione as variáveis acima

### 2. **Testar Localmente (se necessário)**

```bash
# Instalar dependências (se ainda não tiver)
npm install

# Fazer login na Vercel (interativo - abrirá browser)
npx vercel login

# Iniciar servidor de desenvolvimento
npm run dev
```

### 3. **Deploy para Produção**

```bash
# Deploy manual
npm run deploy

# Ou usar comando direto
npx vercel --prod
```

## Testes Realizados

### ✅ **Teste da API Resend:**
```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_LbdLcyNv_M2UgBTiC31dAfiQeib2SFpXc" \
  -H "Content-Type: application/json" \
  -d '{"from": "onboarding@resend.dev", "to": ["luispintocosta@hotmail.com"], "subject": "Test", "text": "Test email"}'
```
**Resultado**: ✅ Sucesso (email enviado)

### ✅ **Teste do Endpoint Local:**
```bash
curl -X POST http://localhost:3002/api/contact \
  -H "Content-Type: application/json" \
  -d '{"nome": "Teste", "email": "test@test.com", "mensagem": "Teste", "privacidade": true}'
```
**Resultado**: ✅ Sucesso (email enviado via Resend)

## Estrutura do Formulário

### Campos Enviados:
1. `nome` (obrigatório)
2. `email` (obrigatório, validado)
3. `empresa` (opcional)
4. `telefone` (opcional)
5. `mensagem` (obrigatório)
6. `privacidade` (obrigatório - checkbox)

### Respostas da API:
- **Sucesso (200)**: `{success: true, message: "...", emailId: "...", timestamp: "..."}`
- **Erro (400)**: `{error: "Mensagem de erro específica"}`
- **Erro (500)**: `{error: "Erro interno do servidor: ..."}`

## Monitorização

### Logs da Vercel:
```bash
# Ver logs de produção
npx vercel logs

# Ver logs específicos do endpoint
npx vercel logs /api/contact
```

### Dashboard da Resend:
- Aceda a https://resend.com/dashboard
- Veja emails enviados, entregues, falhas
- Monitorize a chave da API

## Troubleshooting

### Problema: "The specified token is not valid"
**Solução**: `npx vercel login` (interativo)

### Problema: Email não chega
**Verifique**:
1. Dashboard da Resend - email foi enviado?
2. Spam folder do destinatário
3. Logs da Vercel para erros

### Problema: Formulário mostra erro genérico
**Solução**: Ative debug no frontend (já está ativo):
- Abra console do browser (F12)
- Veja logs detalhados
- Verifique resposta da API na aba "Network"

## Segurança

### Chave da API:
- ✅ Armazenada em variáveis de ambiente
- ✅ Nunca commitada no código
- ✅ Acessível apenas no servidor

### Validação:
- ✅ Validação de email no servidor
- ✅ Campos obrigatórios validados
- ✅ Prevenção de XSS no conteúdo HTML

## Próximos Passos Opcionais

1. **Rate limiting** - Prevenir spam
2. **reCAPTCHA** - Adicionar verificação humana
3. **Template de email melhorado** - Design mais elaborado
4. **Notificação Slack/Teams** - Alertas de novos contactos
5. **Base de dados** - Armazenar contactos para CRM