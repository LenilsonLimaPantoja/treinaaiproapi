const nodemailer = require('nodemailer');

const sendEmailResetPassword = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'lenilson.pantoja@estudante.ifms.edu.br',
            pass: process.env.EMAIL_APP_PASSWORD
        },
        tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
        from: 'TreinaAi PRO <lenilson.pantoja@estudante.ifms.edu.br>', // Seu e-mail
        to: email, // E-mail do destinatário
        subject: 'Alteração de Senha', // Assunto
        html: `
                <div style="width: 100%; background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 30px; text-align: center;">
                        
                        <img src="https://cdn-icons-png.flaticon.com/512/4511/4511571.png" alt="Abelha" style="width: 80px; " />
                        
                        <h2 style="color: #333;">Recebemos uma solicitação para alterar sua senha de acesso à nossa plataforma</h2>
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
                        <p style="font-size: 14px; color: #555;">
                        Se você não fez essa solicitação para alterar sua senha, alguém pode estar usando sua conta. Verifique e proteja a conta imediatamente.
                        </p>
                        <a href="https://treinaaipro.com/reset?token=${encodeURIComponent(token)}" 
                        style="display: inline-block; margin-top: 25px; background-color: #4285F4; color: white; padding: 12px 25px; border-radius: 4px; text-decoration: none; font-size: 15px; min-width: 300px;">
                        Alterar minha senha
                        </a>
                    </div>
                </div>
            `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmailResetPassword;