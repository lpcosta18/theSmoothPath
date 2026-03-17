// Load environment variables for local development
if (process.env.NODE_ENV !== 'production') {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      for (const line of lines) {
        const trimmedLine = line.trim();
        // Skip comments and empty lines
        if (!trimmedLine || trimmedLine.startsWith('#')) continue;

        const equalsIndex = trimmedLine.indexOf('=');
        if (equalsIndex !== -1) {
          const key = trimmedLine.substring(0, equalsIndex).trim();
          let value = trimmedLine.substring(equalsIndex + 1).trim();

          // Remove surrounding quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.substring(1, value.length - 1);
          }

          if (key && !process.env[key]) {
            process.env[key] = value;
          }
        }
      }
      console.log('📁 Loaded environment variables from .env.local');
      console.log('🔑 RESEND_API_KEY available:', !!process.env.RESEND_API_KEY);
    }
  } catch (error) {
    console.warn('⚠️ Could not load .env.local:', error.message);
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📧 Contact form submission received');

    // Get all form data
    const { nome, email, empresa, telefone, mensagem, privacidade } = req.body;

    // Validate required fields
    if (!nome || !email || !mensagem || !privacidade) {
      const missing = [];
      if (!nome) missing.push('nome');
      if (!email) missing.push('email');
      if (!mensagem) missing.push('mensagem');
      if (!privacidade) missing.push('privacidade');

      console.error('❌ Missing required fields:', missing);
      return res.status(400).json({
        error: `Campos obrigatórios em falta: ${missing.join(', ')}`
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email);
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    console.log('✅ Form validation passed');
    console.log('📋 Form data:', {
      nome: nome.substring(0, 20) + '...',
      email,
      empresa: empresa || 'Não especificada',
      telefone: telefone || 'Não especificado',
      mensagem: mensagem.substring(0, 50) + '...'
    });

    // Get environment variables
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const EMAIL_FROM = process.env.EMAIL_FROM || 'theSmoothPath <onboarding@resend.dev>';
    const EMAIL_TO_DEFAULT = process.env.EMAIL_TO_DEFAULT || 'luispintocosta@hotmail.com';

    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'Configuração do servidor incompleta' });
    }

    console.log('🔑 Resend API key found, preparing email...');

    // Prepare email data for Resend
    const emailData = {
      from: EMAIL_FROM,
      to: [EMAIL_TO_DEFAULT],
      subject: `Novo contacto de ${nome} - theSmoothPath`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #592112;">Novo Contacto - theSmoothPath</h2>
          <div style="background-color: #faf0e6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Empresa:</strong> ${empresa || 'Não especificada'}</p>
            <p><strong>Telefone:</strong> ${telefone || 'Não especificado'}</p>
            <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-PT')}</p>
          </div>
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
            <h3 style="color: #f7710e;">Mensagem:</h3>
            <p style="white-space: pre-wrap;">${mensagem}</p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
            <p>Este email foi enviado automaticamente através do formulário de contacto do site theSmoothPath.</p>
          </div>
        </div>
      `,
      text: `
        NOVO CONTACTO - theSmoothPath

        Nome: ${nome}
        Email: ${email}
        Empresa: ${empresa || 'Não especificada'}
        Telefone: ${telefone || 'Não especificado'}
        Data/Hora: ${new Date().toLocaleString('pt-PT')}

        MENSAGEM:
        ${mensagem}

        ---
        Este email foi enviado automaticamente através do formulário de contacto do site theSmoothPath.
      `
    };

    // Send email via Resend API
    console.log('🚀 Sending email via Resend API...');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('❌ Resend API error:', responseData);
      return res.status(500).json({
        error: `Erro ao enviar email: ${responseData.message || 'Erro desconhecido'}`
      });
    }

    console.log('✅ Email sent successfully via Resend:', responseData.id);

    // Return success
    return res.status(200).json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contacto em breve.',
      emailId: responseData.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Unexpected error in contact handler:', error);
    return res.status(500).json({
      error: `Erro interno do servidor: ${error.message}`
    });
  }
}